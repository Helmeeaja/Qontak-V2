import { useCallback, useEffect, useState } from "react";

import api, { extractError } from "./api";

const toRule = (record) => {
  const condition = record.condition || {};
  return {
    id: record.id,
    ruleName: record.name,
    description: record.description || "",
    transactionGroup: condition.transactionGroup || "",
    transactionType: condition.transactionType || record.condition?.transactionType || "",
    createdBy: condition.createdBy || "all",
    createdByUsers: condition.createdByUsers || [],
    createdFor: condition.createdFor || "all",
    createdForCustomers: condition.createdForCustomers || [],
    productScope: condition.productScope || "all",
    applyToDraft: condition.applyToDraft ?? true,
    criteria: condition.criteria || [],
    overdueDays: condition.overdueDays || 0,
    amountValue: Number(record.amount_threshold ?? condition.amountValue ?? 0) || 0,
    levels: condition.levels || condition.steps || [],
    changelog: condition.changelog || [],
    lastEdited: condition.lastEdited || "",
    lastEditedBy: condition.lastEditedBy || "",
  };
};

const toPayload = (values) => ({
  name: values.ruleName,
  description: values.description || "",
  rule_type: "workflow",
  amount_threshold: (values.criteria || []).includes("specificValue")
    ? Number(values.amountValue) || 0
    : null,
  is_active: true,
  condition: values,
});

export function useApprovalRules() {
  const [rules, setRules] = useState([]);
  const [options, setOptions] = useState({ users: [], customers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get("/approval-rules/"),
      api.get("/approval-rules/options/"),
    ])
      .then(([rulesResponse, optionsResponse]) => {
        setRules(rulesResponse.data.map(toRule));
        setOptions({
          users: optionsResponse.data.users || [],
          customers: optionsResponse.data.customers || [],
        });
        setError("");
      })
      .catch((requestError) => {
        setError(extractError(requestError, "Gagal memuat approval rules."));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (values) => {
    await api.post("/approval-rules/", toPayload(values));
    load();
  };

  const update = async (id, values) => {
    await api.patch(`/approval-rules/${id}/`, toPayload(values));
    load();
  };

  const remove = async (id) => {
    await api.delete(`/approval-rules/${id}/`);
    load();
  };

  return { rules, options, loading, error, create, update, remove };
}
