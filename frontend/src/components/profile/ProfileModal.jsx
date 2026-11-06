import { useEffect, useRef, useState } from "react";
import { Camera, Trash, X } from "@phosphor-icons/react";

import api, { extractError } from "@/services/api";
import {
  btnModalCancel,
  btnModalSubmit,
  buttonSpinner,
  formLabel,
  inputBase,
  modalCloseButton,
  modalFooter,
  modalHeader,
  modalOverlay,
  modalPanel,
  modalTitle,
} from "@/components/ui/styles";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const roleLabels = {
  MANAGER: "Sales Manager",
  AGENT: "Sales Agent",
};

const initialOf = (value) => (value || "?").trim().charAt(0).toUpperCase();

const profileErrorMessage = (error, fallback) => {
  const data = error.response?.data;
  if (data && typeof data === "object") {
    for (const field of ["email", "avatar", "first_name", "last_name", "phone"]) {
      const message = data[field];
      if (!message) continue;
      return Array.isArray(message) ? message.join(" ") : String(message);
    }
  }
  return extractError(error, fallback);
};

function AccountInfo({ label, value }) {
  return (
    <div className="min-w-0">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-0.5 truncate text-sm font-medium text-gray-900">
        {value || "-"}
      </div>
    </div>
  );
}

export default function ProfileModal({ user, onClose, onUpdated }) {
  const [form, setForm] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    phone: user.phone || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar_url || null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const firstFieldRef = useRef(null);
  const modalRef = useRef(null);
  const objectUrlRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const fullName =
    `${form.first_name} ${form.last_name}`.trim() ||
    user.username ||
    "User";
  const isDirty =
    Boolean(avatarFile) ||
    removeAvatar ||
    form.first_name !== (user.first_name || "") ||
    form.last_name !== (user.last_name || "") ||
    form.email !== (user.email || "") ||
    form.phone !== (user.phone || "");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTarget = window.matchMedia("(min-width: 640px)").matches
      ? firstFieldRef.current
      : modalRef.current;
    focusTarget?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !modalRef.current) return;

      const focusable = Array.from(
        modalRef.current.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const clearObjectUrl = () => {
    if (!objectUrlRef.current) return;
    URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
  };

  const onAvatarPick = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("File yang dipilih harus berupa gambar.");
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      setError("Ukuran foto maksimal 5 MB.");
      return;
    }

    clearObjectUrl();
    const previewUrl = URL.createObjectURL(file);
    objectUrlRef.current = previewUrl;
    setAvatarFile(file);
    setAvatarPreview(previewUrl);
    setRemoveAvatar(false);
    setError("");
  };

  const onAvatarRemove = () => {
    clearObjectUrl();
    setAvatarFile(null);
    setAvatarPreview(null);
    setRemoveAvatar(true);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;
    if (!form.email.trim()) {
      setError("Email wajib diisi.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = new FormData();
      payload.append("first_name", form.first_name.trim());
      payload.append("last_name", form.last_name.trim());
      payload.append("email", form.email.trim());
      payload.append("phone", form.phone.trim());

      if (avatarFile) payload.append("avatar", avatarFile);
      if (removeAvatar) payload.append("remove_avatar", "true");

      const response = await api.put("/auth/profile/", payload);
      onUpdated(response.data);
      onClose();
    } catch (requestError) {
      setError(profileErrorMessage(requestError, "Gagal menyimpan profil."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`${modalOverlay} z-[1300]`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <div
        ref={modalRef}
        className={`${modalPanel} flex max-w-[620px] flex-col`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        aria-describedby="profile-modal-description"
        tabIndex={-1}
      >
        <div className={`${modalHeader} shrink-0`}>
          <div>
            <h2 id="profile-modal-title" className={`${modalTitle} font-bold`}>
              Profil Saya
            </h2>
            <p
              id="profile-modal-description"
              className="m-0 mt-1 text-[13px] text-slate-500"
            >
              Perbarui foto dan informasi akun Anda
            </p>
          </div>
          <button
            type="button"
            className={modalCloseButton}
            onClick={onClose}
            disabled={saving}
            aria-label="Tutup profil"
          >
            <X size={20} />
          </button>
        </div>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[22px] py-5">
            <div className="flex items-center gap-5 max-[520px]:flex-col max-[520px]:items-start">
              <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-[30px] font-bold text-blue-700">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={fullName}
                    width={88}
                    height={88}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{initialOf(fullName)}</span>
                )}
              </div>

              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900">
                  Foto profil
                </div>
                <p className="m-0 mt-1 text-[13px] text-slate-500">
                  JPG, PNG, atau WebP. Maksimal 5 MB.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={saving}
                  >
                    <Camera size={16} />
                    Ganti foto
                  </button>

                  {avatarPreview && (
                    <button
                      type="button"
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={onAvatarRemove}
                      disabled={saving}
                    >
                      <Trash size={16} />
                      Hapus
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={onAvatarPick}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-[18px] max-[520px]:grid-cols-1">
              <div>
                <label htmlFor="profile-first-name" className={formLabel}>
                  Nama depan
                </label>
                <input
                  id="profile-first-name"
                  name="first_name"
                  ref={firstFieldRef}
                  className={inputBase}
                  value={form.first_name}
                  autoComplete="given-name"
                  onChange={(event) => setField("first_name", event.target.value)}
                />
              </div>

              <div>
                <label htmlFor="profile-last-name" className={formLabel}>
                  Nama belakang
                </label>
                <input
                  id="profile-last-name"
                  name="last_name"
                  className={inputBase}
                  value={form.last_name}
                  autoComplete="family-name"
                  onChange={(event) => setField("last_name", event.target.value)}
                />
              </div>

              <div className="col-span-full">
                <label htmlFor="profile-email" className={formLabel}>
                  Email
                </label>
                <input
                  id="profile-email"
                  name="email"
                  type="email"
                  className={inputBase}
                  value={form.email}
                  autoComplete="email"
                  spellCheck={false}
                  required
                  onChange={(event) => setField("email", event.target.value)}
                />
              </div>

              <div className="col-span-full">
                <label htmlFor="profile-phone" className={formLabel}>
                  Nomor telepon
                </label>
                <input
                  id="profile-phone"
                  name="phone"
                  type="tel"
                  className={inputBase}
                  value={form.phone}
                  autoComplete="tel"
                  placeholder="0812-3456-7890"
                  onChange={(event) => setField("phone", event.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <div className="text-[13px] font-semibold text-gray-700">
                Informasi akun
              </div>
              <div className="mt-3 grid grid-cols-3 gap-4 max-[520px]:grid-cols-1">
                <AccountInfo label="Username" value={`@${user.username}`} />
                <AccountInfo
                  label="Role"
                  value={roleLabels[user.role] || user.role}
                />
                <AccountInfo
                  label="Perusahaan"
                  value={user.company_name || "-"}
                />
              </div>
            </div>

          </div>

          {error && (
            <div
              className="mx-[22px] mt-4 shrink-0 whitespace-pre-line rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className={`${modalFooter} shrink-0`}>
            <button
              type="button"
              className={btnModalCancel}
              onClick={onClose}
              disabled={saving}
            >
              Batal
            </button>
            <button
              type="submit"
              className={btnModalSubmit}
              disabled={saving || !isDirty}
            >
              {saving && <span className={buttonSpinner} />}
              {saving ? "Menyimpan..." : "Simpan perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
