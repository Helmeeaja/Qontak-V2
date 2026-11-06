import { useEffect, useRef, useState } from "react";

import api from "./api";
import { can } from "./permissions";

export const canEditTemplates = () => can("sales", "edit");

const collectMessages = (value) => {
  if (value === null || value === undefined) return [];
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectMessages);
  if (typeof value === "object") return Object.values(value).flatMap(collectMessages);
  return [String(value)];
};

export const templateErrorMessage = (error, fallback) => {
  const data = error.response?.data;
  if (data && typeof data === "object") {
    const messages = collectMessages(data);
    if (messages.length > 0) return messages.join("\n");
  }
  return fallback;
};

export function useTemplateSetting(key, defaults) {
  const defaultsRef = useRef(defaults);
  const [values, setValues] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get(`/template-settings/${key}/`)
      .then((response) => {
        if (cancelled) return;
        setValues({ ...defaultsRef.current, ...response.data });
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(templateErrorMessage(requestError, "Gagal memuat template."));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  const setField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setSaved(false);
    setError("");
  };

  const reset = () => {
    setValues({ ...defaultsRef.current });
    setSaved(false);
    setError("");
  };

  const isDirty = JSON.stringify(values) !== JSON.stringify(defaultsRef.current);

  const save = async (extras) => {
    if (saving) return null;
    setSaving(true);
    setError("");
    try {
      const payload = Object.fromEntries(
        Object.entries(values).filter(([name]) => !name.endsWith("_url"))
      );
      let body = payload;
      if (extras) {
        body = new FormData();
        body.append("data", JSON.stringify(payload));
        Object.entries(extras).forEach(([name, value]) => {
          if (value === null || value === undefined || value === false) return;
          body.append(name, value === true ? "true" : value);
        });
      }
      const response = await api.put(`/template-settings/${key}/`, body);
      const next = { ...defaultsRef.current, ...response.data };
      setValues(next);
      setSaved(true);
      return response.data;
    } catch (requestError) {
      setError(templateErrorMessage(requestError, "Gagal menyimpan template."));
      return null;
    } finally {
      setSaving(false);
    }
  };

  return {
    values,
    setField,
    loading,
    saving,
    saved,
    setSaved,
    error,
    save,
    reset,
    isDirty,
  };
}
