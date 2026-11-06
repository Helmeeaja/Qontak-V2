import glob
import json
import os
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from qontak_sales.apps.regions.models import City, District, Province, Village

COMMAND_DIR = Path(__file__).resolve().parent
PROJECT_DIR = Path(settings.BASE_DIR)
REFERENCE_DIR = PROJECT_DIR.parent.parent / "QontakSales"


def first_existing(*paths):
    for path in paths:
        if path and Path(path).exists():
            return Path(path)
    return None


class Command(BaseCommand):
    help = "Isi data wilayah Indonesia (provinsi, kota/kab, kecamatan, kelurahan) + kode pos"

    def add_arguments(self, parser):
        parser.add_argument(
            "--kodepos",
            type=str,
            default=str(COMMAND_DIR / "kodepos.json"),
            help="Path file JSON mapping kode wilayah level 4 -> kode pos",
        )
        parser.add_argument(
            "--kecamatan",
            type=str,
            default="",
            help="Path file kecamatan.json (default: cari di project ini atau QontakSales)",
        )
        parser.add_argument(
            "--kelurahan-dir",
            type=str,
            default="",
            help="Folder berisi file kelurahan/*.json (default: cari di project ini atau QontakSales)",
        )

    @transaction.atomic
    def handle(self, *args, **kwargs):
        fe_src = first_existing(
            PROJECT_DIR.parent / "frontend" / "src" / "data",
            REFERENCE_DIR / "frontend" / "src" / "data",
        )
        fe_public = first_existing(
            PROJECT_DIR.parent / "frontend" / "public" / "data",
            REFERENCE_DIR / "frontend" / "public" / "data",
        )

        provinsi_path = first_existing(fe_src / "provinsi.json") if fe_src else None
        kota_path = first_existing(fe_src / "kabupaten_kota.json") if fe_src else None
        kecamatan_path = first_existing(
            kwargs["kecamatan"], fe_public / "kecamatan.json" if fe_public else None
        )
        kelurahan_dir = first_existing(
            kwargs["kelurahan_dir"], fe_public / "kelurahan" if fe_public else None
        )

        missing = [
            label
            for label, path in [
                ("provinsi.json", provinsi_path),
                ("kabupaten_kota.json", kota_path),
                ("kecamatan.json", kecamatan_path),
                ("folder kelurahan", kelurahan_dir),
            ]
            if path is None
        ]
        if missing:
            raise CommandError(
                "Data wilayah tidak ditemukan: " + ", ".join(missing)
            )

        provinsi = json.loads(provinsi_path.read_text(encoding="utf-8"))
        kota = json.loads(kota_path.read_text(encoding="utf-8"))
        kecamatan = json.loads(kecamatan_path.read_text(encoding="utf-8"))

        kelurahan = []
        for file_path in sorted(glob.glob(os.path.join(kelurahan_dir, "*.json"))):
            kelurahan += json.loads(Path(file_path).read_text(encoding="utf-8"))

        kodepos_path = Path(kwargs["kodepos"])
        kodepos = {}
        if kodepos_path.exists():
            kodepos = json.loads(kodepos_path.read_text(encoding="utf-8"))
            self.stdout.write(f"Loaded {len(kodepos)} kode pos dari {kodepos_path}")
        else:
            self.stdout.write(
                self.style.WARNING(
                    f"File kode pos tidak ditemukan: {kodepos_path}. "
                    "Data tetap diimpor tanpa kode pos."
                )
            )

        prov_map = {}
        for p in provinsi:
            obj, _ = Province.objects.get_or_create(
                code=p["id"], defaults={"name": p["name"]}
            )
            prov_map[p["id"]] = obj
        self.stdout.write(f"Provinsi: {len(prov_map)}")

        city_map = {}
        for k in kota:
            obj, _ = City.objects.get_or_create(
                code=k["id"],
                defaults={
                    "name": k["name"],
                    "province": prov_map[k["provinceId"]],
                },
            )
            city_map[k["id"]] = obj
        self.stdout.write(f"Kota/Kabupaten: {len(city_map)}")

        dist_map = {}
        for c in kecamatan:
            obj, _ = District.objects.get_or_create(
                code=c["id"],
                defaults={"name": c["name"], "city": city_map[c["cityId"]]},
            )
            dist_map[c["id"]] = obj
        self.stdout.write(f"Kecamatan: {len(dist_map)}")

        existing = dict(Village.objects.values_list("code", "id"))
        without_postal = set(
            Village.objects.filter(postal_code="").values_list("code", flat=True)
        )
        batch = []
        postal_updates = []
        for v in kelurahan:
            if v["id"] in existing:
                postal_code = kodepos.get(v["id"], "")
                if postal_code and v["id"] in without_postal:
                    postal_updates.append(
                        Village(id=existing[v["id"]], postal_code=postal_code)
                    )
                continue
            batch.append(
                Village(
                    code=v["id"],
                    name=v["name"],
                    district=dist_map[v["districtId"]],
                    postal_code=kodepos.get(v["id"], ""),
                )
            )
            if len(batch) >= 2000:
                Village.objects.bulk_create(batch)
                self.stdout.write(f"  kelurahan terimport: {Village.objects.count()}")
                batch = []
        if batch:
            Village.objects.bulk_create(batch)
        if postal_updates:
            Village.objects.bulk_update(postal_updates, ["postal_code"], batch_size=2000)
            self.stdout.write(f"  kode pos diperbarui: {len(postal_updates)}")

        total = Village.objects.count()
        with_kodepos = Village.objects.exclude(postal_code="").count()
        self.stdout.write(
            self.style.SUCCESS(
                f"Selesai. Total kelurahan/desa: {total}, "
                f"memiliki kode pos: {with_kodepos}, "
                f"tanpa kode pos: {total - with_kodepos}."
            )
        )
