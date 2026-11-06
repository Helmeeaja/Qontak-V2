import React from "react";
import { useNavigate } from "react-router-dom";

const LEFT_ITEMS = [
    {
        id: "kategori-tag",
        title: "Kategori Tag",
        description: "Menampilkan kategori yang berisi tag.",
    },
    {
        id: "daftar-transaksi",
        title: "Daftar Transaksi",
        description: "Daftar dari semua transaksi",
    },
    {
        id: "kategori-produk",
        title: "Kategori produk",
        description: "Berisi daftar kategori produk Anda.",
    },
    {
        id: "cara-pembayaran",
        title: "Cara Pembayaran",
        path: "/cara-pembayaran",
        description: "Menampilkan cara pembayaran yang Anda pakai atau dipakai oleh Supplier Anda.",
    },
    {
        id: "unit",
        path: "/units",
        title: "Unit",
        description: "Berisi daftar satuan (unit) produk Anda.",
    },
    {
        id: "daftar-audit",
        path: "/audits",
        title: "Daftar Audit",
        description: "Daftar perubahan yang telah dilakukan",
    },
    {
        id: "penghitungan-ulang-nilai-persediaan",
        path: "/inventory-recalculation",
        title: "Penghitungan ulang nilai persediaan",
        badge: "Baru",
        description:
            "Menampilkan status dan log penghitungan nilai persediaan yang disebabkan oleh perubahan data transaksi.",
    },
];

const RIGHT_ITEMS = [
    {
        id: "daftar-jadwal-berulang",
        title: "Daftar Jadwal Berulang",
        description: "Daftar pengaturan jadwal untuk transaksi berulang",
    },
    {
        id: "daftar-kunci-periode-tutup-buku",
        title: "Daftar Kunci Periode & Tutup Buku",
        badge: "Baru",
        description:
            "Menampilkan daftar periode yang dikunci dan buku yang sudah ditutup dalam satu tabel.",
    },
    {
        id: "daftar-lampiran",
        path: "/attachments",
        title: "Daftar Lampiran",
        description: "Daftar semua lampiran pada transaksi",
    },
    {
        id: "pajak",
        title: "Pajak",
        path: "/pajak",
        description:
            "Menampilkan tipe-tipe pajak yang Anda pakai untuk penjualan kepada pelanggan atau pembelian dari supplier.",
    },
    {
        id: "syarat-pembayaran",
        title: "Syarat Pembayaran",
        path: "/syarat-pembayaran",
        description:
            "Menampilkan daftar syarat pembayaran yang menentukan tanggal jatuh tempo untuk pelanggan atau dari supplier. Dari sini Anda dapat membuat syarat pembayaran baru, dan mengubah atau menghapusnya.",
    },
    {
        id: "daftar-impor-ekspor",
        path: "/importexport",
        title: "Daftar Impor & Ekspor",
        description:
            "Menampilkan daftar riwayat impor dan ekspor di Jurnal. Anda dapat melihat status dan data dari masing-masing impor & ekspor, serta menghapus data per impor.",
    },
    {
        id: "data-migrasi",
        title: "Data Migrasi",
        path: "/data-migrasi",
        description: "Dapatkan Kemudahan dalam Pemindahan Data Anda",
    },
];

const Badge = () => (
    <span
        style={{
            display: "inline-flex",
            alignItems: "center",
            marginLeft: "8px",
            padding: "2px 10px",
            borderRadius: "999px",
            backgroundColor: "#E12D39",
            color: "#ffffff",
            fontSize: "11px",
            fontWeight: 700,
            verticalAlign: "middle",
        }}
    >
        Baru
    </span>
);

const ListItem = ({ item }) => {
    const navigate = useNavigate();
    return (
        <div style={{ marginBottom: "28px" }}>
            <h3
                onClick={() => item.path && navigate(item.path)}
                style={{
                    margin: 0,
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "rgb(0, 96, 191)",
                    cursor: "pointer",
                }}
            >
                {item.title}
                {item.badge && <Badge />}
            </h3>
            <p
                style={{
                    margin: "6px 0 0 0",
                    fontSize: "14px",
                    color: "#334155",
                    lineHeight: 1.6,
                    maxWidth: "620px",
                }}
            >
                {item.description}
            </p>
        </div>
    );
};

export default function DaftarLainnya() {
    return (
        <div
            style={{
                margin: "-24px",
                minHeight: "100vh",
                backgroundColor: "#EEF1F6",
                fontFamily: "'Inter', sans-serif, system-ui",
            }}
        >
            <div style={{ padding: "32px 32px 48px 32px" }}>
                <div style={{ marginBottom: "20px" }}>
                    <p style={{ margin: 0, fontSize: "14px", color: "#64748B" }}>Pengaturan</p>
                    <h1
                        style={{
                            margin: "-5px 0 0 0",
                            fontSize: "28px",
                            fontWeight: 700,
                            color: "#0F172A",
                        }}
                    >
                        Daftar Lainnya
                    </h1>
                </div>

                <div
                    style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #E5E7EB",
                        borderRadius: "16px",
                        padding: "40px 48px",
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            columnGap: "64px",
                        }}
                    >
                        <div>
                            {LEFT_ITEMS.map((item) => (
                                <ListItem key={item.id} item={item} />
                            ))}
                        </div>
                        <div>
                            {RIGHT_ITEMS.map((item) => (
                                <ListItem key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}