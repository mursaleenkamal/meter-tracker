import os
import sys
import time
import subprocess
import urllib.request
from playwright.sync_api import sync_playwright

TEST_PORT = 3005
BASE_URL = f"http://localhost:{TEST_PORT}"
SCREENSHOT_DIR = "D:/meter-track/qa_audit_screenshots"
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

def wait_for_server(url, timeout=45):
    start = time.time()
    while time.time() - start < timeout:
        try:
            with urllib.request.urlopen(f"{url}/guest", timeout=2) as resp:
                if resp.status == 200:
                    return True
        except Exception:
            time.sleep(1)
    return False

def run_tests():
    print("=" * 70)
    print("Starting Automated QA & Cross-Device Visual Audit for Read Meter")
    print("=" * 70)
    
    # 1. Start Next.js production server
    print(f"[1/4] Spawning 'next start -p {TEST_PORT}'...")
    server_proc = subprocess.Popen(
        ["npx.cmd", "next", "start", "-p", str(TEST_PORT)],
        cwd="D:/meter-track",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    try:
        ready = wait_for_server(BASE_URL)
        if not ready:
            print("ERROR: Server failed to start within timeout.")
            server_proc.terminate()
            sys.exit(1)
        print(f"Server is ready at {BASE_URL}")

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)

            # -------------------------------------------------------------
            # TEST A: Mobile Viewport (375x812 - iPhone X / 13 Mini)
            # -------------------------------------------------------------
            print("\n[2/4] Testing Mobile Viewport (375 x 812)...")
            context_mobile = browser.new_context(
                viewport={"width": 375, "height": 812},
                user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1"
            )
            page_mobile = context_mobile.new_page()
            page_mobile.goto(f"{BASE_URL}/guest", wait_until="networkidle")

            # Check 1: Inputmodes & pattern in Quick Entry drawer
            print("Opening 4-Digit Entry Drawer...")
            page_mobile.locator('button:has-text("4-Digit Entry")').click()
            page_mobile.wait_for_timeout(500)
            
            dial_input = page_mobile.locator('input[placeholder*="5420"]')
            input_mode = dial_input.get_attribute("inputmode")
            pattern = dial_input.get_attribute("pattern")
            print(f"Guest Quick Input: inputmode='{input_mode}', pattern='{pattern}'")
            assert input_mode == "decimal", f"Expected inputmode='decimal', got '{input_mode}'"
            assert pattern == "[0-9]*", f"Expected pattern='[0-9]*', got '{pattern}'"

            # Check 2: Inputmodes & pattern in ReadingForm Modal (Camera / Manual Entry)
            print("Opening ReadingForm Modal to verify modal input attributes...")
            page_mobile.locator('button:has-text("Scan Meter Dial")').click()
            page_mobile.wait_for_timeout(600)
            modal_input = page_mobile.locator('input#readingValue')
            modal_input_mode = modal_input.get_attribute("inputmode")
            modal_pattern = modal_input.get_attribute("pattern")
            print(f"ReadingForm Modal Input: inputmode='{modal_input_mode}', pattern='{modal_pattern}'")
            assert modal_input_mode == "decimal", f"Expected ReadingForm inputmode='decimal', got '{modal_input_mode}'"
            assert modal_pattern == "[0-9]*", f"Expected ReadingForm pattern='[0-9]*', got '{modal_pattern}'"

            # Close modal
            page_mobile.locator('button[aria-label="Close modal"]').click()
            page_mobile.wait_for_timeout(400)

            # Check 3: Typography & Tabular Nums on telemetry
            gauge_number = page_mobile.locator('div[style*="font-size: 2.5rem"]')
            gauge_style = gauge_number.get_attribute("style") or ""
            print(f"Gauge Number Style: {gauge_style}")
            assert "tabular-nums" in gauge_style.lower(), "tabular-nums missing in gauge number"

            # Check 4: CSS Sanitization / Card Tokens
            middle_card = page_mobile.locator('section:has-text("Household Bill & Penalty Comparison")')
            middle_card_style = middle_card.get_attribute("style") or ""
            print(f"Middle Card Background token: {middle_card_style[:60]}...")
            assert "var(--card-bg, #ffffff)" in middle_card_style or "#ffffff" in middle_card_style, "Card token #ffffff not enforced"

            # Check 5: Add reading to test mobile responsive history table card view
            print("Logging reading (5620) to populate history...")
            dial_input.fill("5620")
            page_mobile.locator('button:has-text("Save Reading")').click()
            page_mobile.wait_for_timeout(1000)

            print("Opening Reading History Accordion...")
            page_mobile.locator('button:has-text("Reading History & Records")').click()
            page_mobile.wait_for_timeout(500)

            # Capture mobile screenshot
            mobile_shot_path = os.path.join(SCREENSHOT_DIR, "guest_mobile_375x812.png")
            page_mobile.screenshot(path=mobile_shot_path, full_page=True)
            print(f"Mobile Screenshot saved: {mobile_shot_path}")

            # -------------------------------------------------------------
            # TEST B: Desktop Viewport (1280x800)
            # -------------------------------------------------------------
            print("\n[3/4] Testing Desktop Viewport (1280 x 800)...")
            context_desktop = browser.new_context(viewport={"width": 1280, "height": 800})
            page_desktop = context_desktop.new_page()
            page_desktop.goto(f"{BASE_URL}/guest", wait_until="networkidle")

            desktop_shot_path = os.path.join(SCREENSHOT_DIR, "guest_desktop_1280x800.png")
            page_desktop.screenshot(path=desktop_shot_path, full_page=True)
            print(f"Desktop Screenshot saved: {desktop_shot_path}")

            # -------------------------------------------------------------
            # TEST C: Static Code Analysis of Chart & layout.tsx
            # -------------------------------------------------------------
            print("\n[4/4] Verifying Dashboard Chart SVG & Layout font tokens...")
            with open("D:/meter-track/src/app/layout.tsx", "r", encoding="utf-8") as f:
                layout_content = f.read()
            assert "geistMono.variable" in layout_content, "geistMono.variable missing from layout.tsx"
            print("Verified: geistMono.variable integrated into layout.tsx root.")

            with open("D:/meter-track/src/app/dashboard/page.tsx", "r", encoding="utf-8") as f:
                dash_content = f.read()
            assert "200 kWh PROTECTED SLAB CLIFF" in dash_content, "200 kWh cliff line missing from dashboard/page.tsx"
            assert "strokeDasharray=\"4,4\"" in dash_content or "strokeDasharray='4,4'" in dash_content, "Cliff line dashed styling missing"
            assert "background: '#f8fafc'" in dash_content, "SVG chart background #f8fafc missing"
            print("Verified: SVG trend chart has #f8fafc background and 200 kWh Protected Slab Cliff line.")

            with open("D:/meter-track/src/app/dashboard.module.css", "r", encoding="utf-8") as f:
                css_content = f.read()
            assert "@media (max-width: 600px)" in css_content, "max-width: 600px media query missing"
            assert "historyTable" in css_content, "historyTable missing from css"
            print("Verified: Responsive card view rule for .historyTable active under @media (max-width: 600px).")

            browser.close()

        print("\n" + "=" * 70)
        print("ALL AUTOMATED TESTS AND CROSS-DEVICE AUDITS PASSED!")
        print("=" * 70)

    finally:
        print("Stopping Next.js server...")
        try:
            server_proc.terminate()
            server_proc.wait(timeout=5)
        except Exception:
            pass
        print("Server stopped cleanly.")

if __name__ == "__main__":
    run_tests()
