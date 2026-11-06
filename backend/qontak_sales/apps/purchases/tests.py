from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from qontak_sales.apps.accounts.models import Company

User = get_user_model()

URL = "/api/purchases/form-settings/"


class PurchaseSettingTests(APITestCase):
    def setUp(self):
        company = Company.objects.create(name="PT Test")
        self.manager = User.objects.create_user(
            username="manager", password="x", company=company, role="MANAGER"
        )
        self.agent = User.objects.create_user(
            username="agent", password="x", company=company, role="AGENT"
        )
        self.client.force_authenticate(self.manager)

    def test_get_returns_defaults(self):
        response = self.client.get(URL)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["preferred_purchase_term"], "net_30")
        self.assertFalse(response.data["use_purchase_discount"])

    def test_manager_can_update_and_value_persists(self):
        response = self.client.put(
            URL,
            {
                "preferred_purchase_term": "cod",
                "enable_supplier_in_purchase_request": True,
                "use_purchase_deposit": True,
                "default_purchase_order_message": "Mohon kirim sesuai jadwal",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        saved = self.client.get(URL).data
        self.assertEqual(saved["preferred_purchase_term"], "cod")
        self.assertTrue(saved["enable_supplier_in_purchase_request"])
        self.assertTrue(saved["use_purchase_deposit"])
        self.assertEqual(saved["default_purchase_order_message"], "Mohon kirim sesuai jadwal")

    def test_invalid_term_rejected(self):
        response = self.client.put(URL, {"preferred_purchase_term": "net_50"}, format="json")
        self.assertEqual(response.status_code, 400)

    def test_agent_can_read_but_not_update(self):
        self.client.force_authenticate(self.agent)
        self.assertEqual(self.client.get(URL).status_code, 200)
        self.assertEqual(
            self.client.put(URL, {"use_purchase_shipping": True}, format="json").status_code, 403
        )

    def test_requires_login(self):
        self.client.force_authenticate(None)
        self.assertEqual(self.client.get(URL).status_code, 401)
