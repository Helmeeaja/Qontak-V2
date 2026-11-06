import { useCallback, useEffect, useState } from "react";

import api, { extractError } from "./api";

const toHistoryRow = (record) => ({
  payDate: record.invoice_date
    ? new Date(record.invoice_date).toLocaleDateString("id-ID")
    : "-",
  period: record.billing_period || "-",
  amount: new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  }).format(Number(record.total_amount) || 0),
  invoiceAvailable: record.status === "paid",
});

export function useBillings() {
  const [history, setHistory] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([api.get("/billings/"), api.get("/company/").catch(() => null)])
      .then(([billingResponse, companyResponse]) => {
        setHistory(billingResponse.data.map(toHistoryRow));
        setCompany(companyResponse?.data || null);
        setError("");
      })
      .catch((requestError) => {
        setError(extractError(requestError, "Gagal memuat billing."));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { history, company, loading, error };
}
