"""
Submits Read Meter URLs to IndexNow API (Bing, Yandex, Seznam, Naver)
"""
import urllib.request
import urllib.error
import json

KEY = "5a3b9e8c4d1f2a7b8e9c0d1e2f3a4b5c"
HOST = "www.readmeter.online"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"

URL_LIST = [
    f"https://{HOST}/",
    f"https://{HOST}/protected-slab-calculator",
    f"https://{HOST}/tools",
    f"https://{HOST}/tools/sub-meter-bill-calculator",
    f"https://{HOST}/tools/solar-net-metering-calculator",
    f"https://{HOST}/tools/car-oil-change-calculator",
    f"https://{HOST}/tools/battery-backup-calculator",
    f"https://{HOST}/tools/ev-charging-cost-calculator",
    f"https://{HOST}/tools/read-digital-lcd-meter",
    f"https://{HOST}/tools/read-analog-dial-meter",
    f"https://{HOST}/tools/read-gas-meter",
    f"https://{HOST}/tools/read-water-meter",
    f"https://{HOST}/tools/landlord-submeter-splitter",
    f"https://{HOST}/tools/appliance-power-cost-calculator",
    f"https://{HOST}/tools/ac-electricity-cost-calculator",
    f"https://{HOST}/tools/solar-system-sizing-calculator",
    f"https://{HOST}/tools/generator-fuel-cost-calculator",
    f"https://{HOST}/tools/lpg-cylinder-calculator",
    f"https://{HOST}/tools/water-pump-electricity-calculator",
    f"https://{HOST}/blog",
    f"https://{HOST}/blog/water-pump-motor-electricity-units-consumption-pakistan-2026",
    f"https://{HOST}/blog/how-to-read-water-meter-dials-leak-detection-guide-2026",
    f"https://{HOST}/blog/october-2026-electricity-bill-saving-hacks-pakistan",
    f"https://{HOST}/blog/nepra-200-units-protected-slab-6-month-rule-pakistan",
    f"https://{HOST}/blog/inverter-ac-electricity-units-consumption-pakistan",
    f"https://{HOST}/blog/kelectric-peak-hours-timings-bill-saving-guide",
    f"https://{HOST}/blog/landlord-tenant-submeter-billing-calculation-formula",
    f"https://{HOST}/blog/kelectric-wapda-protected-slab-bill-double-formula-2026",
    f"https://{HOST}/blog/solar-net-metering-units-calculation-pakistan-2026",
    f"https://{HOST}/blog/gas-geyser-vs-electric-geyser-bill-consumption-pakistan-2026",
    f"https://{HOST}/blog/how-to-read-analog-dial-digital-electric-meters-kwh-guide",
    f"https://{HOST}/blog/ups-inverter-battery-backup-time-calculation-formula-pakistan-2026",
    f"https://{HOST}/blog/electric-bike-car-charging-cost-units-pakistan-2026",
    f"https://{HOST}/blog/single-phase-vs-3-phase-meter-charges-tariff-pakistan-2026",
    f"https://{HOST}/blog/refrigerator-deep-freezer-electricity-consumption-pakistan-2026",
    f"https://{HOST}/blog/solar-system-sizing-inverter-capacity-guide-pakistan-2026",
    f"https://{HOST}/blog/washing-machine-dryer-electricity-consumption-pakistan-2026",
    f"https://{HOST}/blog/how-to-split-electric-utility-bills-fairly-between-tenants-submeter-guide-2026",
    f"https://{HOST}/guest",
    f"https://{HOST}/about",
    f"https://{HOST}/disclaimer"
]

payload = {
    "host": HOST,
    "key": KEY,
    "keyLocation": KEY_LOCATION,
    "urlList": URL_LIST
}

req = urllib.request.Request(
    "https://api.indexnow.org/indexnow",
    data=json.dumps(payload).encode('utf-8'),
    headers={"Content-Type": "application/json; charset=utf-8"}
)

try:
    with urllib.request.urlopen(req, timeout=10) as response:
        print(f"IndexNow Response Status: {response.status} (Success - URLs submitted for immediate crawl)")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code} - {e.read().decode('utf-8')}")
except Exception as e:
    print(f"Error submitting to IndexNow: {e}")
