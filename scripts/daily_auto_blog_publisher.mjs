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

// Topic Catalog for Daily Automatic SEO Publishing
const TOPIC_POOL = [
  {
    slug: 'refrigerator-deep-freezer-electricity-consumption-pakistan-2026',
    title: 'Fridge Aur Deep Freezer Mahana Kitne Bijli Ke Units Khata Hai? 2026 Inverter vs Conventional Bill Guide',
    excerpt: 'Pakistan mein refrigerator aur deep freezer ke daily aur monthly units (kWh) ka hisab. Normal vs inverter fridge ka mawazna, thermostat settings se bijli bachane ke practical tareeqay, aur K-Electric bill par asar.',
    category: 'Energy Saving',
    author: 'Read Meter Appliance Lab',
    read_time: '5 min read',
    tags: ['Fridge Electricity Consumption', 'Inverter Refrigerator Pakistan', 'Deep Freezer Units', 'Bijli Bachat', 'Read Meter'],
    content: `## Refrigerator Aur Deep Freezer Ka Bijli Ke Bill Mein Kitna Hissa Hota Hai?

Pakistan mein refrigerator aur deep freezer woh wahid gharelu ashya hain jo **24 ghante, 7 din lagatar on rehti hain**. Aksar sarfeen ko lagta hai ke sirf AC bijli khata hai, lekin haqeeqat mein aik purana non-inverter fridge aur deep freezer mil kar **mahana 90 se 160 units** akele jala dete hain!

Agar aapka meter 200 units ki subsidized protected slab ke qareeb hai, to fridge ke yeh extra units aapko Rs 14/unit se nikaal kar **Rs 34+ unprotected slab cliff** par pohncha dete hain.

---

## 1. Purana (Conventional) vs Inverter Refrigerator Units Comparison

| Fridge Type | Daily Run Hours | Average Wattage | Daily Units (kWh) | Mahana Units (30 Din) | Mahana Kharcha (Rs 35/unit) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Purana Non-Inverter (10+ Cu.Ft)** | Compressor 14–16 hrs | 250W – 320W | 3.5 – 4.5 Units | **105 – 135 Units** | **Rs 3,700 – Rs 4,700** |
| **Naya Standard Non-Inverter** | Compressor 10–12 hrs | 180W – 220W | 2.2 – 2.8 Units | **66 – 84 Units** | **Rs 2,300 – Rs 2,900** |
| **Inverter Refrigerator (Tier 1)** | Continuous Variable | 60W – 140W | 1.1 – 1.6 Units | **33 – 48 Units** | **Rs 1,150 – Rs 1,680** |
| **Deep Freezer (Chest Type)** | Compressor 12–15 hrs | 220W – 300W | 2.8 – 3.8 Units | **84 – 114 Units** | **Rs 2,900 – Rs 4,000** |

---

## 2. Inverter Refrigerator Lagane Se Saalana Kitni Bachat Hoti Hai?

Aik purane fridge ko modern inverter fridge se replace karne par mahana taqreeban **65 se 85 units ki direct bachat** hoti hai. 

- **Mahana Bachat:** ~Rs 2,500 se Rs 3,200 PKR  
- **Salana Bachat:** ~Rs 30,000 se Rs 38,000 PKR  
- **Payback Period:** Naye inverter fridge ki qeemat (Rs 90,000 – Rs 120,000) taqreeban **2.5 se 3 saal** mein sirf bijli ki bachat se wapis recover ho jati hai.

---

## 3. Fridge Aur Deep Freezer Se 20–30% Units Bachane Ke 4 Practical Tareeqay

1. **Thermostat Setting (Medium Dial):**  
   Fridge ke thermostat ko maximum '7' ya 'High' par na rakhein. Garmiyon mein dial '3 ya 4' aur sardiyon mein '1 ya 2' par chalana behtareen cooling deta hai aur compressor cut-off barha deta hai.

2. **Rubber Gasket / Seal Test:**  
   Fridge ke darwaze mein kaghaz (paper) rakh kar darwaza band karein. Agar kaghaz aasaani se nikal aaye to seal kharab hai aur thandak bahir nikal rahi hai. Nayi seal lagwane se 15% units bachte hain.

3. **Wall Gap (Air Circulation):**  
   Fridge ko deewar ke bilkul sath chipka kar na rakhein. Peechhe kam az kam 4 se 6 inch ka faasla rakhein taake condenser coils garam na hon aur compressor par load na pare.

4. **Hot Food Mistake:**  
   Garam khana ya ubli hui cheezein foran fridge mein na rakhein. Pehle kamre ke darja hararat (room temperature) par thanda karein.

---

## Conclusion
Apne ghar ke tamam appliances ke units ka exact hisab lagane ke liye hamara [Appliance Power Cost Calculator](https://www.readmeter.online/tools/appliance-power-cost-calculator) istemal karein aur monthly billing slab ko safe zone mein rakhein.`,
    faqs: [
      {
        question: 'Kya inverter fridge UPS ya Solar par chal sakta hai?',
        answer: 'Jee haan! Inverter fridge startup surge nahi leta (soft start technology), is liye yeh aam 1000VA UPS ya 1.5kW solar inverter par aasaani se chal jata hai.'
      },
      {
        question: 'Deep freezer ko rozana kitne ghante chalana kafi hota hai?',
        answer: 'Achi insulation wale deep freezer ko 8 se 10 ghante chalana kaafi hota hai. Subah 8 se shaam 5 baje tak chala kar peak hours (6 PM to 10 PM) mein band rakhne se bill mein 30% bachat hoti hai.'
      }
    ]
  },
  {
    slug: 'solar-system-sizing-inverter-capacity-guide-pakistan-2026',
    title: 'Ghar Ke Liye Solar System Kaise Chunein? 3kW, 5kW Ya 10kW Capacity Sizing Formula 2026',
    excerpt: 'Pakistan mein ghar ke connected load aur ACs ke mutabiq sahi solar panel capacity aur inverter size calculate karne ka formula. On-grid vs hybrid system ka mawazna aur net-metering feasibility.',
    category: 'Energy Saving',
    author: 'Read Meter Engineering Bureau',
    read_time: '6 min read',
    tags: ['Solar Sizing Pakistan', '5kW Solar System', '10kW Solar System', 'Inverter Sizing', 'Read Meter'],
    content: `## Ghar Ke Liye Sahi Solar Capacity Ka Intikhab Kyun Zaroori Hai?

Pakistan mein solar system lagwate waqt aksar log ya to **under-sized** system lagwa lete hain jisse AC chalte hi grid se units girne lagte hain, ya phir **over-sized** system par be-wajah lakhon rupay zaya kar dete hain.

Sahi capacity ka ta-ayyun karne ke liye aapko apne **Summer Peak Load (kW)** aur **Daily Units Burn Rate (kWh)** ko calculate karna zaroori hai.

---

## 1. Household Load vs Recommended Solar System Size

| System Size | Inverter Type | Solar Panels Required | Daily Units Generated | Kya Kya Chala Sakta Hai? |
| :--- | :--- | :--- | :--- | :--- |
| **3.2 kW** | Hybrid / On-grid | 6 x 585W Panels | 12 – 14 Units | 1 Inverter AC (Din mein) + 1 Fridge + Lights/Fans |
| **5.5 kW** | Hybrid / On-grid | 10 x 585W Panels | 20 – 24 Units | 2 Inverter ACs + 1HP Water Pump + Full Home |
| **10 kW** | 3-Phase On-grid | 18 x 585W Panels | 40 – 48 Units | 3–4 ACs + Deep Freezer + Complete Home + Export Units |
| **15 kW** | 3-Phase On-grid | 26 x 585W Panels | 60 – 72 Units | 1 Kanal / Commercial Bungalow with High Net Metering |

---

## 2. Solar System Sizing Ka Practical Formula

$$\\text{Required Panels (kW)} = \\frac{\\text{Average Daily Units Consumption}}{\\text{Peak Sun Hours (4.5)}} \\times 1.25$$

Misaal ke tor par, agar aapka garmiyon ka bijli ka bill mahana **600 units** aata hai:
- Daily Consumption = 600 / 30 = **20 Units / Day**
- Required Solar = (20 / 4.5) * 1.25 = **5.5 kW System**

Aap hamare [Solar System Sizing Calculator](https://www.readmeter.online/tools/solar-system-sizing-calculator) par apna actual load enter karke exact panels aur inverter rating check kar sakte hain.`,
    faqs: [
      {
        question: 'Kya 5kW solar system par 1.5 ton ke do AC chal sakte hain?',
        answer: 'Jee haan! Din ke waqt dhoop mein 5kW system 4200W se 4800W tak live power generate karta hai, jo 2 inverter ACs (approx 1200W each) ko ba-aasaani chala sakta hai.'
      }
    ]
  },
  {
    slug: 'washing-machine-dryer-electricity-consumption-pakistan-2026',
    title: 'Washing Machine Aur Dryer Kitne Bijli Ke Units Khata Hai? 2026 Top Load vs Front Load Bill Guide',
    excerpt: 'Pakistan mein automatic washing machine aur dryer spinner ke electricity units (kWh) ka hisab. Top load vs front load ka farq, water heater option aur bill saving tips.',
    category: 'Energy Saving',
    author: 'Read Meter Appliance Lab',
    read_time: '5 min read',
    tags: ['Washing Machine Units', 'Dryer Electricity Consumption', 'Automatic Washing Machine Pakistan', 'Bijli Bachat', 'Read Meter'],
    content: `## Washing Machine Aur Dryer Ka Bijli Ke Bill Mein Kitna Hissa Hota Hai?

Gharon mein kapre dhone ke liye istemal hone wali automatic aur semi-automatic washing machines aur dryers ka bijli consumption is baat par munhasir hota hai ke machine mein **built-in water heater** on hai ya nahi.

Aam washing cycle sirf motor chalati hai jo ke kam units khati hai, lekin agar built-in heater (hot water wash 40°C - 60°C) chalaya jaye to units 5 guna barh jate hain.

---

## 1. Washing Machine & Dryer Unit Consumption Comparison

| Machine Type | Motor Wattage | Heater Wattage | Cycle Time | Units Per Wash (Cold) | Units Per Wash (Hot Water) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Twin Tub Semi-Automatic** | 350W – 450W | None | 45 Mins | **0.25 – 0.35 Units** | N/A |
| **Top Load Fully Automatic** | 400W – 550W | None (External) | 60 Mins | **0.40 – 0.55 Units** | N/A |
| **Front Load (Cold Wash)** | 250W – 350W | Off | 60 Mins | **0.30 – 0.40 Units** | N/A |
| **Front Load (Hot Wash 60°C)** | 250W | 1800W – 2000W | 90 Mins | N/A | **2.2 – 2.8 Units** |
| **Dedicated Spinner Dryer** | 200W – 300W | None | 10 Mins | **0.05 – 0.08 Units** | N/A |

---

## 2. Mahana Units Aur Bill Ka Hisab (15 Wash Cycles / Month)

- **Cold Water Top/Front Load Wash:** 15 cycles × 0.45 units = **6.75 Units / Month** (~Rs 250 - 300 PKR)
- **Hot Water Cycle (Built-in Heater):** 15 cycles × 2.5 units = **37.5 Units / Month** (~Rs 1,300 - 1,600 PKR)

Agr aapka meter 200 units ki protected limit ke qareeb hai, to heater cycle band rakhne se protected slab mehfooz rehti hai.

---

## 3. Washing Machine Se Units Bachane Ke 3 Tips

1. **Cold Wash Routine:** 90% kapre normal tap water mein saaf ho jate hain. Heater option sirf shadeed daagh ya bedding ke liye use karein.
2. **Full Load Optimization:** Rozana 2-3 kapre dhone ke bajaye haftay mein 2-3 martaba full load run karein.
3. **Avoid Peak Hours:** Sham 5 PM se 10 PM ke doran automatic washing machine na chalayein taake TOU peak slab trigger na ho.

---

## Conclusion
Apne tamam ghar ke appliances ke load aur cost ka hisab lagane ke liye [Appliance Power Cost Calculator](https://www.readmeter.online/tools/appliance-power-cost-calculator) istemal karein.`,
    faqs: [
      {
        question: 'Kya automatic washing machine normal UPS par chal sakti hai?',
        answer: 'Agar machine ka built-in heater off ho to sirf motor 400W-500W leti hai, jo 1000VA UPS par chal sakti hai. Lekin water heater mode 2000W leta hai jo UPS trip kar dega.'
      },
      {
        question: 'Top load behtar hai ya front load electricity ke lehaz se?',
        answer: 'Front load machines motor energy aur paani kam istemal karti hain, jabke top load cycle time chota hone ki wajah se quick wash mein faidamand hoti hai.'
      }
    ]
  },
  {
    slug: 'winter-peak-hours-timings-tariff-pakistan-2026',
    title: 'Sardiyon Mein Peak Hours Timings Aur Tariff Rules 2026: K-Electric, LESCO, IESCO Protected Slab Bachao',
    excerpt: 'Pakistan mein sardiyon ke doran DISCOs ke badalte peak hours timings (5 PM to 9 PM). TOU meters par per unit rate aur geyser/heaters chalane ke bachat tareeqay.',
    category: 'Tariff Guides',
    author: 'Read Meter Regulatory Bureau',
    read_time: '5 min read',
    tags: ['Peak Hours Pakistan', 'Winter Peak Hours Timings', 'TOU Meter Rates', 'K-Electric Peak Hours', 'Read Meter'],
    content: `## Pakistan Mein Sardiyon Ke Peak Hours Timings

Pakistan mein power distribution companies (K-Electric, LESCO, IESCO, FESCO wagera) mausam ke mutabiq peak hours schedule tabdeel karti hain.

Sardiyon ke mahino (December se February) mein sham jaldi hone ki wajah se peak hours **5:00 PM se 9:00 PM** hotay hain (jabke garmiyon mein yeh 6:30 PM / 7:00 PM se 10:30 PM / 11:00 PM hotay hain).

---

## 1. Peak vs Off-Peak Rates Comparison (Time-of-Use 3-Phase Meters)

| Metric | Off-Peak Hours | Peak Hours (5 PM – 9 PM) | Rate Farq |
| :--- | :--- | :--- | :--- |
| **Per Unit Base Rate** | Rs 35 – Rs 39 / kWh | **Rs 48 – Rs 54 / kWh** | +35% to +45% Extra |
| **Taxes & Surcharges** | Standard GST + FPA | Higher Slab Pro-rata | Higher Total Bill |
| **Target Appliances** | Heavy Motors, Iron, Geysers | Strictly Low Load (LEDs, Fans) | High Impact |

---

## 2. Sardiyon Mein Peak Hours Mein Kin Cheezon Se Parhez Karein?

1. **Electric Geysers / Instant Water Heaters (3000W – 5000W):** Peak hours mein chalane se 4 ghante mein 15-20 units extra jalte hain jo double rate par charge hotay hain.
2. **Room Blowers & Quartz Heaters (1000W – 2000W):** Off-peak hours mein room warm kar lein ya inverter heat pump AC istemal karein.
3. **Water Motors / Submersible Pumps:** Subah ya dopahar ke waqt tanki bharein.

---

## 3. Single Phase vs 3-Phase TOU Rule

- **Single Phase Meters:** In par peak/off-peak alag se nahi hota, lekin mahana total slab cross hone par per-unit rate barh jata hai.
- **3-Phase TOU Meters:** In par peak aur off-peak units ka alag meter reading register hota hai. Peak units ka rate bohot mehnga hota hai.

---

## Conclusion
Apne billing slab aur units ki status track karne ke liye [Protected Slab Calculator](https://www.readmeter.online/protected-slab-calculator) ka istemal karein.`,
    faqs: [
      {
        question: 'Kya single phase meter par peak hours ka koi nuksan hai?',
        answer: 'Single phase regular meter par specific ghanton ka higher rate nahi lagta, lekin excessive peak usage se total monthly units barh kar protected slab (200 units) se bahir ho jate hain.'
      },
      {
        question: 'Peak hours mein geyser chalane se kitna bill barhta hai?',
        answer: 'Agar aap rozana peak hours mein 3kW geyser 2 ghante chalayein to mahana 180 peak units bante hain, jis se taqreeban Rs 9,000 se Rs 11,000 ka extra bojh parta hai.'
      }
    ]
  },
  {
    slug: 'how-to-calculate-home-ev-charging-cost-kwh-level-2-charger-guide',
    title: 'How to Calculate Home EV Charging Cost (kWh): Level 1 vs Level 2 Charger Guide 2026',
    excerpt: 'Calculate your exact cost to charge an electric car at home per mile and full battery. Compare Level 1 trickle charging vs 240V Level 2, off-peak time-of-use tariffs, and home battery savings.',
    category: 'Energy Saving',
    author: 'Read Meter Global CleanTech Lab',
    read_time: '6 min read',
    tags: ['EV Charging Cost', 'Level 2 EV Charger', 'Electric Car kWh', 'Home Charging Calculator', 'Read Meter'],
    content: `## How Much Does It Really Cost to Charge an Electric Vehicle at Home?

With global fuel prices volatile and electric vehicle (EV) adoption accelerating worldwide, charging at home remains **3x to 5x cheaper than gasoline and up to 60% cheaper than commercial DC Fast Charging networks** (such as Tesla Superchargers, Electrify America, or Ionity).

However, many new EV owners struggle to estimate their exact electricity bill impact. How many kilowatt-hours (kWh) does a full charge take? What does Level 2 charging add to your monthly utility statement?

In this practical guide, we break down the exact mathematical formula for EV home charging, efficiency loss multipliers, and how to optimize charging schedules under Time-of-Use (TOU) rates.

---

## 1. The Home EV Charging Cost Formula

Calculating the cost to charge any electric vehicle at home requires three metrics:

$$\\text{Cost to Charge} = \\left( \\frac{\\text{Battery Capacity (kWh)} \\times \\text{State of Charge Added}}{\\text{Charging Efficiency (0.85 - 0.90)}} \\right) \\times \\text{Electricity Rate Per kWh}$$

* **Usable Battery Capacity:** The real usable kWh size (e.g., Tesla Model 3 = ~57.5 kWh, Ford Mustang Mach-E = ~72 kWh, Hyundai Ioniq 5 = ~77.4 kWh).
* **Charging Inefficiency Factor (~10% to 15%):** Energy lost as heat through AC-to-DC onboard rectification and battery thermal cooling.

---

## 2. Level 1 vs Level 2 Home Charging Comparison

| Metric | Level 1 (120V Standard Outlet) | Level 2 (240V Dedicated Circuit) |
| :--- | :--- | :--- |
| **Voltage & Current** | 120V @ 12A – 15A (1.4 kW – 1.8 kW) | 240V @ 32A – 48A (7.7 kW – 11.5 kW) |
| **Range Added Per Hour** | 3 – 5 miles per hour | 25 – 35 miles per hour |
| **Full 60 kWh Recharge Time** | 35 – 45 hours | 6 – 8 hours (Overnight) |
| **Charging Efficiency** | ~80% – 84% (High thermal overhead) | **~88% – 92% (Significantly lower loss)** |
| **Best Used For** | Plug-in hybrids (PHEVs) & short commutes | Pure battery EVs (BEVs) & daily commuters |

---

## 3. Real-World Charging Cost Per Mile (EV vs Gas)

* **Average EV Efficiency:** 3.3 to 3.8 miles per kWh.
* **At Average Off-Peak Electric Rate ($0.16 / kWh):** Charging costs **~$0.045 per mile** ($4.50 per 100 miles).
* **Equivalent Gas Vehicle (30 MPG at $3.80/gallon):** Fuel costs **~$0.127 per mile** ($12.70 per 100 miles).
* **Annual Savings (12,000 miles/year):** Over **$980+ net annual fuel savings** by charging at home.

---

## 4. Calculate Your Exact Home EV Charge Cost Free

Use our free [EV Charging Cost & Range Calculator](https://www.readmeter.online/tools/ev-charging-cost-calculator) to compute charging duration, costs across off-peak/peak utility slabs, and savings against combustion vehicles.`,
    faqs: [
      {
        question: 'Is it cheaper to charge an EV at night?',
        answer: 'Yes. If your electric utility offers Time-of-Use (TOU) billing, off-peak rates between 11 PM and 6 AM are often 40% to 60% cheaper than daytime peak hours.'
      },
      {
        question: 'Does Level 2 charging use more electricity than Level 1?',
        answer: 'No. In fact, Level 2 is more energy-efficient because the car finishes charging faster, reducing the total runtime of the vehicle internal cooling pumps and computers.'
      }
    ]
  },
  {
    slug: 'how-long-will-200ah-battery-run-ups-solar-backup-duration-formula',
    title: 'How Long Will a 200Ah Battery Last? UPS & Solar Inverter Backup Calculation Formula',
    excerpt: 'Calculate exact run hours for 100Ah, 150Ah, and 200Ah deep cycle batteries under real appliance load. Understand Depth of Discharge (DoD), Peukert law, and inverter loss factors.',
    category: 'Energy Saving',
    author: 'Read Meter Battery Engineering Lab',
    read_time: '6 min read',
    tags: ['200Ah Battery Runtime', 'UPS Battery Formula', 'Solar Battery Backup Hours', 'Inverter Efficiency', 'Read Meter'],
    content: `## How to Calculate Exact Battery Backup Duration in Hours & Minutes

One of the most frequent questions from homeowners installing emergency UPS backup systems or off-grid solar storage is: **"How long will a 12V 200Ah battery power my appliances?"**

Electricians often give overly simplistic answers like: *"12V × 200Ah = 2,400 Watt-hours, so a 300W load will run for 8 hours."*

In reality, running a 300W load on a conventional lead-acid battery for 8 hours will **permanently destroy the battery plates through deep sulfation**.

To calculate realistic, safe backup time without damaging battery health, you must account for **Depth of Discharge (DoD)** and **inverter conversion efficiency**.

---

## 1. The True Battery Runtime Equation

$$\\text{Backup Hours} = \\frac{\\text{Battery Bank Voltage (V)} \\times \\text{Capacity (Ah)} \\times \\text{Safe DoD (\\%)} \\times \\text{Inverter Efficiency (\\%)}}{\\text{Total Connected Load (Watts)}}$$

### Parameters Breakdown:
1. **Depth of Discharge (DoD):**
   * **Tall Tubular / Deep-Cycle Lead-Acid:** 70% maximum safe DoD (discharging beyond 70% cuts lifecycle from 1,200 cycles to under 300 cycles).
   * **Automotive Liquid Lead-Acid:** 50% safe DoD.
   * **Lithium LiFePO4:** 90% safe DoD.
2. **Inverter Efficiency:**
   * Standard Inverters: ~80% to 85% efficiency.
   * Pure Sine Wave Solar Hybrids: ~90% to 95% efficiency.

---

## 2. Practical 200Ah Battery Runtime Benchmark Table

Under a typical 12V 200Ah Tall Tubular Deep-Cycle setup (70% DoD, 85% Inverter Efficiency):
* **Usable Safe Energy:** $12\\text{V} \\times 200\\text{Ah} \\times 0.70 \\times 0.85 = \\mathbf{1,428\\text{ Watt-hours}}$

| Load Scenario | Connected Appliances | Total Continuous Load | Estimated Safe Backup Duration |
| :--- | :--- | :--- | :--- |
| **Light Emergency Load** | 3 LED bulbs (36W) + 1 WiFi Router (15W) + 1 Laptop (65W) | **116 Watts** | **~12 hours 15 mins** |
| **Standard Residential Load** | 2 Ceiling Fans (160W) + 4 LED Lights (48W) + WiFi (15W) | **223 Watts** | **~6 hours 25 mins** |
| **Heavy Living Room Load** | 2 Fans (160W) + 1 LED TV 55\" (90W) + Lights (48W) + Workstation (80W) | **378 Watts** | **~3 hours 45 mins** |
| **Surge Appliance Load** | 1 Inverter Refrigerator (180W) + 2 Fans + Lights + TV | **558 Watts** | **~2 hours 30 mins** |

---

## 3. Calculate Your Exact Battery Bank Hours in Real Time

Instead of manual calculations, test your exact appliance setup with our free [UPS & Inverter Battery Backup Calculator](https://www.readmeter.online/tools/battery-backup-calculator). Supports 12V, 24V, and 48V banks with real-time recharge cost estimates.`,
    faqs: [
      {
        question: 'Can I connect two 12V 200Ah batteries together?',
        answer: 'Yes. Connecting them in Parallel maintains 12V while doubling capacity to 400Ah (2x runtime). Connecting them in Series creates a 24V 200Ah bank (ideal for 24V inverters with lower cable current).'
      },
      {
        question: 'Why does my battery die faster under heavy load?',
        answer: 'This is due to Peukert Law: high discharge currents increase internal battery resistance, temporarily reducing effective capacity.'
      }
    ]
  }
]

async function runDailyPublishing() {
  const todayStr = new Date().toISOString().slice(0, 10)
  console.log(`📅 Checking daily Read Meter publishing status for date: ${todayStr}...`)

  // Check today's posts in Supabase
  const { data: existing, error } = await supabase
    .from('blog_posts')
    .select('slug, published_at')
    .gte('published_at', `${todayStr}T00:00:00.000Z`)

  if (error) {
    console.error('❌ Supabase check error:', error.message)
    return
  }

  if (existing && existing.length > 0) {
    console.log(`✅ Read Meter already has ${existing.length} post(s) published for today (${todayStr}):`, existing[0].slug)
    console.log('Skipping duplicate daily publish.')
    return
  }

  // Get all existing slugs to pick an un-published candidate
  const { data: allPosts } = await supabase.from('blog_posts').select('slug')
  const publishedSlugs = new Set((allPosts || []).map(p => p.slug))

  const candidate = TOPIC_POOL.find(t => !publishedSlugs.has(t.slug))
  if (!candidate) {
    console.log('⚠️ All catalog topics have already been published. Awaiting fresh queue.')
    return
  }

  console.log(`🚀 Publishing today's candidate: "${candidate.title}" (${candidate.slug})...`)
  const payload = {
    slug: candidate.slug,
    title: candidate.title,
    excerpt: candidate.excerpt,
    content: candidate.content,
    author: candidate.author,
    read_time: candidate.read_time,
    category: candidate.category,
    tags: candidate.tags,
    faqs: candidate.faqs,
    status: 'published',
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  const { data: inserted, error: insertError } = await supabase
    .from('blog_posts')
    .upsert(payload, { onConflict: 'slug' })
    .select()

  if (insertError) {
    console.error('❌ Insert failed:', insertError.message)
    return
  }

  console.log('🎉 Successfully published to Read Meter Supabase Database!')
  console.log(`🔗 URL: https://www.readmeter.online/blog/${candidate.slug}`)

  // Ping IndexNow
  try {
    console.log('📡 Pinging IndexNow API for instant search engine indexation...')
    execSync('python scripts/ping_indexnow.py', { cwd: BASE_DIR, stdio: 'inherit' })
  } catch (pe) {
    console.error('⚠️ IndexNow ping notice:', pe.message)
  }
}

runDailyPublishing()
