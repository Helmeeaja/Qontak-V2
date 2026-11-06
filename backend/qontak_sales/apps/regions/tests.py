from django.conf import settings
from django.contrib.auth import get_user_model
from django.test import SimpleTestCase, TestCase
from django.urls import resolve, reverse
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken

from qontak_sales.apps.accounts.models import ApprovalRule

from .models import City, District, Province, Village


class RegionConfigurationTests(SimpleTestCase):
    def test_approval_rule_uses_configured_user_model(self):
        self.assertEqual(
            ApprovalRule._meta.get_field("approver_user").remote_field.model,
            get_user_model(),
        )

    def test_regions_app_is_installed(self):
        self.assertIn("qontak_sales.apps.regions", settings.INSTALLED_APPS)

    def test_region_routes_are_registered(self):
        routes = {
            "province-list": "/api/provinces/",
            "city-list": "/api/cities/",
            "district-list": "/api/districts/",
            "village-list": "/api/villages/",
            "postalcode-list": "/api/postal-codes/",
        }
        for name, path in routes.items():
            with self.subTest(path=path):
                self.assertEqual(reverse(name), path)
                self.assertEqual(resolve(path).url_name, name)


class RegionAPITests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = get_user_model().objects.create_user(username="region-test-user")
        cls.province = Province.objects.create(code="31", name="DKI JAKARTA")
        cls.other_province = Province.objects.create(code="32", name="JAWA BARAT")
        cls.city = City.objects.create(
            code="31.71", name="KOTA JAKARTA PUSAT", province=cls.province
        )
        cls.other_city = City.objects.create(
            code="32.73", name="KOTA BANDUNG", province=cls.other_province
        )
        cls.district = District.objects.create(
            code="31.71.01", name="GAMBIR", city=cls.city
        )
        cls.other_district = District.objects.create(
            code="32.73.01", name="SUKASARI", city=cls.other_city
        )
        Village.objects.create(
            code="31.71.01.1001", name="GAMBIR", district=cls.district,
            postal_code="10110",
        )
        Village.objects.create(
            code="31.71.01.1002", name="CIDENG", district=cls.district,
            postal_code="10150",
        )
        Village.objects.create(
            code="31.71.01.1003", name="PETOJO", district=cls.district,
            postal_code="10110",
        )
        Village.objects.create(
            code="31.71.01.1004", name="WITHOUT POSTAL CODE", district=cls.district,
        )
        Village.objects.create(
            code="32.73.01.1001", name="GEGERKALONG", district=cls.other_district,
            postal_code="40153",
        )

    def setUp(self):
        self.client = APIClient()
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {AccessToken.for_user(self.user)}"
        )

    def test_provinces_return_json_array(self):
        response = self.client.get("/api/provinces/")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        self.assertEqual([row["code"] for row in response.json()], ["31", "32"])

    def test_cities_return_frontend_fields_without_pagination(self):
        response = self.client.get("/api/cities/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0], {
            "id": self.city.pk,
            "code": self.city.code,
            "name": self.city.name,
            "province": self.province.pk,
        })

    def test_cities_filter_by_province(self):
        response = self.client.get("/api/cities/", {"province_code": "31"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual([row["code"] for row in response.json()], [self.city.code])

    def test_districts_filter_by_city(self):
        response = self.client.get("/api/districts/", {"city_code": self.city.code})
        self.assertEqual(response.status_code, 200)
        self.assertEqual([row["code"] for row in response.json()], [self.district.code])

    def test_villages_filter_by_district(self):
        response = self.client.get(
            "/api/villages/", {"district_code": self.other_district.code}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual([row["postal_code"] for row in response.json()], ["40153"])

    def test_postal_codes_are_sorted_unique_nonempty_and_city_scoped(self):
        response = self.client.get("/api/postal-codes/", {"city_code": self.city.code})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [
            {"id": 0, "code": "10110"},
            {"id": 1, "code": "10150"},
        ])

    def test_postal_codes_without_city_return_empty_array(self):
        response = self.client.get("/api/postal-codes/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [])

    def test_unknown_region_filters_return_empty_arrays(self):
        requests = [
            ("/api/cities/", {"province_code": "unknown"}),
            ("/api/districts/", {"city_code": "unknown"}),
            ("/api/villages/", {"district_code": "unknown"}),
            ("/api/postal-codes/", {"city_code": "unknown"}),
        ]
        for path, params in requests:
            with self.subTest(path=path):
                response = self.client.get(path, params)
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.json(), [])

    def test_region_endpoints_require_authentication(self):
        client = APIClient()
        for path in [
            "/api/provinces/", "/api/cities/", "/api/districts/",
            "/api/villages/", "/api/postal-codes/",
        ]:
            with self.subTest(path=path):
                self.assertEqual(client.get(path).status_code, 401)
