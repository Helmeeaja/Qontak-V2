from rest_framework.permissions import SAFE_METHODS, BasePermission

from .authorities import can


class IsManager(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == "MANAGER"


class IsManagerOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_authenticated and request.user.role == "MANAGER"


def action_for_method(method):
    if method in SAFE_METHODS:
        return "see"
    if method == "POST":
        return "create"
    if method in ("PUT", "PATCH"):
        return "edit"
    if method == "DELETE":
        return "delete"
    return "see"


class ModulePermission(BasePermission):


    message = "Role kamu tidak punya izin untuk aksi ini."

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        module = getattr(view, "permission_module", None)
        if not module:
            return True

        return can(user, module, action_for_method(request.method))
