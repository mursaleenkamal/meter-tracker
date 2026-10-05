-- Create Blog Posts Table for Dynamic SEO CMS
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT DEFAULT 'Read Meter Energy Team',
  read_time TEXT DEFAULT '5 min read',
  category TEXT NOT NULL CHECK (category IN ('Energy Saving', 'Tariff Guides', 'Sub-metering', 'Product Updates')),
  tags TEXT[] DEFAULT '{}',
  faqs JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'in_review', 'published')),
  seo_meta_title TEXT,
  seo_meta_description TEXT,
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast queries & SEO lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published ON public.blog_posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);

-- Row Level Security (RLS)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published posts
CREATE POLICY "Allow public read on published blog posts"
  ON public.blog_posts
  FOR SELECT
  USING (status = 'published');

-- Allow authenticated/service role full access
CREATE POLICY "Allow full access for authenticated admins"
  ON public.blog_posts
  FOR ALL
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Seed initial starter blog posts
INSERT INTO public.blog_posts (slug, title, excerpt, content, author, read_time, category, tags, faqs, status, published_at)
VALUES
(
  'inverter-ac-electricity-units-consumption-pakistan',
  'Inverter AC vs Non-Inverter: 1.5 Ton Real Units Consumption & Slabs Impact 2026',
  'Discover how many electricity units a 1.5-ton DC inverter AC consumes per hour in Pakistan summer and how temperature settings (24°C vs 26°C) protect your 200-unit slab.',
  '## Inverter AC Kitni Bijli Khata Hai? (Real Data & Calculation)

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
3. **Rozana Meter Reading Record Karein:** **Read Meter App** par camera se meter dial scan karein taake aap ko pata chale ke aaj kitne units kharch hue aur month-end par kitna bill aayega.',
  'Read Meter Energy Team',
  '5 min read',
  'Energy Saving',
  ARRAY['Inverter AC', 'Electricity Units', 'Slab Protection', 'K-Electric', 'LESCO', 'Energy Saving'],
  '[{"question": "1.5 ton Inverter AC 8 ghante mein kitne units leta hai?", "answer": "Agar AC ko 26°C par chalaya jaye aur room theek se insulated ho to 1.5 ton inverter AC 8 ghante mein taqreeban 4.5 se 6.5 units consume karta hai."}, {"question": "Kya AC chalate hue 200 unit protected slab bachaya ja sakta hai?", "answer": "Jee haan! Agar AC ko daily 3 se 4 ghante 26°C par chalaya jaye aur baaqi light/fridge load control kiya jaye to mahana 200 units ke andar rehna mumkin hai."}]'::jsonb,
  'published',
  NOW()
)
ON CONFLICT (slug) DO NOTHING;
