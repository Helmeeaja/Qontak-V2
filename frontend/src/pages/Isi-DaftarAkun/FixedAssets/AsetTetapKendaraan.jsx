import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text, Button, Input, HStack } from "@chakra-ui/react";
import { CaretDown } from "@phosphor-icons/react";
import dompetBiru from "../../../assets/dompetbiru.png";

const AKUN = {
  kode: "1-10703",
  nama: "Aset Tetap - Kendaraan",
  kategori: "Aset Tetap",
};

const outlineBtn = {
  bg: "white",
  color: "#2563eb",
  border: "1px solid #d2d9e2",
  borderRadius: "6px",
  fontSize: "13px",
  fontWeight: "500",
  h: "34px",
  px: 4,
  boxShadow: "sm",
  _hover: { bg: "#f8fafc" },
};

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function formatDateDDMMYYYY(date) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d)) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const days = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: daysInPrevMonth - i, month: month - 1, year: month === 0 ? year - 1 : year, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, month, year, isCurrentMonth: true });
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, month: month + 1, year: month === 11 ? year + 1 : year, isCurrentMonth: false });
  }
  return days;
}

// --- KOMPONEN KALENDER KUSTOM ---
function DatePicker({ value, onChange, placeholder, minDate }) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => (value ? new Date(value) : new Date()));
  const [viewMode, setViewMode] = useState("days"); // "days" | "months"
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectDate = (d) => {
    const newDate = new Date(d.year, d.month, d.day);
    onChange(newDate.toISOString().split("T")[0]); 
    setOpen(false);
  };

  return (
    <div className="relative" ref={containerRef} style={{ width: "176px" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          height: "38px", fontSize: "13px", border: "1px solid #cfd7e2", borderRadius: "5px",
          color: value ? "#1e293b" : "#94a3b8", backgroundColor: "white", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between", width: "175px", padding: "10px 12px"
        }}
      >
        <span>{value ? formatDateDDMMYYYY(value) : placeholder}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </div>

      {open && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 1000,
            backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12), 0 8px 10px -6px rgba(0,0,0,0.08)",
            padding: "14px 16px", width: "280px", userSelect: "none",
          }}
        >
          {/* Header Kalender */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <button
              type="button"
              style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "4px 8px", borderRadius: "4px" }}
              onClick={(e) => {
                e.stopPropagation();
                if (viewMode === "days") setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
                else setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1));
              }}
            >
              «
            </button>
            <button
              type="button"
              style={{ background: "none", border: "none", fontSize: "14px", fontWeight: "700", color: "#2563eb", cursor: "pointer", padding: "4px 8px" }}
              onClick={(e) => {
                e.stopPropagation();
                setViewMode(viewMode === "days" ? "months" : "days");
              }}
            >
              {viewMode === "days" && `${MONTH_NAMES[viewDate.getMonth()]} ${viewDate.getFullYear()}`}
              {viewMode === "months" && `${viewDate.getFullYear()}`}
            </button>
            <button
              type="button"
              style={{ background: "none", border: "none", fontSize: "16px", fontWeight: "bold", cursor: "pointer", color: "#334155", padding: "4px 8px", borderRadius: "4px" }}
              onClick={(e) => {
                e.stopPropagation();
                if (viewMode === "days") setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
                else setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1));
              }}
            >
              »
            </button>
          </div>

          {/* Tampilan Hari */}
          {viewMode === "days" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", fontWeight: 600, fontSize: "11px", color: "#64748b", marginBottom: "6px" }}>
                <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", textAlign: "center", fontSize: "12px" }}>
                {getCalendarDays(viewDate.getFullYear(), viewDate.getMonth()).map((d, idx) => {
                  const isSelected = value && d.day === new Date(value).getDate() && d.month === new Date(value).getMonth() && d.year === new Date(value).getFullYear();
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectDate(d);
                      }}
                      style={{
                        padding: "6px 0", border: "none", borderRadius: "4px", cursor: "pointer",
                        backgroundColor: isSelected ? "#2563eb" : "transparent",
                        color: isSelected ? "#ffffff" : d.isCurrentMonth ? "#1e293b" : "#94a3b8",
                        fontWeight: isSelected ? "bold" : "normal",
                      }}
                    >
                      {d.day}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Tampilan Bulan */}
          {viewMode === "months" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", textAlign: "center", fontSize: "12px", paddingTop: "8px" }}>
              {MONTH_NAMES.map((mName, idx) => (
                <button
                  key={mName}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewDate(new Date(viewDate.getFullYear(), idx, 1));
                    setViewMode("days");
                  }}
                  style={{
                    padding: "10px 4px", border: "none", borderRadius: "4px", cursor: "pointer",
                    backgroundColor: viewDate.getMonth() === idx ? "#2563eb" : "#f8fafc",
                    color: viewDate.getMonth() === idx ? "#ffffff" : "#1e293b",
                    fontWeight: viewDate.getMonth() === idx ? "bold" : "normal",
                  }}
                >
                  {mName.substring(0, 3)}
                </button>
              ))}
            </div>
          )}

          {/* Tombol Hari Ini */}
          <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const today = new Date();
                onChange(today.toISOString().split("T")[0]);
                setViewDate(today);
                setOpen(false);
              }}
              style={{ background: "none", border: "none", fontSize: "13px", fontWeight: 600, color: "#2563eb", cursor: "pointer", padding: "4px 8px", borderRadius: "4px" }}
            >
              Hari ini
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- HALAMAN UTAMA ---
export default function DetailAkunPiutangPage() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactions, setTransactions] = useState([]);

  const handleTampilkan = () => {
    setTransactions([]);
  };

  return (
    <Flex direction="column" minH="100vh" bg="#ffffffff">
      {/* Header */}
      <Flex
        px={6} pt={5} pb={4}
        align={{ base: "flex-start", sm: "center" }}
        justify="space-between"
        direction={{ base: "column", sm: "row" }}
        gap={3}
      >
        <Box>
          <Text
            as="button"
            fontSize="13px"
            color="#2563eb"
            mb={1}
            _hover={{ textDecoration: "underline" }}
            onClick={() => navigate("/daftar-akun")}
          >
            Daftar akun
          </Text>
          <Text fontSize="23px" fontWeight="bold" color="#1e293b" letterSpacing="-0.01em">
            ({AKUN.kode}) - {AKUN.nama}
          </Text>
        </Box>

        <HStack gap={2.5}>
          <Button {...outlineBtn}>Beri masukan</Button>
          <Button {...outlineBtn} display="inline-flex" alignItems="center" gap={2}>
            <span>Tindakan</span>
            <CaretDown size={14} weight="bold" color="#2563eb" />
          </Button>
        </HStack>
      </Flex>

      {/* Main card */}
      <Box flex={1} px={4} display="flex" flexDirection="column">
        <Flex
          flex={1}
          direction="column"
          bg="white"
          borderTop="1px solid #dde3ea"
          borderX="1px solid #dde3ea"
          borderTopRadius="10px"
          boxShadow="sm"
        >
          {/* Toolbar */}
          <Flex
            px={6} py={4}
            borderBottom="1px solid #f1f5f9"
            align="center"
            justify="space-between"
            wrap="wrap"
            gap={4}
          >
            <HStack gap={6} fontSize="13px">
              <Text color="#64748b">Kategori akun</Text>
              <Text color="#1e293b">{AKUN.kategori}</Text>
            </HStack>

            <Flex wrap="wrap" align="center" gap={3}>
              
              {/* TANGGAL AWAL DENGAN KALENDER KUSTOM */}
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="Tanggal awal"
              />

              {/* TANGGAL AKHIR DENGAN KALENDER KUSTOM */}
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="Tanggal akhir"
                minDate={startDate}
              />

              <Button
                h="36px"
                px={6}
                fontSize="13px"
                fontWeight="500"
                color="white"
                bg="#365cb9"
                borderRadius="5px"
                boxShadow="sm"
                _hover={{ bg: "#2b4c9e" }}
                onClick={handleTampilkan}
              >
                Tampilkan
              </Button>
            </Flex>
          </Flex>

          {/* Empty state */}
          {transactions.length === 0 && (
            <Flex
              flex={1}
              direction="column"
              align="center"
              justify="center"
              py={24}
              px={4}
              userSelect="none"
            >
              <Box
                as="img"
                src={dompetBiru}
                alt="Belum ada transaksi"
                w="240px"
                maxW="100%"
                mb={5}
                style={{ objectFit: "contain" }}
              />
              <Text fontSize="16px" fontWeight="600" color="#1e293b" mb={1}>
                Belum ada transaksi
              </Text>
              <Text fontSize="13px" color="#64748b">
                Daftar transaksi Anda akan ditampilkan di sini.
              </Text>
            </Flex>
          )}
        </Flex>
      </Box>
    </Flex>
  );
}