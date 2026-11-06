import { useCallback, useEffect, useState } from "react";

import api, { extractError } from "./api";

export function useAccountMappings() {
  const [values, setValues] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get("/account-mappings/"),
      api.get("/account-mappings/options/"),
    ])
      .then(([mappingResponse, optionsResponse]) => {
        const next = {};
        mappingResponse.data.forEach((item) => {
          const value =
            item.account_code || item.mapping_options?.account_value;
          if (value) next[item.target_id] = value;
        });
        setValues(next);
        setAccounts(optionsResponse.data.accounts || []);
        setError("");
      })
      .catch((requestError) => {
        setError(extractError(requestError, "Gagal memuat account mapping."));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (entries) => {
    await api.put("/account-mappings/bulk/", { mappings: entries });
    load();
  };

  return { values, accounts, loading, error, save };
}
