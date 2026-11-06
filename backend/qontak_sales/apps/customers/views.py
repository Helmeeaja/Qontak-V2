from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Customer
from .serializers import CustomerSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "MANAGER":
            return Customer.objects.filter(
                Q(agent__company=user.company) |
                Q(agent__isnull=True)
            ).select_related("agent").order_by("-created_at")

        return Customer.objects.filter(
            agent=user
        ).select_related("agent").order_by("-created_at")

    def perform_create(self, serializer):
        if self.request.user.role == "MANAGER":
            serializer.save()
        else:
            serializer.save(agent=self.request.user)
