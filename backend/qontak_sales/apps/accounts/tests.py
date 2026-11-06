from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from qontak_sales.apps.accounts_coa.models import AccountCOA
from qontak_sales.apps.customers.models import Customer

from .models import AccountMapping, ApprovalRule, Company, CustomField, TaggingRule

User = get_user_model()

URL = "/api/custom-fields/"
QUOTA_URL = "/api/custom-fields/quota/"
REORDER_URL = "/api/custom-fields/reorder/"


def text_payload(**overrides):
    payload = {
        "name": "PO Number",
        "page": "sales",
        "sub_pages": ["Sales Invoice"],
        "field_type": "text",
        "is_required": True,
        "show_in_print": True,
        "max_chars": 20,
    }
    payload.update(overrides)
    return payload


class CustomFieldApiTestCase(APITestCase):
    def setUp(self):
        self.company = Company.objects.create(name="PT Test")
        self.other_company = Company.objects.create(name="PT Lain")
        self.manager = User.objects.create_user(
            username="manager", password="x", company=self.company, role="MANAGER"
        )
        self.agent = User.objects.create_user(
            username="agent", password="x", company=self.company, role="AGENT"
        )
        self.outsider = User.objects.create_user(
            username="outsider", password="x", company=self.other_company, role="MANAGER"
        )
        self.client.force_authenticate(self.manager)

    def create_field(self, **overrides):
        response = self.client.post(URL, text_payload(**overrides), format="json")
        self.assertEqual(response.status_code, 201, response.data)
        return response.data


class CustomFieldCreateTests(CustomFieldApiTestCase):
    def test_create_text_field_persists_to_database(self):
        data = self.create_field()
        field = CustomField.objects.get(pk=data["id"])
        self.assertEqual(field.company, self.company)
        self.assertEqual(field.name, "PO Number")
        self.assertEqual(field.max_chars, 20)
        self.assertEqual(field.status, "active")
        self.assertEqual(field.sort_order, 1)

    def test_create_number_field_requires_affix_text(self):
        response = self.client.post(
            URL,
            text_payload(field_type="number", affix_type="prefix", affix_text=""),
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("affix_text", response.data)

    def test_create_number_field_clears_text_settings(self):
        data = self.create_field(
            field_type="number",
            use_decimal=True,
            affix_type="suffix",
            affix_text=" cm ",
        )
        self.assertEqual(data["affix_text"], "cm")
        self.assertIsNone(data["max_chars"])

    def test_create_dropdown_requires_options(self):
        response = self.client.post(
            URL, text_payload(field_type="dropdown", options=[]), format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("options", response.data)

    def test_create_dropdown_rejects_duplicate_options(self):
        response = self.client.post(
            URL,
            text_payload(field_type="dropdown", options=["A", "a"]),
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("options", response.data)

    def test_create_dropdown_main_option_must_exist(self):
        response = self.client.post(
            URL,
            text_payload(
                field_type="dropdown", options=["A", "B"], default_value="C"
            ),
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("default_value", response.data)

    def test_create_dropdown_saves_main_option(self):
        data = self.create_field(
            field_type="dropdown",
            options=["A", "B"],
            default_value="B",
            allow_multiple=True,
        )
        self.assertEqual(data["options"], ["A", "B"])
        self.assertEqual(data["default_value"], "B")
        self.assertTrue(data["allow_multiple"])

    def test_create_date_field(self):
        data = self.create_field(field_type="date", date_default="today")
        self.assertEqual(data["date_default"], "today")

    def test_sub_page_required_for_sales(self):
        response = self.client.post(URL, text_payload(sub_pages=[]), format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("sub_pages", response.data)

    def test_sub_page_must_belong_to_page(self):
        response = self.client.post(
            URL, text_payload(sub_pages=["Purchase Order"]), format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("sub_pages", response.data)

    def test_products_page_has_no_sub_pages(self):
        data = self.create_field(page="products", sub_pages=["Sales Order"])
        self.assertEqual(data["sub_pages"], [])

    def test_duplicate_name_on_same_page_is_rejected(self):
        self.create_field()
        response = self.client.post(URL, text_payload(name="po number"), format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("name", response.data)

    def test_same_name_on_other_page_is_allowed(self):
        self.create_field()
        self.create_field(page="products", sub_pages=[])

    def test_name_longer_than_limit_is_rejected(self):
        response = self.client.post(URL, text_payload(name="x" * 26), format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("name", response.data)

    def test_cannot_create_with_deleted_status(self):
        response = self.client.post(URL, text_payload(status="deleted"), format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("status", response.data)


class CustomFieldQuotaTests(CustomFieldApiTestCase):
    def test_quota_reports_used_slots(self):
        self.create_field(name="One")
        response = self.client.get(QUOTA_URL)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"quota": 3, "used": 1})

    def test_create_beyond_quota_is_rejected(self):
        for index in range(3):
            self.create_field(name=f"Field {index}")
        response = self.client.post(URL, text_payload(name="Extra"), format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("detail", response.data)

    def test_deleting_a_field_frees_quota(self):
        created = [self.create_field(name=f"Field {index}") for index in range(3)]
        self.client.delete(f"{URL}{created[0]['id']}/")
        response = self.client.post(URL, text_payload(name="Extra"), format="json")
        self.assertEqual(response.status_code, 201)


class CustomFieldUpdateTests(CustomFieldApiTestCase):
    def test_update_name_and_settings(self):
        data = self.create_field()
        response = self.client.patch(
            f"{URL}{data['id']}/",
            {"name": "Customer PO", "max_chars": 50},
            format="json",
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["name"], "Customer PO")
        self.assertEqual(response.data["max_chars"], 50)

    def test_changing_type_clears_old_settings(self):
        data = self.create_field()
        response = self.client.patch(
            f"{URL}{data['id']}/", {"field_type": "date"}, format="json"
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertIsNone(response.data["max_chars"])

    def test_toggle_status(self):
        data = self.create_field()
        response = self.client.patch(
            f"{URL}{data['id']}/", {"status": "inactive"}, format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "inactive")

    def test_update_keeps_own_name_without_duplicate_error(self):
        data = self.create_field()
        response = self.client.patch(
            f"{URL}{data['id']}/", {"is_required": False}, format="json"
        )
        self.assertEqual(response.status_code, 200, response.data)

    def test_deleted_field_cannot_be_updated(self):
        data = self.create_field()
        self.client.delete(f"{URL}{data['id']}/")
        response = self.client.patch(
            f"{URL}{data['id']}/", {"name": "Other"}, format="json"
        )
        self.assertEqual(response.status_code, 400)


class CustomFieldDeleteTests(CustomFieldApiTestCase):
    def test_delete_is_soft(self):
        data = self.create_field()
        response = self.client.delete(f"{URL}{data['id']}/")
        self.assertEqual(response.status_code, 204)
        field = CustomField.objects.get(pk=data["id"])
        self.assertEqual(field.status, "deleted")

    def test_deleted_field_is_listed_under_deleted_filter(self):
        data = self.create_field()
        self.client.delete(f"{URL}{data['id']}/")
        response = self.client.get(URL, {"status": "deleted"})
        self.assertEqual([item["id"] for item in response.data], [data["id"]])
        response = self.client.get(URL, {"status": "active"})
        self.assertEqual(response.data, [])


class CustomFieldListTests(CustomFieldApiTestCase):
    def test_list_filters_by_search_and_page(self):
        self.create_field(name="Alpha")
        self.create_field(name="Beta", page="products", sub_pages=[])
        response = self.client.get(URL, {"search": "alp"})
        self.assertEqual([item["name"] for item in response.data], ["Alpha"])
        response = self.client.get(URL, {"for_page": "products"})
        self.assertEqual([item["name"] for item in response.data], ["Beta"])

    def test_list_filters_by_sub_page(self):
        self.create_field(name="Alpha", sub_pages=["Sales Invoice", "Sales Order"])
        self.create_field(name="Beta", sub_pages=["Sales Order"])
        response = self.client.get(
            URL, {"for_page": "sales", "for_sub_page": "Sales Invoice"}
        )
        self.assertEqual([item["name"] for item in response.data], ["Alpha"])

    def test_company_data_is_isolated(self):
        self.create_field()
        self.client.force_authenticate(self.outsider)
        response = self.client.get(URL)
        self.assertEqual(response.data, [])
        self.assertEqual(self.client.get(QUOTA_URL).data["used"], 0)

    def test_other_company_field_cannot_be_modified(self):
        data = self.create_field()
        self.client.force_authenticate(self.outsider)
        response = self.client.patch(
            f"{URL}{data['id']}/", {"name": "Hacked"}, format="json"
        )
        self.assertEqual(response.status_code, 404)


class CustomFieldPermissionTests(CustomFieldApiTestCase):
    def test_agent_can_read_but_not_write(self):
        data = self.create_field()
        self.client.force_authenticate(self.agent)
        self.assertEqual(self.client.get(URL).status_code, 200)
        self.assertEqual(
            self.client.post(URL, text_payload(name="Other"), format="json").status_code,
            403,
        )
        self.assertEqual(
            self.client.patch(
                f"{URL}{data['id']}/", {"name": "X"}, format="json"
            ).status_code,
            403,
        )
        self.assertEqual(self.client.delete(f"{URL}{data['id']}/").status_code, 403)
        self.assertEqual(
            self.client.post(REORDER_URL, {"ids": [data["id"]]}, format="json").status_code,
            403,
        )

    def test_unauthenticated_is_rejected(self):
        self.client.force_authenticate(None)
        self.assertEqual(self.client.get(URL).status_code, 401)


class CustomFieldReorderTests(CustomFieldApiTestCase):
    def test_reorder_changes_list_order(self):
        first = self.create_field(name="First")
        second = self.create_field(name="Second")
        third = self.create_field(name="Third")
        response = self.client.post(
            REORDER_URL,
            {"ids": [third["id"], first["id"], second["id"]]},
            format="json",
        )
        self.assertEqual(response.status_code, 200, response.data)
        listing = self.client.get(URL)
        self.assertEqual(
            [item["name"] for item in listing.data], ["Third", "First", "Second"]
        )

    def test_reorder_subset_keeps_other_fields_in_place(self):
        first = self.create_field(name="First")
        middle = self.create_field(name="Middle", page="products", sub_pages=[])
        third = self.create_field(name="Third")
        self.client.post(
            REORDER_URL, {"ids": [third["id"], first["id"]]}, format="json"
        )
        listing = self.client.get(URL)
        self.assertEqual(
            [item["name"] for item in listing.data], ["Third", "Middle", "First"]
        )
        self.assertEqual(middle["name"], "Middle")

    def test_reorder_rejects_unknown_ids(self):
        data = self.create_field()
        response = self.client.post(
            REORDER_URL, {"ids": [data["id"], 99999]}, format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_reorder_rejects_other_company_ids(self):
        data = self.create_field()
        self.client.force_authenticate(self.outsider)
        response = self.client.post(REORDER_URL, {"ids": [data["id"]]}, format="json")
        self.assertEqual(response.status_code, 400)

    def test_reorder_rejects_duplicate_ids(self):
        data = self.create_field()
        response = self.client.post(
            REORDER_URL, {"ids": [data["id"], data["id"]]}, format="json"
        )
        self.assertEqual(response.status_code, 400)


ACCOUNT_MAPPING_URL = "/api/account-mappings/"
ACCOUNT_MAPPING_BULK_URL = "/api/account-mappings/bulk/"
ACCOUNT_MAPPING_OPTIONS_URL = "/api/account-mappings/options/"
APPROVAL_RULE_URL = "/api/approval-rules/"
APPROVAL_RULE_OPTIONS_URL = "/api/approval-rules/options/"
TAGGING_RULE_URL = "/api/tagging-rules/"
TAGGING_RULE_OPTIONS_URL = "/api/tagging-rules/options/"


class SettingsApiTestCase(APITestCase):
    def setUp(self):
        self.company = Company.objects.create(name="PT Test")
        self.other_company = Company.objects.create(name="PT Lain")
        self.manager = User.objects.create_user(
            username="manager", password="x", company=self.company, role="MANAGER"
        )
        self.agent = User.objects.create_user(
            username="agent", password="x", company=self.company, role="AGENT"
        )
        self.outsider = User.objects.create_user(
            username="outsider",
            password="x",
            company=self.other_company,
            role="MANAGER",
        )
        self.account = AccountCOA.objects.create(
            company=self.company,
            kode_akun="4-40000",
            nama_akun="Revenue",
            kategori_akun="Income",
        )
        self.other_account = AccountCOA.objects.create(
            company=self.other_company,
            kode_akun="4-40001",
            nama_akun="Other Revenue",
            kategori_akun="Income",
        )
        self.customer = Customer.objects.create(name="PT Pelanggan", agent=self.agent)
        self.other_customer = Customer.objects.create(
            name="PT Asing", agent=self.outsider
        )
        self.client.force_authenticate(self.manager)

    def mapping_payload(self, target_id="company[default_sale_account_id]"):
        return {
            "account_type": "sales",
            "target_type": "company",
            "target_id": target_id,
            "account_code": self.account.kode_akun,
            "account_name": "(4-40000) - Revenue (Income)",
            "mapping_options": {
                "account_value": self.account.kode_akun,
                "label": "Sales Revenue",
            },
        }


class AccountMappingApiTests(SettingsApiTestCase):
    def test_bulk_saves_company_and_returns_saved_mappings(self):
        response = self.client.put(
            ACCOUNT_MAPPING_BULK_URL,
            {"mappings": [self.mapping_payload()]},
            format="json",
        )
        self.assertEqual(response.status_code, 200, response.data)
        mapping = AccountMapping.objects.get(target_id="company[default_sale_account_id]")
        self.assertEqual(mapping.company, self.company)
        self.assertEqual(mapping.account_code, "4-40000")
        self.assertEqual(response.data[0]["account_name"], "(4-40000) - Revenue (Income)")

    def test_bulk_updates_existing_mapping(self):
        self.client.put(
            ACCOUNT_MAPPING_BULK_URL,
            {"mappings": [self.mapping_payload()]},
            format="json",
        )
        payload = self.mapping_payload()
        payload["account_name"] = "Revenue Updated"
        response = self.client.put(
            ACCOUNT_MAPPING_BULK_URL, {"mappings": [payload]}, format="json"
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(AccountMapping.objects.count(), 1)
        self.assertEqual(
            AccountMapping.objects.get().account_name, "Revenue Updated"
        )

    def test_same_target_can_be_mapped_by_different_companies(self):
        self.client.put(
            ACCOUNT_MAPPING_BULK_URL,
            {"mappings": [self.mapping_payload()]},
            format="json",
        )
        self.client.force_authenticate(self.outsider)
        response = self.client.put(
            ACCOUNT_MAPPING_BULK_URL,
            {"mappings": [self.mapping_payload()]},
            format="json",
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(AccountMapping.objects.count(), 2)

    def test_list_is_scoped_to_company(self):
        self.client.put(
            ACCOUNT_MAPPING_BULK_URL,
            {"mappings": [self.mapping_payload()]},
            format="json",
        )
        self.client.force_authenticate(self.outsider)
        self.assertEqual(self.client.get(ACCOUNT_MAPPING_URL).data, [])

    def test_options_returns_company_accounts(self):
        response = self.client.get(ACCOUNT_MAPPING_OPTIONS_URL)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data["accounts"],
            [
                {
                    "code": "4-40000",
                    "name": "Revenue",
                    "category": "Income",
                    "label": "(4-40000) - Revenue (Income)",
                }
            ],
        )

    def test_duplicate_targets_are_rejected(self):
        payload = self.mapping_payload()
        response = self.client.put(
            ACCOUNT_MAPPING_BULK_URL,
            {"mappings": [payload, payload]},
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(AccountMapping.objects.count(), 0)

    def test_agent_can_read_but_not_write(self):
        self.client.force_authenticate(self.agent)
        self.assertEqual(self.client.get(ACCOUNT_MAPPING_URL).status_code, 200)
        response = self.client.put(
            ACCOUNT_MAPPING_BULK_URL,
            {"mappings": [self.mapping_payload()]},
            format="json",
        )
        self.assertEqual(response.status_code, 403)


class ApprovalRuleApiTests(SettingsApiTestCase):
    def approval_payload(self):
        return {
            "name": "Sales Invoice Rule",
            "description": "Approval untuk invoice",
            "rule_type": "workflow",
            "amount_threshold": "1000000",
            "is_active": True,
            "condition": {
                "transactionGroup": "Sales",
                "transactionType": "Sales invoice",
                "createdBy": "all",
                "createdFor": "all",
                "criteria": ["specificValue"],
                "levels": [
                    {
                        "approverType": "Either must approve",
                        "approvers": ["manager"],
                    }
                ],
            },
        }

    def test_create_persists_company_and_condition(self):
        response = self.client.post(
            APPROVAL_RULE_URL, self.approval_payload(), format="json"
        )
        self.assertEqual(response.status_code, 201, response.data)
        rule = ApprovalRule.objects.get(pk=response.data["id"])
        self.assertEqual(rule.company, self.company)
        self.assertEqual(rule.condition["transactionType"], "Sales invoice")
        self.assertEqual(rule.condition["levels"][0]["approvers"], ["manager"])

    def test_update_and_delete_rule(self):
        created = self.client.post(
            APPROVAL_RULE_URL, self.approval_payload(), format="json"
        ).data
        response = self.client.patch(
            f"{APPROVAL_RULE_URL}{created['id']}/",
            {"name": "Updated Rule"},
            format="json",
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["name"], "Updated Rule")
        self.assertEqual(
            self.client.delete(f"{APPROVAL_RULE_URL}{created['id']}/").status_code,
            204,
        )
        self.assertEqual(ApprovalRule.objects.count(), 0)

    def test_list_is_scoped_to_company(self):
        self.client.post(APPROVAL_RULE_URL, self.approval_payload(), format="json")
        self.client.force_authenticate(self.outsider)
        self.assertEqual(self.client.get(APPROVAL_RULE_URL).data, [])

    def test_options_returns_company_users_and_customers(self):
        response = self.client.get(APPROVAL_RULE_OPTIONS_URL)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            [user["username"] for user in response.data["users"]],
            ["agent", "manager"],
        )
        self.assertEqual(
            [customer["name"] for customer in response.data["customers"]],
            ["PT Pelanggan"],
        )

    def test_agent_can_read_but_not_create(self):
        self.client.force_authenticate(self.agent)
        self.assertEqual(self.client.get(APPROVAL_RULE_URL).status_code, 200)
        response = self.client.post(
            APPROVAL_RULE_URL, self.approval_payload(), format="json"
        )
        self.assertEqual(response.status_code, 403)


class TaggingRuleApiTests(SettingsApiTestCase):
    def tagging_payload(self):
        return {
            "name": "Sales Invoice Tag",
            "description": "",
            "tag_type": "transaction",
            "transaction_type": "Sales Invoice",
            "is_active": True,
            "default_tag": "Sales",
            "tag_set": ["Sales"],
            "tag_mapping": {
                "taggingType": 2,
                "transactionMakers": ["manager"],
            },
        }

    def test_create_persists_company_and_tag_mapping(self):
        response = self.client.post(
            TAGGING_RULE_URL, self.tagging_payload(), format="json"
        )
        self.assertEqual(response.status_code, 201, response.data)
        rule = TaggingRule.objects.get(pk=response.data["id"])
        self.assertEqual(rule.company, self.company)
        self.assertEqual(rule.tag_mapping["taggingType"], 2)
        self.assertEqual(rule.tag_mapping["transactionMakers"], ["manager"])

    def test_update_and_delete_rule(self):
        created = self.client.post(
            TAGGING_RULE_URL, self.tagging_payload(), format="json"
        ).data
        response = self.client.patch(
            f"{TAGGING_RULE_URL}{created['id']}/",
            {"name": "Updated Tag"},
            format="json",
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["name"], "Updated Tag")
        self.assertEqual(
            self.client.delete(f"{TAGGING_RULE_URL}{created['id']}/").status_code,
            204,
        )
        self.assertEqual(TaggingRule.objects.count(), 0)

    def test_list_is_scoped_to_company(self):
        self.client.post(TAGGING_RULE_URL, self.tagging_payload(), format="json")
        self.client.force_authenticate(self.outsider)
        self.assertEqual(self.client.get(TAGGING_RULE_URL).data, [])

    def test_options_returns_company_users(self):
        response = self.client.get(TAGGING_RULE_OPTIONS_URL)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            [user["username"] for user in response.data["users"]],
            ["agent", "manager"],
        )

    def test_agent_can_read_but_not_create(self):
        self.client.force_authenticate(self.agent)
        self.assertEqual(self.client.get(TAGGING_RULE_URL).status_code, 200)
        response = self.client.post(
            TAGGING_RULE_URL, self.tagging_payload(), format="json"
        )
        self.assertEqual(response.status_code, 403)
