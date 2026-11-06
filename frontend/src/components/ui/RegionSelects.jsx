import { useEffect, useState } from "react";
import { formLabel, selectBase } from "@/components/ui/styles";
import provinsiData from "@/data/provinsi.json";
import kotaData from "@/data/kabupaten_kota.json";

let kecamatanCache = null;
const kelurahanCache = {};

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-[7px]">
      <label className={formLabel}>{label}</label>
      {children}
    </div>
  );
}

function Select({ value, onChange, disabled, loading, placeholder, options, optionValueKey }) {
  return (
    <select
      className={selectBase}
      value={value}
      disabled={disabled || loading}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{loading ? "Memuat..." : placeholder}</option>
      {options.map((option) => (
        <option key={option.id} value={option[optionValueKey]}>
          {option.name}
        </option>
      ))}
    </select>
  );
}

export default function RegionSelects({
  value,
  onChange,
  disabled = false,
  fields = ["province", "city", "district", "village"],
}) {
  const province = value.province || "";
  const city = value.city || "";
  const district = value.district || "";
  const village = value.village || "";

  const [kecamatan, setKecamatan] = useState(kecamatanCache || []);
  const [kelurahan, setKelurahan] = useState([]);
  const [loadingKec, setLoadingKec] = useState(false);
  const [loadingKel, setLoadingKel] = useState(false);

  const provId = province
    ? provinsiData.find((p) => p.name === province)?.id || ""
    : "";
  const cityId = city
    ? kotaData.find((k) => k.name === city && k.provinceId === provId)?.id || ""
    : "";
  const districtId = district
    ? kecamatan.find((k) => k.name === district && k.cityId === cityId)?.id || ""
    : "";

  useEffect(() => {
    if (kecamatanCache) {
      setKecamatan(kecamatanCache);
      return;
    }

    let alive = true;
    setLoadingKec(true);
    fetch("/data/kecamatan.json")
      .then((r) => r.json())
      .then((data) => {
        kecamatanCache = data;
        if (alive) setKecamatan(data);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoadingKec(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!provId) {
      setKelurahan([]);
      return;
    }

    if (kelurahanCache[provId]) {
      setKelurahan(kelurahanCache[provId]);
      return;
    }

    let alive = true;
    setLoadingKel(true);
    fetch(`/data/kelurahan/${provId}.json`)
      .then((r) => r.json())
      .then((data) => {
        kelurahanCache[provId] = data;
        if (alive) setKelurahan(data);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoadingKel(false);
      });

    return () => {
      alive = false;
    };
  }, [provId]);

  const kotaOptions = kotaData.filter((k) => k.provinceId === provId);
  const kecOptions = kecamatan.filter((k) => k.cityId === cityId);
  const kelOptions = kelurahan.filter((k) => k.districtId === districtId);

  const setProvince = (name) =>
    onChange({ province: name, city: "", district: "", village: "" });
  const setCity = (name) => onChange({ city: name, district: "", village: "" });
  const setDistrict = (name) => onChange({ district: name, village: "" });
  const setVillage = (name) => onChange({ village: name });

  const allFields = [
    fields.includes("province") && (
      <Field key="province" label="Provinsi">
        <Select
          value={province}
          onChange={setProvince}
          disabled={disabled}
          loading={false}
          placeholder="Pilih provinsi"
          options={provinsiData}
          optionValueKey="name"
        />
      </Field>
    ),
    fields.includes("city") && (
      <Field key="city" label="Kota/Kabupaten">
        <Select
          value={city}
          onChange={setCity}
          disabled={disabled || !province}
          loading={false}
          placeholder="Pilih kota/kabupaten"
          options={kotaOptions}
          optionValueKey="name"
        />
      </Field>
    ),
    fields.includes("district") && (
      <Field key="district" label="Kecamatan">
        <Select
          value={district}
          onChange={setDistrict}
          disabled={disabled || !city}
          loading={loadingKec}
          placeholder="Pilih kecamatan"
          options={kecOptions}
          optionValueKey="name"
        />
      </Field>
    ),
    fields.includes("village") && (
      <Field key="village" label="Kelurahan/Desa">
        <Select
          value={village}
          onChange={setVillage}
          disabled={disabled || !district}
          loading={loadingKel}
          placeholder="Pilih kelurahan/desa"
          options={kelOptions}
          optionValueKey="name"
        />
      </Field>
    ),
  ].filter(Boolean);

  return <>{allFields}</>;
}
