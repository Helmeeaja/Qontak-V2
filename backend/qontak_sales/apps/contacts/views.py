from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Sum
from .models import Contact, ContactGroup
from .serializers import ContactSerializer, ContactGroupSerializer


class ContactGroupViewSet(viewsets.ModelViewSet):
    queryset = ContactGroup.objects.all()
    serializer_class = ContactGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = ContactGroup.objects.all()
        if hasattr(user, "company") and user.company:
            qs = qs.filter(Q(company=user.company) | Q(company__isnull=True))
        q = self.request.query_params.get("search")
        if q:
            qs = qs.filter(name__icontains=q)
        return qs

    def perform_create(self, serializer):
        company = getattr(self.request.user, "company", None)
        serializer.save(company=company)


class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["display_name", "company_name", "first_name", "last_name", "phone"]
    ordering_fields = ["display_name", "balance", "created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        user = self.request.user
        qs = Contact.objects.all().prefetch_related("groups", "bank_accounts")
        if hasattr(user, "company") and user.company:
            qs = qs.filter(Q(company=user.company) | Q(company__isnull=True))

        # Filter: Tab type (customer, vendor, employee, others)
        tab_type = self.request.query_params.get("type")
        if tab_type and tab_type != "all":
            # contact_types is a JSON array e.g. ["customer", "vendor"]
            qs = qs.filter(contact_types__contains=[tab_type])

        # Filter: Archived
        archived = self.request.query_params.get("archived")
        if archived == "true":
            qs = qs.filter(is_archived=True)
        else:
            qs = qs.filter(is_archived=False)

        # Filter: Group
        group = self.request.query_params.get("group")
        if group:
            qs = qs.filter(groups__name__icontains=group)

        # Filter: Phone
        phone = self.request.query_params.get("phone")
        if phone:
            qs = qs.filter(Q(phone__icontains=phone) | Q(telephone__icontains=phone))

        # Filter: Email
        email = self.request.query_params.get("email")
        if email:
            qs = qs.filter(emails__icontains=email)

        # Filter: General Keyword
        keyword = self.request.query_params.get("keyword")
        if keyword:
            qs = qs.filter(
                Q(display_name__icontains=keyword)
                | Q(company_name__icontains=keyword)
                | Q(phone__icontains=keyword)
            )

        return qs.distinct()

    def perform_create(self, serializer):
        company = getattr(self.request.user, "company", None)
        serializer.save(company=company)

    @action(detail=True, methods=["post"], url_path="toggle-archive")
    def toggle_archive(self, request, pk=None):
        contact = self.get_object()
        contact.is_archived = not contact.is_archived
        contact.save()
        return Response({"status": "ok", "is_archived": contact.is_archived})

    @action(detail=False, methods=["get"], url_path="summary")
    def summary(self, request):
        """
        Ringkasan total piutang, hutang, memo kredit & debit untuk kartu summary
        """
        qs = self.get_queryset()
        total_balance = qs.aggregate(total=Sum("balance"))["total"] or 0
        total_contacts = qs.count()
        return Response({
            "total_contacts": total_contacts,
            "total_balance": total_balance,
            "open_receivable": {
                "count": qs.filter(balance__gt=0).count(),
                "total": qs.filter(balance__gt=0).aggregate(t=Sum("balance"))["t"] or 0,
            },
            "open_payable": {
                "count": qs.filter(balance__lt=0).count(),
                "total": abs(qs.filter(balance__lt=0).aggregate(t=Sum("balance"))["t"] or 0),
            },
        })
