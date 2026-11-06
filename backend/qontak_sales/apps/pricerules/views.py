from rest_framework import viewsets, filters, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import PriceRule
from .serializers import PriceRuleSerializer


class PriceRuleViewSet(viewsets.ModelViewSet):
    queryset = PriceRule.objects.all().prefetch_related("target_contacts", "target_products")
    serializer_class = PriceRuleSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["name", "start_date", "end_date", "created_at"]
    ordering = ["-start_date", "-created_at"]

    def get_queryset(self):
        user = self.request.user
        qs = PriceRule.objects.all().prefetch_related("target_contacts", "target_products")
        if hasattr(user, "company") and user.company:
            qs = qs.filter(Q(company=user.company) | Q(company__isnull=True))

        active_only = self.request.query_params.get("active_only")
        if active_only == "true":
            qs = qs.filter(is_active=True)

        return qs

    def perform_create(self, serializer):
        company = getattr(self.request.user, "company", None)
        serializer.save(company=company)

    @action(detail=True, methods=["post"], url_path="toggle-active")
    def toggle_active(self, request, pk=None):
        rule = self.get_object()
        rule.is_active = not rule.is_active
        rule.save()
        return Response({"status": "ok", "is_active": rule.is_active})
