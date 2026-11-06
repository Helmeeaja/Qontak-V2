ACTIONS = ("see", "create", "edit", "delete")

MODULES = (
    "dashboard",
    "customers",
    "coa",
    "products",
    "sales",
    "purchases",
    "productions",
    "reports",
    "company",
    "usermanagement",
    "roles",
    "agents",
)

MANAGER_ONLY_MODULES = ("company", "usermanagement", "roles", "agents")

BUSINESS_MODULES = (
    "dashboard",
    "customers",
    "coa",
    "products",
    "sales",
    "purchases",
    "productions",
    "reports",
)

REPORT_FEATURES = (
    "Business overview report",
    "Sales report",
    "Purchases report",
    "Product report",
    "Assets report",
    "Foreign exchange report",
    "Bank report",
    "Tax report",
)

PRESET_ROLES = {
    "ultimate": {
        "see": BUSINESS_MODULES,
        "create": BUSINESS_MODULES,
    },
    "administrator": {
        "see": BUSINESS_MODULES,
        "create": (),
    },
    "accountant": {
        "see": BUSINESS_MODULES,
        "create": ("coa",),
    },
    "reportReader": {
        "see": ("dashboard", "reports"),
        "create": (),
    },
    "banker": {
        "see": ("dashboard", "coa", "customers", "reports"),
        "create": ("coa",),
    },
    "sales": {
        "see": ("dashboard", "customers", "products", "sales", "reports"),
        "create": ("customers", "products", "sales"),
    },
    "purchasing": {
        "see": ("dashboard", "products", "purchases", "reports"),
        "create": ("products", "purchases"),
    },
    "expenses": {
        "see": ("dashboard", "purchases", "reports"),
        "create": ("purchases",),
    },
    "stockist": {
        "see": ("dashboard", "products", "reports"),
        "create": ("products",),
    },
    "productions": {
        "see": ("dashboard", "products", "productions", "reports"),
        "create": ("productions",),
    },
}

SUB_FEATURE_MODULES = {
    "Company setting": "company",
    "User management: User list": "usermanagement",
    "User management: Custom role": "roles",
    "Sales: Form settings": "sales",
    "Sales: Invoice reminder": "sales",
    "Purchase": "purchases",
    "Product: Good & Services": "products",
    "Product: Warehouse": "products",
    "Product: Unit": "products",
    "Chart of Accounts": "coa",
    "Customer": "customers",
    "Production": "productions",
}

FEATURE_MODULES = {
    "Sales": "sales",
    "Purchase": "purchases",
    "Product": "products",
    "Expenses": "purchases",
    "Cash & Bank": "coa",
    "Productions": "productions",
}

PRESET_AUTHORITY_MODULES = {
    "sales": "sales",
    "purchasing": "purchases",
    "expenses": "purchases",
}


def blank_permissions():
    return {module: {action: False for action in ACTIONS} for module in MODULES}


def full_permissions():
    return {module: {action: True for action in ACTIONS} for module in MODULES}


def _grant(permissions, module, actions):
    if module not in permissions:
        return
    for action in actions:
        permissions[module][action] = True


def module_for_authority(feature, sub_feature):
    module = SUB_FEATURE_MODULES.get(sub_feature)
    if module:
        return module
    if feature in REPORT_FEATURES:
        return "reports"
    return FEATURE_MODULES.get(feature)


def _from_config(permissions, user):
    config = user.role_config if isinstance(user.role_config, dict) else {}

    for key in config.get("existing") or []:
        preset = PRESET_ROLES.get(key)
        if not preset:
            continue
        for module in preset["see"]:
            _grant(permissions, module, ("see",))
        for module in preset["create"]:
            _grant(permissions, module, ("create",))

    for cell in config.get("authority") or []:
        module = PRESET_AUTHORITY_MODULES.get(str(cell).split(".")[0])
        if module:
            _grant(permissions, module, ("see", "create"))

    if config.get("list_manager"):
        for module in MODULES:
            if permissions[module]["see"]:
                _grant(permissions, module, ("edit", "delete"))


def _from_custom_roles(permissions, user):
    for role in user.roles.all():
        for authority in role.authorities.all():
            module = module_for_authority(authority.feature, authority.sub_feature)
            if not module:
                continue
            if authority.see:
                _grant(permissions, module, ("see",))
            if authority.create:
                _grant(permissions, module, ("create",))
            if authority.edit:
                _grant(permissions, module, ("edit",))
            if authority.can_delete:
                _grant(permissions, module, ("delete",))


def _is_configured(user):
    config = user.role_config if isinstance(user.role_config, dict) else {}
    return bool(
        user.roles.exists()
        or config.get("existing")
        or config.get("authority")
    )


def permissions_for(user):
    permissions = blank_permissions()

    if not user or not getattr(user, "is_authenticated", False):
        return permissions

    _grant(permissions, "dashboard", ("see",))

    if user.role == "MANAGER" or user.is_superuser:
        return full_permissions()

    _from_config(permissions, user)
    _from_custom_roles(permissions, user)

    if not _is_configured(user):
        for module in BUSINESS_MODULES:
            _grant(permissions, module, ("see",))

    for module in MANAGER_ONLY_MODULES:
        for action in ACTIONS:
            permissions[module][action] = False

    return permissions


def can(user, module, action):
    if module not in MODULES or action not in ACTIONS:
        return False
    return permissions_for(user)[module][action]
