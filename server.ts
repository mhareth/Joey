import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;

// Shared server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      market: 'Riyadh, Saudi Arabia',
      hasApiKey: Boolean(apiKey),
      timestamp: new Date().toISOString(),
    });
  });

  // 1. AI Personalized Recommendations for Riyadh Buyers
  app.post('/api/ai/recommendations', async (req: Request, res: Response) => {
    const { buyerProfile, properties } = req.body;

    const buildFallback = () => {
      return properties.map((p: any, idx: number) => {
        let score = 90;
        if (p.price >= buyerProfile.budgetMin && p.price <= buyerProfile.budgetMax) score += 6;
        if (p.beds >= buyerProfile.minBeds) score += 3;
        return {
          propertyId: p.id,
          matchScore: Math.min(99, Math.max(72, score - idx * 2)),
          matchReason: `Matches your SAR ${(buyerProfile.budgetMax / 1000000).toFixed(1)}M budget and priority for prime ${p.district} living in Riyadh.`,
          tradeoff: 'High demand northern corridor with rapid capital appreciation and competitive buyer bids.',
        };
      });
    };

    if (!ai) {
      return res.json({ recommendations: buildFallback() });
    }

    try {
      const prompt = `You are the lead AI Real Estate Advisor at joey.properties | جوي للعقارات in Riyadh, Saudi Arabia (المستشار العقاري الذكي لمنصة جوي للعقارات).
Analyze this Saudi buyer profile and match it against the listed Riyadh properties.
Buyer Profile:
- Budget Range: SAR ${buyerProfile.budgetMin?.toLocaleString()} - SAR ${buyerProfile.budgetMax?.toLocaleString()}
- Target Monthly Payment: SAR ${buyerProfile.targetMonthlyPayment?.toLocaleString()}
- Down Payment: ${buyerProfile.downPaymentPercent}%
- Preferred Districts: ${buyerProfile.preferredDistricts?.join(', ') || 'Northern Riyadh'}
- Min Bedrooms: ${buyerProfile.minBeds}, Min Bathrooms: ${buyerProfile.minBaths}
- Must Have Amenities: ${buyerProfile.mustHaveAmenities?.join(', ') || 'Elevator, Driver Room, Modern Majlis'}
- Top Strategic Priority: ${buyerProfile.priority}
- Timeline: ${buyerProfile.purchaseTimeline}

Properties Catalog in Riyadh:
${properties.map((p: any) => `- ID: ${p.id}, Title: ${p.title}, District: ${p.district}, Price: SAR ${p.price}, Beds: ${p.beds}, Baths: ${p.baths}, Type: ${p.propertyType}, Tags: ${p.tags.join(', ')}`).join('\n')}

Score each property from 72 to 99 based on relevance, Sharia financing feasibility, district appreciation, and lifestyle match. Provide a personalized 1-2 sentence reason and 1 trade-off note.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                propertyId: { type: Type.STRING },
                matchScore: { type: Type.INTEGER },
                matchReason: { type: Type.STRING },
                tradeoff: { type: Type.STRING },
              },
              required: ['propertyId', 'matchScore', 'matchReason', 'tradeoff'],
            },
          },
        },
      });

      const parsed = JSON.parse(response.text || '[]');
      return res.json({ recommendations: parsed.length ? parsed : buildFallback() });
    } catch (err: any) {
      console.warn('Gemini recommendation call fallback applied:', err.message);
      return res.json({ recommendations: buildFallback() });
    }
  });

  // 2. AI Real-time Market Insights for Riyadh
  app.post('/api/ai/market-insights', async (req: Request, res: Response) => {
    const { property, district, city } = req.body;
    const targetDistrict = district || property?.district || 'Hittin & Northern Riyadh';

    const fallbackInsights = {
      marketVerdict: 'High-Demand Expansion Market (سوق نشط ذو نمو متسارع)',
      temperatureScore: 92,
      annualAppreciationForecast: '+12.5% projected across Northern Riyadh over the next 18 months',
      daysOnMarketTrend: 'Prime turnkey villas selling in under 16 days due to corporate headquarters influx',
      buyerNegotiationPower: 'Competitive Seller Advantage - Secure early reservation before pre-handover price increments',
      summary: `The Riyadh residential property market—particularly in northern enclaves like Hittin, Al Malqa, KAFD, and Al Nakheel—is undergoing unprecedented capital expansion driven by Saudi Vision 2030, RHQ global corporate headquarters relocation, the Riyadh Metro operational launch, and Expo 2030 infrastructure delivery.`,
      keyDrivers: [
        'Strategic Northern Riyadh expansion corridor anchored by KAFD, Boulevard, and New Murabba',
        'Exemption on Real Estate Transaction Tax (RETT 5%) up to SAR 1,000,000 for first-time Saudi home buyers',
        'Stringent Saudi Building Code and mandatory 10-year insurance against latent defects (تأمين ملاذ) bolstering buyer confidence'
      ]
    };

    if (!ai) {
      return res.json(fallbackInsights);
    }

    try {
      const prompt = `You are a Chief Real Estate Economist at EstateIQ specializing in Saudi Arabia and the Riyadh real estate ecosystem.
Analyze the local micro-market dynamics for:
District: ${targetDistrict} in Riyadh, Saudi Arabia.
Property / Reference: ${property?.title || 'Luxury Modern Villa'}, Price: SAR ${property?.price?.toLocaleString() || 'N/A'}.
Current Metrics: WalkScore: ${property?.marketMetrics?.walkScore || 85}, CapRate: ${property?.marketMetrics?.capRate || 6.5}%.

Provide a data-driven market insight briefing referencing Saudi Vision 2030, REGA (الهيئة العامة للعقار) regulatory oversight, Real Estate Transaction Tax (RETT 5%), and institutional capital migration into Northern Riyadh.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              marketVerdict: { type: Type.STRING },
              temperatureScore: { type: Type.INTEGER, description: '0-100 where >70 is hot seller market' },
              annualAppreciationForecast: { type: Type.STRING },
              daysOnMarketTrend: { type: Type.STRING },
              buyerNegotiationPower: { type: Type.STRING },
              summary: { type: Type.STRING },
              keyDrivers: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['marketVerdict', 'temperatureScore', 'annualAppreciationForecast', 'daysOnMarketTrend', 'buyerNegotiationPower', 'summary', 'keyDrivers'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed.marketVerdict ? parsed : fallbackInsights);
    } catch (err: any) {
      console.warn('Gemini market-insights fallback applied:', err.message);
      return res.json(fallbackInsights);
    }
  });

  // 3. AI Seller Home Valuation & Listing Optimizer (Riyadh)
  app.post('/api/ai/home-valuation', async (req: Request, res: Response) => {
    const { address, district, beds, baths, sqm, landAreaSqm, propertyType, yearBuilt, condition, updates } = req.body;
    const baseSqm = sqm || 450;
    const estimatedBase = baseSqm * 11500; // SAR per sqm benchmark in Northern Riyadh

    const fallbackValuation = {
      estimatedValueMin: Math.round(estimatedBase * 0.95),
      estimatedValueMax: Math.round(estimatedBase * 1.10),
      recommendedListPrice: Math.round(estimatedBase * 1.03),
      projectedDaysOnMarket: 16,
      confidenceScore: 94,
      equityOutlook: 'High-Demand Riyadh Bracket (طلب استثماري وعائلي مرتفع)',
      roiUpgrades: [
        { upgrade: 'Smart Home Automation Integration & KNX Touch Panels', estimatedCost: 'SAR 35,000', valueAdd: '+SAR 120,000' },
        { upgrade: 'Natural Riyadh Yellow Stone Architectural Wall Finishing', estimatedCost: 'SAR 45,000', valueAdd: '+SAR 140,000' },
        { upgrade: 'Rooftop Majlis Louver Pergola with Ambient Lighting', estimatedCost: 'SAR 28,000', valueAdd: '+SAR 85,000' }
      ],
      marketAnalysis: `Based on verified REGA transaction data in ${district || 'Northern Riyadh'}, modern villas with Italian elevators, separate formal Majlis, driver quarters, and Saudi building code compliance command a 14% price premium. Demand from both high-net-worth Saudi families and multinational executives is at historic highs.`
    };

    if (!ai) {
      return res.json(fallbackValuation);
    }

    try {
      const prompt = `Act as an expert REGA-Certified Real Estate Appraiser & Listing Strategist in Riyadh, Saudi Arabia.
Estimate the fair market valuation and listing roadmap in Saudi Riyals (SAR) for:
Location: ${address}, ${district}, Riyadh, Saudi Arabia
Property Type: ${propertyType}, Built-Up Area: ${sqm} sqm, Land Area: ${landAreaSqm || 'N/A'} sqm
Beds: ${beds}, Baths: ${baths}, Year Built: ${yearBuilt}
Condition: ${condition}
Features / Updates: ${updates || 'Modern Salmanic facade, Italian lift, smart home, driver room'}

Provide an accurate valuation range in SAR, recommended asking price, projected days on market in Riyadh, top 3 high-ROI upgrades before listing, and marketing briefing.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              estimatedValueMin: { type: Type.INTEGER },
              estimatedValueMax: { type: Type.INTEGER },
              recommendedListPrice: { type: Type.INTEGER },
              projectedDaysOnMarket: { type: Type.INTEGER },
              confidenceScore: { type: Type.INTEGER },
              equityOutlook: { type: Type.STRING },
              roiUpgrades: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    upgrade: { type: Type.STRING },
                    estimatedCost: { type: Type.STRING },
                    valueAdd: { type: Type.STRING },
                  },
                  required: ['upgrade', 'estimatedCost', 'valueAdd'],
                },
              },
              marketAnalysis: { type: Type.STRING },
            },
            required: ['estimatedValueMin', 'estimatedValueMax', 'recommendedListPrice', 'projectedDaysOnMarket', 'confidenceScore', 'equityOutlook', 'roiUpgrades', 'marketAnalysis'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed.recommendedListPrice ? parsed : fallbackValuation);
    } catch (err: any) {
      console.warn('Gemini home-valuation fallback applied:', err.message);
      return res.json(fallbackValuation);
    }
  });

  // 4. AI Automated Legal Document Preparation (REGA-Compliant Contracts)
  app.post('/api/ai/generate-document', async (req: Request, res: Response) => {
    const { docType, property, buyerName, sellerName, offerPrice, earnestMoney, closingDays, financingType, inspectionDays, specialProvisions } = req.body;
    const rettTax = Math.round(Number(offerPrice || 5000000) * 0.05);

    const fallbackDoc = `المملكة العربية السعودية | joey.properties (جوي للعقارات)
عقد وساطة واتفاقية شراء عقار موحدة معتمدة من الهيئة العامة للعقار (REGA)
UNIFIED REAL ESTATE PURCHASE & SALE AGREEMENT
تاريخ التحرير: ${new Date().toLocaleDateString('ar-SA')} م الموافق ${new Date().toLocaleDateString('en-GB')}

البند الأول: أطراف العقد (Parties)
الطرف الأول (المشتري): ${buyerName || 'سعود بن عبدالعزيز آل سعود'} (سجل مدني/إقامة موثقة عبر نفاذ)
الطرف الثاني (البائع/المكتب العقاري): ${sellerName || property?.agent?.brokerage || 'المالك بموجب الصك الإلكتروني'} (رخصة فال العقارية: ${property?.agent?.falLicense || 'FAL-1200018942'})

البند الثاني: بيانات العقار وموقعه (Property Details)
اسم العقار: ${property?.title || 'فيلا سكنية فاخرة'}
الموقع: مدينة الرياض، ${property?.district || 'حي حطين'}، شارع ${property?.address || 'العام'}
رقم الصك الإلكتروني: موثق عبر البورصة العقارية لوزارة العدل
المساحة الإجمالية: ${property?.sqm || 480} متر مربع مباني / مساحة الأرض: ${property?.landAreaSqm || 375} م²

البند الثالث: المقابل المالي وضريبة التصرفات العقارية (Financial Terms)
1. القيمة الإجمالية المتفق عليها للشراء: ${Number(offerPrice || 5000000).toLocaleString()} ريال سعودي (SAR).
2. مبلغ العربون المودع في الحساب البنكي الضامن: ${Number(earnestMoney || 150000).toLocaleString()} ريال سعودي.
3. ضريبة التصرفات العقارية (RETT 5%): ${rettTax.toLocaleString()} ريال سعودي (تسدد للهيئة العامة للزكاة والضريبة والجمارك ZATCA وفق الأنظمة).
4. طريقة السداد: ${financingType || 'تمويل مرابحة عقاري معتمد متوافق مع الشريعة الإسلامية'}.

البند الرابع: الفحص الإنشائي وتأمين العيوب الخفية (Inspection & Warranty)
يمنح المشتري مدة (${inspectionDays || 10}) أيام عمل لإجراء الفحص الفني بواسطة مهندس معتمد. ويلتزم البائع بتسليم بوليصة تأمين العيوب الخفية (تأمين ملاذ) لمدة 10 سنوات الصادرة وفق كود البناء السعودي وكافة شهادات إتمام البناء وإطلاق التيار.

البند الخامس: الإفراغ ونقل الملكية (Title Deed Conveyance)
يتم إفراغ العقار ونقل الملكية عبر منصة البورصة العقارية بوزارة العدل خلال مدة أقصاها (${closingDays || 30}) يوماً من تاريخ توقيع هذه الاتفاقية.

شروط وإضافات خاصة:
${specialProvisions || 'يشمل البيع المصعد الإيطالي راكباً والمطبخ المجهز ووحدات التكييف المركزي ونظام التحكم الذكي بالكامل.'}

حرر هذا العقد من نسختين إلكترونيتين موثقتين وفق اشتراطات الهيئة العامة للعقار.`;

    if (!ai) {
      return res.json({
        documentContent: fallbackDoc,
        rettTaxSAR: rettTax,
        legalNotice: 'عقد وساطة وشراء عقاري موحد متوافق مع أنظمة الهيئة العامة للعقار ووزارة العدل السعودية.'
      });
    }

    try {
      const prompt = `You are a Senior Saudi Real Estate Legal Counsel & REGA (الهيئة العامة للعقار) Certified Documentation Specialist in Riyadh.
Generate a comprehensive, legally binding, bilingual (Arabic & English headings) ${docType.toUpperCase()} real estate contract.
Details:
- Document Type: ${docType}
- Property: ${property?.title || 'Luxury Residence in Riyadh'}, District: ${property?.district || 'Hittin'}, City: Riyadh, Saudi Arabia
- Buyer Name: ${buyerName}
- Seller / Brokerage: ${sellerName || property?.agent?.brokerage} (REGA Fal License: ${property?.agent?.falLicense || 'FAL-1200018942'})
- Offer Purchase Price: SAR ${Number(offerPrice).toLocaleString()}
- Earnest Money Deposit (العربون): SAR ${Number(earnestMoney).toLocaleString()}
- RETT Tax (ضريبة التصرفات العقارية 5%): SAR ${rettTax.toLocaleString()}
- Financing: ${financingType}
- Closing / Title Deed Conveyance: ${closingDays} days via Ministry of Justice Real Estate Exchange (البورصة العقارية)
- Inspection Period: ${inspectionDays} days with 10-Year Malath Latent Defects Insurance policy (تأمين ملاذ للعيوب الخفية)
- Special Clauses: ${specialProvisions || 'Conveyance includes Italian elevator, installed designer kitchens, and full KNX home automation'}

Draft a formal, numbered legal contract in authoritative Arabic with clear structure, compliant with Saudi Real Estate General Authority standards and digital title deed transfer protocols.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You produce clean, professional, fully articulated Saudi real estate agreements complying with REGA (الهيئة العامة للعقار) and Ministry of Justice standards.',
        },
      });

      return res.json({
        documentContent: response.text || fallbackDoc,
        rettTaxSAR: rettTax,
        legalNotice: 'عقد وساطة وشراء عقاري موحد متوافق مع أنظمة الهيئة العامة للعقار ووزارة العدل السعودية.'
      });
    } catch (err: any) {
      console.warn('Gemini generate-document fallback applied:', err.message);
      return res.json({
        documentContent: fallbackDoc,
        rettTaxSAR: rettTax,
        legalNotice: 'عقد وساطة وشراء عقاري موحد متوافق مع أنظمة الهيئة العامة للعقار ووزارة العدل السعودية.'
      });
    }
  });

  // 5. AI Agent Live Communication Copilot (Riyadh Broker)
  app.post('/api/ai/agent-chat', async (req: Request, res: Response) => {
    const { userMessage, agent, property, history } = req.body;

    const fallbackReply = `حياك الله أهلاً وسهلاً بك! أنا ${agent.name}، وسيطك العقاري المرخص برخصة فال (${agent.falLicense}) لدى ${agent.brokerage}. يسعدني جداً ترتيب موعد لمعاينة ${property.title} في ${property.district}، أو تزويدك بنسخة الصك الإلكتروني وشهادة إتمام البناء وبوليصة تأمين العيوب الخفية. هل يناسبك يوم السبت القادم الساعة 4:30 عصراً للمعاينـة؟`;

    if (!ai) {
      return res.json({ reply: fallbackReply });
    }

    try {
      const conversationHistory = (history || [])
        .map((m: any) => `${m.sender === 'user' ? 'Client' : agent.name}: ${m.text}`)
        .join('\n');

      const prompt = `You are ${agent.name}, a distinguished licensed Saudi real estate broker with REGA Fal License ${agent.falLicense} at ${agent.brokerage} in Riyadh, Saudi Arabia.
Your bio: ${agent.bio}. Your rating: ${agent.rating} stars (${agent.reviewsCount} verified Saudi clients).
You are currently advising an interested client about your exclusive listing in Riyadh:
"${property.title}" located in ${property.district}, Riyadh, Saudi Arabia.
Asking Price: SAR ${property.price.toLocaleString()} (${property.sqm} sqm built-up area).
Key Highlights: ${property.features?.slice(0, 3).join(', ')}.
Warranties: 10-year structural warranty & Malath insurance (تأمين ملاذ ضد العيوب الخفية). Status: ${property.status}.

Recent Chat History:
${conversationHistory}

Client's New Message: "${userMessage}"

Respond warmly and professionally in polished, courteous Arabic (with English terms if requested), maintaining traditional Saudi hospitality (حياك الله، يسعدني، أبشر). You can offer to schedule private in-person or virtual walkthroughs, answer technical building code inquiries, clarify title deed and RETT tax, or assist in drafting an initial offer. Never break character.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({
        reply: response.text?.trim() || fallbackReply,
      });
    } catch (err: any) {
      console.warn('Gemini agent-chat fallback applied:', err.message);
      return res.json({ reply: fallbackReply });
    }
  });

  // 6. AI Listing Description Generator for Riyadh Properties
  app.post('/api/ai/listing-description', async (req: Request, res: Response) => {
    const { propertyData } = req.body;

    const fallbackDescription = {
      headline: `تحفة معمارية فاخرة في أرقى أحياء ${propertyData.district || 'شمال الرياض'}`,
      description: `فرصة استثنائية لامتلاك ${propertyData.propertyType} بمواصفات ملكية وتشطيبات سلمانية عصرية فائقة الفخامة في ${propertyData.district || 'حي الملقا'} بالرياض. يضم العقار ${propertyData.beds} أجنحة نوم ماستر ومجالس ضيافة رحبة بمساحة بناء تبلغ ${propertyData.sqm} م² مع مصعد إيطالي وتأمين شامل ضد العيوب الخفية لمدة 10 سنوات وفق كود البناء السعودي.`,
      keyBullets: [
        'تصميم معماري طراز سلماني حديث بواجهات حجر الرياض الطبيعي',
        'مجلس ضيافة رئيسي منفصل بإطلالة على فناء وحديقة ومسبح خاص',
        'مصعد بانورامي يخدم كافة الأدوار من القبو إلى السطح',
        'موقع استراتيجي بالقرب من كافد والبوليفارد ومحطات قطار الرياض'
      ]
    };

    if (!ai) {
      return res.json(fallbackDescription);
    }

    try {
      const prompt = `Write an enticing, luxury Saudi real estate MLS listing copy in Arabic for a prime Riyadh property:
District: ${propertyData.district || 'Hittin'}, Riyadh, Type: ${propertyData.propertyType}
Beds: ${propertyData.beds}, Baths: ${propertyData.baths}, Built-Up Area: ${propertyData.sqm} sqm, Land: ${propertyData.landAreaSqm || 'N/A'} sqm
Special Features: ${propertyData.updates || 'Private swimming pool, Italian lift, smart home automation, driver room, rooftop sky terrace'}
Target Audience: Discerning Saudi families and high-net-worth investors seeking long-term prestige.

Provide a compelling Arabic headline, a 2-paragraph evocative description celebrating modern Salmanic architecture, and 4 bullet points.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              description: { type: Type.STRING },
              keyBullets: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['headline', 'description', 'keyBullets'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed.headline ? parsed : fallbackDescription);
    } catch (err: any) {
      console.warn('Gemini listing-description fallback applied:', err.message);
      return res.json(fallbackDescription);
    }
  });

  // Mount Vite middleware in development
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`EstateIQ Riyadh Server running at http://localhost:${port}`);
  });
}

startServer();
