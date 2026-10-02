import { Property, MortgageQuote } from '../types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-riyadh-hittin-palace',
    title: 'The Hittin Sovereign Villa | قصر حطين المودرن',
    titleAr: 'قصر حطين العصري بإطلالة قريبة من البوليفارد وكافد',
    tagline: 'Salmanic modern architecture with private courtyard, elevator, infinity pool, and luxury driver & maid quarters',
    price: 8900000,
    originalPrice: 9400000,
    address: 'Prince Turki Ibn Abdulaziz Al Awwal Rd, Hittin',
    district: 'Hittin (حي حطين)',
    city: 'Riyadh',
    zip: '13516',
    coordinates: {
      lat: 24.7670,
      lng: 46.5980,
      mapX: 38,
      mapY: 36,
    },
    beds: 6,
    baths: 7.5,
    sqm: 680,
    landAreaSqm: 500,
    pricePerSqm: 13088,
    yearBuilt: 2024,
    propertyType: 'Contemporary Palace',
    status: 'Hot Deal',
    tags: ['Private Pool', 'Italian Lift', 'Smart Automation', 'Driver & Maid Suite', 'Near KAFD & Boulevard'],
    features: [
      'Authentic Salmanic architectural facade with natural Riyadh limestone & thermal glass',
      'Private German Schindler panoramic elevator serving basement, ground, 1st floor & roof terrace',
      'Indoor-outdoor formal Majlis with water features and frameless European curtain walling',
      'Heated saltwater swimming pool with sunken seating lounge and outdoor barbecue kitchen',
      '10-Year Malath latent defects insurance policy & full compliance with Saudi Building Code'
    ],
    description: 'An architectural tour de force in Riyadh’s most coveted prestige district of Hittin. Designed to offer utter privacy and regal hospitality, featuring dual grand Majlis halls, double-height ceiling voids, a custom Italian show kitchen, and a private oasis courtyard minutes from KAFD and Boulevard Riyadh City.',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80'
    ],
    marketMetrics: {
      neighborhoodRating: 9.9,
      walkScore: 82,
      transitScore: 88,
      schoolsScore: 9.6,
      historicalAnnualAppreciation: 14.8,
      forecast12mAppreciation: 11.2,
      medianDaysOnMarket: 15,
      saleToListRatio: 99.4,
      estimatedRentalIncome: 42000, // SAR/month
      capRate: 5.7,
      propertyTaxAnnual: 0,
      hoaMonthly: 0,
    },
    warranties: {
      structuralYears: 10,
      plumbingYears: 15,
      electricalYears: 25,
    },
    virtualTourRooms: [
      {
        id: 'room-1',
        name: 'The Grand Najdi Majlis (المجلس الرئيسي)',
        sqft: 140,
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        ambientSoundTitle: 'Oud Melody & Gentle Fountain Water',
        narration: 'Welcome into the formal reception Majlis featuring double-height 6.5-meter ceilings, bookmatched Statuario marble, and seamless glass overlook into the courtyard fountain.',
        hotspots: [
          { id: 'h1', x: 30, y: 50, title: 'Riyadh Natural Stone Wall', description: 'Hand-chiseled local Riyadh limestone creating a thermal buffer and majestic visual texture', spec: 'Grade-A Riyadh Yellow Stone' },
          { id: 'h2', x: 68, y: 65, title: 'Italian Marble Flooring', description: 'Full slab Statuario Venato marble with seamless underfloor acoustics', spec: 'Italian Statuario' },
          { id: 'h3', x: 82, y: 35, title: 'Smart KNX Automation', description: 'Centralized Lutron and KNX lighting and climate control with motorized privacy screens', spec: 'KNX Automation Suite' }
        ]
      },
      {
        id: 'room-2',
        name: 'Courtyard Pool & Sunken Firepit (الفناء والمسبح)',
        sqft: 220,
        imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
        ambientSoundTitle: 'Relaxing Pool Waterfall & Evening Breeze',
        narration: 'A private sanctuary surrounded by high privacy perimeter walls, native date palms, and a temperature-controlled infinity pool.',
        hotspots: [
          { id: 'h4', x: 45, y: 60, title: 'Negative Edge Pool', description: 'Dual chiller and heater system engineered for year-round Riyadh temperatures', spec: 'Zodiac Pool Systems' },
          { id: 'h5', x: 75, y: 45, title: 'Sunken Majlis Lounge', description: 'Recessed lounge seating with automated smokeless gas fire pit', spec: 'Custom Outdoor Basalt' }
        ]
      },
      {
        id: 'room-3',
        name: 'Show Kitchen & Dining Pavilion (المطبخ الإيطالي)',
        sqft: 95,
        imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80',
        ambientSoundTitle: 'Culinary Elegance',
        narration: 'Poliform open kitchen with quartzite waterfall breakfast bar, accompanied by a fully equipped enclosed dirty kitchen for heavy preparation.',
        hotspots: [
          { id: 'h6', x: 50, y: 55, title: 'Miele & Gaggenau Suite', description: 'Integrated induction cooktops, dual steam ovens, and sub-zero wine refrigeration', spec: 'Gaggenau 400 Series' }
        ]
      },
      {
        id: 'room-4',
        name: 'Master Suite & Skyline Balcony (جناح الماستر الملكي)',
        sqft: 120,
        imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
        ambientSoundTitle: 'Peaceful Night Ambience',
        narration: 'Expansive private master retreat boasting private terrace, custom walk-in Italian dressing gallery, and en-suite spa bath with freestanding soaking tub.',
        hotspots: [
          { id: 'h7', x: 40, y: 60, title: 'Apaiser Soaking Tub', description: 'Solid stone freestanding tub overlooking the illuminated courtyard below', spec: 'Apaiser Luxury Composite' }
        ]
      }
    ],
    agent: {
      id: 'agent-1',
      name: 'Faisal Al-Otaibi | فيصل العتيبي',
      title: 'Senior Luxury Property Advisor',
      brokerage: 'Diriyah & Northern Riyadh Estates',
      phone: '+966 50 894 4120',
      email: 'faisal.otaibi@riyadhestates.sa',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      rating: 4.99,
      reviewsCount: 184,
      salesVolume: 'SAR 420M+ Closed in 2025',
      activeListingsCount: 8,
      languages: ['Arabic (العربية)', 'English'],
      responseTime: 'Under 5 mins',
      bio: 'Certified REGA Real Estate Broker specialized in off-market luxury estates, private palaces, and prime Northern Riyadh enclaves.',
      falLicense: 'FAL-1200018942'
    }
  },
  {
    id: 'prop-riyadh-kafd-penthouse',
    title: 'The KAFD Highline Sky Penthouse | بنتهاوس كافد البانورامي',
    titleAr: 'بنتهاوس فاخر في أبراج مركز الملك عبدالله المالي',
    tagline: 'Unobstructed 360° views over KAFD financial district towers, private sky pool, and direct metro link',
    price: 5450000,
    originalPrice: 5750000,
    address: 'KAFD Tower 4.08, King Fahd Road, Riyadh',
    district: 'KAFD (مركز الملك عبدالله المالي)',
    city: 'Riyadh',
    zip: '13519',
    coordinates: {
      lat: 24.7640,
      lng: 46.6380,
      mapX: 52,
      mapY: 34,
    },
    beds: 4,
    baths: 4.5,
    sqm: 410,
    landAreaSqm: 0,
    pricePerSqm: 13292,
    yearBuilt: 2023,
    propertyType: 'KAFD Sky Penthouse',
    status: 'Hot Deal',
    tags: ['KAFD Tower View', 'Private Sky Pool', 'Direct Metro Link', '24/7 VIP Concierge', 'LEED Platinum'],
    features: [
      'Direct elevator access opening into private gallery foyer with panoramic Riyadh skyline',
      'Floor-to-ceiling 3.8-meter acoustic glazed curtain walls with motorized sun shading',
      'Private heated sky plunge pool situated on double-height outdoor terrace',
      'Connected directly by air-conditioned skybridge to KAFD Grand Mosque and Metro Station',
      'Includes 3 deeded subterranean parking spaces with fast Level 2 EV charging'
    ],
    description: 'The height of metropolitan luxury in Saudi Arabia’s premier global financial district. Living at KAFD offers world-class dining, Michelin-starred bistros, luxury boutiques, and financial institutions at your doorstep, all framed by breathtaking sky-high vistas.',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80'
    ],
    marketMetrics: {
      neighborhoodRating: 9.9,
      walkScore: 98,
      transitScore: 100,
      schoolsScore: 9.0,
      historicalAnnualAppreciation: 16.5,
      forecast12mAppreciation: 12.8,
      medianDaysOnMarket: 12,
      saleToListRatio: 101.1,
      estimatedRentalIncome: 35000,
      capRate: 7.7,
      propertyTaxAnnual: 0,
      hoaMonthly: 1850,
    },
    warranties: {
      structuralYears: 10,
      plumbingYears: 10,
      electricalYears: 20,
    },
    virtualTourRooms: [
      {
        id: 'room-1',
        name: 'The Skyline Grand Salon (الصالون البانورامي)',
        sqft: 160,
        imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
        ambientSoundTitle: 'Gentle High-Altitude Breeze & Metro Humming',
        narration: 'Commanding high-floor view overlooking the crystalline architectural towers of King Abdullah Financial District.',
        hotspots: [
          { id: 'h1', x: 50, y: 45, title: 'Thermal Double Glazing', description: 'Solarban 70 high-performance low-emissivity glass cutting 85% of solar heat gain', spec: 'Saint-Gobain Glass' }
        ]
      }
    ],
    agent: {
      id: 'agent-2',
      name: 'Nouf Al-Sudairi | نوف السديري',
      title: 'Managing Director, Commercial & Sky Residences',
      brokerage: 'KAFD Private Office Realty',
      phone: '+966 55 421 9088',
      email: 'nouf.sudairi@kafdrealty.sa',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      rating: 4.98,
      reviewsCount: 142,
      salesVolume: 'SAR 310M+ in 2025',
      activeListingsCount: 6,
      languages: ['Arabic (العربية)', 'English', 'French'],
      responseTime: 'Under 10 mins',
      bio: 'Leading luxury high-rise real estate advisor in KAFD and Olaya with extensive institutional transaction expertise.',
      falLicense: 'FAL-1100092314'
    }
  },
  {
    id: 'prop-riyadh-almalqa-smart-villa',
    title: 'Al Malqa Contemporary Smart Villa | فيلا الملقا الذكية',
    titleAr: 'فيلا مودرن ذكية في حي الملقا مع مسبح ومصعد',
    tagline: 'Brand new luxury modern villa on 20m street with basement courtyard, rooftop sky lounge, and private elevator',
    price: 4950000,
    originalPrice: 5200000,
    address: 'Anas Ibn Malik Rd, Al Malqa District',
    district: 'Al Malqa (حي الملقا)',
    city: 'Riyadh',
    zip: '13524',
    coordinates: {
      lat: 24.8020,
      lng: 46.6110,
      mapX: 42,
      mapY: 22,
    },
    beds: 5,
    baths: 6.0,
    sqm: 480,
    landAreaSqm: 375,
    pricePerSqm: 10312,
    yearBuilt: 2024,
    propertyType: 'Luxury Modern Villa',
    status: 'Price Drop',
    tags: ['Private Elevator', 'Rooftop Terrace', 'Basement Majlis', '10-Yr Structural Guarantee', 'Smart Home'],
    features: [
      'Italian Fuji panoramic glass elevator serving all four levels from basement to roof',
      'Basement sunken courtyard bringing natural sunlight into entertainment room and home cinema',
      'Smart home automation controlling central AC, security cameras, audio and ambient lighting',
      'All master bedrooms with private en-suite bathrooms and built-in dressing rooms',
      'Certified under Saudi Building Code with comprehensive 10-year warranty certificate'
    ],
    description: 'Located in Riyadh’s prime growth corridor along Anas Ibn Malik in Al Malqa. This turn-key modern villa offers intelligent spatial engineering with separate formal and family zones, soaring glass walls, rooftop sky lounge, and private maid and driver quarters.',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80'
    ],
    marketMetrics: {
      neighborhoodRating: 9.8,
      walkScore: 86,
      transitScore: 82,
      schoolsScore: 9.5,
      historicalAnnualAppreciation: 12.9,
      forecast12mAppreciation: 9.4,
      medianDaysOnMarket: 18,
      saleToListRatio: 98.8,
      estimatedRentalIncome: 26000,
      capRate: 6.3,
      propertyTaxAnnual: 0,
      hoaMonthly: 0,
    },
    warranties: {
      structuralYears: 10,
      plumbingYears: 15,
      electricalYears: 25,
    },
    virtualTourRooms: [
      {
        id: 'room-1',
        name: 'Family Living & Garden Overlook (صالة العائلة والحديقة)',
        sqft: 90,
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        ambientSoundTitle: 'Modern Family Living Ambience',
        narration: 'Soaring 4-meter glass sliders connecting the indoor family room with the landscaped outdoor private garden and waterfall.',
        hotspots: [
          { id: 'h1', x: 45, y: 50, title: 'Minimalist Slim-Line Glazing', description: 'Thermally broken aluminum profile system with zero-level threshold', spec: 'Technal Aluminum System' }
        ]
      }
    ],
    agent: {
      id: 'agent-3',
      name: 'Rakan Al-Ghamdi | راكان الغامدي',
      title: 'Principal Residential Broker',
      brokerage: 'Al Malqa Real Estate Advisory',
      phone: '+966 54 812 7700',
      email: 'rakan.ghamdi@almalqarealty.sa',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
      rating: 4.96,
      reviewsCount: 165,
      salesVolume: 'SAR 280M+ in Northern Riyadh',
      activeListingsCount: 11,
      languages: ['Arabic (العربية)', 'English'],
      responseTime: 'Under 5 mins',
      bio: 'Specialist in high-end Al Malqa, Al Yasmin and Al Narjis residential villas and land plots.',
      falLicense: 'FAL-1200034189'
    }
  },
  {
    id: 'prop-riyadh-alnakheel-mansion',
    title: 'The Palm Enclave Estate | قصر النخيل الغربي',
    titleAr: 'قصر فخم في حي النخيل الغربي مع مسبح خاص وحديقة شاسعة',
    tagline: 'Ultra-exclusive private residence in West Nakheel near King Saud University and Digital City',
    price: 11800000,
    address: 'Imam Saud Ibn Abdulaziz Bin Mohammed Rd, Al Nakheel',
    district: 'Al Nakheel (حي النخيل)',
    city: 'Riyadh',
    zip: '12384',
    coordinates: {
      lat: 24.7430,
      lng: 46.6210,
      mapX: 48,
      mapY: 48,
    },
    beds: 7,
    baths: 8.5,
    sqm: 850,
    landAreaSqm: 650,
    pricePerSqm: 13882,
    yearBuilt: 2023,
    propertyType: 'Contemporary Palace',
    status: 'Available',
    tags: ['Huge Garden', 'Private Spa & Sauna', 'Underground 4-Car Parking', 'Near Digital City', 'Prime Location'],
    features: [
      'Expansive 650 sqm land parcel in ultra-rare Western Nakheel established enclave',
      'Private wellness spa pavilion with Finnish cedar sauna, steam hammam, and cold plunge',
      'Subterranean climate-controlled garage accommodating up to 4 luxury vehicles',
      'Two detached suites: Independent security guard/driver house and interior maid quarters',
      'Triple-height central atrium centered around a 50-year-old preserved olive tree'
    ],
    description: 'An heirloom-quality modern mansion in West Nakheel, one of Riyadh’s most mature and prestigious residential districts. Uncompromising privacy, timeless craftsmanship, and lush landscaping create an urban sanctuary close to Digital City and King Saud University.',
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80'
    ],
    marketMetrics: {
      neighborhoodRating: 9.9,
      walkScore: 84,
      transitScore: 85,
      schoolsScore: 9.8,
      historicalAnnualAppreciation: 15.2,
      forecast12mAppreciation: 10.8,
      medianDaysOnMarket: 21,
      saleToListRatio: 99.1,
      estimatedRentalIncome: 55000,
      capRate: 5.6,
      propertyTaxAnnual: 0,
      hoaMonthly: 0,
    },
    warranties: {
      structuralYears: 10,
      plumbingYears: 20,
      electricalYears: 25,
    },
    virtualTourRooms: [
      {
        id: 'room-1',
        name: 'The Atrium & Olive Tree Sanctuary (بهو شجرة الزيتون)',
        sqft: 180,
        imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80',
        ambientSoundTitle: 'Courtyard Water Cascade & Birds',
        narration: 'A breathtaking 3-story glass atrium centered on an ancient olive tree bathed in skylight.',
        hotspots: [
          { id: 'h1', x: 50, y: 55, title: 'Olive Tree Skylight Atrium', description: 'Motorized operable glass roof providing natural cross-ventilation', spec: 'Architectural Glazing' }
        ]
      }
    ],
    agent: {
      id: 'agent-1',
      name: 'Faisal Al-Otaibi | فيصل العتيبي',
      title: 'Senior Luxury Property Advisor',
      brokerage: 'Diriyah & Northern Riyadh Estates',
      phone: '+966 50 894 4120',
      email: 'faisal.otaibi@riyadhestates.sa',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      rating: 4.99,
      reviewsCount: 184,
      salesVolume: 'SAR 420M+ Closed in 2025',
      activeListingsCount: 8,
      languages: ['Arabic (العربية)', 'English'],
      responseTime: 'Under 5 mins',
      bio: 'Certified REGA Real Estate Broker specialized in off-market luxury estates, private palaces, and prime Northern Riyadh enclaves.',
      falLicense: 'FAL-1200018942'
    }
  },
  {
    id: 'prop-riyadh-alyasmin-townhome',
    title: 'The Jasmine Modern Duplex Villa | تاون هاوس الياسمين',
    titleAr: 'دوبلكس عصري مستقل في حي الياسمين مع جلسة سطح فاخرة',
    tagline: 'Turnkey independent modern duplex villa on 15m street, rooftop outdoor cinema, and smart lock access',
    price: 2850000,
    originalPrice: 2980000,
    address: 'Al Qadisiyyah St, Al Yasmin District',
    district: 'Al Yasmin (حي الياسمين)',
    city: 'Riyadh',
    zip: '13322',
    coordinates: {
      lat: 24.8230,
      lng: 46.6430,
      mapX: 60,
      mapY: 18,
    },
    beds: 4,
    baths: 4.5,
    sqm: 320,
    landAreaSqm: 250,
    pricePerSqm: 8906,
    yearBuilt: 2024,
    propertyType: 'Architectural Duplex',
    status: 'Available',
    tags: ['Sakani Eligible', 'Rooftop Cinema', 'Smart Locks', '10-Yr Structural Warranty', 'Near Airport & Metro'],
    features: [
      'Sakani and REDF subsidized financing eligible for Saudi citizens',
      'Rooftop entertaining deck with outdoor pergola, barbecue bar, and projector wiring',
      'Independent structural construction with separate double party wall and acoustic isolation',
      'Strategic location 12 minutes from King Khalid International Airport and Princess Nourah University',
      'Fully equipped with smart video intercom, electronic gates, and CCTV surveillance'
    ],
    description: 'An exceptional value in the fast-growing Al Yasmin corridor. Perfect for modern Saudi families seeking independent title deed, high energy efficiency, low maintenance, and immediate eligibility for subsidized Islamic mortgage financing.',
    images: [
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'
    ],
    marketMetrics: {
      neighborhoodRating: 9.4,
      walkScore: 78,
      transitScore: 80,
      schoolsScore: 9.3,
      historicalAnnualAppreciation: 13.4,
      forecast12mAppreciation: 9.8,
      medianDaysOnMarket: 14,
      saleToListRatio: 99.6,
      estimatedRentalIncome: 16500,
      capRate: 6.9,
      propertyTaxAnnual: 0,
      hoaMonthly: 0,
    },
    warranties: {
      structuralYears: 10,
      plumbingYears: 15,
      electricalYears: 25,
    },
    virtualTourRooms: [
      {
        id: 'room-1',
        name: 'The Sky Lounge & Terrace (جلسة السطح)',
        sqft: 75,
        imageUrl: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1600&q=80',
        ambientSoundTitle: 'Cool Evening Breeze & Outdoor Fire',
        narration: 'Private rooftop terrace equipped with custom pergola, outdoor cinema hookup, and views of northern Riyadh.',
        hotspots: [
          { id: 'h1', x: 40, y: 55, title: 'Outdoor Pergola & Kitchenette', description: 'Weatherproof aluminum louvers with integrated dimmable LED lighting', spec: 'Riyadh Outdoor Louvers' }
        ]
      }
    ],
    agent: {
      id: 'agent-3',
      name: 'Rakan Al-Ghamdi | راكان الغامدي',
      title: 'Principal Residential Broker',
      brokerage: 'Al Malqa Real Estate Advisory',
      phone: '+966 54 812 7700',
      email: 'rakan.ghamdi@almalqarealty.sa',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
      rating: 4.96,
      reviewsCount: 165,
      salesVolume: 'SAR 280M+ in Northern Riyadh',
      activeListingsCount: 11,
      languages: ['Arabic (العربية)', 'English'],
      responseTime: 'Under 5 mins',
      bio: 'Specialist in high-end Al Malqa, Al Yasmin and Al Narjis residential villas and land plots.',
      falLicense: 'FAL-1200034189'
    }
  },
  {
    id: 'prop-riyadh-safarat-diplomatic',
    title: 'The Diplomatic Quarter Courtyard Villa | واحة حي السفارات',
    titleAr: 'فيلا واحات حي السفارات بتصميم بيئي مستدام وحديقة نخيل',
    tagline: 'Sustainable stone sanctuary in the Diplomatic Quarter (Al Safarat) with Wadi Hanifa walking trail access',
    price: 7600000,
    address: 'Amr Ad Damri St, Diplomatic Quarter (Al Safarat)',
    district: 'Al Safarat / DQ (حي السفارات)',
    city: 'Riyadh',
    zip: '12512',
    coordinates: {
      lat: 24.6850,
      lng: 46.6230,
      mapX: 46,
      mapY: 75,
    },
    beds: 5,
    baths: 5.5,
    sqm: 540,
    landAreaSqm: 420,
    pricePerSqm: 14074,
    yearBuilt: 2022,
    propertyType: 'Luxury Modern Villa',
    status: 'Hot Deal',
    tags: ['Diplomatic Quarter', 'Wadi Hanifa Trails', 'Ultra Secure Gated', 'Bioclimatic Design', 'High Rental Yield'],
    features: [
      'Prime location in Riyadh’s most secure, serene, and internationally renowned Diplomatic Quarter',
      'Direct access to Tuwaiq and Wadi Hanifa paved walking, running, and cycling trails',
      'Bioclimatic natural limestone architecture maintaining cool ambient temperature year-round',
      'Heated plunge pool with basalt water cascades and fragrant jasmine courtyards',
      'Historically high rental yield catering to senior diplomatic and multinational executive tenants'
    ],
    description: 'A sanctuary of peace and prestige in the heart of Riyadh’s Diplomatic Quarter (Al Safarat). Featuring lush internal courtyards, authentic earthy finishes, and unmatched neighborhood security surrounded by green parks, international schools, and embassies.',
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80'
    ],
    marketMetrics: {
      neighborhoodRating: 9.9,
      walkScore: 96,
      transitScore: 80,
      schoolsScore: 9.9,
      historicalAnnualAppreciation: 14.1,
      forecast12mAppreciation: 10.4,
      medianDaysOnMarket: 10,
      saleToListRatio: 100.2,
      estimatedRentalIncome: 48000,
      capRate: 7.5,
      propertyTaxAnnual: 0,
      hoaMonthly: 650,
    },
    warranties: {
      structuralYears: 10,
      plumbingYears: 15,
      electricalYears: 25,
    },
    virtualTourRooms: [
      {
        id: 'room-1',
        name: 'The Courtyard Oasis (فناء الواحة)',
        sqft: 110,
        imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80',
        ambientSoundTitle: 'Wadi Hanifa Birds & Water Fountain',
        narration: 'Shaded courtyard sanctuary designed according to traditional Najdi thermal architecture with running water fountains and local stone.',
        hotspots: [
          { id: 'h1', x: 50, y: 60, title: 'Wadi Basalt Stone', description: 'Locally quarried natural basalt paving keeping the courtyard cool under Riyadh sunshine', spec: 'Wadi Hanifa Basalt' }
        ]
      }
    ],
    agent: {
      id: 'agent-2',
      name: 'Nouf Al-Sudairi | نوف السديري',
      title: 'Managing Director, Commercial & Sky Residences',
      brokerage: 'KAFD Private Office Realty',
      phone: '+966 55 421 9088',
      email: 'nouf.sudairi@kafdrealty.sa',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      rating: 4.98,
      reviewsCount: 142,
      salesVolume: 'SAR 310M+ in 2025',
      activeListingsCount: 6,
      languages: ['Arabic (العربية)', 'English', 'French'],
      responseTime: 'Under 10 mins',
      bio: 'Leading luxury real estate advisor in KAFD, Olaya, and Diplomatic Quarter with institutional transaction expertise.',
      falLicense: 'FAL-1100092314'
    }
  }
];

export const MOCK_MORTGAGE_QUOTES = (loanAmountSAR: number): MortgageQuote[] => {
  const baseMonthly = (profitRate: number, years: number) => {
    const monthlyRate = profitRate / 100 / 12;
    const n = years * 12;
    return Math.round((loanAmountSAR * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1));
  };

  return [
    {
      id: 'quote-rajhi',
      lenderName: 'Al Rajhi Bank',
      lenderNameAr: 'مصرف الراجحي',
      lenderLogo: '🕌',
      financeType: 'Murabaha (مرابحة)',
      profitRate: 3.99,
      apr: 4.12,
      monthlyInstallment: baseMonthly(3.99, 25),
      downPaymentRequiredPercent: 10,
      termYears: 25,
      recommendedTag: 'Lowest Profit Rate (أقل هامش ربح)'
    },
    {
      id: 'quote-snb',
      lenderName: 'Saudi National Bank (SNB)',
      lenderNameAr: 'البنك الأهلي السعودي',
      lenderLogo: '🏛️',
      financeType: 'Murabaha (مرابحة)',
      profitRate: 4.15,
      apr: 4.28,
      monthlyInstallment: baseMonthly(4.15, 25),
      downPaymentRequiredPercent: 10,
      termYears: 25,
      recommendedTag: 'Fast Digital Approval (موافقة فورية)'
    },
    {
      id: 'quote-sakani',
      lenderName: 'Sakani & REDF Subsidized Program',
      lenderNameAr: 'برنامج الدعم السكني والصندوق العقاري',
      lenderLogo: '🇸🇦',
      financeType: 'Subsidized Sakani (سكني)',
      profitRate: 3.25,
      apr: 3.40,
      monthlyInstallment: baseMonthly(3.25, 25),
      downPaymentRequiredPercent: 5,
      termYears: 25,
      recommendedTag: 'Gov Subsidized (تمويل سكني مدعوم)'
    },
    {
      id: 'quote-riyad',
      lenderName: 'Riyad Bank',
      lenderNameAr: 'بنك الرياض',
      lenderLogo: '🐎',
      financeType: 'Ijara (إجارة)',
      profitRate: 4.25,
      apr: 4.40,
      monthlyInstallment: baseMonthly(4.25, 25),
      downPaymentRequiredPercent: 15,
      termYears: 25,
      recommendedTag: 'Flexible Tenor (مرونة في السداد)'
    },
    {
      id: 'quote-alinma',
      lenderName: 'Alinma Bank',
      lenderNameAr: 'مصرف الإنماء',
      lenderLogo: '⭐',
      financeType: 'Murabaha (مرابحة)',
      profitRate: 4.09,
      apr: 4.22,
      monthlyInstallment: baseMonthly(4.09, 25),
      downPaymentRequiredPercent: 10,
      termYears: 25,
      recommendedTag: '100% Sharia Certified (متوافق مع الشريعة)'
    }
  ];
};
