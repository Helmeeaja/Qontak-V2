from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    AcceptInvitationView,
    AccountMappingViewSet,
    AgentViewSet,
    ApprovalRuleViewSet,
    BillingViewSet,
    CompanyDetailView,
    CustomFieldViewSet,
    DashboardStatsView,
    EmailTokenObtainPairView,
    InvitationDetailView,
    MemberViewSet,
    ProductionSettingDetailView,
    ProfileView,
    RegisterView,
    RoleViewSet,
    SwitchAccountView,
    TaggingRuleViewSet,
    TeamMembersView,
    TemplateSettingView,
)

router = DefaultRouter()
router.register(r"account-mappings", AccountMappingViewSet, basename="account-mapping")
router.register(r"agents", AgentViewSet, basename="agent")
router.register(r"approval-rules", ApprovalRuleViewSet, basename="approval-rule")
router.register(r"billings", BillingViewSet, basename="billing")
router.register(r"custom-fields", CustomFieldViewSet, basename="custom-field")
router.register(r"members", MemberViewSet, basename="member")
router.register(r"roles", RoleViewSet, basename="role")
router.register(r"tagging-rules", TaggingRuleViewSet, basename="tagging-rule")

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("token/", EmailTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/profile/", ProfileView.as_view(), name="profile"),
    path("auth/team/", TeamMembersView.as_view(), name="team-members"),
    path(
        "auth/switch-account/",
        SwitchAccountView.as_view(),
        name="switch-account",
    ),
    path(
        "auth/invitation/",
        InvitationDetailView.as_view(),
        name="invitation-detail",
    ),
    path(
        "auth/accept-invitation/",
        AcceptInvitationView.as_view(),
        name="accept-invitation",
    ),
    path("company/", CompanyDetailView.as_view(), name="company-detail"),
    path(
        "production-settings/",
        ProductionSettingDetailView.as_view(),
        name="production-setting-detail",
    ),
    path("template-settings/", TemplateSettingView.as_view(), name="template-settings"),
    path(
        "template-settings/<str:key>/",
        TemplateSettingView.as_view(),
        name="template-setting-detail",
    ),
    path("dashboard/stats/", DashboardStatsView.as_view(), name="dashboard-stats"),
    path("", include(router.urls)),
]
