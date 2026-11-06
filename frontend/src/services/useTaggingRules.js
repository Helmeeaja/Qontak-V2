import { useCallback, useEffect, useState } from "react";

import api, { extractError } from "./api";

const toRule = (record) => ({
  id: record.id,
  ruleName: record.name,
  transactionType: record.transaction_type,
  taggingType: record.tag_mapping?.taggingType ?? 2,
  customTags: record.tag_set || [],
  transactionMakers: record.tag_mapping?.transactionMakers || [],
});

const toPayload = (values) => ({
  name: values.ruleName,
  description: "",
  tag_type: "transaction",
  transaction_type: values.transactionType,
  is_active: true,
  default_tag: values.customTags?.[0] || "",
  tag_set: values.customTags || [],
  tag_mapping: {
    taggingType: values.taggingType,
    transactionMakers: values.transactionMakers || [],
  },
});

export function useTaggingRules() {
  const [rules, setRules] = useState([]);
  const [options, setOptions] = useState({ users: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get("/tagging-rules/"),
      api.get("/tagging-rules/options/"),
    ])
      .then(([rulesResponse, optionsResponse]) => {
        setRules(rulesResponse.data.map(toRule));
        setOptions({ users: optionsResponse.data.users || [] });
        setError("");
      })
      .catch((requestError) => {
        setError(extractError(requestError, "Gagal memuat tagging rules."));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (values) => {
    await api.post("/tagging-rules/", toPayload(values));
    load();
  };

  const update = async (id, values) => {
    await api.patch(`/tagging-rules/${id}/`, toPayload(values));
    load();
  };

  const remove = async (id) => {
    await api.delete(`/tagging-rules/${id}/`);
    load();
  };

  return { rules, options, loading, error, create, update, remove };
}
