const PERMISSIONS_KEY = "permissions";

export function getPermissions() {
  try {
    const raw = localStorage.getItem(PERMISSIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setPermissions(permissions) {
  if (!permissions) {
    localStorage.removeItem(PERMISSIONS_KEY);
    return;
  }
  localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions));
}

export function hasStoredPermissions() {
  return Boolean(localStorage.getItem(PERMISSIONS_KEY));
}

export function can(module, action = "see") {
  if (localStorage.getItem("user_role") === "MANAGER") return true;
  const permissions = getPermissions();
  return Boolean(permissions?.[module]?.[action]);
}

export function canAny(module, actions = []) {
  return actions.some((action) => can(module, action));
}

export const PATH_MODULES = {
  "/settings/sales": "sales",
  "/settings/purchases": "purchases",
  "/settings/products": "products",
  "/settings/productions": "productions",
  "/settings/template": "sales",
  "/settings/user-management": "usermanagement",
  "/settings/agents": "agents",
  "/settings/company": "company",
  "/settings/account-mapping": "coa",
  "/settings/billings": "company",
  "/settings/approval-rules": "sales",
  "/settings/tagging-rules": "sales",
};

export function moduleForPath(pathname) {
  return PATH_MODULES[pathname] || null;
}

export function canOpenPath(pathname) {
  const module = moduleForPath(pathname);
  if (!module) return true;
  return can(module, "see");
}
