from django.contrib import admin

from .models import City, District, Province, Village

admin.site.register(Province)
admin.site.register(City)
admin.site.register(District)
admin.site.register(Village)
