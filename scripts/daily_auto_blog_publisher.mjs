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
