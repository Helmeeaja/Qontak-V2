from django.db import models

PAYMENT_TERM_CHOICES = [
    ("net_15", "Net 15"),
    ("net_30", "Net 30"),
    ("net_60", "Net 60"),
    ("cod", "Cash On Delivery"),
    ("custom", "Custom"),
]


class SingletonModel(models.Model):

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _created = cls.objects.get_or_create(pk=1)
        return obj
