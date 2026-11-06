from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("qontak_sales.apps.accounts.urls")),
    path("api/", include("qontak_sales.apps.customers.urls")),
    path("api/", include("qontak_sales.apps.sales.urls")),
    path("api/", include("qontak_sales.apps.purchases.urls")),
    path("api/", include("qontak_sales.apps.leads.urls")),
    path("api/", include("qontak_sales.apps.activities.urls")),
    path("api/", include("qontak_sales.apps.notifications.urls")),
    path("api/", include("qontak_sales.apps.broadcasts.urls")),
    path("api/", include("qontak_sales.apps.accounts_coa.urls")),
    path("api/", include("qontak_sales.apps.contacts.urls")),
    path("api/", include("qontak_sales.apps.products.urls")),
    path("api/", include("qontak_sales.apps.inventory.urls")),
    path("api/", include("qontak_sales.apps.pricerules.urls")),
    path("api/", include("qontak_sales.apps.regions.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
