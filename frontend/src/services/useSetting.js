import { useEffect, useState } from "react";
import api, { extractError } from "./api";

import { can } from "./permissions";

export const canEditSettings = (module) => can(module, "edit");

export function useSetting(url) {
  const [saved, setSaved] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .get(url)
      .then((response) => {
        if (!cancelled) setSaved(response.data);
      })
      .catch((error) => {
        if (!cancelled) setLoadError(extractError(error, "Gagal memuat pengaturan."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  const save = async (values) => {
    const response = await api.put(url, values);
    setSaved(response.data);
  };

  return { saved, setSaved, loading, loadError, save };
}

export function useEditing(saved, save, failMessage) {
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const start = () => {
    setError("");
    setDraft(saved);
  };
  const cancel = () => setDraft(null);
  const setField = (field, value) => setDraft((current) => ({ ...current, [field]: value }));
  const toggleField = (field) => setDraft((current) => ({ ...current, [field]: !current[field] }));

  const submit = async (payload) => {
    setSaving(true);
    setError("");
    try {
      await save(payload);
      setDraft(null);
    } catch (e) {
      setError(extractError(e, failMessage));
    } finally {
      setSaving(false);
    }
  };

  return { draft, editing: draft !== null, saving, error, start, cancel, setField, toggleField, submit };
}
