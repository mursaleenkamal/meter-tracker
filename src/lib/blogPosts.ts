export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  updatedAt: string
  author: string
  readTime: string
  category: 'Energy Saving' | 'Tariff Guides' | 'Sub-metering' | 'Product Updates'
  tags: string[]
  coverImage?: string
  content: string
  faqs?: { question: string; answer: string }[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'inverter-ac-electricity-units-consumption-pakistan',
    title: 'Inverter AC vs Non-Inverter: 1.5 Ton Real Units Consumption & Slabs Impact 2026',
    excerpt:
      'Discover how many electricity units a 1.5-ton DC inverter AC consumes per hour in Pakistan summer and how temperature settings (24°C vs 26°C) protect your 200-unit slab.',
    publishedAt: '2026-10-05',
    updatedAt: '2026-10-05',
    author: 'Read Meter Energy Team',
    readTime: '5 min read',
    category: 'Energy Saving',
    tags: ['Inverter AC', 'Electricity Units', 'Slab Protection', 'K-Electric', 'LESCO', 'Energy Saving'],
    content: `
## Inverter AC Kitni Bijli Khata Hai? (Real Data & Calculation)

Garmiyon mein bijli ke bill barhne ki sab se barhi wajah Air Conditioners (AC) hote hain. Pakistan mein ziadatar gharon mein **1.5 Ton DC Inverter AC** istemal hota hai. Lekin kia aap ko pata hai ke inverter AC har ghante kitne units leta hai aur yeh aap ke monthly slab ko kaise mutasir karta hai?

---

### 1. Inverter AC vs Non-Inverter (Hourly Consumption Comparison)

| AC Type | Initial Starting Load | Steady Running Load (After 1 Hr) | Daily Consumption (8 Hours @ 26°C) |
| :--- | :--- | :--- | :--- |
| **1.5 Ton DC Inverter (T3 Compressor)** | 1,400W – 1,800W (1.5 units/hr) | **450W – 750W (0.5 – 0.7 units/hr)** | **~4.8 to 6.2 Units** |
| **1.5 Ton Non-Inverter (Conventional)** | 2,100W (Fixed 2.1 units/hr) | **2,100W (Compressor cycles ON/OFF)** | **~14.5 to 16.8 Units** |

**Kamyabi Ka Raz:** DC Inverter AC kamre ka matlooba temperature pohanchne ke baad compressor ki speed ko 30% tak slow kar deta hai, jabke Non-Inverter AC poori taqat par chal kar band hota rehta hai jisse bijli ka zaya bohot ziada hota hai.

---

### 2. Temperature Setting Ka Jaadu: 24°C vs 26°C

Bohat se log AC ko 18°C ya 20°C par chalate hain is khayal se ke kamra jaldi thanda hoga. Lekin yeh sab se barhi ghalti hai!

- **20°C par AC chalane se:** Compressor lagataar 100% capacity par chalta hai aur mahana **250 se 320 units** akela AC kha jata hai.
- **26°C par AC chalane se + Ceiling Fan Low Speed:** Compressor jaldi eco-mode mein shift ho jata hai aur mahana sirf **140 se 170 units** consume hote hain.

> 💡 **Golden Formula:** Har 1°C temperature barhane par aap ke bijli ke bill mein **6% se 8% tak direct bachat** hoti hai.

---

### 3. 200-Unit Protected Slab Ko Kaise Bachayein?

Pakistan mein NEPRA ke naye rules ke tehat agar aap ka mahana total **200 units** ke andar rehta hai to aap ko **Protected Tariff (~Rs 15/unit)** milta hai. Lekin agar aap 201 units par chalay gaye to rate seedha **Rs 38.5/unit + 18% GST** ho jata hai!

Agar aap AC istemal karte hue 200 units ke andar rehna chahte hain:
1. **Timer Feature Istemal Karein:** AC ko raat ke waqt sirf 4 se 5 ghante ka timer lagayein.
2. **Room Insulation Check Karein:** Darwazon aur khirkiyon ki darazon (leaks) ko seal karein taake cooling bahar na jaye.
3. **Rozana Meter Reading Record Karein:** **Read Meter App** par camera se meter dial scan karein taake aap ko pata chale ke aaj kitne units kharch hue aur month-end par kitna bill aayega.
    `,
    faqs: [
      {
        question: '1.5 ton Inverter AC 8 ghante mein kitne units leta hai?',
        answer:
          'Agar AC ko 26°C par chalaya jaye aur room theek se insulated ho to 1.5 ton inverter AC 8 ghante mein taqreeban 4.5 se 6.5 units consume karta hai.',
      },
      {
        question: 'Kya AC chalate hue 200 unit protected slab bachaya ja sakta hai?',
        answer:
          'Jee haan! Agar AC ko daily 3 se 4 ghante 26°C par chalaya jaye aur baaqi light/fridge load control kiya jaye to mahana 200 units ke andar rehna mumkin hai.',
      },
    ],
  },
  {
    slug: 'kelectric-peak-hours-timings-bill-saving-guide',
    title: 'K-Electric Peak Hours Timings & Heavy Appliance Schedule 2026',
    excerpt:
      'Complete guide on K-Electric, LESCO, and IESCO peak hours timings (6:30 PM to 10:30 PM) and how avoiding heavy appliances saves thousands in utility bills.',
    publishedAt: '2026-10-04',
    updatedAt: '2026-10-04',
    author: 'Read Meter Energy Team',
    readTime: '4 min read',
    category: 'Tariff Guides',
    tags: ['K-Electric', 'Peak Hours', 'Off-Peak Tariff', 'IESCO', 'LESCO', 'Bijli Bill'],
    content: `
## Peak Hours Kia Hain Aur In Mein Bijli Kyun Mehngi Hoti Hai?

Pakistan mein tamaam bijli taqseem karne wali companiyan (K-Electric, LESCO, IESCO, FESCO, MEPCO) din ke mukhtalif auqaat mein 2 tarah ke rates charge karti hain: **Off-Peak Hours Rate** aur **Peak Hours Rate**.

Peak hours woh auqaat hote hain jab poore shehar mein bijli ki talab (demand) sab se buland satah par hoti hai. In 4 ghanton ke dauran bijli ka unit rate aam auqaat se **30% se 50% tak mehnga** hota hai.

---

### 1. 2026 Official Peak Hours Schedule (Season-Wise)

| Season / Months | Peak Hours Timings | Off-Peak Hours |
| :--- | :--- | :--- |
| **Summer (April to October)** | **6:30 PM se 10:30 PM** | 10:30 PM se aglay din 6:30 PM tak |
| **Winter (November to March)** | **5:00 PM se 9:00 PM** | 9:00 PM se aglay din 5:00 PM tak |

*Note: Time of Use (TOU) 3-phase meters par peak hours ke units alag se calculate hote hain.*

---

### 2. Peak Hours Mein Kaun Si Cheezein Hargiz Na Chalayein?

In 4 ghanton ke dauran mandarja zail heavy load appliances chalane se parhez karein:
- ❌ **Washing Machine & Dryer** (Load: 1,500W – 2,200W)
- ❌ **Electric Iron / Istri** (Load: 1,000W – 1,500W)
- ❌ **Water Motor / Geyser** (Load: 1,200W – 2,500W)
- ❌ **Microwave & Electric Oven** (Load: 1,200W – 2,000W)
- ❌ **EV Car / Scooter Charging** (Load: 3,000W+)

---

### 3. Smart Strategy: Shift Your Heavy Load to Off-Peak Hours

- **Istri aur Dhulai ka Time:** Subah 8:00 AM se dopahar 12:00 PM ke darmiyan istri aur washing machine chalayein jab grid par load kam hota hai.
- **Pani ki Motor:** Dopahar 2:00 PM ya subah sawarey tanki bhar lein.
- **Daily Unit Tracking:** Apne meter ke reading records ko **Read Meter** par daily log karein taake aap ko pata chal sake ke peak hours avoidance se aap ne kitne units bachaye.
    `,
    faqs: [
      {
        question: 'Single phase meter par bhi peak hours laagu hote hain?',
        answer:
          'Single phase domestic meters par slab-based billing hoti hai, jabke 3-phase digital meters par Peak aur Off-Peak units alag calculate hote hain.',
      },
      {
        question: 'Peak hours mein unit rate kitna hota hai?',
        answer:
          '2026 NEPRA tariff ke mutabiq 3-phase meters par Peak hours ka unit rate ~Rs 48 se Rs 52/unit tak pohanch jata hai.',
      },
    ],
  },
  {
    slug: 'landlord-tenant-submeter-billing-calculation-formula',
    title: 'Landlord & Tenant Sub-Meter Split Formula: Avoid Utility Disputes',
    excerpt:
      'Step-by-step mathematical formula for landlords and rental tenants in Pakistan to accurately split main electricity bills and sub-meter consumption without unfair charges.',
    publishedAt: '2026-10-03',
    updatedAt: '2026-10-03',
    author: 'Read Meter Sub-metering Team',
    readTime: '6 min read',
    category: 'Sub-metering',
    tags: ['Sub-meter', 'Landlord Tenant', 'Bill Calculation', 'Rental Property', 'Utility Split'],
    content: `
## Sub-Meter Ka Bill Calculate Kaise Karein? (Fair Formula)

Rental properties (jaise upper portion, ground portion, ya apartments) mein aksar 1 Main Meter hota hai aur mukhtalif tenants ke liye **Sub-Meters** lagaye jate hain. Month-end par jab K-Electric ya WAPDA ka main bill aata hai to sab se barha masla yeh hota hai ke:
*"Har tenant ka hissa kitna banta hai?"*

Aksar landlords ya tenants simple flat rate laga dete hain jo kisi aik party ke sath na-insaafi ka sabab banta hai. Yahan standard aur fair formula diya gaya hai.

---

### 1. The Proportional Average Unit Rate Formula

Sub-meter billing ka sab se munafas (fair) tareeqa **Total Bill / Total Units** ka average rate nikalna hai:

$$\\text{Effective Unit Rate} = \\frac{\\text{Total Main Bill Amount (Taxes Included)}}{\\text{Total Units Consumed on Main Bill}}$$

#### Example Calculation:
- **Main K-Electric Bill:** Rs 24,000
- **Total Main Meter Units:** 600 Units
- **Effective Rate Per Unit:** $\\frac{24000}{600} = \\text{Rs 40.00 per unit}$

Agar **Tenant A (Ground Floor)** ke sub-meter par 220 units aaye hain:
$$\\text{Tenant A Bill} = 220 \\times 40 = \\text{Rs 8,800}$$

Agar **Tenant B (First Floor)** ke sub-meter par 380 units aaye hain:
$$\\text{Tenant B Bill} = 380 \\times 40 = \\text{Rs 15,200}$$

$$\\text{Total} = 8,800 + 15,200 = \\text{Rs 24,000 (Exact Match!)}$$

---

### 2. Common Sub-Meter Billing Mistakes to Avoid

1. ❌ **Main Bill Aane Se Pehle Readings Lena:** Main meter ki reading date aur sub-meters ki reading date hamesha **aik hi din** honi chahiye.
2. ❌ **Taxes aur Fixed Charges Ko Ignore Karna:** Sub-meter par sirf base rate lagane se landlord ko apni jeb se FPA aur GST bharna parhta hai. Average Unit Rate formula tamam taxes ko automatically proportionate divide karta hai.
3. ❌ **Kharab Sub-Meter:** Agar sub-meters mechanical (purane) hon to woh ghalat readings de sakte hain. Hamesha digital sub-meters lagayein.

---

### 3. Read Meter Sub-Meter Management

**Read Meter** web platform par aap multiple sub-meters register kar sakte hain, camera se dial scan kar ke automatically tenant wise WhatsApp invoices generate kar sakte hain.
    `,
    faqs: [
      {
        question: 'Sub-meter ke bill mein Fuel Price Adjustment (FPA) kaise divide karein?',
        answer:
          'FPA ko alag se calculate karne ke bajaye poore bill ki total raqam ko total units par divide karein. Is se FPA har tenant ke units ke hisab se barabar taqseem ho jata hai.',
      },
      {
        question: 'Agar sub-meters ke total units main meter se kam hon to kia karein?',
        answer:
          'Yeh difference line losses ya shared lights (staircase/water motor) ki wajah se hota hai. Shared load ko tamam tenants mein barabar divide kiya jana chahiye.',
      },
    ],
  },
]

export function getAllPosts(): BlogPost[] {
  return BLOG_POSTS.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}
