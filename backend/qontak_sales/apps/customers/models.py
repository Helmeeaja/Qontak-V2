from django.db import models
from qontak_sales.apps.accounts.models import CustomUser

class Customer(models.Model):
    STATUS_CHOICES = [
        ("PROSPECT", "prospect"),
        ("CUSTOMER", "customer"),
        ("INACTIVE", "inactive"),
    ]

    name = models.CharField(max_length=150)
    company_name = models.CharField(max_length=200, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    province = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    district = models.CharField(max_length=100, blank=True)
    village = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=10, blank=True)

    status = models.CharField(
        max_length=20,
        choices= STATUS_CHOICES,
        default= "PROSPECT",
    )

    agent = models.ForeignKey(
        CustomUser, 
        on_delete= models.SET_NULL, 
        null= True, 
        blank= True,
        related_name = "customers",
        limit_choices_to={"role": "AGENT"},
    )

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name