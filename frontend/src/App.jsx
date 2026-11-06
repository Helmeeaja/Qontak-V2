import { Routes, Route, Navigate } from "react-router-dom";
import Beranda from "./pages/Main-Beranda/Beranda";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AcceptInvitationPage from "./pages/AcceptInvitationPage";
import BiayaPage from "./pages/BiayaPage";
import ProductsMain from "./pages/Main-Product/ProductsMain";
import DashboardPage from "./pages/Main-Dashboard/DashboardPage";
import LeadsPage from "./pages/LeadsPage";
import PipelinePage from "./pages/PipelinePage";
import CalendarPage from "./pages/CalendarPage";
import LeadDetailPage from "./pages/LeadDetailPage";
import SettingsPage from "./pages/Main-Settings/SettingsPage";
import BroadcastPage from "./pages/BroadcastPage";
import BroadcastHistoryPage from "./pages/BroadcastHistoryPage";
import ArchivedLeadsPage from "./pages/ArchivedLeadsPage";
import DaftarAkunPage from "./pages/Main-DaftarAkun/DaftarAkunPage";
import TutupBukuPage from "./pages/Main-DaftarAkun/TutupBukuPage";
import JurnalUmumPage from "./pages/Main-DaftarAkun/JurnalUmumPage";
import AsetPage from "./pages/AsetPage";
import SimpanAsetPage from "./pages/Main-Aset/SimpanAsetPage";
import Laporan from "./pages/Laporan";
import Neraca from "./pages/Main-Laporan/Neraca";
import KasBankPage from "./pages/KasBankPage";
import Anggaran from "./pages/Anggaran";
import LabaRugi from "./pages/Main-Laporan/LabaRugi";
import ArusKas from "./pages/Main-Laporan/ArusKas";
import PerubahanModal from "./pages/Main-Laporan/PerubahanModal";
import BukuBesar from "./pages/Main-Laporan/BukuBesar";
import Jurnal from "./pages/Main-Laporan/Jurnal";
import NeracaSaldo from "./pages/Main-Laporan/NeracaSaldo";
import RincianAnggaran from "./pages/Main-Anggaran/RincianAnggaran";
import RingkasanBisnis from "./pages/Main-Laporan/RingkasanBisnis";
import DaftarPenjualan from "./pages/Main-Laporan/DaftarPenjualan";
import PiutangPelanggan from "./pages/Main-Laporan/PiutangPelanggan";
import PengirimanPenjualan from "./pages/Main-Laporan/PengirimanPenjualan";
import PenjualanPerPelanggan from "./pages/Main-Laporan/PenjualanPerPelanggan";
import PenjualanPerProduk from "./pages/Main-Laporan/PenjualanPerProduk";
import PenyelesaianPesananPenjualan from "./pages/Main-Laporan/PenyelesaianPesananPenjualan";
import ProfitabilitasProduk from "./pages/Main-Laporan/ProfitabilitasProduk";
import UsiaPiutang from "./pages/Main-Laporan/UsiaPiutang";
import DaftarLainnya from "./pages/DaftarLainnya";
import UnitsPage from "./pages/UnitsPage";
import AuditsPage from "./pages/AuditsPage";
import InventoryRecalculationPage from "./pages/InventoryRecalculationPage";
import AttachmentsPage from "./pages/AttachmentsPage";
import ImportExportPage from "./pages/ImportExportPage";
import DaftarFakturProforma from "./pages/DaftarFakturProforma";
import DaftarTukarFaktur from "./pages/DaftarTukarFaktur";
import DaftarPembelian from "./pages/DaftarPembelian";
import PembelianPerSupplier from "./pages/Main-Laporan/PembelianPerSupplier";
import UtangSupplier from "./pages/Main-Laporan/UtangSupplier";
import DaftarPengeluaran from "./pages/Main-Laporan/DaftarPengeluaran";
import DetailPengeluaran from "./pages/Main-Laporan/DetailPengeluaran";
import UsiaUtang from "./pages/Main-Laporan/UsiaUtang";
import PengirimanPembelian from "./pages/Main-Laporan/PengirimanPembelian";
import PembelianPerProduk from "./pages/Main-Laporan/PembelianPerProduk";
import PenyelesaianPesananPembelian from "./pages/Main-Laporan/PenyelesaianPesananPembelian";
import TingkatPemenuhanPesanan from "./pages/Main-Laporan/TingkatPemenuhanPesanan";
import PerputaranPersediaanBarang from "./pages/Main-Laporan/PerputaranPersediaanBarang";
import RingkasanPersediaanBarang from "./pages/Main-Laporan/RingkasanPersediaanBarang";
import KuantitasStokGudang from "./pages/Main-Laporan/KuantitasStokGudang";
import NilaiPersediaanBarang from "./pages/Main-Laporan/NilaiPersediaanBarang";
import NilaiStokGudang from "./pages/Main-Laporan/NilaiStokGudang";
import DetailPersediaanBarang from "./pages/Main-Laporan/DetailPersediaanBarang";
import PergerakanBarangGudang from "./pages/Main-Laporan/PergerakanBarangGudang";
import KuantitasProdukNomorSeri from "./pages/Main-Laporan/KuantitasProdukNomorSeri";
import GudangProdukBernomorSeri from "./pages/Main-Laporan/GudangProdukBernomorSeri";
import RingkasanAsetTetap from "./pages/Main-Laporan/RingkasanAsetTetap";
import DetailAsetTetap from "./pages/Main-Laporan/DetailAsetTetap";
import LaporanPenjualanPelepasanAset from "./pages/Main-Laporan/LaporanPenjualanPelepasanAset";
import RingkasanRekonsiliasi from "./pages/Main-Laporan/RingkasanRekonsiliasi";
import MutasiRekeningKoran from "./pages/Main-Laporan/MutasiRekeningKoran";
import LaporanPajakPemotongan from "./pages/Main-Laporan/LaporanPajakPemotongan";
import LaporanPajakPenjualan from "./pages/Main-Laporan/LaporanPajakPenjualan";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import ContactPage from "./pages/Main-Contact/ContactPage";
import MainLayout from "./components/layout/MainLayout";
import AuthGuard from "./components/layout/AuthGuard";
import PusatBantuan from "./pages/PusatBantuan";
import Pajak from "./pages/Main-DaftarLainnya/Pajak";
import CaraPembayaran from "./pages/Main-DaftarLainnya/CaraPembayaran";
import BuatPajakBaru from "./pages/BuatPajakBaru";
import EditPajak from "./pages/EditPajak";
import SyaratPembayaran from "./pages/Main-DaftarLainnya/SyaratPembayaran";
import DataMigrasi from "./pages/Main-DaftarLainnya/DataMigrasi";
import PengaturanPerusahaan from "./pages/PengaturanPerusahaan";
import MasterData1 from "./pages/MasterData1";
import MasterData2 from "./pages/MasterData2";
import MasterData3 from "./pages/MasterData3";
import Transaksi1 from "./pages/Transaksi1";
import Transaksi2 from "./pages/Transaksi2";
import Transaksi3 from "./pages/Transaksi3";
import AturSaldoCoa from "./pages/AturSaldoCoa";
/* Isi Daftar Akun */
import PpnMasukan from "./pages/Isi-DaftarAkun/OtherCurrentAssets/PpnMasukan";
import Kas from "./pages/Isi-DaftarAkun/Cash & Bank/Kas";
import RekeningBank from "./pages/Isi-DaftarAkun/Cash & Bank/RekeningBank";
import Giro from "./pages/Isi-DaftarAkun/Cash & Bank/Giro";
import PiutangBelumDitagih from "./pages/Isi-DaftarAkun/AccountsReceivable/PiutangBelumDitagih";
import PiutangUsaha from "./pages/Isi-DaftarAkun/AccountsReceivable/PiutangUsaha"; 
import CadanganKerugianPiutang from "./pages/Isi-DaftarAkun/AccountsReceivable/CadanganKerugianPiutang"; 
import PersediaanBarang from "./pages/Isi-DaftarAkun/Inventory/PersediaanBarang";
import PiutangLainnya from "./pages/Isi-DaftarAkun/OtherCurrentAssets/PiutangLainnya";
import PiutangKaryawan from "./pages/Isi-DaftarAkun/OtherCurrentAssets/PiutangKaryawan";
import DanaBelumDisetor from "./pages/Isi-DaftarAkun/OtherCurrentAssets/DanaBelumDisetor";
import AsetLancarLainnya from "./pages/Isi-DaftarAkun/OtherCurrentAssets/AsetLancarLainnya";
import BiayaDibayarDimuka from "./pages/Isi-DaftarAkun/OtherCurrentAssets/BiayaDibayarDimuka";
import UangMuka from "./pages/Isi-DaftarAkun/OtherCurrentAssets/UangMuka";
import PPh22 from "./pages/Isi-DaftarAkun/OtherCurrentAssets/PPh22";
import PPh23 from "./pages/Isi-DaftarAkun/OtherCurrentAssets/PPh23";
import PPh25 from "./pages/Isi-DaftarAkun/OtherCurrentAssets/PPh25";
import AsetTetapTanah from "./pages/Isi-DaftarAkun/FixedAssets/AsetTetapTanah";
import AsetTetapBangunan from "./pages/Isi-DaftarAkun/FixedAssets/AsetTetapBangunan";
import AsetTetapBuildingImprovements from "./pages/Isi-DaftarAkun/FixedAssets/AsetTetapBuildingImprovements";
import AsetTetapKendaraan from "./pages/Isi-DaftarAkun/FixedAssets/AsetTetapKendaraan";
import AsetTetapMesinPeralatan from "./pages/Isi-DaftarAkun/FixedAssets/AsetTetapMesin&Peralatan";
import AsetTetapPerlengkapanKantor from "./pages/Isi-DaftarAkun/FixedAssets/AsetTetapPerlengkapanKantor";
import AsetTetapSewaGunaUsaha from "./pages/Isi-DaftarAkun/FixedAssets/AsetTetapSewaGunaUsaha";
import AsetTakBerwujud from "./pages/Isi-DaftarAkun/FixedAssets/AsetTakBerwujud";
import AkumulasiPenyusutanBangunan from "./pages/Isi-DaftarAkun/Depreciation & Amortization/AkumulasiPenyusutan-Bangunan";
import AkumulasiPenyusutanBuilding from "./pages/Isi-DaftarAkun/Depreciation & Amortization/AkumulasiPenyusutan-Building";
import AkumulasiPenyusutanKendaraan from "./pages/Isi-DaftarAkun/Depreciation & Amortization/AkumulasiPenyusutan-Kendaraan";
import AkumulasiPenyusutanMesinPeralatan from "./pages/Isi-DaftarAkun/Depreciation & Amortization/AkumulasiPenyusutan-Mesin&Peralatan";
import AkumulasiPenyusutanPeralatanKantor from "./pages/Isi-DaftarAkun/Depreciation & Amortization/AkumulasiPenyusutan-PeralatanKantor";
import AkumulasiPenyusutanSewaGunaUsaha from "./pages/Isi-DaftarAkun/Depreciation & Amortization/AkumulasiPenyusutan-SewaGunaUsaha";
import AkumulasiPenyusutanAmortisasi from "./pages/Isi-DaftarAkun/Depreciation & Amortization/AkumulasiPenyusutan-Amortisasi";
import Investasi from "./pages/Isi-DaftarAkun/OtherAssets/Investasi";
import HutangUsaha from "./pages/Isi-DaftarAkun/AccountsPayable/HutangUsaha";
import HutangBelumDitagih from "./pages/Isi-DaftarAkun/AccountsPayable/HutangBelumDitagih";
import HutangLainLain from "./pages/Isi-DaftarAkun/OtherCurrentLiabilities/HutangLainLain";
import HutangGaji from "./pages/Isi-DaftarAkun/OtherCurrentLiabilities/HutangGaji";
import HutangDeviden from "./pages/Isi-DaftarAkun/OtherCurrentLiabilities/HutangDeviden";
import PendapatanDiterimaDimuka from "./pages/Isi-DaftarAkun/OtherCurrentLiabilities/PendapatanDiterimaDimuka";
import SaranaKantorTerhutang from "./pages/Isi-DaftarAkun/OtherCurrentLiabilities/SaranaKantorTerhutang";
import BungaTerhutang from "./pages/Isi-DaftarAkun/OtherCurrentLiabilities/BungaTerhutang";
import BiayaTerhutangLainnya from "./pages/Isi-DaftarAkun/OtherCurrentLiabilities/BiayaTerhutangLainnya";
import HutangBank from "./pages/Isi-DaftarAkun/OtherCurrentLiabilities/HutangBank";
import PPNKeluaran from "./pages/Isi-DaftarAkun/OtherCurrentLiabilities/PPNKeluaran";
import HutangPajakPPH21 from "./pages/Isi-DaftarAkun/OtherCurrentLiabilities/HutangPajak-PPh21";
import HutangPajakPPH22 from "./pages/Isi-DaftarAkun/OtherCurrentLiabilities/HutangPajak-PPh22";
import HutangPajakPPH23 from "./pages/Isi-DaftarAkun/OtherCurrentLiabilities/HutangPajak-PPh23";
import HutangPajakPPH29 from "./pages/Isi-DaftarAkun/OtherCurrentLiabilities/HutangPajak-PPh29";
import HutangPajakLainnya from "./pages/Isi-DaftarAkun/OtherCurrentLiabilities/HutangPajakLainnya";
import HutangDariPemegangSaham from "./pages/Isi-DaftarAkun/OtherCurrentLiabilities/HutangDariPemegangSaham";
import KewajibanLancarLainnya from "./pages/Isi-DaftarAkun/OtherCurrentLiabilities/KewajibanLancarLainnya";
import KewajibanManfaatKaryawan from "./pages/Isi-DaftarAkun/LongTermLiabilities/KewajibanManfaatKaryawan";
import ModalSaham from "./pages/Isi-DaftarAkun/Equity/ModalSaham";
import TambahanModalDisetor from "./pages/Isi-DaftarAkun/Equity/TambahanModalDisetor";
import Deviden from "./pages/Isi-DaftarAkun/Equity/Deviden";
import EquitasSaldoAwal from "./pages/Isi-DaftarAkun/Equity/EquitasSaldoAwal";
import LabaDitahan from "./pages/Isi-DaftarAkun/Equity/LabaDitahan";
import PendapatanKomprehensifLainnya from "./pages/Isi-DaftarAkun/Equity/PendapatanKomprehensifLainnya";
import DiskonPenjualan from "./pages/Isi-DaftarAkun/Income/DiskonPenjualan";
import PendapatanBelumDitagih from "./pages/Isi-DaftarAkun/Income/PendapatanBelumDitagih";
import PendapatanJasa from "./pages/Isi-DaftarAkun/Income/PendapatanJasa";
import ReturPenjualan from "./pages/Isi-DaftarAkun/Income/ReturPenjualan";
import BebanPokokPendapatan from "./pages/Isi-DaftarAkun/CostOfSales/BebanPokokPendapatan";
import BiayaImpor from "./pages/Isi-DaftarAkun/CostOfSales/BiayaImpor";
import DiskonPembelian from "./pages/Isi-DaftarAkun/CostOfSales/DiskonPembelian";
import ReturPembelian from "./pages/Isi-DaftarAkun/CostOfSales/ReturPembelian";
import BiayaProduksi from "./pages/Isi-DaftarAkun/CostOfSales/BiayaProduksi";
import PengirimanPengangkutan from "./pages/Isi-DaftarAkun/CostOfSales/Pengiriman&Pengangkutan" 
import BiayaPenjualan from "./pages/Isi-DaftarAkun/Expenses/BiayaPenjualan";
import IklanPromosi from "./pages/Isi-DaftarAkun/Expenses/IklanPromosi";
import KomisiFee from "./pages/Isi-DaftarAkun/Expenses/KomisiFee";
import BensinTolParkirPenjualan from "./pages/Isi-DaftarAkun/Expenses/BensinTolParkirPenjualan";
import PerjalananDinasPenjualan from "./pages/Isi-DaftarAkun/Expenses/PerjalananDinasPenjualan";
import KomunikasiPenjualan from "./pages/Isi-DaftarAkun/Expenses/KomunikasiPenjualan";
import MarketingLainnya from "./pages/Isi-DaftarAkun/Expenses/MarketingLainnya";
import BiayaUmumAdministratif from "./pages/Isi-DaftarAkun/Expenses/BiayaUmumAdministratif";
import Gaji from "./pages/Isi-DaftarAkun/Expenses/Gaji";
import Upah from "./pages/Isi-DaftarAkun/Expenses/Upah";
import MakananTransportasi from "./pages/Isi-DaftarAkun/Expenses/Makanan&Transportasi";
import Lembur from "./pages/Isi-DaftarAkun/Expenses/Lembur";
import Pengobatan from "./pages/Isi-DaftarAkun/Expenses/Pengobatan";
import ThrBonus from "./pages/Isi-DaftarAkun/Expenses/Thr&Bonus";
import Jamsostek from "./pages/Isi-DaftarAkun/Expenses/Jamsostek";
import Insentif from "./pages/Isi-DaftarAkun/Expenses/Insentif";
import Pesangon from "./pages/Isi-DaftarAkun/Expenses/Pesangon";
import ManfaatTunjanganLain from "./pages/Isi-DaftarAkun/Expenses/Manfaat&TunjanganLain";
import Donasi from "./pages/Isi-DaftarAkun/Expenses/Donasi";
import Hiburan from "./pages/Isi-DaftarAkun/Expenses/Hiburan";
import BensinTolParkirUmum from "./pages/Isi-DaftarAkun/Expenses/BensinTolParkirUmum";
import PerbaikanPemeliharaan from "./pages/Isi-DaftarAkun/Expenses/Perbaikan&Pemeliharaan";
import PerjalananDinasUmum from "./pages/Isi-DaftarAkun/Expenses/PerjalananDinasUmum";
import Makanan from "./pages/Isi-DaftarAkun/Expenses/Makanan";
import KomunikasiUmum from "./pages/Isi-DaftarAkun/Expenses/KomunikasiUmum";
import IuranLangganan from "./pages/Isi-DaftarAkun/Expenses/Iuran&Langganan";
import Asuransi from "./pages/Isi-DaftarAkun/Expenses/Asuransi";
import LegalProfesional from "./pages/Isi-DaftarAkun/Expenses/Legal&Profesional";
import BebanManfaatKaryawan from "./pages/Isi-DaftarAkun/Expenses/BebanManfaatKaryawan";
import SaranaKantor from "./pages/Isi-DaftarAkun/Expenses/SaranaKantor";
import PelatihanPengembangan from "./pages/Isi-DaftarAkun/Expenses/Pelatihan&Pengembangan";
import BebanPiutangTakTertagih from "./pages/Isi-DaftarAkun/Expenses/BebanPiutangTakTertagih";
import PajakPerizinan from "./pages/Isi-DaftarAkun/Expenses/Pajak&Perizinan";
import Denda from "./pages/Isi-DaftarAkun/Expenses/Denda";
import PengeluaranBarangRusak from "./pages/Isi-DaftarAkun/Expenses/PengeluaranBarangRusak";
import BebanKantor from "./pages/Isi-DaftarAkun/Expenses/BebanKantor";
import AlatTulisKantorPrinting from "./pages/Isi-DaftarAkun/Expenses/AlatTulisKantor&Printing";
import BeaMaterai from "./pages/Isi-DaftarAkun/Expenses/BeaMaterai";
import KeamananKebersihan from "./pages/Isi-DaftarAkun/Expenses/Keamanan&Kebersihan";
import SuppliesMaterial from "./pages/Isi-DaftarAkun/Expenses/Supplies&Material";
import Pemborong from "./pages/Isi-DaftarAkun/Expenses/Pemborong";
import BiayaSewaBangunan from "./pages/Isi-DaftarAkun/Expenses/BiayaSewaBangunan";
import BiayaSewaKendaraan from "./pages/Isi-DaftarAkun/Expenses/BiayaSewaKendaraan";
import BiayaSewaOperasional from "./pages/Isi-DaftarAkun/Expenses/BiayaSewaOperasional";
import BiayaSewaLainLain from "./pages/Isi-DaftarAkun/Expenses/BiayaSewaLainLain";
import PenyusutanBangunan from "./pages/Isi-DaftarAkun/Expenses/PenyusutanBangunan";
import PenyusutanPerbaikanBangunan from "./pages/Isi-DaftarAkun/Expenses/PenyusutanPerbaikanBangunan";
import PenyusutanKendaraan from "./pages/Isi-DaftarAkun/Expenses/PenyusutanKendaraan";
import PenyusutanMesinPeralatan from "./pages/Isi-DaftarAkun/Expenses/PenyusutanMesin&Peralatan";
import PenyusutanPeralatanKantor from "./pages/Isi-DaftarAkun/Expenses/PenyusutanPeralatanKantor";
import PenyusutanAsetSewaGunaUsaha from "./pages/Isi-DaftarAkun/Expenses/PenyusutanAsetSewaGunaUsaha";
import PendapatanBungaBank from "./pages/Isi-DaftarAkun/OtherIncome/PendapatanBungaBank";
import PendapatanBungaDeposito from "./pages/Isi-DaftarAkun/OtherIncome/PendapatanBungaDeposito";
import PendapatanLainLain from "./pages/Isi-DaftarAkun/OtherIncome/PendapatanLainLain";
import BebanBunga from "./pages/Isi-DaftarAkun/OtherExpense/BebanBunga";
import BebanLainLain from "./pages/Isi-DaftarAkun/OtherExpense/BebanLainLain";
import BebanPajakKini from "./pages/Isi-DaftarAkun/OtherExpense/BebanPajakKini";
import BebanPajakTangguhan from "./pages/Isi-DaftarAkun/OtherExpense/BebanPajakTangguhan";
import LabaRugiPelepasanAsetTetap from "./pages/Isi-DaftarAkun/OtherExpense/LabaRugiPelepasanAsetTetap";
import PenyesuaianPersediaan from "./pages/Isi-DaftarAkun/OtherExpense/PenyesuaianPersediaan";
import Provisi from "./pages/Isi-DaftarAkun/OtherExpense/Provisi";
/* Kontak */
import ProfilKontak from "./pages/Main-Contact/ProfilKontak";
import BuatKontak from "./pages/Main-Contact/BuatKontak";
import UbahKontak from "./pages/Main-Contact/UbahKontak";
/* Produk */
import BuatProduk from "./pages/Main-Product/BuatProduk";
import TambahGudang from "./pages/Main-Product/TambahGudang";
import PenyesuaianStok from "./pages/Main-Product/PenyesuaianStok";
import TransferGudang from "./pages/Main-Product/TransferGudang";
import AturanHarga from "./pages/Main-Product/AturanHarga";
import ProfilProduk from "./pages/Main-Product/ProfilProduk";
import UbahProduk from "./pages/Main-Product/UbahProduk";
/* Penjualan */
import PenjualanPage from "./pages/Main-Penjualan/PenjualanPage";
import CreateInvoice from "./pages/Main-Penjualan/CreateSalesInvoicePage";
import CreateSalesOrderPage from "./pages/Main-Penjualan/CreateSalesOrderPage";
import CreateSalesQuotePage from "./pages/Main-Penjualan/CreateSalesQuotePage";
/* Pembelian */
import PembelianPage from "./pages/Main-Pembelian/PembelianPage";
import CreatePurchaseInvoice from "./pages/Main-Pembelian/CreatePurchaseInvoice";
import CreatePurchaseExchange from "./pages/Main-Pembelian/CreatePurchaseExchange";
import CreatePurchaseOrderPage from "./pages/Main-Pembelian/CreatePurchaseOrderPage";
import CreatePurchaseQuotePage from "./pages/Main-Pembelian/CreatePurchaseQuotePage";
import CreatePurchaseRequestPage from "./pages/Main-Pembelian/CreatePurchaseRequestPage";
import FulfillmentPage from "./pages/FulfillmentPage";
import ProductionsMainPage from "./pages/ProductionsMainPage";



function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/accept-invitation" element={<AcceptInvitationPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/pusat-bantuan" element={<PusatBantuan />} />
      <Route element={<AuthGuard />}>
        <Route element={<MainLayout />}>
          /* Isi Daftar Akun */
          <Route path="/isi-daftar-akun/ppn-masukan" element={<PpnMasukan />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<PpnMasukan />} />
          <Route path="/isi-daftar-akun/kas" element={<Kas />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<Kas />} />
          <Route path="/isi-daftar-akun/rekening-bank" element={<RekeningBank />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<RekeningBank />} />
          <Route path="/isi-daftar-akun/giro" element={<Giro />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<Giro />} />
          <Route path="/isi-daftar-akun/piutang-belum-ditagih" element={<PiutangBelumDitagih />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<PiutangBelumDitagih />} />
          <Route path="/isi-daftar-akun/piutang-usaha" element={<PiutangUsaha />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<PiutangUsaha />} />
          <Route path="/isi-daftar-akun/cadangan-kerugian-piutang" element={<CadanganKerugianPiutang />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<CadanganKerugianPiutang />} />
          <Route path="/isi-daftar-akun/persediaan-barang" element={<PersediaanBarang />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<PersediaanBarang />} />
          <Route path="/isi-daftar-akun/piutang-lainnya" element={<PiutangLainnya />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<PiutangLainnya />} />
          <Route path="/isi-daftar-akun/piutang-karyawan" element={<PiutangKaryawan />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<PiutangKaryawan />} />
          <Route path="/isi-daftar-akun/dana-belum-disetor" element={<DanaBelumDisetor />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<DanaBelumDisetor />} />
          <Route path="/isi-daftar-akun/aset-lancar-lainnya" element={<AsetLancarLainnya />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<AsetLancarLainnya />} />
          <Route path="/isi-daftar-akun/biaya-dibayar-dimuka" element={<BiayaDibayarDimuka />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<BiayaDibayarDimuka />} />
          <Route path="/isi-daftar-akun/uang-muka" element={<UangMuka />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<UangMuka />} />
          <Route path="/isi-daftar-akun/pph-23" element={<PPh23 />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<PPh23 />} />
          <Route path="/isi-daftar-akun/pph-22" element={<PPh22 />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<PPh22 />} />
          <Route path="/isi-daftar-akun/pph-25" element={<PPh25 />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<PPh25 />} />
          <Route path="/isi-daftar-akun/aset-tetap-tanah" element={<AsetTetapTanah />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<AsetTetapTanah />} />
          <Route path="/isi-daftar-akun/aset-tetap-bangunan" element={<AsetTetapBangunan />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<AsetTetapBangunan />} />
          <Route path="/isi-daftar-akun/aset-tetap-building-improvements" element={<AsetTetapBuildingImprovements />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<AsetTetapBuildingImprovements />} />
          <Route path="/isi-daftar-akun/aset-tetap-kendaraan" element={<AsetTetapKendaraan />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<AsetTetapKendaraan />} />
          <Route path="/isi-daftar-akun/aset-tetap-mesin-peralatan" element={<AsetTetapMesinPeralatan />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<AsetTetapMesinPeralatan />} />
          <Route path="/isi-daftar-akun/aset-tetap-perlengkapan-kantor" element={<AsetTetapPerlengkapanKantor />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<AsetTetapPerlengkapanKantor />} />
          <Route path="/isi-daftar-akun/aset-tetap-sewa-guna-usaha" element={<AsetTetapSewaGunaUsaha />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<AsetTetapSewaGunaUsaha />} />
          <Route path="/isi-daftar-akun/aset-tak-berwujud" element={<AsetTakBerwujud />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<AsetTakBerwujud />} />
          <Route path="/isi-daftar-akun/akumulasi-penyusutan-bangunan" element={<AkumulasiPenyusutanBangunan />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<AkumulasiPenyusutanBangunan />} />
          <Route path="/isi-daftar-akun/akumulasi-penyusutan-building-improvements" element={<AkumulasiPenyusutanBuilding />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<AkumulasiPenyusutanBuilding />} />
          <Route path="/isi-daftar-akun/akumulasi-penyusutan-kendaraan" element={<AkumulasiPenyusutanKendaraan />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<AkumulasiPenyusutanKendaraan />} />
          <Route path="/isi-daftar-akun/akumulasi-penyusutan-mesin-peralatan" element={<AkumulasiPenyusutanMesinPeralatan />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<AkumulasiPenyusutanMesinPeralatan />} />
          <Route path="/isi-daftar-akun/akumulasi-penyusutan-peralatan-kantor" element={<AkumulasiPenyusutanPeralatanKantor />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<AkumulasiPenyusutanPeralatanKantor />} />
          <Route path="/isi-daftar-akun/akumulasi-penyusutan-sewa-guna-usaha" element={<AkumulasiPenyusutanSewaGunaUsaha />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<AkumulasiPenyusutanSewaGunaUsaha />} />
          <Route path="/isi-daftar-akun/akumulasi-penyusutan-amortisasi" element={<AkumulasiPenyusutanAmortisasi />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<AkumulasiPenyusutanAmortisasi />} />
          <Route path="/isi-daftar-akun/investasi" element={<Investasi />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<Investasi />} />
          <Route path="/isi-daftar-akun/hutang-usaha" element={<HutangUsaha />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<HutangUsaha />} />
          <Route path="/isi-daftar-akun/hutang-belum-ditagih" element={<HutangBelumDitagih />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<HutangBelumDitagih />} />
          <Route path="/isi-daftar-akun/hutang-lain-lain" element={<HutangLainLain />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<HutangLainLain />} />
          <Route path="/isi-daftar-akun/hutang-gaji" element={<HutangGaji />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<HutangGaji />} />
          <Route path="/isi-daftar-akun/hutang-deviden" element={<HutangDeviden />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<HutangDeviden />} />
          <Route path="/isi-daftar-akun/pendapatan-diterima-dimuka" element={<PendapatanDiterimaDimuka />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<PendapatanDiterimaDimuka />} />
          <Route path="/isi-daftar-akun/sarana-kantor-terhutang" element={<SaranaKantorTerhutang />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<SaranaKantorTerhutang />} />
          <Route path="/isi-daftar-akun/bunga-terhutang" element={<BungaTerhutang />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<BungaTerhutang />} />
          <Route path="/isi-daftar-akun/biaya-terhutang-lainnya" element={<BiayaTerhutangLainnya />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<BiayaTerhutangLainnya />} />
          <Route path="/isi-daftar-akun/hutang-bank" element={<HutangBank />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<HutangBank />} />
          <Route path="/isi-daftar-akun/ppn-keluaran" element={<PPNKeluaran />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<PPNKeluaran />} />
          <Route path="/isi-daftar-akun/hutang-pajak-pph21" element={<HutangPajakPPH21 />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<HutangPajakPPH21 />} />
          <Route path="/isi-daftar-akun/hutang-pajak-pph22" element={<HutangPajakPPH22 />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<HutangPajakPPH22 />} />
          <Route path="/isi-daftar-akun/hutang-pajak-pph23" element={<HutangPajakPPH23 />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<HutangPajakPPH23 />} />
          <Route path="/isi-daftar-akun/hutang-pajak-pph29" element={<HutangPajakPPH29 />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<HutangPajakPPH29 />} />
          <Route path="/isi-daftar-akun/hutang-pajak-lainnya" element={<HutangPajakLainnya />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<HutangPajakLainnya />} />
          <Route path="/isi-daftar-akun/hutang-dari-pemegang-saham" element={<HutangDariPemegangSaham />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<HutangDariPemegangSaham />} />
          <Route path="/isi-daftar-akun/kewajiban-lancar-lainnya" element={<KewajibanLancarLainnya />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<KewajibanLancarLainnya />} />
          <Route path="/isi-daftar-akun/kewajiban-manfaat-karyawan" element={<KewajibanManfaatKaryawan />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<KewajibanManfaatKaryawan />} />
          <Route path="/isi-daftar-akun/modal-saham" element={<ModalSaham />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<ModalSaham />} />
          <Route path="/isi-daftar-akun/tambahan-modal-disetor" element={<TambahanModalDisetor />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<TambahanModalDisetor />} />
          <Route path="/isi-daftar-akun/laba-ditahan" element={<LabaDitahan />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<LabaDitahan />} />
          <Route path="/isi-daftar-akun/deviden" element={<Deviden />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<Deviden />} />
          <Route path="/isi-daftar-akun/pendapatan-komprehensif-lainnya" element={<PendapatanKomprehensifLainnya />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<PendapatanKomprehensifLainnya />} />
          <Route path="/isi-daftar-akun/equitas-saldo-awal" element={<EquitasSaldoAwal />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<EquitasSaldoAwal />} />
          <Route path="/isi-daftar-akun/diskon-penjualan" element={<DiskonPenjualan />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<DiskonPenjualan />} />
          <Route path="/isi-daftar-akun/pendapatan-belum-ditagih" element={<PendapatanBelumDitagih />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<PendapatanBelumDitagih />} />
          <Route path="/isi-daftar-akun/pendapatan-jasa" element={<PendapatanJasa />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<PendapatanJasa />} />
          <Route path="/isi-daftar-akun/retur-penjualan" element={<ReturPenjualan />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<ReturPenjualan />} />
          <Route path="/isi-daftar-akun/pengiriman-pengangkutan" element={<PengirimanPengangkutan />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<PengirimanPengangkutan />} />
          <Route path="/isi-daftar-akun/biaya-produksi" element={<BiayaProduksi />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<BiayaProduksi />} />
          <Route path="/isi-daftar-akun/diskon-pembelian" element={<DiskonPembelian />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<DiskonPembelian />} />
          <Route path="/isi-daftar-akun/retur-pembelian" element={<ReturPembelian />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<ReturPembelian />} />
          <Route path="/isi-daftar-akun/beban-pokok-pendapatan" element={<BebanPokokPendapatan />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<BebanPokokPendapatan />} />
          <Route path="/isi-daftar-akun/biaya-impor" element={<BiayaImpor />} />
          <Route path="/isi-daftar-akun/:kode_akun" element={<BiayaImpor />} />
          <Route path="/isi-daftar-akun/biaya-penjualan" element={<BiayaPenjualan />} />
          <Route path="/isi-daftar-akun/iklan-promosi" element={<IklanPromosi />} />
          <Route path="/isi-daftar-akun/komisi-fee" element={<KomisiFee />} />
          <Route path="/isi-daftar-akun/bensin-tol-parkir-penjualan" element={<BensinTolParkirPenjualan />} />
          <Route path="/isi-daftar-akun/perjalanan-dinas-penjualan" element={<PerjalananDinasPenjualan />} />
          <Route path="/isi-daftar-akun/komunikasi-penjualan" element={<KomunikasiPenjualan />} />
          <Route path="/isi-daftar-akun/marketing-lainnya" element={<MarketingLainnya />} />
          <Route path="/isi-daftar-akun/biaya-umum-administratif" element={<BiayaUmumAdministratif />} />
          <Route path="/isi-daftar-akun/gaji" element={<Gaji />} />
          <Route path="/isi-daftar-akun/upah" element={<Upah />} />
          <Route path="/isi-daftar-akun/makanan-transportasi" element={<MakananTransportasi />} />
          <Route path="/isi-daftar-akun/lembur" element={<Lembur />} />
          <Route path="/isi-daftar-akun/pengobatan" element={<Pengobatan />} />
          <Route path="/isi-daftar-akun/thr-bonus" element={<ThrBonus />} />
          <Route path="/isi-daftar-akun/jamsostek" element={<Jamsostek />} />
          <Route path="/isi-daftar-akun/insentif" element={<Insentif />} />
          <Route path="/isi-daftar-akun/pesangon" element={<Pesangon />} />
          <Route path="/isi-daftar-akun/manfaat-tunjangan-lain" element={<ManfaatTunjanganLain />} />
          <Route path="/isi-daftar-akun/donasi" element={<Donasi />} />
          <Route path="/isi-daftar-akun/hiburan" element={<Hiburan />} />
          <Route path="/isi-daftar-akun/bensin-tol-parkir-umum" element={<BensinTolParkirUmum />} />
          <Route path="/isi-daftar-akun/perbaikan-pemeliharaan" element={<PerbaikanPemeliharaan />} />
          <Route path="/isi-daftar-akun/perjalanan-dinas-umum" element={<PerjalananDinasUmum />} />
          <Route path="/isi-daftar-akun/makanan" element={<Makanan />} />
          <Route path="/isi-daftar-akun/komunikasi-umum" element={<KomunikasiUmum />} />
          <Route path="/isi-daftar-akun/iuran-langganan" element={<IuranLangganan />} />
          <Route path="/isi-daftar-akun/asuransi" element={<Asuransi />} />
          <Route path="/isi-daftar-akun/legal-profesional" element={<LegalProfesional />} />
          <Route path="/isi-daftar-akun/beban-manfaat-karyawan" element={<BebanManfaatKaryawan />} />
          <Route path="/isi-daftar-akun/sarana-kantor" element={<SaranaKantor />} />
          <Route path="/isi-daftar-akun/pelatihan-pengembangan" element={<PelatihanPengembangan />} />
          <Route path="/isi-daftar-akun/beban-piutang-tak-tertagih" element={<BebanPiutangTakTertagih />} />
          <Route path="/isi-daftar-akun/pajak-perizinan" element={<PajakPerizinan />} />
          <Route path="/isi-daftar-akun/denda" element={<Denda />} />
          <Route path="/isi-daftar-akun/pengeluaran-barang-rusak" element={<PengeluaranBarangRusak />} />
          <Route path="/isi-daftar-akun/beban-kantor" element={<BebanKantor />} />
          <Route path="/isi-daftar-akun/alat-tulis-kantor-printing" element={<AlatTulisKantorPrinting />} />
          <Route path="/isi-daftar-akun/bea-materai" element={<BeaMaterai />} />
          <Route path="/isi-daftar-akun/keamanan-kebersihan" element={<KeamananKebersihan />} />
          <Route path="/isi-daftar-akun/supplies-material" element={<SuppliesMaterial />} />
          <Route path="/isi-daftar-akun/pemborong" element={<Pemborong />} />
          <Route path="/isi-daftar-akun/biaya-sewa-bangunan" element={<BiayaSewaBangunan />} />
          <Route path="/isi-daftar-akun/biaya-sewa-kendaraan" element={<BiayaSewaKendaraan />} />
          <Route path="/isi-daftar-akun/biaya-sewa-operasional" element={<BiayaSewaOperasional />} />
          <Route path="/isi-daftar-akun/biaya-sewa-lain-lain" element={<BiayaSewaLainLain />} />
          <Route path="/isi-daftar-akun/penyusutan-bangunan" element={<PenyusutanBangunan />} />
          <Route path="/isi-daftar-akun/penyusutan-perbaikan-bangunan" element={<PenyusutanPerbaikanBangunan />} />
          <Route path="/isi-daftar-akun/penyusutan-kendaraan" element={<PenyusutanKendaraan />} />
          <Route path="/isi-daftar-akun/penyusutan-mesin-peralatan" element={<PenyusutanMesinPeralatan />} />
          <Route path="/isi-daftar-akun/penyusutan-peralatan-kantor" element={<PenyusutanPeralatanKantor />} />
          <Route path="/isi-daftar-akun/penyusutan-aset-sewa-guna-usaha" element={<PenyusutanAsetSewaGunaUsaha />} />
          <Route path="/isi-daftar-akun/pendapatan-bunga-bank" element={<PendapatanBungaBank />} />
          <Route path="/isi-daftar-akun/pendapatan-bunga-deposito" element={<PendapatanBungaDeposito />} />
          <Route path="/isi-daftar-akun/pendapatan-lain-lain" element={<PendapatanLainLain />} />
          <Route path="/isi-daftar-akun/beban-bunga" element={<BebanBunga />} />
          <Route path="/isi-daftar-akun/beban-lain-lain" element={<BebanLainLain />} />
          <Route path="/isi-daftar-akun/beban-pajak-kini" element={<BebanPajakKini />} />
          <Route path="/isi-daftar-akun/beban-pajak-tangguhan" element={<BebanPajakTangguhan />} />
          <Route path="/isi-daftar-akun/laba-rugi-pelepasan-aset-tetap" element={<LabaRugiPelepasanAsetTetap />} />
          <Route path="/isi-daftar-akun/penyesuaian-persediaan" element={<PenyesuaianPersediaan />} />
          <Route path="/isi-daftar-akun/provisi" element={<Provisi />} />
          /* Kontak */
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/main-contact/profil-kontak/:id" element={<ProfilKontak/>} />
          <Route path="/main-contact/profil-kontak" element={<ProfilKontak />} />
          <Route path="/main-contact/buat-kontak" element={<BuatKontak />} />
          <Route path="/main-contact/ubah-kontak" element={<UbahKontak />} />
          /* Produk */
          <Route path="/main-product/products" element={<ProductsMain />} />
          <Route path="/main-product/buat-produk" element={<BuatProduk />} />
          <Route path="/main-product/tambah-gudang" element={<TambahGudang />} />
          <Route path="/main-product/penyesuaian-stok" element={<PenyesuaianStok />} />
          <Route path="/main-product/transfer-gudang" element={<TransferGudang />} />
          <Route path="/main-product/aturan-harga" element={<AturanHarga />} />
          <Route path="/main-product/profil-produk/:id" element={<ProfilProduk />} />
          <Route path="/main-product/profil-produk" element={<ProfilProduk />} />
          <Route path="/main-product/ubah-produk" element={<UbahProduk />} />
          /* Penjualan */
          <Route path="/penjualan" element={<PenjualanPage />} />
          <Route path="/penjualan/create" element={<CreateInvoice />} />
          <Route path="/penjualan/create-sales-order" element={<CreateSalesOrderPage />} />
          <Route path="/penjualan/create-sales-quote" element={<CreateSalesQuotePage />} />
          /* Pembelian */
          <Route path="/pembelian" element={<PembelianPage />} />
          <Route path="/pembelian/faktur/create" element={<CreatePurchaseInvoice />} />
          <Route path="/pembelian/tukar-faktur/create" element={<CreatePurchaseExchange />} />
          <Route path="/pembelian/pesanan/create" element={<CreatePurchaseOrderPage />} />
          <Route path="/pembelian/penawaran/create" element={<CreatePurchaseQuotePage />} />
          <Route path="/pembelian/permintaan/create" element={<CreatePurchaseRequestPage />} />
          /* Beranda */
          <Route path="/kas-bank" element={<KasBankPage />} />
          <Route path="/biaya" element={<BiayaPage />} />
          <Route path="/daftar-lainnya" element={<DaftarLainnya />} />
          <Route path="/units" element={<UnitsPage />} />
          <Route path="/audits" element={<AuditsPage />} />
          <Route path="/inventory-recalculation" element={<InventoryRecalculationPage />} />
          <Route path="/attachments" element={<AttachmentsPage />} />
          <Route path="/importexport" element={<ImportExportPage />} />
          <Route path="/pajak" element={<Pajak />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/cara-pembayaran" element={<CaraPembayaran />} />
          <Route path="/syarat-pembayaran" element={<SyaratPembayaran />} />
          <Route path="/buat-pajak-baru" element={<BuatPajakBaru />} />
          <Route path="/edit-pajak" element={<EditPajak />} />
          <Route path="/data-migrasi" element={<DataMigrasi />} />
          <Route path="/pengaturan-perusahaan" element={<PengaturanPerusahaan />} />
          <Route path="/master-data/akun" element={<MasterData1 />} />
          <Route path="/master-data/produk" element={<MasterData2 />} />
          <Route path="/master-data/kontak" element={<MasterData3 />} />
          <Route path="/transaksi/data-penjualan" element={<Transaksi1 />} />
          <Route path="/transaksi/data-pembelian" element={<Transaksi2 />} />
          <Route path="/transaksi/biaya" element={<Transaksi3 />} />
          <Route path="/atur-saldo-coa" element={<AturSaldoCoa />} />
          <Route path="/beranda" element={<Beranda  />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/leads/archived" element={<ArchivedLeadsPage />} />
          <Route path="/pipeline" element={<PipelinePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/leads/:id" element={<LeadDetailPage />} />
          <Route path="/broadcasts" element={<BroadcastPage />} />
          <Route path="/broadcasts/history" element={<BroadcastHistoryPage />} />
          <Route path="/settings/*" element={<SettingsPage />} />
          <Route path="/fulfillment" element={<FulfillmentPage />} />
          <Route path="/productions" element={<ProductionsMainPage />} />
          <Route path="/daftar-akun" element={<DaftarAkunPage />} />
          <Route path="/tutup-buku" element={<TutupBukuPage />} />
          <Route path="/jurnal-umum" element={<JurnalUmumPage />} />
          <Route path="/aset" element={<AsetPage />} />
          <Route path="/aset/simpan" element={<SimpanAsetPage />} />
          <Route path="/laporan" element={<Laporan />} />
          <Route path="/anggaran" element={<Anggaran />} />
          <Route path="/anggaran/rincian-anggaran" element={<RincianAnggaran />} />
          <Route path="/laporan/neraca" element={<Neraca />} />
          <Route path="/laporan/laba-rugi" element={<LabaRugi />} />
          <Route path="/laporan/arus-kas" element={<ArusKas />} />
          <Route path="/laporan/perubahan-modal" element={<PerubahanModal />} />
          <Route path="/laporan/buku-besar" element={<BukuBesar />} />
          <Route path="/laporan/jurnal" element={<Jurnal />} />
          <Route path="/laporan/neraca-saldo" element={<NeracaSaldo />} />
          <Route path="/laporan/ringkasan-bisnis" element={<RingkasanBisnis />} />
          <Route path="/laporan/manajemen-anggaran" element={<Anggaran />} />
          <Route path="/laporan/daftar-penjualan" element={<DaftarPenjualan />} />
          <Route path="/laporan/piutang-pelanggan" element={<PiutangPelanggan />} />
          <Route path="/laporan/pengiriman-penjualan" element={<PengirimanPenjualan />} />
          <Route path="/laporan/penjualan-per-pelanggan" element={<PenjualanPerPelanggan />} />
          <Route path="/laporan/penjualan-per-produk" element={<PenjualanPerProduk />} />
          <Route path="/laporan/penyelesaian-pesanan-penjualan" element={<PenyelesaianPesananPenjualan />} />
          <Route path="/laporan/profitabilitas-produk" element={<ProfitabilitasProduk />} />
          <Route path="/laporan/usia-piutang" element={<UsiaPiutang />} />
          <Route path="/laporan/daftar-faktur-proforma" element={<DaftarFakturProforma />} />
          <Route path="/laporan/daftar-tukar-faktur" element={<DaftarTukarFaktur />} />
          <Route path="/laporan/daftar-pembelian" element={<DaftarPembelian />} />
          <Route path="/laporan/pembelian-per-supplier" element={<PembelianPerSupplier />} />
          <Route path="/laporan/utang-supplier" element={<UtangSupplier />} />
          <Route path="/laporan/daftar-pengeluaran" element={<DaftarPengeluaran />} />
          <Route path="/laporan/detail-pengeluaran" element={<DetailPengeluaran />} />
          <Route path="/laporan/usia-utang" element={<UsiaUtang />} />
          <Route path="/laporan/pengiriman-pembelian" element={<PengirimanPembelian />} />
          <Route path="/laporan/pembelian-per-produk" element={<PembelianPerProduk />} />
          <Route path="/laporan/penyelesaian-pesanan-pembelian" element={<PenyelesaianPesananPembelian />} />
          <Route path="/laporan/tingkat-pemenuhan-pesanan" element={<TingkatPemenuhanPesanan />} />
          <Route path="/laporan/perputaran-persediaan-barang" element={<PerputaranPersediaanBarang />} />
          <Route path="/laporan/ringkasan-persediaan-barang" element={<RingkasanPersediaanBarang />} />
          <Route path="/laporan/kuantitas-stok-gudang" element={<KuantitasStokGudang />} />
          <Route path="/laporan/nilai-persediaan-barang" element={<NilaiPersediaanBarang />} />
          <Route path="/laporan/nilai-stok-gudang" element={<NilaiStokGudang />} />
          <Route path="/laporan/detail-persediaan-barang" element={<DetailPersediaanBarang />} />
          <Route path="/laporan/pergerakan-barang-gudang" element={<PergerakanBarangGudang />} />
          <Route path="/laporan/kuantitas-produk-no-seri" element={<KuantitasProdukNomorSeri />} />
          <Route path="/laporan/gudang-produk-bernomor-seri" element={<GudangProdukBernomorSeri />} />
          <Route path="/laporan/ringkasan-aset-tetap" element={<RingkasanAsetTetap />} />
          <Route path="/laporan/detail-aset-tetap" element={<DetailAsetTetap />} />
          <Route path="/laporan/penjualan-pelepasan-aset" element={<LaporanPenjualanPelepasanAset />} />
          <Route path="/laporan/ringkasan-rekonsiliasi-bank" element={<RingkasanRekonsiliasi />} />
          <Route path="/laporan/mutasi-rekening-koran" element={<MutasiRekeningKoran />} />
          <Route path="/laporan/pajak-pemotongan" element={<LaporanPajakPemotongan />} />
          <Route path="/laporan/pajak-penjualan" element={<LaporanPajakPenjualan />} />
          <Route path="/laporan/:reportId" element={<PembelianPerProduk />} />       
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;