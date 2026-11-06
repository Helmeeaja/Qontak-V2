from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from qontak_sales.apps.accounts.models import Company
from qontak_sales.apps.customers.models import Customer

User = get_user_model()

FORM_URL = "/api/sales/form-settings/"
REMINDER_URL = "/api/sales/invoice-reminder/"
INTERVAL_URL = "/api/sales/invoice-reminder/intervals/"


class SalesApiTestCase(APITestCase):
    def setUp(self):
        self.company = Company.objects.create(name="PT Test")
        self.manager = User.objects.create_user(
            username="manager", password="x", company=self.company, role="MANAGER"
        )
        self.agent = User.objects.create_user(
            username="agent", password="x", company=self.company, role="AGENT"
        )
        self.client.force_authenticate(self.manager)


class SalesFormSettingTests(SalesApiTestCase):
    def test_get_returns_defaults(self):
        response = self.client.get(FORM_URL)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["preferred_sales_term"], "net_30")
        self.assertFalse(response.data["use_sales_discount"])

    def test_manager_can_update_and_value_persists(self):
        response = self.client.put(
            FORM_URL,
            {
                "preferred_sales_term": "net_60",
                "use_sales_discount": True,
                "default_invoice_message": "Terima kasih",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        saved = self.client.get(FORM_URL).data
        self.assertEqual(saved["preferred_sales_term"], "net_60")
        self.assertTrue(saved["use_sales_discount"])
        self.assertEqual(saved["default_invoice_message"], "Terima kasih")

    def test_invalid_term_rejected(self):
        response = self.client.put(FORM_URL, {"preferred_sales_term": "net_999"}, format="json")
        self.assertEqual(response.status_code, 400)

    def test_agent_can_read_but_not_update(self):
        self.client.force_authenticate(self.agent)
        self.assertEqual(self.client.get(FORM_URL).status_code, 200)
        self.assertEqual(
            self.client.put(FORM_URL, {"use_sales_shipping": True}, format="json").status_code, 403
        )

    def test_requires_login(self):
        self.client.force_authenticate(None)
        self.assertEqual(self.client.get(FORM_URL).status_code, 401)


class InvoiceReminderTests(SalesApiTestCase):
    def test_amount_required_when_exempt_by_amount(self):
        response = self.client.put(REMINDER_URL, {"exempt_by_amount": True}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("exempt_amount_under", response.data)

    def test_update_reminder(self):
        response = self.client.put(
            REMINDER_URL,
            {
                "is_enabled": True,
                "invoice_type": "both",
                "exempt_by_amount": True,
                "exempt_amount_under": "50000",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        saved = self.client.get(REMINDER_URL).data
        self.assertTrue(saved["is_enabled"])
        self.assertEqual(saved["invoice_type"], "both")
        self.assertEqual(saved["exempt_amount_under"], "50000.00")

    def test_exempt_customers_only_from_own_company(self):
        mine = Customer.objects.create(name="Milik sendiri", agent=self.agent)
        other_company = Company.objects.create(name="PT Lain")
        other_agent = User.objects.create_user(
            username="other", password="x", company=other_company, role="AGENT"
        )
        foreign = Customer.objects.create(name="Milik orang lain", agent=other_agent)

        ok = self.client.put(REMINDER_URL, {"exempt_customers": [mine.id]}, format="json")
        self.assertEqual(ok.status_code, 200)
        self.assertEqual(ok.data["exempt_customers"], [mine.id])

        bad = self.client.put(REMINDER_URL, {"exempt_customers": [foreign.id]}, format="json")
        self.assertEqual(bad.status_code, 400)


class InvoiceReminderIntervalTests(SalesApiTestCase):
    payload = {
        "days": 7,
        "timing": "before_due",
        "email_subject": "Invoice jatuh tempo",
        "email_body": "Mohon segera bayar.",
        "include_pdf": True,
    }

    def test_create_list_update_delete(self):
        created = self.client.post(INTERVAL_URL, self.payload, format="json")
        self.assertEqual(created.status_code, 201)
        interval_id = created.data["id"]

        self.assertEqual(len(self.client.get(INTERVAL_URL).data), 1)
        self.assertEqual(len(self.client.get(REMINDER_URL).data["intervals"]), 1)

        updated = self.client.patch(f"{INTERVAL_URL}{interval_id}/", {"days": 3}, format="json")
        self.assertEqual(updated.status_code, 200)
        self.assertEqual(updated.data["days"], 3)

        self.assertEqual(self.client.delete(f"{INTERVAL_URL}{interval_id}/").status_code, 204)
        self.assertEqual(len(self.client.get(INTERVAL_URL).data), 0)

    def test_duplicate_interval_rejected(self):
        self.client.post(INTERVAL_URL, self.payload, format="json")
        again = self.client.post(INTERVAL_URL, self.payload, format="json")
        self.assertEqual(again.status_code, 400)

    def test_same_days_different_timing_allowed(self):
        self.client.post(INTERVAL_URL, self.payload, format="json")
        after = self.client.post(
            INTERVAL_URL, {**self.payload, "timing": "after_due"}, format="json"
        )
        self.assertEqual(after.status_code, 201)

    def test_days_must_be_positive(self):
        response = self.client.post(INTERVAL_URL, {**self.payload, "days": 0}, format="json")
        self.assertEqual(response.status_code, 400)

    def test_agent_cannot_create(self):
        self.client.force_authenticate(self.agent)
        self.assertEqual(
            self.client.post(INTERVAL_URL, self.payload, format="json").status_code, 403
        )
