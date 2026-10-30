import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const BASE_DIR = 'D:/meter-track'
const envPath = path.join(BASE_DIR, '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim()
const supabaseKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim() || 
                    envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim()

const supabase = createClient(supabaseUrl, supabaseKey)

const post = {
  slug: 'how-to-split-electric-utility-bills-fairly-between-tenants-submeter-guide-2026',
  title: 'How to Split Electric Utility Bills Fairly Between Tenants: The Complete Sub-Meter & Blended Rate Guide (2026)',
  excerpt: 'A comprehensive mathematical guide for landlords and shared-property tenants on how to split electric bills accurately using sub-meters. Eliminate arguments over tier jumps, fixed taxes, fuel adjustments, and shared water pumps with verifiable calculation formulas.',
  category: 'Sub-metering',
  author: 'Read Meter Global Utility Research',
  read_time: '7 min read',
  tags: [
    'Sub-Meter Bill Split',
    'Tenant Utility Calculator',
    'Landlord Electricity Division',
    'Blended Tariff Rate',
    'Shared Utility Bills',
    'Read Meter PWA'
  ],
  content: `## Why Splitting Electric Bills Causes Endless Landlord-Tenant Disputes

Splitting a single master electricity bill between multiple residential portions, flatmates, or commercial tenants is one of the most common friction points in property management worldwide.

Most disputes stem from three fundamental flaws in conventional bill division:

1. **The "Flat Rate" Mistake:** Landlords often pick an arbitrary flat rate (e.g., $0.18 / kWh or Rs 35 / unit). When progressive stepped tariffs, seasonal fuel adjustments, or peak-demand charges hit, either the landlord undercharges and loses hundreds of dollars, or tenants feel cheated.
2. **The Unmetered Common Load:** Shared infrastructure—such as booster water pumps, staircase lighting, outdoor security cameras, and gate motors—is routinely overlooked, leading to unallocated kWh gaps.
3. **Progressive Slab Multipliers:** Under progressive utility tariffs, the total bill does not scale linearly. Crossing higher consumption tiers incurs punitive tax multipliers and surcharge bands.

In this guide, we break down the **Mathematically Fair Blended Rate Method**, step-by-step division formulas for common loads, and how to generate dispute-free, itemized tenant receipts.

---

## 1. The True Blended Rate Formula (The Industry Standard)

To divide a master utility bill with 100% fairness, you must calculate the **Effective Blended Cost Per Unit**. This accounts for progressive slab tiers, base fuel surcharges, regulatory fees, and sales taxes without forcing individual tenants to manually calculate tariff brackets.

### Mathematical Equation:

$$\\text{Blended Rate Per kWh} = \\frac{\\text{Total Invoice Payable (including all taxes & surcharges)}}{\\text{Total kWh Units Recorded on Main Utility Meter}}$$

### Real-World Example:
* **Total Main Utility Bill Payable:** $285.00
* **Total Units on Main Meter:** 950 kWh
* **True Blended Rate:** $285.00 ÷ 950 = **$0.30 per kWh**

Every sub-meter occupant is subsequently charged exactly $0.30 per kWh consumed. If Tenant A consumes 300 units, their baseline share is $90.00. If Tenant B consumes 500 units, their baseline share is $150.00.

---

## 2. Handling Shared Water Motors and Common Hallway Lights

Shared loads must be handled transparently so no single tenant shoulders community infrastructure costs.

### Scenario A: The Common Load Has a Dedicated Sub-Meter
If your booster pump or hallway lighting runs through a separate sub-meter (e.g., recording 100 kWh):
1. **Multiply Common kWh by the Blended Rate:** 100 kWh × $0.30 = $30.00 common bill.
2. **Divide by Number of Portions / Family Size:** For 3 equal portions: $30.00 ÷ 3 = **$10.00 added per portion**.

### Scenario B: Unmetered Residual Common Draw
If all sub-meter sums equal 900 kWh, but the master utility meter shows 950 kWh:
* **Residual Gap:** 950 kWh – 900 kWh = 50 kWh.
* **Cost of Residual Load:** 50 kWh × $0.30 = $15.00.
* **Equitable Allocation:** Allocate this $15.00 equally across all portions ($5.00 each) as verified "Common Building Loss / Unmetered Shared Draw".

---

## 3. Sample Tenant Breakdown & Verifiable Receipt Table

Here is what an audit-proof, transparent tenant utility division looks like:

| Tenant / Portion | Sub-Meter Initial | Sub-Meter Final | Net kWh Used | Blended Unit Rate | Sub-Total | Shared Common Load | Total Tenant Payable |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Ground Floor (Tenant A)** | 1,420 | 1,720 | 300 kWh | $0.30 / kWh | $90.00 | $10.00 | **$100.00** |
| **First Floor (Tenant B)** | 2,150 | 2,650 | 500 kWh | $0.30 / kWh | $150.00 | $10.00 | **$160.00** |
| **Penthouse (Tenant C)** | 880 | 980 | 100 kWh | $0.30 / kWh | $30.00 | $10.00 | **$40.00** |
| **Totals** | — | — | **900 kWh** | — | **$270.00** | **$30.00** | **$300.00** |

---

## 4. Key Rules for Landlords & Property Managers

1. **Fixed Reading Schedule:** Record all sub-meter readings on the exact same date and hour that the utility company meter-reader logs the main meter.
2. **High-Resolution Photo Verification:** Take a clear digital photo of every sub-meter dial or LCD display. Keep digital logs to resolve any discrepancy before rent day.
3. **Avoid Estimation:** Never estimate unit consumption based on past seasons. Weather changes, guest visits, and portable space heaters cause massive month-to-month consumption swings.

---

## 5. Calculate & Generate Receipts in Seconds (100% Free)

Instead of manually calculating complex math on scratch paper or Excel sheets, use our free [Tenant Sub-Meter Bill Divider & Receipt Generator](https://www.readmeter.online/tools/landlord-submeter-splitter).

* **Supports any currency:** USD, GBP, EUR, AED, SAR, PKR, INR.
* **One-Click WhatsApp Receipts:** Generates an itemized breakdown with sub-meter photos, units consumed, and math transparency.
* **Runs 100% in your browser:** Zero login required, private client-side processing, and offline-ready PWA support.`,
  faqs: [
    {
      question: 'What is the fairest way to calculate electric sub-meter unit cost?',
      answer: 'The fairest method is the Blended Unit Rate formula: divide your total utility invoice amount (including taxes, fuel adjustments, and fixed charges) by the total units on the main meter. This applies progressive tariff jumps proportionally to every unit consumed.'
    },
    {
      question: 'How should common booster pump and outdoor lighting costs be split?',
      answer: 'Common loads should either have a dedicated sub-meter or be calculated as the difference between the main meter and the sum of all individual sub-meters, then divided equally or by family headcount across all participating portions.'
    },
    {
      question: 'What happens if sub-meter totals do not match the main utility meter?',
      answer: 'Differences occur due to unmetered shared lighting, standby transformer losses, water motors, or wiring resistance. Read Meter calculates this variance automatically and flags it as shared common load.'
    }
  ],
  status: 'published',
  published_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

async function publishEnglishPillar() {
  console.log('🚀 Publishing Flagship English Pillar Article to Read Meter Supabase...')
  const { data, error } = await supabase
    .from('blog_posts')
    .upsert(post, { onConflict: 'slug' })
    .select()

  if (error) {
    console.error('❌ Supabase Upsert Failed:', error.message)
    process.exit(1)
  }

  console.log('✅ Successfully published to Supabase!')
  console.log(`🔗 Live Article URL: https://www.readmeter.online/blog/${post.slug}`)

  // Ping IndexNow
  try {
    console.log('📡 Pinging IndexNow API for instant search engine indexing...')
    execSync('python scripts/ping_indexnow.py', { cwd: BASE_DIR, stdio: 'inherit' })
  } catch (err) {
    console.log('IndexNow notice:', err.message)
  }
}

publishEnglishPillar()
