import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function SimpanAsetPage() {
  const navigate = useNavigate();
  const datePickerRef = useRef(null);

  const [nonDepresiasi, setNonDepresiasi] = useState(true);
  const [namaAset, setNamaAset] = useState("");
  const [nomorAset, setNomorAset] = useState("10001");
  const [akunAsetTetap, setAkunAsetTetap] = useState("(1-10700) Aset Tetap - Tanah");
  const [deskripsi, setDeskripsi] = useState("");

  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 8, 11));
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date(2026, 8, 11));
  const [calendarViewMode, setCalendarViewMode] = useState("days");
  const [yearRangeStart, setYearRangeStart] = useState(() => Math.floor(2026 / 12) * 12);
  const [showCalendar, setShowCalendar] = useState(false);
  const [tanggalAkuisisi, setTanggalAkuisisi] = useState("11/09/2026");

  const [biayaAkuisisi, setBiayaAkuisisi] = useState("Rp. 0,00");
  const [akunDikreditkan, setAkunDikreditkan] = useState("(1-10001) Kas");
  const [tags, setTags] = useState("");

  const [metode, setMetode] = useState("Straight line");
  const [masaManfaat, setMasaManfaat] = useState("4");
  const [nilaiTahun, setNilaiTahun] = useState("25.0");
  const [akunPenyusutan, setAkunPenyusutan] = useState("(6-60001) Iklan & Promosi");
  const [akumulasiAkunPenyusutan, setAkumulasiAkunPenyusutan] = useState("(1-10751) Akumulasi Penyusutan - Bangunan");
  const [akumulasiPenyusutan, setAkumulasiPenyusutan] = useState("Rp. 0,00");
  const [padaTanggal, setPadaTanggal] = useState("11/09/2026");

  const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const formatDateDDMMYYYY = (date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  useEffect(() => {
    setTanggalAkuisisi(formatDateDDMMYYYY(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCalendarDays = (year, month) => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: month - 1,
        year: month === 0 ? year - 1 : year,
        isCurrentMonth: false,
      });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month,
        year,
        isCurrentMonth: true,
      });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        month: month + 1,
        year: month === 11 ? year + 1 : year,
        isCurrentMonth: false,
      });
    }
    return days;
  };

  const inputStyle = {
    width: "100%",
    border: "1px solid #cbd5e1",
    borderRadius: "4px",
    fontSize: "13px",
    padding: "6px 12px",
    color: "#334155",
    backgroundColor: "#ffffff",
    outline: "none",
    boxSizing: "border-box",
  };

  const inputDisabledStyle = {
    ...inputStyle,
    backgroundColor: "#f8fafc",
    color: "#94a3b8",
    borderColor: "#e2e8f0",
    cursor: "not-allowed",
  };

  const labelStyle = {
    width: "140px",
    fontSize: "13px",
    color: "#1e293b",
    fontWeight: "400",
    flexShrink: 0,
  };

  const labelDisabledStyle = {
    ...labelStyle,
    color: "#94a3b8",
  };

  const TooltipIcon = ({ disabled = false }) => (
    <div style={{ width: "24px", marginLeft: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <button
        type="button"
        style={{ background: "none", border: "none", cursor: disabled ? "default" : "pointer", padding: 0, display: "flex" }}
        title="Bantuan"
      >
        <svg style={{ width: "16px", height: "16px", fill: disabled ? "#7dd3fc" : "#0284c7" }} viewBox="0 0 20 20">
          <path fillRule="evenodd" clipRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
      </button>
    </div>
  );

  return (
    <div
      style={{
        margin: "-24px",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        color: "#334155",
      }}
    >
      {/* ── BEGIN: PageHeader ── */}
      <header
        style={{
          borderBottom: "1px solid #e2e8f0",
          padding: "16px 32px",
          backgroundColor: "#ffffff",
        }}
      >
        <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "2px" }}>Aset Tetap</div>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#143f77", letterSpacing: "-0.01em", margin: 0 }}>
          Penyimpanan Aset Baru
        </h1>
      </header>
      {/* ── END: PageHeader ── */}

      {/* ── BEGIN: MainContent ── */}
      <main style={{ padding: "24px 32px", maxWidth: "1720px", margin: "0 auto" }}>
        <form onSubmit={(e) => e.preventDefault()}>
          {/* ── BEGIN: SectionDetailAset ── */}
          <section style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "600", color: "#1e293b", marginBottom: "20px" }}>Detail Aset</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "16px 64px" }}>
              {/* Left Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Nama Aset */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="nama_aset" style={labelStyle}>*Nama Aset</label>
                  <div style={{ flex: 1 }}>
                    <input id="nama_aset" type="text" style={inputStyle} value={namaAset} onChange={(e) => setNamaAset(e.target.value)} />
                  </div>
                  <div style={{ width: "24px", marginLeft: "8px" }} />
                </div>

                {/* Nomor Aset */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="nomor_aset" style={labelStyle}>*Nomor Aset</label>
                  <div style={{ flex: 1 }}>
                    <input id="nomor_aset" type="text" style={inputStyle} value={nomorAset} onChange={(e) => setNomorAset(e.target.value)} />
                  </div>
                  <TooltipIcon />
                </div>

                {/* Akun Aset Tetap */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="akun_aset_tetap" style={labelStyle}>*Akun Aset Tetap</label>
                  <div style={{ flex: 1 }}>
                    <select id="akun_aset_tetap" style={inputStyle} value={akunAsetTetap} onChange={(e) => setAkunAsetTetap(e.target.value)}>
                      <option>(1-10700) Aset Tetap - Tanah</option>
                      <option>(1-10701) Gedung &amp; Bangunan</option>
                      <option>(1-10702) Kendaraan</option>
                    </select>
                  </div>
                  <TooltipIcon />
                </div>

                {/* Deskripsi */}
                <div style={{ display: "flex", alignItems: "flex-start", paddingTop: "4px" }}>
                  <label htmlFor="deskripsi" style={{ ...labelStyle, paddingTop: "4px" }}>Deskripsi</label>
                  <div style={{ flex: 1 }}>
                    <textarea id="deskripsi" rows={3} style={{ ...inputStyle, height: "96px", resize: "vertical" }} value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} />
                  </div>
                  <div style={{ width: "24px", marginLeft: "8px" }} />
                </div>
              </div>

              {/* Right Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Tanggal Akuisisi */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="tanggal_akuisisi" style={labelStyle}>Tanggal Akuisisi</label>
                  <div style={{ flex: 1, position: "relative" }} ref={datePickerRef}>
                    <div
                      style={{ display: "flex", cursor: "pointer" }}
                      onClick={() => setShowCalendar((prev) => !prev)}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", padding: "0 12px", backgroundColor: "#e9ecef", border: "1px solid #d5dcde", borderRight: "none", borderRadius: "4px 0 0 4px", color: "#475569", cursor: "pointer" }}>
                        <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <input
                        id="tanggal_akuisisi"
                        type="text"
                        readOnly
                        value={tanggalAkuisisi}
                        style={{ ...inputStyle, borderRadius: "0 4px 4px 0", cursor: "pointer" }}
                      />
                    </div>

                    {/* Calendar Popover */}
                    {showCalendar && (
                      <div
                        style={{
                          position: "absolute",
                          top: "42px",
                          left: 0,
                          zIndex: 50,
                          backgroundColor: "#ffffff",
                          border: "1px solid #d5dcde",
                          borderRadius: "8px",
                          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)",
                          padding: "16px",
                          width: "280px",
                          userSelect: "none",
                        }}
                      >
                        {/* Month & Year Navigator Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                          <button
                            type="button"
                            style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "4px 8px", borderRadius: "4px" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (calendarViewMode === "days") {
                                setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() - 1, 1));
                              } else if (calendarViewMode === "months") {
                                setCalendarViewDate(new Date(calendarViewDate.getFullYear() - 1, calendarViewDate.getMonth(), 1));
                              } else if (calendarViewMode === "years") {
                                setYearRangeStart((prev) => prev - 12);
                              }
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                          >
                            «
                          </button>

                          <button
                            type="button"
                            style={{ background: "none", border: "none", fontSize: "14px", fontWeight: "700", color: "#0284c7", cursor: "pointer", padding: "4px 8px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "5px" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (calendarViewMode === "days") {
                                setCalendarViewMode("months");
                              } else if (calendarViewMode === "months") {
                                setYearRangeStart(Math.floor(calendarViewDate.getFullYear() / 12) * 12);
                                setCalendarViewMode("years");
                              } else {
                                setCalendarViewMode("days");
                              }
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0f2fe")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                            title="Klik untuk memilih bulan / tahun"
                          >
                            <span>
                              {calendarViewMode === "days" && `${MONTH_NAMES[calendarViewDate.getMonth()]} ${calendarViewDate.getFullYear()}`}
                              {calendarViewMode === "months" && `${calendarViewDate.getFullYear()}`}
                              {calendarViewMode === "years" && `${yearRangeStart} - ${yearRangeStart + 11}`}
                            </span>
                            <span style={{ fontSize: "10px" }}>▼</span>
                          </button>

                          <button
                            type="button"
                            style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "4px 8px", borderRadius: "4px" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (calendarViewMode === "days") {
                                setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 1));
                              } else if (calendarViewMode === "months") {
                                setCalendarViewDate(new Date(calendarViewDate.getFullYear() + 1, calendarViewDate.getMonth(), 1));
                              } else if (calendarViewMode === "years") {
                                setYearRangeStart((prev) => prev + 12);
                              }
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                          >
                            »
                          </button>
                        </div>

                        {/* View 1: Days */}
                        {calendarViewMode === "days" && (
                          <>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center", marginBottom: "8px" }}>
                              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((dayName) => (
                                <div key={dayName} style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>{dayName}</div>
                              ))}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center" }}>
                              {getCalendarDays(calendarViewDate.getFullYear(), calendarViewDate.getMonth()).map((item, idx) => {
                                const isSelected =
                                  selectedDate.getDate() === item.day &&
                                  selectedDate.getMonth() === item.month &&
                                  selectedDate.getFullYear() === item.year;
                                return (
                                  <div
                                    key={idx}
                                    style={{ height: "32px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: isSelected ? "700" : "400", color: isSelected ? "#ffffff" : item.isCurrentMonth ? "#1e293b" : "#cbd5e1", backgroundColor: isSelected ? "#0284c7" : "transparent", borderRadius: "6px", cursor: "pointer", transition: "all 0.15s ease" }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newDate = new Date(item.year, item.month, item.day);
                                      setSelectedDate(newDate);
                                      setCalendarViewDate(newDate);
                                      setShowCalendar(false);
                                    }}
                                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "#f1f5f9"; }}
                                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "transparent"; }}
                                  >
                                    {item.day}
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        )}

                        {/* View 2: Months */}
                        {calendarViewMode === "months" && (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "4px 0" }}>
                            {MONTH_NAMES.map((monthName, idx) => {
                              const isSelected = calendarViewDate.getMonth() === idx;
                              return (
                                <div
                                  key={monthName}
                                  style={{ height: "40px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: isSelected ? "700" : "500", color: isSelected ? "#ffffff" : "#1e293b", backgroundColor: isSelected ? "#0284c7" : "#f8fafc", border: isSelected ? "1px solid #0284c7" : "1px solid #e2e8f0", borderRadius: "6px", cursor: "pointer", transition: "all 0.15s ease" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCalendarViewDate(new Date(calendarViewDate.getFullYear(), idx, 1));
                                    setCalendarViewMode("days");
                                  }}
                                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "#e0f2fe"; }}
                                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "#f8fafc"; }}
                                >
                                  {monthName.substring(0, 3)}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* View 3: Years */}
                        {calendarViewMode === "years" && (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", padding: "4px 0" }}>
                            {Array.from({ length: 12 }).map((_, idx) => {
                              const yearVal = yearRangeStart + idx;
                              const isSelected = calendarViewDate.getFullYear() === yearVal;
                              return (
                                <div
                                  key={yearVal}
                                  style={{ height: "40px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: isSelected ? "700" : "500", color: isSelected ? "#ffffff" : "#1e293b", backgroundColor: isSelected ? "#0284c7" : "#f8fafc", border: isSelected ? "1px solid #0284c7" : "1px solid #e2e8f0", borderRadius: "6px", cursor: "pointer", transition: "all 0.15s ease" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCalendarViewDate(new Date(yearVal, calendarViewDate.getMonth(), 1));
                                    setCalendarViewMode("months");
                                  }}
                                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "#e0f2fe"; }}
                                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "#f8fafc"; }}
                                >
                                  {yearVal}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Today Button */}
                        <div style={{ marginTop: "12px", paddingTop: "8px", borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
                          <button
                            type="button"
                            style={{ background: "none", border: "none", fontSize: "13px", fontWeight: "700", color: "#1e293b", cursor: "pointer", padding: "4px 8px" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              const today = new Date();
                              setSelectedDate(today);
                              setCalendarViewDate(today);
                              setCalendarViewMode("days");
                              setShowCalendar(false);
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#0284c7")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#1e293b")}
                          >
                            Today
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <TooltipIcon />
                </div>

                {/* Biaya Akuisisi */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="biaya_akuisisi" style={labelStyle}>Biaya Akuisisi</label>
                  <div style={{ flex: 1 }}>
                    <input id="biaya_akuisisi" type="text" style={inputStyle} value={biayaAkuisisi} onChange={(e) => setBiayaAkuisisi(e.target.value)} />
                  </div>
                  <TooltipIcon />
                </div>

                {/* Akun Dikreditkan */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="akun_dikreditkan" style={labelStyle}>Akun Dikreditkan</label>
                  <div style={{ flex: 1 }}>
                    <select id="akun_dikreditkan" style={inputStyle} value={akunDikreditkan} onChange={(e) => setAkunDikreditkan(e.target.value)}>
                      <option>(1-10001) Kas</option>
                      <option>(1-10002) Bank</option>
                    </select>
                  </div>
                  <TooltipIcon />
                </div>

                {/* Tags */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="tags" style={labelStyle}>Tags</label>
                  <div style={{ flex: 1 }}>
                    <input id="tags" type="text" style={inputStyle} value={tags} onChange={(e) => setTags(e.target.value)} />
                  </div>
                  <div style={{ width: "24px", marginLeft: "8px" }} />
                </div>
              </div>
            </div>
          </section>
          {/* ── END: SectionDetailAset ── */}

          {/* ── BEGIN: SectionPenyusutan ── */}
          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "600", color: "#1e293b", marginBottom: "16px" }}>Penyusutan</h2>

            {/* Checkbox Row */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
              <span style={labelStyle}>Aset non-depresiasi</span>
              <div
                role="checkbox"
                aria-checked={nonDepresiasi}
                tabIndex={0}
                onClick={() => setNonDepresiasi(!nonDepresiasi)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    setNonDepresiasi(!nonDepresiasi);
                  }
                }}
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "3px",
                  backgroundColor: nonDepresiasi ? "#2563eb" : "#ffffff",
                  border: nonDepresiasi ? "none" : "1px solid #cbd5e1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  userSelect: "none",
                  outline: "none",
                }}
              >
                {nonDepresiasi && (
                  <svg
                    style={{ width: "12px", height: "12px" }}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </div>

            {/* Two Column Grid for Depreciation Inputs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "16px 64px" }}>
              {/* Left Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Metode */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="metode" style={nonDepresiasi ? labelDisabledStyle : labelStyle}>Metode</label>
                  <div style={{ flex: 1 }}>
                    <select id="metode" disabled={nonDepresiasi} style={nonDepresiasi ? inputDisabledStyle : inputStyle} value={metode} onChange={(e) => setMetode(e.target.value)}>
                      <option>Straight line</option>
                      <option>Reducing balance</option>
                    </select>
                  </div>
                  <TooltipIcon disabled={nonDepresiasi} />
                </div>

                {/* Masa Manfaat */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="masa_manfaat" style={nonDepresiasi ? labelDisabledStyle : labelStyle}>Masa Manfaat</label>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "140px" }}>
                      <input id="masa_manfaat" type="text" disabled={nonDepresiasi} style={nonDepresiasi ? inputDisabledStyle : inputStyle} value={masaManfaat} onChange={(e) => setMasaManfaat(e.target.value)} />
                    </div>
                    <span style={{ fontSize: "13px", color: nonDepresiasi ? "#94a3b8" : "#64748b" }}>Tahun</span>
                  </div>
                  <TooltipIcon disabled={nonDepresiasi} />
                </div>

                {/* Nilai/Tahun */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="nilai_tahun" style={nonDepresiasi ? labelDisabledStyle : labelStyle}>Nilai/Tahun</label>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "140px" }}>
                      <input id="nilai_tahun" type="text" disabled={nonDepresiasi} style={nonDepresiasi ? inputDisabledStyle : inputStyle} value={nilaiTahun} onChange={(e) => setNilaiTahun(e.target.value)} />
                    </div>
                    <span style={{ fontSize: "13px", color: nonDepresiasi ? "#94a3b8" : "#64748b" }}>Persen</span>
                  </div>
                  <TooltipIcon disabled={nonDepresiasi} />
                </div>
              </div>

              {/* Right Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Akun Penyusutan */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="akun_penyusutan" style={{ ...(nonDepresiasi ? labelDisabledStyle : labelStyle), width: "170px" }}>Akun Penyusutan</label>
                  <div style={{ flex: 1 }}>
                    <select id="akun_penyusutan" disabled={nonDepresiasi} style={nonDepresiasi ? inputDisabledStyle : inputStyle} value={akunPenyusutan} onChange={(e) => setAkunPenyusutan(e.target.value)}>
                      <option>(6-60001) Iklan &amp; Promosi</option>
                      <option>(6-60002) Beban Penyusutan</option>
                    </select>
                  </div>
                  <TooltipIcon disabled={nonDepresiasi} />
                </div>

                {/* Akumulasi Akun Penyusutan */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="akumulasi_akun_penyusutan" style={{ ...(nonDepresiasi ? labelDisabledStyle : labelStyle), width: "170px" }}>Akumulasi Akun Penyusutan</label>
                  <div style={{ flex: 1 }}>
                    <select id="akumulasi_akun_penyusutan" disabled={nonDepresiasi} style={nonDepresiasi ? inputDisabledStyle : inputStyle} value={akumulasiAkunPenyusutan} onChange={(e) => setAkumulasiAkunPenyusutan(e.target.value)}>
                      <option>(1-10751) Akumulasi Penyusutan - Bangunan</option>
                    </select>
                  </div>
                  <TooltipIcon disabled={nonDepresiasi} />
                </div>

                {/* Akumulasi Penyusutan */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="akumulasi_penyusutan" style={{ ...(nonDepresiasi ? labelDisabledStyle : labelStyle), width: "170px" }}>Akumulasi Penyusutan</label>
                  <div style={{ flex: 1 }}>
                    <input id="akumulasi_penyusutan" type="text" disabled={nonDepresiasi} style={nonDepresiasi ? inputDisabledStyle : inputStyle} value={akumulasiPenyusutan} onChange={(e) => setAkumulasiPenyusutan(e.target.value)} />
                  </div>
                  <TooltipIcon disabled={nonDepresiasi} />
                </div>

                {/* Pada Tanggal */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="pada_tanggal" style={{ ...(nonDepresiasi ? labelDisabledStyle : labelStyle), width: "170px" }}>Pada Tanggal</label>
                  <div style={{ flex: 1, display: "flex" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", padding: "0 12px", backgroundColor: nonDepresiasi ? "#f8fafc" : "#f1f5f9", border: "1px solid #cbd5e1", borderRight: "none", borderRadius: "4px 0 0 4px", color: "#94a3b8" }}>
                      <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <input id="pada_tanggal" type="text" disabled={nonDepresiasi} style={{ ...(nonDepresiasi ? inputDisabledStyle : inputStyle), borderRadius: "0 4px 4px 0" }} value={padaTanggal} onChange={(e) => setPadaTanggal(e.target.value)} />
                  </div>
                  <TooltipIcon disabled={nonDepresiasi} />
                </div>
              </div>
            </div>
          </section>
          {/* ── END: SectionPenyusutan ── */}

          {/* ── BEGIN: ActionButtons ── */}
          <div style={{ marginTop: "32px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button
              type="button"
              onClick={() => navigate("/aset")}
              style={{
                backgroundColor: "#d9534f",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "400",
                padding: "6px 24px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "background-color 150ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c9302c")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#d9534f")}
            >
              Batal
            </button>
            <button
              type="submit"
              onClick={() => navigate("/aset")}
              style={{
                backgroundColor: "#5cb85c",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "400",
                padding: "6px 24px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "background-color 150ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#449d44")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#5cb85c")}
            >
              Buat Aset
            </button>
          </div>
          {/* ── END: ActionButtons ── */}
        </form>
      </main>
      {/* ── END: MainContent ── */}
    </div>
  );
}
