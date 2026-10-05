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
    f"https://{HOST}/blog",
    f"https://{HOST}/blog/inverter-ac-electricity-units-consumption-pakistan",
    f"https://{HOST}/blog/kelectric-peak-hours-timings-bill-saving-guide",
    f"https://{HOST}/blog/landlord-tenant-submeter-billing-calculation-formula",
    f"https://{HOST}/guest"
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
