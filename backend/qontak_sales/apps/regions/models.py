from django.db import models


class Province(models.Model):
    code = models.CharField(max_length=2, unique=True)
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ["code"]

    def __str__(self):
        return self.name


class City(models.Model):
    code = models.CharField(max_length=5, unique=True)
    name = models.CharField(max_length=100)
    province = models.ForeignKey(
        Province, on_delete=models.CASCADE, related_name="cities"
    )

    class Meta:
        ordering = ["code"]

    def __str__(self):
        return self.name


class District(models.Model):
    code = models.CharField(max_length=8, unique=True)
    name = models.CharField(max_length=100)
    city = models.ForeignKey(
        City, on_delete=models.CASCADE, related_name="districts"
    )

    class Meta:
        ordering = ["code"]

    def __str__(self):
        return self.name


class Village(models.Model):
    code = models.CharField(max_length=13, unique=True)
    name = models.CharField(max_length=100)
    district = models.ForeignKey(
        District, on_delete=models.CASCADE, related_name="villages"
    )
    postal_code = models.CharField(max_length=5, blank=True, default="")

    class Meta:
        ordering = ["code"]

    def __str__(self):
        return self.name
