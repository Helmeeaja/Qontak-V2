import { useEffect, useState, useCallback } from "react";
import { Spinner } from "@chakra-ui/react";
import mekariPayImg from "../../assets/mekariPAY.png"
import {
  Export,
  ArrowClockwise,
  PencilSimple,
  Funnel,
  X,
  ArrowCounterClockwise,
  Info,
  DotsSixVertical,
  CaretUp,
  CaretDown,
  CaretLeft,
  CaretRight,
  Plus,
} from "@phosphor-icons/react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import api from "@/services/api";
import LoadingPopup from "@/components/ui/LoadingPopup";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DEFAULT_WIDGET_ORDER = [
  "arus_kas",
  "penjualan_terhutang",
  "tagihan_belum_dibayar",
  "laba_rugi",
  "biaya_operasional",
  "daftar_akun_terpantau",
  "produk_terlaris",
  "piutang_usaha",
  "mekari_pay",
  "kas",
];

function PeriodDropdown({ value: externalValue, onChange: externalOnChange }) {
  const [internalValue, setInternalValue] = useState("bulan_ini");
  const currentValue = externalValue !== undefined ? externalValue : internalValue;

  const handleChange = (e) => {
    const newVal = e.target.value;
    if (externalValue === undefined) {
      setInternalValue(newVal);
    }
    if (externalOnChange) {
      externalOnChange(e);
    }
  };

  return (
    <select
      value={currentValue}
      onChange={handleChange}
      className="text-xs border border-slate-200 rounded-md py-1.5 pl-2.5 pr-7 text-slate-600 font-normal focus:ring-blue-500 bg-white cursor-pointer"
    >
      <option value="hari_ini">Hari ini (09 Sep 2026)</option>
      <option value="pekan_ini">Pekan ini (08 Sep 2026 - 14 Sep 2026)</option>
      <option value="bulan_ini">Bulan ini (Sep 2026)</option>
      <option value="kuartal_ini">Kuartal ini (Jul 2026 - Sep 2026)</option>
      <option value="tahun_ini">Tahun ini (2026)</option>
    </select>
  );
}

function EmptyDataState({ text = "Belum ada data" }) {
  return (
    <div className="flex flex-col items-center justify-center my-8 text-center">
      <svg className="w-12 h-12 mb-3" viewBox="0 0 48 48" fill="none">
        <path
          className="empty-icon-stroke"
          d="M 22 7.2 A 17 17 0 1 0 40.8 26"
          stroke="#0040C1"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          className="empty-icon-fill empty-icon-stroke"
          d="M 26 5 C 33.5 5 40.5 12 40.5 19.5 C 40.5 21 39.5 22 38 22 L 26 22 C 24.5 22 24 21 24 19.5 L 24 6.5 C 24 5 25 5 26 5 Z"
          fill="#E8EEFF"
          stroke="#0040C1"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-xs font-semibold text-slate-800 tracking-tight">{text}</span>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState("performa");
  const [cashflowMode, setCashflowMode] = useState("chart");
  const [profitLossMode, setProfitLossMode] = useState("chart");
  const [lastUpdated, setLastUpdated] = useState("");

  // Edit Mode & Widget Reordering State
  const [isEditMode, setIsEditMode] = useState(false);
  const [widgetsOrder, setWidgetsOrder] = useState(() => {
    try {
      const saved = localStorage.getItem("dashboard_widgets_order");
      return saved ? JSON.parse(saved) : DEFAULT_WIDGET_ORDER;
    } catch {
      return DEFAULT_WIDGET_ORDER;
    }
  });
  const [savedWidgetsOrder, setSavedWidgetsOrder] = useState(widgetsOrder);
  const [activeWidgetId, setActiveWidgetId] = useState("arus_kas");
  const [draggedWidgetId, setDraggedWidgetId] = useState(null);

  // Filter Drawer State
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterWidgetTitle, setFilterWidgetTitle] = useState("penjualan terhutang");
  const [selectedPeriod, setSelectedPeriod] = useState("bulan_ini");
  const [selectedTag, setSelectedTag] = useState("");
  const [tagMatchMode, setTagMatchMode] = useState("mencakup_semua");

  const openFilter = (title) => {
    setFilterWidgetTitle(title);
    setFilterDrawerOpen(true);
  };

  const closeFilter = () => {
    setFilterDrawerOpen(false);
  };

  const handleResetFilter = () => {
    setSelectedPeriod("bulan_ini");
    setSelectedTag("");
    setTagMatchMode("mencakup_semua");
  };

  const handleToggleEditMode = () => {
    if (!isEditMode) {
      setSavedWidgetsOrder(widgetsOrder);
      setIsEditMode(true);
    } else {
      handleCancelEdit();
    }
  };

  const handleSaveEdit = () => {
    try {
      localStorage.setItem("dashboard_widgets_order", JSON.stringify(widgetsOrder));
    } catch (e) {
      console.error("Failed to save widget order", e);
    }
    setSavedWidgetsOrder(widgetsOrder);
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    setWidgetsOrder(savedWidgetsOrder);
    setIsEditMode(false);
  };

  const moveWidget = (id, direction) => {
    const index = widgetsOrder.indexOf(id);
    if (index === -1) return;

    let targetIndex = index;
    if (direction === "up" || direction === "left") {
      targetIndex = Math.max(0, index - 1);
    } else if (direction === "down" || direction === "right") {
      targetIndex = Math.min(widgetsOrder.length - 1, index + 1);
    }

    if (targetIndex !== index) {
      const newOrder = [...widgetsOrder];
      const [moved] = newOrder.splice(index, 1);
      newOrder.splice(targetIndex, 0, moved);
      setWidgetsOrder(newOrder);
    }
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggedWidgetId(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("text/plain") || draggedWidgetId;
    if (!sourceId || sourceId === targetId) return;

    const sourceIndex = widgetsOrder.indexOf(sourceId);
    const targetIndex = widgetsOrder.indexOf(targetId);

    if (sourceIndex !== -1 && targetIndex !== -1) {
      const newOrder = [...widgetsOrder];
      const [moved] = newOrder.splice(sourceIndex, 1);
      newOrder.splice(targetIndex, 0, moved);
      setWidgetsOrder(newOrder);
    }
    setDraggedWidgetId(null);
  };

  const formatTimestamp = () => {
    const now = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const day = String(now.getDate()).padStart(2, "0");
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year}, ${hours}:${minutes} (GMT+7)`;
  };

  const fetchStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const r = await api.get("/dashboard/stats/");
      setStats(r.data);
      setLastUpdated(formatTimestamp());
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await api.get("/dashboard/export/", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `dashboard-report-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      console.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const [themeMode, setThemeMode] = useState(
  () => localStorage.getItem("app_theme") || "light"
);

useEffect(() => {
  const sync = () => setThemeMode(localStorage.getItem("app_theme") || "light");
  window.addEventListener("themeChanged", sync);
  window.addEventListener("storage", sync);
  return () => {
    window.removeEventListener("themeChanged", sync);
    window.removeEventListener("storage", sync);
  };
}, []);

const isDark = themeMode === "dark";

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[400px]">
        <Spinner size="xl" color="blue.600" />
      </div>
    );
  }

  const formatRp = (val) => {
    if (val === undefined || val === null) return "Rp0,00";
    return `Rp${Number(val).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Prepare Chart Data
  const defaultMonths = [
    "Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26",
    "Apr 26", "May 26", "Jun 26", "Jul 26", "Aug 26", "Sep 26"
  ];

  const labels = (stats?.monthly_revenue && stats.monthly_revenue.length > 0)
    ? stats.monthly_revenue.map((m) => m.month)
    : defaultMonths;

  const revenueData = (stats?.monthly_revenue && stats.monthly_revenue.length > 0)
    ? stats.monthly_revenue.map((m) => m.revenue)
    : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const cashOutData = revenueData.map((val) => val * 0.4);
  const netCashData = revenueData.map((val, idx) => val - cashOutData[idx]);

  const hasCashflowData = revenueData.some((v) => v > 0);
  const hasProfitLossData = revenueData.some((v) => v > 0);

  const cashflowChartData = {
    labels,
    datasets: [
      {
        label: "Total kas masuk",
        data: revenueData,
        backgroundColor: "#2563eb",
        borderRadius: 4,
      },
      {
        label: "Total kas keluar",
        data: cashOutData,
        backgroundColor: "#14b8a6",
        borderRadius: 4,
      },
      {
        label: "Perpindahan kas bersih",
        data: netCashData,
        borderColor: "#9333ea",
        backgroundColor: "#9333ea",
        type: "line",
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${formatRp(context.raw)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 }, color: isDark ? "#94a3b8" : "#64748b" },
      },
      y: {
        beginAtZero: true,
        grid: { color: isDark ? "#2d2d2d" : "#f1f5f9" },
        ticks: {
          font: { size: 11 },
          color: isDark ? "#94a3b8" : "#64748b",
          callback: (v) => (v >= 1000000 ? `Rp ${(v / 1000000).toFixed(0)}M` : `Rp ${v}`),
        },
      },
    },
  };

  const profitLossChartData = {
    labels,
    datasets: [
      {
        label: "Pendapatan",
        data: revenueData,
        backgroundColor: "#2563eb",
        borderRadius: 4,
      },
      {
        label: "Beban",
        data: cashOutData,
        backgroundColor: "#14b8a6",
        borderRadius: 4,
      },
      {
        label: "Laba bersih",
        data: netCashData,
        borderColor: "#9333ea",
        backgroundColor: "#9333ea",
        type: "line",
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  // Render individual widget component
  const renderWidgetComponent = (widgetId) => {
    switch (widgetId) {
      case "arus_kas":
        return (
          <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm h-full">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                {isEditMode && (
                  <div className="cursor-grab active:cursor-grabbing p-0.5 text-slate-400 hover:text-slate-600">
                    <DotsSixVertical className="w-5 h-5" />
                  </div>
                )}
                <h2 className="text-base font-semibold text-slate-800">Arus kas</h2>
              </div>
              <div className="flex items-center space-x-2">
                <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-slate-50 text-xs">
                  <button
                    onClick={() => setCashflowMode("chart")}
                    className={`px-3 py-1 font-medium rounded cursor-pointer ${cashflowMode === "chart"
                        ? "bg-blue-50 text-blue-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                      }`}
                    type="button"
                  >
                    Tampilan grafik
                  </button>
                  <button
                    onClick={() => setCashflowMode("table")}
                    className={`px-3 py-1 font-medium rounded cursor-pointer ${cashflowMode === "table"
                        ? "bg-blue-50 text-blue-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                      }`}
                    type="button"
                  >
                    Tampilan tabel
                  </button>
                </div>
                <button
                  onClick={() => openFilter("arus kas")}
                  className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-slate-200 cursor-pointer"
                  type="button"
                >
                  <Funnel className="w-4 h-4" />
                </button>
              </div>
            </div>

            {cashflowMode === "chart" ? (
              hasCashflowData ? (
                <div className="w-full h-64 relative pt-4 pb-2">
                  <Bar data={cashflowChartData} options={chartOptions} />
                </div>
              ) : (
                <div className="w-full my-2">
                  <div className="w-full h-48 flex flex-col justify-between pt-2 pb-1">
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-[11px] text-slate-400 min-w-[12px] text-right">1</span>
                      <div className="flex-1 border-b border-slate-100"></div>
                    </div>
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-[11px] text-slate-400 min-w-[12px] text-right">0</span>
                      <div className="flex-1 border-b border-slate-300"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 text-[11px] text-slate-500 pt-2 text-center pl-6">
                    {labels.map((m) => (
                      <div key={m}>{m}</div>
                    ))}
                  </div>
                </div>
              )
            ) : (
              <div className="overflow-x-auto my-4">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-medium">
                      <th className="pb-2">Bulan</th>
                      <th className="pb-2 text-right">Kas Masuk</th>
                      <th className="pb-2 text-right">Kas Keluar</th>
                      <th className="pb-2 text-right">Bersih</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {labels.map((m, idx) => (
                      <tr key={m}>
                        <td className="py-2 text-slate-700">{m}</td>
                        <td className={`py-2 text-right font-medium ${isDark ? "text-[#4ade80]" : "text-blue-600"}`}>
                          {formatRp(revenueData[idx])}
                        </td>
                        <td className={`py-2 text-right ${isDark ? "text-[#f87171]" : "text-teal-600"}`}>
                          {formatRp(cashOutData[idx])}
                        </td>
                        <td className={`py-2 text-right font-semibold ${isDark ? "text-[#E5B85C]" : "text-purple-600"}`}>
                          {formatRp(netCashData[idx])}
                        </td>                      
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-6 mt-4 text-xs font-normal text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-[2px] inline-block"></span>
                <span>Total kas masuk</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-teal-500 rounded-[2px] inline-block"></span>
                <span>Total kas keluar</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-purple-600 rounded-[2px] inline-block"></span>
                <span>Perpindahan kas bersih</span>
              </div>
            </div>
          </section>
        );

      case "penjualan_terhutang":
        return (
          <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm h-full">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                {isEditMode && (
                  <div className="cursor-grab active:cursor-grabbing p-0.5 text-slate-400 hover:text-slate-600">
                    <DotsSixVertical className="w-5 h-5" />
                  </div>
                )}
                <h2 className="text-base font-semibold text-slate-800">Penjualan terhutang</h2>
              </div>
              <div className="flex items-center space-x-2">
                <PeriodDropdown />
                <button
                  onClick={() => openFilter("penjualan terhutang")}
                  className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  type="button"
                >
                  <Funnel className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {/* Belum dibayar */}
              <div className="border border-amber-300 rounded overflow-hidden">
                <div className="bg-amber-50 px-3 py-1.5 flex items-center justify-between border-b border-amber-100">
                  <span className="text-xs font-semibold text-slate-700">Belum dibayar</span>
                  <span className="bg-amber-500 text-white rounded-full text-[10px] font-bold w-4 h-4 flex items-center justify-center">
                    {stats?.active_leads || 0}
                  </span>
                </div>
                <div className="p-3 bg-white">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Total</span>
                  <div className="text-base font-bold text-slate-900">Rp0,00</div>
                  <a className="text-xs text-blue-600 hover:underline mt-2 inline-block" href="#">
                    Dapatkan info lebih lanjut
                  </a>
                </div>
              </div>
              {/* Telat dibayar */}
              <div className="border border-red-300 rounded overflow-hidden">
                <div className="bg-red-50 px-3 py-1.5 flex items-center justify-between border-b border-red-100">
                  <span className="text-xs font-semibold text-slate-700">Telat dibayar</span>
                  <span className="bg-red-600 text-white rounded-full text-[10px] font-bold w-4 h-4 flex items-center justify-center">
                    {stats?.lost_count || 0}
                  </span>
                </div>
                <div className="p-3 bg-white">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Total</span>
                  <div className="text-base font-bold text-slate-900">Rp0,00</div>
                  <a className="text-xs text-blue-600 hover:underline mt-2 inline-block" href="#">
                    Dapatkan info lebih lanjut
                  </a>
                </div>
              </div>
            </div>

            {/* Lunas Full Width Subcard */}
            <div className="border border-emerald-300 rounded overflow-hidden">
              <div className="bg-emerald-50 px-3 py-1.5 flex items-center justify-between border-b border-emerald-100">
                <span className="text-xs font-semibold text-slate-700">Lunas</span>
                <span className="bg-emerald-600 text-white rounded-full text-[10px] font-bold w-4 h-4 flex items-center justify-center">
                  {stats?.won_count || 0}
                </span>
              </div>
              <div className="p-3 bg-white">
                <span className="text-[11px] text-slate-400 block mb-0.5">Total</span>
                <div className="text-base font-bold text-slate-900">{formatRp(stats?.total_revenue)}</div>
                <a className="text-xs text-blue-600 hover:underline mt-2 inline-block" href="#">
                  Dapatkan info lebih lanjut
                </a>
              </div>
            </div>
          </section>
        );

      case "tagihan_belum_dibayar":
        return (
          <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm h-full">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                {isEditMode && (
                  <div className="cursor-grab active:cursor-grabbing p-0.5 text-slate-400 hover:text-slate-600">
                    <DotsSixVertical className="w-5 h-5" />
                  </div>
                )}
                <h2 className="text-base font-semibold text-slate-800">Tagihan belum dibayar</h2>
              </div>
              <div className="flex items-center space-x-2">
                <PeriodDropdown />
                <button
                  onClick={() => openFilter("tagihan belum dibayar")}
                  className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  type="button"
                >
                  <Funnel className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {/* Belum dibayar */}
              <div className="border border-amber-300 rounded overflow-hidden">
                <div className="bg-amber-50 px-3 py-1.5 flex items-center justify-between border-b border-amber-100">
                  <span className="text-xs font-semibold text-slate-700">Belum dibayar</span>
                  <span className="bg-amber-500 text-white rounded-full text-[10px] font-bold w-4 h-4 flex items-center justify-center">0</span>
                </div>
                <div className="p-3 bg-white">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Total</span>
                  <div className="text-base font-bold text-slate-900">Rp0,00</div>
                  <a className="text-xs text-blue-600 hover:underline mt-2 inline-block" href="#">
                    Dapatkan info lebih lanjut
                  </a>
                </div>
              </div>
              {/* Telat dibayar */}
              <div className="border border-red-300 rounded overflow-hidden">
                <div className="bg-red-50 px-3 py-1.5 flex items-center justify-between border-b border-red-100">
                  <span className="text-xs font-semibold text-slate-700">Telat dibayar</span>
                  <span className="bg-red-600 text-white rounded-full text-[10px] font-bold w-4 h-4 flex items-center justify-center">0</span>
                </div>
                <div className="p-3 bg-white">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Total</span>
                  <div className="text-base font-bold text-slate-900">Rp0,00</div>
                  <a className="text-xs text-blue-600 hover:underline mt-2 inline-block" href="#">
                    Dapatkan info lebih lanjut
                  </a>
                </div>
              </div>
            </div>

            {/* Lunas Full Width Subcard */}
            <div className="border border-emerald-300 rounded overflow-hidden">
              <div className="bg-emerald-50 px-3 py-1.5 flex items-center justify-between border-b border-emerald-100">
                <span className="text-xs font-semibold text-slate-700">Lunas</span>
                <span className="bg-emerald-600 text-white rounded-full text-[10px] font-bold w-4 h-4 flex items-center justify-center">0</span>
              </div>
              <div className="p-3 bg-white">
                <span className="text-[11px] text-slate-400 block mb-0.5">Total</span>
                <div className="text-base font-bold text-slate-900">Rp0,00</div>
                <a className="text-xs text-blue-600 hover:underline mt-2 inline-block" href="#">
                  Dapatkan info lebih lanjut
                </a>
              </div>
            </div>
          </section>
        );

      case "laba_rugi":
        return (
          <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm h-full">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                {isEditMode && (
                  <div className="cursor-grab active:cursor-grabbing p-0.5 text-slate-400 hover:text-slate-600">
                    <DotsSixVertical className="w-5 h-5" />
                  </div>
                )}
                <h2 className="text-base font-semibold text-slate-800">Laba rugi</h2>
              </div>
              <div className="flex items-center space-x-2">
                <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-slate-50 text-xs">
                  <button
                    onClick={() => setProfitLossMode("chart")}
                    className={`px-3 py-1 font-medium rounded cursor-pointer ${profitLossMode === "chart"
                        ? "bg-blue-50 text-blue-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                      }`}
                    type="button"
                  >
                    Tampilan grafik
                  </button>
                  <button
                    onClick={() => setProfitLossMode("table")}
                    className={`px-3 py-1 font-medium rounded cursor-pointer ${profitLossMode === "table"
                        ? "bg-blue-50 text-blue-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                      }`}
                    type="button"
                  >
                    Tampilan tabel
                  </button>
                </div>
                <button
                  onClick={() => openFilter("laba rugi")}
                  className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-slate-200 cursor-pointer"
                  type="button"
                >
                  <Funnel className="w-4 h-4" />
                </button>
              </div>
            </div>

            {profitLossMode === "chart" ? (
              hasProfitLossData ? (
                <div className="w-full h-64 relative pt-4 pb-2">
                  <Bar data={profitLossChartData} options={chartOptions} />
                </div>
              ) : (
                <div className="w-full my-2">
                  <div className="w-full h-48 flex flex-col justify-between pt-2 pb-1">
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-[11px] text-slate-400 min-w-[12px] text-right">1</span>
                      <div className="flex-1 border-b border-slate-100"></div>
                    </div>
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-[11px] text-slate-400 min-w-[12px] text-right">0</span>
                      <div className="flex-1 border-b border-slate-300"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 text-[11px] text-slate-500 pt-2 text-center pl-6">
                    {labels.map((m) => (
                      <div key={m}>{m}</div>
                    ))}
                  </div>
                </div>
              )
            ) : (
              <div className="overflow-x-auto my-4">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-medium">
                      <th className="pb-2">Bulan</th>
                      <th className="pb-2 text-right">Pendapatan</th>
                      <th className="pb-2 text-right">Beban</th>
                      <th className="pb-2 text-right">Laba Bersih</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {labels.map((m, idx) => (
                      <tr key={m}>
                        <td className="py-2 text-slate-700">{m}</td>
                        <td className="py-2 text-right font-medium text-blue-600">{formatRp(revenueData[idx])}</td>
                        <td className="py-2 text-right text-teal-600">{formatRp(cashOutData[idx])}</td>
                        <td className="py-2 text-right font-semibold text-purple-600">{formatRp(netCashData[idx])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-6 mt-4 text-xs font-normal text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-[2px] inline-block"></span>
                <span>Pendapatan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-teal-500 rounded-[2px] inline-block"></span>
                <span>Beban</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-purple-600 rounded-[2px] inline-block"></span>
                <span>Laba bersih</span>
              </div>
            </div>
          </section>
        );

      case "biaya_operasional":
        return (
          <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm min-h-[260px] flex flex-col justify-between h-full">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {isEditMode && (
                  <div className="cursor-grab active:cursor-grabbing p-0.5 text-slate-400 hover:text-slate-600">
                    <DotsSixVertical className="w-5 h-5" />
                  </div>
                )}
                <h2 className="text-base font-semibold text-slate-800">Biaya operasional</h2>
              </div>
              <div>
                <PeriodDropdown />
              </div>
            </div>

            <EmptyDataState />
            <div></div>
          </section>
        );

      case "daftar_akun_terpantau":
        return (
          <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm h-full">
            <div className="flex items-center gap-2 mb-4">
              {isEditMode && (
                <div className="cursor-grab active:cursor-grabbing p-0.5 text-slate-400 hover:text-slate-600">
                  <DotsSixVertical className="w-5 h-5" />
                </div>
              )}
              <h2 className="text-base font-semibold text-slate-800">Daftar akun terpantau</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-200">
                    <th className="pb-2.5 font-medium">Akun</th>
                    <th className="pb-2.5 font-medium text-right">Bulan ini</th>
                    <th className="pb-2.5 font-medium text-right">Tahun ini</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2.5 text-blue-600 hover:underline cursor-pointer">(1-10001) Kas</td>
                    <td className="py-2.5 text-right font-normal">Rp0,00</td>
                    <td className="py-2.5 text-right font-normal">Rp0,00</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-blue-600 hover:underline cursor-pointer">(1-10002) Rekening Bank</td>
                    <td className="py-2.5 text-right font-normal">Rp0,00</td>
                    <td className="py-2.5 text-right font-normal">Rp0,00</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-blue-600 hover:underline cursor-pointer">(1-10100) Piutang Usaha</td>
                    <td className="py-2.5 text-right font-normal">Rp0,00</td>
                    <td className="py-2.5 text-right font-normal">Rp0,00</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-blue-600 hover:underline cursor-pointer">(1-10101) Piutang Belum Ditagih</td>
                    <td className="py-2.5 text-right font-normal">Rp0,00</td>
                    <td className="py-2.5 text-right font-normal">Rp0,00</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-blue-600 hover:underline cursor-pointer">(1-10200) Persediaan Barang</td>
                    <td className="py-2.5 text-right font-normal">Rp0,00</td>
                    <td className="py-2.5 text-right font-normal">Rp0,00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        );

      case "produk_terlaris":
        return (
          <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm min-h-[260px] flex flex-col justify-between h-full">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {isEditMode && (
                  <div className="cursor-grab active:cursor-grabbing p-0.5 text-slate-400 hover:text-slate-600">
                    <DotsSixVertical className="w-5 h-5" />
                  </div>
                )}
                <h2 className="text-base font-semibold text-slate-800">Produk terlaris</h2>
              </div>
              <PeriodDropdown />
            </div>

            {stats?.leaderboard && stats.leaderboard.length > 0 ? (
              <div className="overflow-x-auto my-3">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="pb-2 font-medium">Agent / Sales</th>
                      <th className="pb-2 font-medium text-center">Deals</th>
                      <th className="pb-2 font-medium text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stats.leaderboard.map((a, i) => (
                      <tr key={i}>
                        <td className="py-2 font-medium text-slate-800">{a.name}</td>
                        <td className="py-2 text-center text-slate-600">{a.deals}</td>
                        <td className="py-2 text-right font-semibold text-blue-600">{formatRp(a.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyDataState />
            )}
            <div></div>
          </section>
        );

      case "piutang_usaha":
        return (
          <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm min-h-[280px] flex flex-col justify-between h-full">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {isEditMode && (
                  <div className="cursor-grab active:cursor-grabbing p-0.5 text-slate-400 hover:text-slate-600">
                    <DotsSixVertical className="w-5 h-5" />
                  </div>
                )}
                <h2 className="text-base font-semibold text-slate-800">Piutang Usaha</h2>
              </div>
              <PeriodDropdown />
            </div>
            <EmptyDataState />
            <div></div>
          </section>
        );

      case "mekari_pay":
        return (
          <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col items-center justify-center text-center min-h-[280px] h-full">
            <div className="flex items-center gap-2 w-full text-left mb-2">
              {isEditMode && (
                <div className="cursor-grab active:cursor-grabbing p-0.5 text-slate-400 hover:text-slate-600">
                  <DotsSixVertical className="w-5 h-5" />
                </div>
              )}
              <h2 className="text-base font-semibold text-slate-800">QRIS Pay</h2>
            </div>
            <div className="my-auto flex flex-col items-center">
              <img
                src={mekariPayImg}
                alt="Mekari Pay Illustration"
                className="h-20 w-auto object-contain mx-auto mb-3"
              />
              <p className="text-xs font-semibold text-slate-800 mb-4">Terima pembayaran lebih cepat dengan QRIS</p>
              <button
                className="px-3.5 py-1.5 border border-blue-500 text-blue-600 hover:bg-blue-50 text-xs font-medium rounded transition-colors cursor-pointer"
                type="button"
              >
                Dapatkan info lebih lanjut
              </button>
            </div>
          </section>
        );

      case "kas":
        return (
          <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm min-h-[280px] flex flex-col justify-between h-full">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {isEditMode && (
                  <div className="cursor-grab active:cursor-grabbing p-0.5 text-slate-400 hover:text-slate-600">
                    <DotsSixVertical className="w-5 h-5" />
                  </div>
                )}
                <h2 className="text-base font-semibold text-slate-800">Kas</h2>
              </div>
              <PeriodDropdown />
            </div>
            <EmptyDataState />
            <div></div>
          </section>
        );

      default:
        return null;
    }
  };

  const isFullWidthWidget = (id) => {
    return id === "arus_kas" || id === "laba_rugi" || id === "biaya_operasional";
  };

  return (
      <div
          className={`${isDark ? "dash-dark" : ""} bg-[#f8fafc] text-slate-800 antialiased min-h-screen -m-4 md:-m-6 pb-20`}
          style={isDark ? { backgroundColor: "#121212", color: "#e2e8f0" } : undefined}
        >
          {/* BEGIN: MainHeader */}
      <header className="bg-white border-b border-slate-200 px-6 pt-5 pb-0">
        <div className="max-w-[1760px] mx-auto">
          {/* Title & Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Dashboard</h1>
            </div>
            {/* Metadata & Actions */}
            <div className="flex flex-wrap items-center space-x-3 text-xs md:text-sm text-slate-600">
              {isEditMode ? (
                <button
                  onClick={() => alert("Fitur Tambah Widget Akun")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md font-medium text-xs hover:bg-blue-50 transition-colors cursor-pointer"
                  type="button"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah widget akun</span>
                </button>
              ) : (
                <>
                  <span>Terakhir diperbarui: {lastUpdated}</span>
                  <button
                    onClick={() => fetchStats(true)}
                    disabled={refreshing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md font-medium text-xs hover:bg-blue-50 transition-colors disabled:opacity-50 cursor-pointer"
                    type="button"
                  >
                    <ArrowClockwise className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                    <span>Perbarui</span>
                  </button>
                  <button
                    onClick={handleToggleEditMode}
                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${isEditMode
                        ? "bg-blue-600 text-white"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                      }`}
                    title="Ubah urutan widget"
                    type="button"
                  >
                    <PencilSimple className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav aria-label="Tabs" className="flex space-x-6 border-b border-transparent -mb-[1px]">
            <button
              onClick={() => setActiveTab("performa")}
              className={`border-b-2 pb-2.5 text-sm font-semibold flex items-center cursor-pointer ${activeTab === "performa"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
            >
              Performa bisnis
            </button>
            <button
              onClick={() => setActiveTab("insight")}
              className={`border-b-2 pb-2.5 text-sm font-medium flex items-center gap-1.5 cursor-pointer ${activeTab === "insight"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
            >
              <span>Insight Business</span>
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none uppercase tracking-wide">
                new
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* BEGIN: MainContentContainer */}
      <main className="max-w-[1760px] mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {widgetsOrder.map((widgetId) => {
            const isFullWidth = isFullWidthWidget(widgetId);
            const isActive = isEditMode && activeWidgetId === widgetId;

            return (
              <div
                key={widgetId}
                draggable={isEditMode}
                onDragStart={(e) => isEditMode && handleDragStart(e, widgetId)}
                onDragOver={(e) => isEditMode && handleDragOver(e)}
                onDrop={(e) => isEditMode && handleDrop(e, widgetId)}
                onClick={() => isEditMode && setActiveWidgetId(widgetId)}
                className={`relative transition-all duration-200 ${isFullWidth ? "col-span-1 lg:col-span-2" : "col-span-1"
                  } ${isEditMode
                    ? `rounded-lg ${isActive
                      ? "ring-2 ring-blue-600 border-2 border-blue-600 shadow-md"
                      : "border border-dashed border-slate-300 hover:border-blue-400"
                    }`
                    : ""
                  }`}
              >
                {/* D-Pad Overlay for Active Widget in Edit Mode */}
                {isActive && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex flex-col items-center justify-center z-20 rounded-lg">
                    <span className="text-xs font-semibold text-slate-800 mb-2">Pindahkan widget</span>
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveWidget(widgetId, "up");
                        }}
                        className="p-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded shadow-xs cursor-pointer"
                        title="Pindah ke atas"
                        type="button"
                      >
                        <CaretUp className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveWidget(widgetId, "left");
                          }}
                          className="p-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded shadow-xs cursor-pointer"
                          title="Pindah ke kiri"
                          type="button"
                        >
                          <CaretLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveWidget(widgetId, "right");
                          }}
                          className="p-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded shadow-xs cursor-pointer"
                          title="Pindah ke kanan"
                          type="button"
                        >
                          <CaretRight className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveWidget(widgetId, "down");
                        }}
                        className="p-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded shadow-xs cursor-pointer"
                        title="Pindah ke bawah"
                        type="button"
                      >
                        <CaretDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {renderWidgetComponent(widgetId)}
              </div>
            );
          })}
        </div>
      </main>

      {/* BEGIN: Bottom Action Bar in Edit Mode */}
      {isEditMode && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 py-3 px-8 flex items-center justify-between z-40 shadow-lg animate-fade-in">
          <div></div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800 font-medium rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              type="button"
            >
              Batalkan
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 text-xs bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
              type="button"
            >
              Simpan perubahan
            </button>
          </div>
        </div>
      )}

      <LoadingPopup open={exporting} message="Generating Excel report..." />

      {/* BEGIN: Right Filter Drawer */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Dark backdrop overlay */}
          <div
            onClick={closeFilter}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-fade-in cursor-pointer"
          />

          {/* Drawer panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out animate-slide-in-right">
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-800">
                  Filter widget {filterWidgetTitle}
                </h2>
                <button
                  onClick={closeFilter}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {/* Periode Field */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Periode
                  </label>
                  <div className="w-full">
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-md py-2 px-3 text-slate-700 font-normal focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer"
                    >
                      <option value="hari_ini">Hari ini (09 Sep 2026)</option>
                      <option value="pekan_ini">Pekan ini (08 Sep 2026 - 14 Sep 2026)</option>
                      <option value="bulan_ini">Bulan ini (Sep 2026)</option>
                      <option value="kuartal_ini">Kuartal ini (Jul 2026 - Sep 2026)</option>
                      <option value="tahun_ini">Tahun ini (2026)</option>
                    </select>
                  </div>
                </div>

                {/* Tag Field */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Tag
                    </label>
                    <span className="text-slate-400 hover:text-slate-600 cursor-pointer" title="Informasi tag">
                      <Info className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <input
                    type="text"
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    placeholder="Pilih tag"
                    className="w-full text-xs border border-slate-300 rounded-md py-2 px-3 text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 transition-colors"
                  />
                  {/* Radio Options */}
                  <div className="flex items-center gap-6 pt-1 text-xs text-slate-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tagMatchMode"
                        value="mencakup_semua"
                        checked={tagMatchMode === "mencakup_semua"}
                        onChange={() => setTagMatchMode("mencakup_semua")}
                        className="text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                      />
                      <span>Mencakup semua</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tagMatchMode"
                        value="salah_satu"
                        checked={tagMatchMode === "salah_satu"}
                        onChange={() => setTagMatchMode("salah_satu")}
                        className="text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                      />
                      <span>Salah satu</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-white">
                <button
                  onClick={handleResetFilter}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-pointer"
                  type="button"
                >
                  <ArrowCounterClockwise className="w-4 h-4" />
                  <span>Reset filter</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={closeFilter}
                    className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800 font-medium rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                    type="button"
                  >
                    Batalkan
                  </button>
                  <button
                    onClick={closeFilter}
                    className="px-4 py-2 text-xs bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
                    type="button"
                  >
                    Terapkan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInFromRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInFromRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.25s ease-out forwards;
        }
        .dash-dark select, .dash-dark input { color-scheme: dark; }
        /* Permukaan */
        .dash-dark .bg-white { background-color: #1e1e1e; }
        .dash-dark [class*="bg-white/70"] { background-color: rgba(30,30,30,0.75); }
        .dash-dark .bg-slate-50 { background-color: #262626; }
        .dash-dark .bg-blue-50 { background-color: rgba(229,184,92,0.15); }
        .dash-dark .bg-amber-50 { background-color: rgba(245,158,11,0.15); }
        .dash-dark .bg-red-50 { background-color: rgba(239,68,68,0.15); }
        .dash-dark .bg-emerald-50 { background-color: rgba(16,185,129,0.15); }
        /* Border & divider */
        .dash-dark .border-slate-100,
        .dash-dark .border-slate-200,
        .dash-dark .border-slate-300 { border-color: #634f27; }
        .dash-dark .divide-slate-100 > :not([hidden]) ~ :not([hidden]) { border-color: #3a3326; }

        /* Teks */
        .dash-dark .text-slate-900,
        .dash-dark .text-slate-800,
        .dash-dark .text-slate-700 { color: #f1f5f9; }
        .dash-dark .text-slate-600,
        .dash-dark .text-slate-500 { color: #cbd5e1; }
        .dash-dark .text-slate-400 { color: #94a3b8; }

        /* Aksen biru UI -> emas (angka tabel tetap biru agar cocok dengan chart) */
        .dash-dark .text-blue-700,
        .dash-dark a.text-blue-600,
        .dash-dark button.text-blue-600,
        .dash-dark td.text-blue-600.cursor-pointer { color: #E5B85C; }
        .dash-dark button.border-blue-600,
        .dash-dark button.border-blue-500,
        .dash-dark .border-blue-600 { border-color: #E5B85C; }
        .dash-dark button.bg-blue-600 { background-color: #E5B85C; color: #121212; }
        .dash-dark button.bg-blue-600:hover { background-color: #f0c978; }
        .dash-dark .ring-blue-600 { --tw-ring-color: #E5B85C; }
        .dash-dark nav button.border-blue-600 { color: #E5B85C; }

        .dash-dark .empty-icon-stroke { stroke: #E5B85C; }
        .dash-dark .empty-icon-fill { fill: rgba(30, 26, 18, 0.18); }

        /* Hover */
        .dash-dark [class*="hover:bg-slate-100"]:hover,
        .dash-dark [class*="hover:bg-slate-50"]:hover,
        .dash-dark [class*="hover:bg-blue-50"]:hover { background-color: #2d2d2d; }
        .dash-dark [class*="hover:text-slate-800"]:hover,
        .dash-dark [class*="hover:text-slate-900"]:hover { color: #ffffff; }
      `}</style>
    </div>
  );
}
