import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Eye, EyeClosed, WarningCircle } from "@phosphor-icons/react";

import { extractError, publicApi } from "@/services/api";
import brandLogo from "@/assets/brand.png";
import LoadingPopup from "@/components/ui/LoadingPopup";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-[13px] text-[15px] text-slate-900 outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-slate-400 focus:border-brand focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]";

export default function AcceptInvitationPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState("loading");
  const [invitation, setInvitation] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    let active = true;
    publicApi
      .get("/auth/invitation/", { params: { token } })
      .then((response) => {
        if (!active) return;
        setInvitation(response.data);
        setStatus("form");
      })
      .catch((err) => {
        if (!active) return;
        setError(extractError(err, "Undangan tidak valid atau sudah kedaluwarsa."));
        setStatus("invalid");
      });

    return () => {
      active = false;
    };
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    setSubmitting(true);
    try {
      await publicApi.post("/auth/accept-invitation/", {
        token,
        password,
        password_confirm: passwordConfirm,
      });
      localStorage.clear();
      setStatus("success");
    } catch (err) {
      setError(extractError(err, "Gagal membuat password. Coba lagi."));
    } finally {
      setSubmitting(false);
    }
  };

  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-slate-200 border-t-brand" />
          <p className="m-0 text-sm text-slate-500">Memeriksa link undangan...</p>
        </div>
      );
    }

    if (status === "invalid") {
      return (
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <WarningCircle size={52} weight="fill" className="text-amber-500" />
          <div>
            <h2 className="m-0 text-lg font-bold text-slate-900">Undangan tidak berlaku</h2>
            <p className="mt-2 mb-0 text-sm leading-relaxed text-slate-500">
              {error || "Link undangan tidak valid atau sudah kedaluwarsa."}
            </p>
          </div>
          <Link
            to="/login"
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-brand px-4 py-[11px] text-sm font-semibold text-white no-underline transition-colors hover:bg-brand-dark"
          >
            Kembali ke login
          </Link>
        </div>
      );
    }

    if (status === "success") {
      return (
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <CheckCircle size={52} weight="fill" className="text-emerald-500" />
          <div>
            <h2 className="m-0 text-lg font-bold text-slate-900">Password berhasil dibuat</h2>
            <p className="mt-2 mb-0 text-sm leading-relaxed text-slate-500">
              Akun {invitation?.email} sudah aktif. Silakan login dengan password baru.
            </p>
          </div>
          <Link
            to="/login"
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-brand px-4 py-[11px] text-sm font-semibold text-white no-underline transition-colors hover:bg-brand-dark"
          >
            Ke halaman login
          </Link>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <p className="m-0">
              Kamu membuat password untuk <span className="font-semibold">{invitation?.email}</span>
              {invitation?.company_name ? (
                <>
                  {" "}
                  di <span className="font-semibold">{invitation.company_name}</span>
                </>
              ) : null}
              .
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-600/15 bg-red-600/[0.08] p-3 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-900">
              Password baru
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                autoComplete="new-password"
                required
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 flex -translate-y-1/2 cursor-pointer items-center justify-center bg-transparent p-1 text-slate-500 hover:text-slate-900"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password_confirm" className="text-sm font-medium text-slate-900">
              Ulangi password
            </label>
            <input
              id="password_confirm"
              type={showPassword ? "text" : "password"}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Ulangi password"
              autoComplete="new-password"
              required
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full cursor-pointer rounded-lg bg-brand px-4 py-[13px] text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Menyimpan..." : "Buat password"}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8 max-md:p-6">
      <div className="w-full max-w-[440px]">
        <div className="mb-8">
          <img src={brandLogo} alt="QontakSales" className="h-9 w-auto object-contain" />
        </div>

        <div className="mb-8">
          <h1 className="mb-3 text-[30px] font-bold leading-[1.2] text-slate-900 max-md:text-[26px]">
            Buat password akunmu
          </h1>
          <p className="m-0 text-[15px] text-slate-500">
            Selesaikan undangan untuk bisa masuk ke QontakSales.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_4px_12px_rgba(15,23,42,0.05)] max-md:p-6">
          {renderContent()}
        </div>
      </div>

      <LoadingPopup open={submitting} message="Menyimpan password..." />
    </div>
  );
}
