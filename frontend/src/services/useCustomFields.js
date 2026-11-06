import { useCallback, useEffect, useState } from "react";

import api, { extractError } from "./api";
import { can } from "./permissions";

export const canManageCustomFields = () => can("company", "edit");

export async function fetchCustomFieldScope(page, subPage) {
  const params = { for_page: page.toLowerCase() };
  if (subPage) params.for_sub_page = subPage;
  const response = await api.get("/custom-fields/", { params });
  return response.data.filter((item) => item.status !== "deleted");
}

export function useCustomFields({ status, search }) {
  const [fields, setFields] = useState([]);
  const [quota, setQuota] = useState({ quota: 0, used: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const params = {};
    if (status) params.status = status;
    if (search) params.search = search;
    setLoading(true);
    Promise.all([
      api.get("/custom-fields/", { params }),
      api.get("/custom-fields/quota/"),
    ])
      .then(([listResponse, quotaResponse]) => {
        if (cancelled) return;
        setFields(listResponse.data);
        setQuota(quotaResponse.data);
        setError("");
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(extractError(requestError, "Gagal memuat custom fields."));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [status, search, version]);

  const refresh = useCallback(() => setVersion((current) => current + 1), []);

  const create = async (payload) => {
    await api.post("/custom-fields/", payload);
    refresh();
  };

  const update = async (id, payload) => {
    await api.patch(`/custom-fields/${id}/`, payload);
    refresh();
  };

  const remove = async (id) => {
    await api.delete(`/custom-fields/${id}/`);
    refresh();
  };

  const reorder = async (ids) => {
    await api.post("/custom-fields/reorder/", { ids });
    refresh();
  };

  return { fields, quota, loading, error, create, update, remove, reorder };
}
