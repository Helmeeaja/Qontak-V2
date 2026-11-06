import json

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Max, Q
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from qontak_sales.apps.accounts_coa.models import AccountCOA
from qontak_sales.apps.customers.models import Customer

from .invitations import (
    build_invitation_url,
    find_invitation,
    issue_invitation,
    send_invitation_email,
)
from .models import (
    AccountMapping,
    ApprovalRule,
    Billing,
    CustomField,
    ProductionSetting,
    Role,
    TaggingRule,
    TemplateSetting,
)
from .permissions import IsManager, IsManagerOrReadOnly, ModulePermission
from .serializers import (
    TEMPLATE_SERIALIZERS,
    AcceptInvitationSerializer,
    AccountMappingSerializer,
    AgentCreateSerializer,
    ApprovalRuleSerializer,
    BillingSerializer,
    CompanySerializer,
    CustomFieldReorderSerializer,
    CustomFieldSerializer,
    EmailTokenObtainPairSerializer,
    InviteMemberSerializer,
    MemberSerializer,
    ProductionSettingSerializer,
    ProfileUpdateSerializer,
    RegisterSerializer,
    RoleSerializer,
    SignatureImageSerializer,
    TaggingRuleSerializer,
    UserSerializer,
)

User = get_user_model()


def company_members(company):
    if company is None:
        return User.objects.none()
    return (
        User.objects.filter(company=company)
        .exclude(status="inactive")
        .order_by("first_name", "last_name", "username")
    )


def user_option(user):
    return {
        "id": user.id,
        "username": user.username,
        "name": user.get_full_name().strip() or user.username,
        "email": user.email,
    }


class EmailTokenObtainPairView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    serializer_class = EmailTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Registrasi berhasil."}, status=status.HTTP_201_CREATED)


class InvitationDetailView(APIView):

    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        invitation = find_invitation(request.query_params.get("token", "").strip())
        if (
            invitation is None
            or not invitation.is_usable
            or invitation.user.status != "invited"
        ):
            return Response(
                {"detail": "Undangan tidak valid atau sudah kedaluwarsa."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = invitation.user
        return Response(
            {
                "email": user.email,
                "name": user.get_full_name().strip() or user.username,
                "company_name": user.company.name if user.company else "",
                "expires_at": invitation.expires_at,
            }
        )


class AcceptInvitationView(APIView):

    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = AcceptInvitationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Password berhasil dibuat. Silakan login."})


class ProfileView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user, context={"request": request}).data)

    def put(self, request):
        serializer = ProfileUpdateSerializer(
            request.user, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user, context={"request": request}).data)

    def patch(self, request):
        return self.put(request)


class CompanyDetailView(APIView):
    permission_classes = [IsManagerOrReadOnly]

    def get(self, request):
        serializer = CompanySerializer(request.user.company, context={"request": request})
        return Response(serializer.data)

    def put(self, request):
        serializer = CompanySerializer(
            request.user.company, data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class DashboardStatsView(APIView):
    def get(self, request):
        company = request.user.company
        users = User.objects.filter(company=company) if company else User.objects.none()
        agents = users.filter(role="AGENT")
        managers = users.filter(role="MANAGER")
        return Response(
            {
                "company_name": company.name if company else "",
                "total_users": users.count(),
                "total_agents": agents.count(),
                "total_managers": managers.count(),
            }
        )


class TeamMembersView(APIView):
    def get(self, request):
        users = User.objects.filter(company=request.user.company).order_by(
            "first_name", "last_name", "username"
        )
        return Response(
            UserSerializer(users, many=True, context={"request": request}).data
        )


class SwitchAccountView(APIView):
    def post(self, request):
        if request.user.role != "MANAGER":
            return Response(
                {"detail": "Hanya manager yang dapat berpindah akun."},
                status=status.HTTP_403_FORBIDDEN,
            )
        target = (
            User.objects.filter(
                pk=request.data.get("user_id"),
                company=request.user.company,
                is_active=True,
            )
            .exclude(pk=request.user.pk)
            .first()
        )
        if target is None:
            return Response(
                {"detail": "User tidak ditemukan."},
                status=status.HTTP_404_NOT_FOUND,
            )
        if target.status == "invited":
            return Response(
                {"detail": "User belum menerima undangan."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        refresh = RefreshToken.for_user(target)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserSerializer(target, context={"request": request}).data,
            }
        )


class AgentViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsManager]

    def get_queryset(self):
        return User.objects.filter(company=self.request.user.company, role="AGENT").order_by(
            "first_name", "last_name"
        )

    def create(self, request, *args, **kwargs):
        serializer = AgentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        agent = User.objects.create_user(
            username=data["username"],
            email=data["email"],
            password=data["password"],
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
            phone=data.get("phone", ""),
            company=request.user.company,
            role="AGENT",
        )
        if data.get("avatar"):
            agent.avatar = data["avatar"]
            agent.save(update_fields=["avatar"])
        return Response(
            UserSerializer(agent, context={"request": request}).data, status=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        agent = self.get_object()
        for field in ("first_name", "last_name", "email", "phone"):
            if field in request.data:
                setattr(agent, field, request.data[field])
        if "avatar" in request.FILES:
            agent.avatar = request.FILES["avatar"]
        agent.save()
        return Response(UserSerializer(agent, context={"request": request}).data)

    def destroy(self, request, *args, **kwargs):
        self.get_object().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MemberViewSet(viewsets.ModelViewSet):
    serializer_class = MemberSerializer
    permission_classes = [IsManager]

    def get_queryset(self):
        return (
            User.objects.filter(company=self.request.user.company)
            .prefetch_related("roles")
            .order_by("username")
        )

    def create(self, request, *args, **kwargs):
        serializer = InviteMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        member = User.objects.create_user(
            username=d["username"],
            email=d.get("email", ""),
            password=None,
            company=request.user.company,
            role="AGENT",
            status="invited",
            type=d.get("type", "member"),
            access_time_limit=d.get("access_time_limit", ""),
            role_config=d.get("role_config", {}),
        )
        if d.get("roles"):
            member.roles.set(d["roles"])

        _invitation, token = issue_invitation(member, created_by=request.user)
        invitation_url = build_invitation_url(token)
        email_sent = send_invitation_email(member, invitation_url)

        data = dict(MemberSerializer(member).data)
        data["email_sent"] = email_sent
        if settings.DEBUG:
            data["invitation_url"] = invitation_url
        return Response(data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        member = self.get_object()
        if member.role == "MANAGER" or member == request.user:
            return Response(
                {"detail": "Owner tidak dapat dihapus."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        member.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["post"], url_path="resend-invitation")
    def resend_invitation(self, request, pk=None):
        member = self.get_object()
        if member.status != "invited":
            return Response(
                {"detail": "Hanya user berstatus invited yang bisa dikirim ulang."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not member.email:
            return Response(
                {"detail": "User ini tidak punya email."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        _invitation, token = issue_invitation(member, created_by=request.user)
        invitation_url = build_invitation_url(token)
        email_sent = send_invitation_email(member, invitation_url)
        payload = {
            "detail": "Undangan berhasil dikirim ulang.",
            "email_sent": email_sent,
        }
        if settings.DEBUG:
            payload["invitation_url"] = invitation_url
        return Response(payload)

    @action(detail=True, methods=["post"], url_path="transfer-ownership")
    def transfer_ownership(self, request, pk=None):
        new_owner = self.get_object()
        current = request.user
        if request.data.get("confirm") != "TRANSFER":
            return Response(
                {"detail": "Konfirmasi tidak valid."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if new_owner == current or new_owner.status != "active":
            return Response(
                {"detail": "Pemilik baru harus user aktif lain."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        with transaction.atomic():
            new_owner.role = "MANAGER"
            new_owner.save(update_fields=["role"])
            current.role = "AGENT"
            current.save(update_fields=["role"])
        return Response({"detail": "Kepemilikan berhasil dialihkan."})


class RoleViewSet(viewsets.ModelViewSet):
    serializer_class = RoleSerializer
    permission_classes = [IsManager]

    def get_queryset(self):
        return Role.objects.all().order_by("name")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        role = serializer.save()
        return Response(self.get_serializer(role).data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        role = self.get_object()
        if role.is_default:
            return Response(
                {"detail": "Role bawaan tidak dapat dihapus."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        role.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CustomFieldViewSet(viewsets.ModelViewSet):
    serializer_class = CustomFieldSerializer
    permission_classes = [IsManagerOrReadOnly]

    def get_queryset(self):
        company = self.request.user.company
        if company is None:
            return CustomField.objects.none()
        queryset = CustomField.objects.filter(company=company)
        params = self.request.query_params
        status_value = params.get("status")
        if status_value in dict(CustomField.STATUS_CHOICES):
            queryset = queryset.filter(status=status_value)
        for_page = params.get("for_page")
        if for_page:
            queryset = queryset.filter(page=for_page)
        for_sub_page = params.get("for_sub_page")
        if for_sub_page:
            queryset = queryset.filter(sub_pages__contains=[for_sub_page])
        search = params.get("search", "").strip()
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset

    def perform_create(self, serializer):
        company = self.request.user.company
        last_order = CustomField.objects.filter(company=company).aggregate(
            last=Max("sort_order")
        )["last"]
        serializer.save(company=company, sort_order=(last_order or 0) + 1)

    def destroy(self, request, *args, **kwargs):
        field = self.get_object()
        if field.status != "deleted":
            field.status = "deleted"
            field.save(update_fields=["status", "updated_at"])
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["get"])
    def quota(self, request):
        company = request.user.company
        used = (
            CustomField.objects.filter(company=company).exclude(status="deleted").count()
            if company
            else 0
        )
        return Response({"quota": CustomField.QUOTA, "used": used})

    @action(detail=False, methods=["post"])
    def reorder(self, request):
        serializer = CustomFieldReorderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ids = serializer.validated_data["ids"]
        fields = {
            field.id: field
            for field in CustomField.objects.filter(
                company=request.user.company, id__in=ids
            ).exclude(status="deleted")
        }
        if len(fields) != len(ids):
            raise ValidationError({"ids": "Custom field tidak ditemukan."})
        positions = sorted(field.sort_order for field in fields.values())
        ordered = []
        for position, field_id in zip(positions, ids):
            field = fields[field_id]
            field.sort_order = position
            ordered.append(field)
        CustomField.objects.bulk_update(ordered, ["sort_order"])
        return Response(self.get_serializer(ordered, many=True).data)


class AccountMappingViewSet(viewsets.ModelViewSet):
    serializer_class = AccountMappingSerializer
    permission_classes = [IsManagerOrReadOnly]

    def get_queryset(self):
        company = self.request.user.company
        if company is None:
            return AccountMapping.objects.none()
        return AccountMapping.objects.filter(company=company)

    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)

    @action(detail=False, methods=["get"])
    def options(self, request):
        company = request.user.company
        if company is None:
            return Response({"accounts": []})
        accounts = AccountCOA.objects.filter(company=company).order_by("kode_akun")
        return Response(
            {
                "accounts": [
                    {
                        "code": account.kode_akun,
                        "name": account.nama_akun,
                        "category": account.kategori_akun,
                        "label": (
                            f"({account.kode_akun}) - {account.nama_akun} "
                            f"({account.kategori_akun})"
                        ),
                    }
                    for account in accounts
                ]
            }
        )

    @action(detail=False, methods=["put"], url_path="bulk")
    def bulk(self, request):
        entries = request.data.get("mappings")
        if not isinstance(entries, list):
            raise ValidationError({"mappings": "Data mapping harus berupa list."})

        company = request.user.company
        if company is None:
            raise ValidationError({"detail": "Company pengguna tidak ditemukan."})

        serializer = AccountMappingSerializer(data=entries, many=True)
        serializer.is_valid(raise_exception=True)

        saved = []
        seen = set()
        with transaction.atomic():
            for item in serializer.validated_data:
                target_type = item.get("target_type") or "company"
                key = (item["account_type"], target_type, item["target_id"])
                if key in seen:
                    raise ValidationError(
                        {"mappings": "Target mapping tidak boleh duplikat."}
                    )
                seen.add(key)
                obj, _created = AccountMapping.objects.update_or_create(
                    company=company,
                    account_type=item["account_type"],
                    target_type=target_type,
                    target_id=item["target_id"],
                    defaults={
                        "account_code": item["account_code"],
                        "account_name": item["account_name"],
                        "is_active": item.get("is_active", True),
                        "mapping_options": item.get("mapping_options"),
                    },
                )
                saved.append(obj)
        return Response(AccountMappingSerializer(saved, many=True).data)


class BillingViewSet(viewsets.ModelViewSet):
    serializer_class = BillingSerializer
    permission_classes = [IsManagerOrReadOnly]

    def get_queryset(self):
        company = self.request.user.company
        if company is None:
            return Billing.objects.none()
        return Billing.objects.filter(customer=company)

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user.company)


class ApprovalRuleViewSet(viewsets.ModelViewSet):
    serializer_class = ApprovalRuleSerializer
    permission_classes = [IsManagerOrReadOnly]

    def get_queryset(self):
        company = self.request.user.company
        if company is None:
            return ApprovalRule.objects.none()
        return ApprovalRule.objects.filter(company=company)

    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)

    @action(detail=False, methods=["get"])
    def options(self, request):
        company = request.user.company
        customers = (
            Customer.objects.filter(
                Q(agent__company=company) | Q(agent__isnull=True)
            ).order_by("name")
            if company is not None
            else Customer.objects.none()
        )
        return Response(
            {
                "users": [user_option(user) for user in company_members(company)],
                "customers": [
                    {"id": customer.id, "name": customer.name}
                    for customer in customers
                ],
            }
        )


class TaggingRuleViewSet(viewsets.ModelViewSet):
    serializer_class = TaggingRuleSerializer
    permission_classes = [IsManagerOrReadOnly]

    def get_queryset(self):
        company = self.request.user.company
        if company is None:
            return TaggingRule.objects.none()
        return TaggingRule.objects.filter(company=company)

    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)

    @action(detail=False, methods=["get"])
    def options(self, request):
        company = request.user.company
        return Response(
            {
                "users": [user_option(user) for user in company_members(company)],
            }
        )


class TemplateSettingView(APIView):
    permission_classes = [ModulePermission]
    permission_module = "sales"
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def _payload(self, setting, request):
        payload = dict(setting.data)
        if setting.key == "pdf_general":
            payload["signature_image_url"] = (
                request.build_absolute_uri(setting.signature_image.url)
                if setting.signature_image
                else None
            )
        return payload

    def _raw_data(self, request):
        if (request.content_type or "").startswith("multipart"):
            try:
                return json.loads(request.data.get("data", "{}"))
            except (TypeError, ValueError):
                raise ValidationError({"data": "Format data tidak valid."})
        return request.data

    def get(self, request, key=None):
        company = request.user.company
        queryset = (
            TemplateSetting.objects.filter(company=company)
            if company
            else TemplateSetting.objects.none()
        )
        if key is None:
            return Response({item.key: self._payload(item, request) for item in queryset})
        if key not in TEMPLATE_SERIALIZERS:
            raise NotFound("Template tidak dikenal.")
        item = queryset.filter(key=key).first()
        return Response(self._payload(item, request) if item else {})

    def put(self, request, key):
        serializer_class = TEMPLATE_SERIALIZERS.get(key)
        if serializer_class is None:
            raise NotFound("Template tidak dikenal.")
        company = request.user.company
        if company is None:
            raise ValidationError({"detail": "User belum terhubung ke company."})

        serializer = serializer_class(data=self._raw_data(request))
        serializer.is_valid(raise_exception=True)

        image_serializer = SignatureImageSerializer(
            data={
                "image": request.FILES.get("signature_image"),
                "remove": request.data.get("remove_signature_image", False),
            }
        )
        image_serializer.is_valid(raise_exception=True)
        image = image_serializer.validated_data.get("image")
        remove_image = image_serializer.validated_data.get("remove")
        if key != "pdf_general" and (image or remove_image):
            raise ValidationError({"signature_image": "Gambar hanya untuk pdf_general."})

        with transaction.atomic():
            item, _created = TemplateSetting.objects.get_or_create(company=company, key=key)
            item.data = serializer.validated_data
            if (image or remove_image) and item.signature_image:
                item.signature_image.delete(save=False)
            if image:
                item.signature_image = image
            item.save()
        return Response(self._payload(item, request))


class ProductionSettingDetailView(APIView):
    permission_classes = [ModulePermission]
    permission_module = "productions"

    def get(self, request):
        setting, _created = ProductionSetting.objects.get_or_create(pk=1)
        return Response(ProductionSettingSerializer(setting).data)

    def put(self, request):
        setting, _created = ProductionSetting.objects.get_or_create(pk=1)
        serializer = ProductionSettingSerializer(setting, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
