import { useState } from "react";

import { useBillings } from "@/services/useBillings";

function CardHeading({ title, muted }) {
  return (
    <h3
      className={`m-0 border-b border-slate-100 pb-2.5 text-xs font-bold uppercase tracking-wide ${
        muted ? "text-slate-300" : "text-slate-500"
      }`}
    >
      {title}
    </h3>
  );
}

function InfoRow({ label, value, valueClassName = "text-gray-900" }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-medium ${valueClassName}`}>{value}</span>
    </div>
  );
}

function ContactSupportModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-[10px] bg-white p-6 shadow-lg">
        <h3 className="m-0 text-base font-bold text-gray-900">Contact Support</h3>
        <p className="mt-2 text-sm text-gray-500">
          Untuk info langganan atau pembayaran, hubungi tim support kami di{" "}
          <span className="font-medium text-blue-600">support@qontak.com</span>.
        </p>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-slate-50"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BillingsPage() {
  const { history: billingHistory, company: companyData, loading, error } = useBillings();
  const [downloadingIndex, setDownloadingIndex] = useState(null);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const company = {
    name: companyData?.name || "Company Name",
    status: "Active",
  };

  const subscription = {
    name: "Trial Qontak 360",
    usersUsed: 1,
    usersLimit: "-",
    partners: 0,
    daysLeft: 6,
    expiryDate: "2026-09-23",
  };

  const billing = {
    cycle: "-",
    nextBillingDate: "-",
  };

  const handleDownload = (index) => {
    setDownloadingIndex(index);
    setTimeout(() => {
      setDownloadingIndex(null);
    }, 1200);
  };

  return (
    <div className="p-7 max-md:p-[18px]">
      <div className="mb-6 flex items-start justify-between">
        <h2 className="m-0 text-[28px] font-bold text-gray-900">Billings</h2>
        <div className="text-right">
          <p className="m-0 text-sm font-bold text-gray-900">{company.name}</p>
          <p className="m-0 text-sm font-bold text-red-600">{company.status}</p>
        </div>
      </div>

      {(error || loading) && (
        <p className="m-0 mb-4 text-sm text-slate-500">
          {loading ? "Memuat billing..." : error}
        </p>
      )}

      <div className="mb-6 grid grid-cols-3 gap-5 max-md:grid-cols-1">
        <div className="rounded-[10px] bg-white p-6 shadow-sm">
          <CardHeading title="Subscription Package" />
          <div className="mt-3">
            <InfoRow label="Name" value={subscription.name} />
            <InfoRow
              label="Users"
              value={`${subscription.usersUsed} out of ${subscription.usersLimit}`}
            />
            <InfoRow label="Partners" value={subscription.partners} />
          </div>

          <div className="mt-4 space-y-1 border-t border-slate-100 pt-4">
            <div className="flex gap-2">
              <span className="m-0 text-xs font-medium text-gray-900">
                Number of days left: </span>
              <span className="m-0 text-xs font-medium font-semibold text-gray-900">{subscription.daysLeft}</span>
            </div>
            <p className="m-0 text-xs">
            <div className="flex gap-2">
              <span className="text-gray-900">Expiry date </span>
              <span className="font-semibold font-semibold text-gray-900">{subscription.expiryDate}</span>
            </div>
            </p>
          </div>
        </div>

        <div className="rounded-[10px] bg-white p-6 shadow-sm">
          <CardHeading title="Billing Information" />
          <div className="mt-3">
            <InfoRow
              label="Billing Cycle"
              value={billing.cycle}
              valueClassName="text-blue-600"
            />
            <InfoRow
              label="Next Billing Date"
              value={billing.nextBillingDate}
              valueClassName="text-blue-600"
            />
          </div>
        </div>

        <div className="rounded-[10px] bg-white p-6 shadow-sm">
          <CardHeading title="Payment Details" muted />
          <div className="flex h-full flex-col items-center justify-center gap-3 pt-6">
            <p className="m-0 text-center text-xs leading-relaxed text-slate-300">
              Learn more about your subscription and proceed by contacting our
              support team.
            </p>
            <button
              type="button"
              className="text-xs font-semibold text-blue-600 hover:underline"
              onClick={() => setShowSupportModal(true)}
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-[10px] bg-white shadow-sm">
        <div className="p-6 pb-4">
          <h3 className="m-0 text-xs font-bold uppercase tracking-wide text-slate-500">
            Billing History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50">
                <th className="px-6 py-3 text-xs font-bold text-gray-900">Pay Date</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-900">Billing Period</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-900">Total Amount</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-900">Download Invoice</th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-500">
                    Belum ada riwayat billing.
                  </td>
                </tr>
              ) : (
                billingHistory.map((row, index) => (
                  <tr key={index} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-6 py-3.5 text-sm text-blue-600">{row.payDate}</td>
                    <td className="px-6 py-3.5 text-sm text-blue-600">{row.period}</td>
                    <td className="px-6 py-3.5 text-sm text-blue-600">{row.amount}</td>
                    <td className="px-6 py-3.5 text-sm">
                      {row.invoiceAvailable ? (
                        <button
                          type="button"
                          className="text-blue-600 hover:underline disabled:opacity-60"
                          disabled={downloadingIndex === index}
                          onClick={() => handleDownload(index)}
                        >
                          {downloadingIndex === index ? "Downloading..." : "Download"}
                        </button>
                      ) : (
                        <span className="text-slate-400">Invoice not Available yet</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-sky-50 px-6 py-3 text-center text-xs text-sky-700">
          Showing 1 .. {billingHistory.length} of {billingHistory.length} Entries
        </div>
      </div>

      {showSupportModal && (
        <ContactSupportModal onClose={() => setShowSupportModal(false)} />
      )}
    </div>
  );
}