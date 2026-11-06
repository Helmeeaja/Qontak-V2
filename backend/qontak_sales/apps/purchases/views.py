from qontak_sales.apps.accounts.permissions import ModulePermission
from qontak_sales.common.views import SingletonSettingView

from .models import PurchaseSetting
from .serializers import PurchaseSettingSerializer


class PurchaseSettingView(SingletonSettingView):
    model = PurchaseSetting
    serializer_class = PurchaseSettingSerializer
    permission_classes = [ModulePermission]
    permission_module = "purchases"
