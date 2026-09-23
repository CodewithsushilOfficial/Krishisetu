import crypto from 'node:crypto';
import prisma from '../../db/prisma.js';
import redis from '../../lib/redis.js';
import logger from '../../lib/logger.js';
import GovernmentMarketPriceClient from './governmentMarketPrice.client.js';
import MarketPriceNormalizer from './marketPriceNormalizer.js';

const CACHE_TTL_SECONDS = 900; // 15 minutes

// Comprehensive catalogue of Indian agricultural commodities
export const COMMODITIES_CATALOG = [
  // Vegetables
  { name: 'Tomato', emoji: '🍅', category: 'Vegetables' },
  { name: 'Potato', emoji: '🥔', category: 'Vegetables' },
  { name: 'Onion', emoji: '🧅', category: 'Vegetables' },
  { name: 'Green Chilli', emoji: '🌶️', category: 'Vegetables' },
  { name: 'Brinjal', emoji: '🍆', category: 'Vegetables' },
  { name: 'Cauliflower', emoji: '🥦', category: 'Vegetables' },
  { name: 'Cabbage', emoji: '🥬', category: 'Vegetables' },
  { name: 'Carrot', emoji: '🥕', category: 'Vegetables' },
  { name: 'Capsicum', emoji: '🫑', category: 'Vegetables' },
  { name: 'Beetroot', emoji: '🟣', category: 'Vegetables' },
  { name: 'Bottle gourd', emoji: '🥒', category: 'Vegetables' },
  { name: 'Bitter gourd', emoji: '🥒', category: 'Vegetables' },
  { name: 'Ashgourd', emoji: '🍈', category: 'Vegetables' },
  { name: 'Cucumbar(Kheera)', emoji: '🥒', category: 'Vegetables' },
  { name: 'Bhindi(Ladies Finger)', emoji: '🥬', category: 'Vegetables' },
  { name: 'Drumstick', emoji: '🌿', category: 'Vegetables' },
  { name: 'Cluster beans', emoji: '🫛', category: 'Vegetables' },
  { name: 'Duster Beans', emoji: '🫛', category: 'Vegetables' },
  { name: 'Pointed gourd (Parval)', emoji: '🥒', category: 'Vegetables' },
  { name: 'Colacasia', emoji: '🥔', category: 'Vegetables' },
  { name: 'Cowpea(Veg)', emoji: '🫛', category: 'Vegetables' },
  { name: 'Sweet Potato', emoji: '🍠', category: 'Vegetables' },
  { name: 'Pumpkin', emoji: '🎃', category: 'Vegetables' },
  { name: 'Radish', emoji: '🥢', category: 'Vegetables' },
  { name: 'Spinach', emoji: '🥬', category: 'Vegetables' },

  // Cereals
  { name: 'Wheat', emoji: '🌾', category: 'Cereals' },
  { name: 'Rice', emoji: '🍚', category: 'Cereals' },
  { name: 'Paddy(Common)', emoji: '🌾', category: 'Cereals' },
  { name: 'Maize', emoji: '🌽', category: 'Cereals' },
  { name: 'Barley (Jau)', emoji: '🌾', category: 'Cereals' },
  { name: 'Bajra(Pearl Millet)', emoji: '🌾', category: 'Cereals' },
  { name: 'Jowar(Sorghum)', emoji: '🌾', category: 'Cereals' },
  { name: 'Ragi (Finger Millet)', emoji: '🌾', category: 'Cereals' },

  // Pulses
  { name: 'Gram(Chana)', emoji: '🫘', category: 'Pulses' },
  { name: 'Arhar (Tur/Red Gram)', emoji: '🫘', category: 'Pulses' },
  { name: 'Pegeon Pea(Arhar Fali)', emoji: '🫛', category: 'Pulses' },
  { name: 'Moong(Green Gram)', emoji: '🫘', category: 'Pulses' },
  { name: 'Urad (Black Gram)', emoji: '🫘', category: 'Pulses' },
  { name: 'Masur(Lentil)', emoji: '🫘', category: 'Pulses' },
  { name: 'Peas(Dry)', emoji: '🫛', category: 'Pulses' },
  { name: 'Peas wet', emoji: '🫛', category: 'Pulses' },

  // Spices
  { name: 'Garlic', emoji: '🧄', category: 'Spices' },
  { name: 'Ginger(Green)', emoji: '🫚', category: 'Spices' },
  { name: 'Turmeric', emoji: '🌿', category: 'Spices' },
  { name: 'Coriander(Leaves)', emoji: '🌿', category: 'Spices' },
  { name: 'Coriander(Seed)', emoji: '🌿', category: 'Spices' },
  { name: 'Dry Chillies', emoji: '🌶️', category: 'Spices' },
  { name: 'Black Pepper', emoji: '⚫', category: 'Spices' },
  { name: 'Cardamoms', emoji: '🌱', category: 'Spices' },

  // Oilseeds
  { name: 'Mustard', emoji: '🌼', category: 'Oilseeds' },
  { name: 'Soyabean', emoji: '🫘', category: 'Oilseeds' },
  { name: 'Groundnut', emoji: '🥜', category: 'Oilseeds' },
  { name: 'Sunflower', emoji: '🌻', category: 'Oilseeds' },
  { name: 'Sesamum(Sesame,Gingelly,Til)', emoji: '🌱', category: 'Oilseeds' },
  { name: 'Castor Seed', emoji: '🌰', category: 'Oilseeds' },

  // Fruits
  { name: 'Apple', emoji: '🍎', category: 'Fruits' },
  { name: 'Banana', emoji: '🍌', category: 'Fruits' },
  { name: 'Banana - Green', emoji: '🍌', category: 'Fruits' },
  { name: 'Mango', emoji: '🥭', category: 'Fruits' },
  { name: 'Orange', emoji: '🍊', category: 'Fruits' },
  { name: 'Papaya', emoji: '🍈', category: 'Fruits' },
  { name: 'Guava', emoji: '🍈', category: 'Fruits' },
  { name: 'Pomegranate', emoji: '🍎', category: 'Fruits' },
  { name: 'Grapes', emoji: '🍇', category: 'Fruits' },
  { name: 'Water Melon', emoji: '🍉', category: 'Fruits' },
  { name: 'Lemon', emoji: '🍋', category: 'Fruits' },
  { name: 'Coconut', emoji: '🥥', category: 'Fruits' },

  // Commercial / Fiber
  { name: 'Cotton', emoji: '🌱', category: 'Commercial' },
  { name: 'Sugarcane', emoji: '🎋', category: 'Commercial' },
  { name: 'Jute', emoji: '🌾', category: 'Commercial' },
];

export const INDIAN_STATES = [
  'Andaman and Nicobar',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli',
  'Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const STATE_DISTRICTS_MAP = {
  'Uttar Pradesh': [
    'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh',
    'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti',
    'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah',
    'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad',
    'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun',
    'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi',
    'Kheri', 'Kushinagar', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura',
    'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh',
    'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur',
    'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi',
  ],
  'Maharashtra': [
    'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur',
    'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City',
    'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani',
    'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha',
    'Washim', 'Yavatmal',
  ],
  'Madhya Pradesh': [
    'Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam',
    'Rewa', 'Murwara', 'Singrauli', 'Burhanpur', 'Khandwa', 'Morena', 'Bhind', 'Chhindwara',
    'Guna', 'Shivpuri', 'Vidisha', 'Damoh', 'Mandsaur', 'Khargone', 'Neemuch', 'Panna',
    'Sehore', 'Hoshangabad', 'Dhar', 'Betul', 'Seoni', 'Datia', 'Chhatarpur',
  ],
  'Bihar': [
    'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah',
    'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Danapur', 'Bettiah', 'Saharsa', 'Sasaram',
    'Hajipur', 'Dehri', 'Siwan', 'Motihari', 'Nawada', 'Bagaha', 'Buxar', 'Kishanganj', 'Sitamarhi',
    'Jamui', 'Jehanabad', 'Aurangabad', 'Lakhisarai', 'Gopalganj', 'Madhubani', 'Samastipur',
  ],
  'Punjab': [
    'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 'Ferozepur',
    'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Mansa', 'Moga', 'Muktsar',
    'Pathankot', 'Patiala', 'Rupnagar', 'Sahibzada Ajit Singh Nagar', 'Sangrur', 'Shahid Bhagat Singh Nagar', 'Tarn Taran',
  ],
  'Haryana': [
    'Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram', 'Hisar', 'Jhajjar',
    'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Nuh', 'Palwal', 'Panchkula',
    'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar',
  ],
  'Rajasthan': [
    'Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi',
    'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer',
    'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh',
    'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur',
  ],
  'Gujarat': [
    'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Botad',
    'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka', 'Gandhinagar', 'Gir Somnath', 'Jamnagar',
    'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal',
    'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad',
  ],
  'Karnataka': [
    'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 'Chamarajanagar',
    'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davanagere', 'Dharwad',
    'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru',
    'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir',
  ],
  'West Bengal': [
    'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling', 'Hooghly',
    'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda', 'Murshidabad', 'Nadia',
    'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur', 'Purba Bardhaman', 'Purba Medinipur',
    'Purulia', 'South 24 Parganas', 'Uttar Dinajpur',
  ],
};

export class MarketPriceService {
  /**
   * Helper: Redis cache reader with silent fallback
   */
  static async getFromCache(key) {
    try {
      if (redis && redis.status === 'ready') {
        const cached = await redis.get(key);
        if (cached) {
          return JSON.parse(cached);
        }
      }
    } catch (err) {
      logger.debug('Redis cache get failed, bypassing cache', { key, error: err.message });
    }
    return null;
  }

  /**
   * Helper: Redis cache writer with silent fallback
   */
  static async setInCache(key, data, ttlSeconds = CACHE_TTL_SECONDS) {
    try {
      if (redis && redis.status === 'ready') {
        await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
      }
    } catch (err) {
      logger.debug('Redis cache set failed', { key, error: err.message });
    }
  }

  /**
   * 1. GET ALL COMMODITIES: Dynamic unique sorted list of all available crops
   */
  static async getCommodities(search = '') {
    const cacheKey = `market-prices:commodities:${(search || '').toLowerCase().trim()}`;
    const cached = await this.getFromCache(cacheKey);
    if (cached) return cached;

    // 1. Gather all known catalogue commodities
    const commodityMap = new Map();
    for (const c of COMMODITIES_CATALOG) {
      commodityMap.set(c.name.toLowerCase(), c);
    }

    // 2. Discover any additional commodities from PostgreSQL
    try {
      const dbCommodities = await prisma.marketPrice.findMany({
        where: { commodity: { not: null } },
        select: { commodity: true },
        distinct: ['commodity'],
      });

      for (const row of dbCommodities) {
        if (!row.commodity) continue;
        const trimmed = row.commodity.trim();
        const lower = trimmed.toLowerCase();
        if (!commodityMap.has(lower)) {
          commodityMap.set(lower, {
            name: trimmed,
            emoji: '🌾',
            category: 'Agriculture',
          });
        }
      }
    } catch (err) {
      logger.debug('Could not query DB commodities, using catalogue', { error: err.message });
    }

    // 3. Convert to sorted array
    let list = Array.from(commodityMap.values()).sort((a, b) => a.name.localeCompare(b.name));

    // 4. Apply optional search filter
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || (c.category && c.category.toLowerCase().includes(q))
      );
    }

    await this.setInCache(cacheKey, list, 3600); // 1 hour TTL
    return list;
  }

  /**
   * 2. GET ALL STATES: Sorted list of Indian States
   */
  static async getStates() {
    const cacheKey = 'market-prices:states';
    const cached = await this.getFromCache(cacheKey);
    if (cached) return cached;

    const statesSet = new Set(INDIAN_STATES);

    try {
      const dbStates = await prisma.marketPrice.findMany({
        where: { state: { not: null } },
        select: { state: true },
        distinct: ['state'],
      });
      for (const s of dbStates) {
        if (s.state && s.state.trim()) {
          statesSet.add(s.state.trim());
        }
      }
    } catch (err) {
      logger.debug('Could not query DB states', { error: err.message });
    }

    const list = Array.from(statesSet).sort((a, b) => a.localeCompare(b));
    await this.setInCache(cacheKey, list, 3600);
    return list;
  }

  /**
   * 3. GET DISTRICTS: Districts dependent on selected State
   */
  static async getDistricts(state = 'Uttar Pradesh') {
    const cleanState = (state || 'Uttar Pradesh').trim();
    const cacheKey = `market-prices:districts:${cleanState.toLowerCase()}`;
    const cached = await this.getFromCache(cacheKey);
    if (cached) return cached;

    const districtsSet = new Set();

    // 1. Add static mapped districts if known
    if (STATE_DISTRICTS_MAP[cleanState]) {
      for (const d of STATE_DISTRICTS_MAP[cleanState]) {
        districtsSet.add(d);
      }
    }

    // 2. Discover dynamically from DB records
    try {
      const dbDistricts = await prisma.marketPrice.findMany({
        where: {
          state: { equals: cleanState, mode: 'insensitive' },
          district: { not: null },
        },
        select: { district: true },
        distinct: ['district'],
      });
      for (const row of dbDistricts) {
        if (row.district && row.district.trim()) {
          districtsSet.add(row.district.trim());
        }
      }
    } catch (err) {
      logger.debug('Could not query DB districts', { error: err.message });
    }

    const list = Array.from(districtsSet).sort((a, b) => a.localeCompare(b));
    await this.setInCache(cacheKey, list, 3600);
    return list;
  }

  /**
   * 4. GET MANDIS: Mandis for a given state & district
   */
  static async getMandis(state = 'Uttar Pradesh', district = '') {
    const cleanState = (state || 'Uttar Pradesh').trim();
    const cleanDistrict = (district || '').trim();
    const cacheKey = `market-prices:mandis:${cleanState.toLowerCase()}:${cleanDistrict.toLowerCase()}`;
    const cached = await this.getFromCache(cacheKey);
    if (cached) return cached;

    const mandisSet = new Set();

    try {
      const whereClause = {
        state: { equals: cleanState, mode: 'insensitive' },
      };
      if (cleanDistrict && cleanDistrict !== 'All' && cleanDistrict !== 'All Districts') {
        whereClause.district = { equals: cleanDistrict, mode: 'insensitive' };
      }

      const dbMandis = await prisma.marketPrice.findMany({
        where: whereClause,
        select: { market: true },
        distinct: ['market'],
      });

      for (const row of dbMandis) {
        if (row.market && row.market.trim()) {
          mandisSet.add(row.market.trim());
        }
      }
    } catch (err) {
      logger.debug('Could not query DB mandis', { error: err.message });
    }

    // Default mandi if none found
    if (mandisSet.size === 0 && cleanDistrict) {
      mandisSet.add(`${cleanDistrict} APMC Mandi`);
    }

    const list = ['All Mandis', ...Array.from(mandisSet).sort((a, b) => a.localeCompare(b))];
    await this.setInCache(cacheKey, list, 1800);
    return list;
  }

  /**
   * 5. PERSISTENCE: Save normalized records to PostgreSQL
   */
  static async persistRecords(records = []) {
    if (!Array.isArray(records) || records.length === 0) return 0;
    let count = 0;

    for (const r of records) {
      try {
        if (!r.commodity || !r.market || !r.recordHash) continue;
        const arrivalDate = MarketPriceNormalizer.parseArrivalDate(r.arrivalDateIso || r.arrivalDate);

        await prisma.marketPrice.upsert({
          where: { recordHash: r.recordHash },
          update: {
            minPrice: r.minPrice,
            maxPrice: r.maxPrice,
            modalPrice: r.modalPrice,
            pricePerKg: r.pricePerKg,
            variety: r.variety,
            grade: r.grade,
            fetchedAt: new Date(),
          },
          create: {
            commodity: r.commodity,
            variety: r.variety,
            grade: r.grade,
            state: r.state,
            district: r.district,
            market: r.market,
            arrivalDate,
            date: arrivalDate,
            minPrice: r.minPrice,
            maxPrice: r.maxPrice,
            modalPrice: r.modalPrice,
            pricePerKg: r.pricePerKg,
            unit: '₹/Quintal',
            recordHash: r.recordHash,
            source: 'data.gov.in',
            fetchedAt: new Date(),
          },
        });
        count++;
      } catch (err) {
        logger.debug('Skipping record persistence error', { error: err.message });
      }
    }
    return count;
  }

  /**
   * 6. LIVE MARKET PRICES: Filtered variety-wise mandi records + summary + pagination
   */
  static async getMarketPrices({
    commodity = 'Tomato',
    state = 'Uttar Pradesh',
    district = '',
    market = '',
    variety = '',
    arrivalDate = '',
    page = 1,
    limit = 50,
  } = {}) {
    const cleanCrop = (commodity || 'Tomato').trim();
    const cleanState = (state || 'Uttar Pradesh').trim();
    const cleanDistrict = (district || '').trim();
    const cleanMarket = (market || '').trim();
    const cleanVariety = (variety || '').trim();
    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const offset = (pageNum - 1) * limitNum;

    // Cache key containing ALL filter parameters
    const cacheKey = [
      'market-prices',
      cleanCrop.toLowerCase(),
      cleanState.toLowerCase(),
      (cleanDistrict || 'all').toLowerCase(),
      (cleanMarket || 'all').toLowerCase(),
      (cleanVariety || 'all').toLowerCase(),
      (arrivalDate || 'latest').toLowerCase(),
      offset,
      limitNum,
    ].join(':');

    const cached = await this.getFromCache(cacheKey);
    if (cached) {
      return { ...cached, fromCache: true };
    }

    // 1. Fetch from Government API Client
    const upstream = await GovernmentMarketPriceClient.fetchRecords({
      commodity: cleanCrop,
      state: cleanState,
      district: cleanDistrict,
      arrivalDate,
      limit: 200,
      offset: 0,
      sortByDateDesc: true,
    });

    let rawRecords = upstream.records || [];

    // 2. If API call returned records, persist in PostgreSQL
    if (rawRecords.length > 0) {
      const normalizedForDb = rawRecords.map((r) => MarketPriceNormalizer.normalizeRecord(r));
      this.persistRecords(normalizedForDb).catch(() => {});
    } else {
      // If upstream failed or returned 0, try querying recently persisted records in DB
      try {
        const whereClause = {
          commodity: { equals: cleanCrop, mode: 'insensitive' },
          state: { equals: cleanState, mode: 'insensitive' },
        };
        if (cleanDistrict && cleanDistrict !== 'All' && cleanDistrict !== 'All Districts') {
          whereClause.district = { equals: cleanDistrict, mode: 'insensitive' };
        }
        if (cleanMarket && cleanMarket !== 'All' && cleanMarket !== 'All Mandis') {
          whereClause.market = { equals: cleanMarket, mode: 'insensitive' };
        }
        if (cleanVariety && cleanVariety !== 'All' && cleanVariety !== 'All Varieties') {
          whereClause.variety = { equals: cleanVariety, mode: 'insensitive' };
        }

        const dbRecords = await prisma.marketPrice.findMany({
          where: whereClause,
          orderBy: { arrivalDate: 'desc' },
          take: 100,
        });

        if (dbRecords.length > 0) {
          rawRecords = dbRecords;
        }
      } catch (err) {
        logger.debug('DB fallback query skipped', { error: err.message });
      }
    }

    // 3. Normalize all records
    const normalizedData = MarketPriceNormalizer.normalizeBatch(rawRecords);
    let allRecords = normalizedData.records;

    // 4. In-memory filter by market and variety if specific was selected
    if (cleanMarket && cleanMarket !== 'All' && cleanMarket !== 'All Mandis') {
      allRecords = allRecords.filter(
        (r) => r.market.toLowerCase() === cleanMarket.toLowerCase()
      );
    }
    if (cleanVariety && cleanVariety !== 'All' && cleanVariety !== 'All Varieties') {
      allRecords = allRecords.filter(
        (r) => r.variety.toLowerCase() === cleanVariety.toLowerCase()
      );
    }

    // Recalculate summary after filters
    const summary = MarketPriceNormalizer.normalizeBatch(allRecords).summary;
    const total = allRecords.length;
    const paginatedRecords = allRecords.slice(offset, offset + limitNum);

    // Get list of all distinct varieties and mandis available for this result
    const availableVarieties = Array.from(new Set(allRecords.map((r) => r.variety))).sort();
    const availableMandis = Array.from(new Set(allRecords.map((r) => r.market))).sort();

    const responsePayload = {
      success: true,
      commodity: cleanCrop,
      location: {
        state: cleanState,
        district: cleanDistrict || 'All Districts',
        market: cleanMarket || 'All Mandis',
      },
      records: paginatedRecords,
      summary,
      availableVarieties,
      availableMandis,
      pagination: {
        page: pageNum,
        limit: limitNum,
        offset,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
      source: {
        name: 'Government Open Data API (Data.gov.in)',
        resourceId: '35985678-0d79-46b4-9ed6-6f13308a1d24',
        arrivalDate: summary.latestDate || arrivalDate || 'Recent',
        retrievedAt: new Date().toISOString(),
      },
      hasData: allRecords.length > 0,
      fromCache: false,
    };

    // Cache if records exist
    if (allRecords.length > 0) {
      await this.setInCache(cacheKey, responsePayload, CACHE_TTL_SECONDS);
    }

    return responsePayload;
  }

  /**
   * 7. PRICE TREND: Timeseries strictly for the selected commodity & location
   */
  static async getPriceTrend({
    commodity = 'Tomato',
    state = 'Uttar Pradesh',
    district = '',
    market = '',
    days = 30,
  } = {}) {
    const cleanCrop = (commodity || 'Tomato').trim();
    const cleanState = (state || 'Uttar Pradesh').trim();
    const cleanDistrict = (district || '').trim();
    const cleanMarket = (market || '').trim();
    const daysNum = Number(days) || 30;

    const cacheKey = `market-prices:trend:${cleanCrop.toLowerCase()}:${cleanState.toLowerCase()}:${(cleanDistrict || 'all').toLowerCase()}:${(cleanMarket || 'all').toLowerCase()}:${daysNum}`;
    const cached = await this.getFromCache(cacheKey);
    if (cached) return cached;

    // Query DB for historical prices
    let trendSeries = [];
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysNum);

      const whereClause = {
        commodity: { equals: cleanCrop, mode: 'insensitive' },
        state: { equals: cleanState, mode: 'insensitive' },
        arrivalDate: { gte: startDate },
      };
      if (cleanDistrict && cleanDistrict !== 'All' && cleanDistrict !== 'All Districts') {
        whereClause.district = { equals: cleanDistrict, mode: 'insensitive' };
      }
      if (cleanMarket && cleanMarket !== 'All' && cleanMarket !== 'All Mandis') {
        whereClause.market = { equals: cleanMarket, mode: 'insensitive' };
      }

      const rows = await prisma.marketPrice.findMany({
        where: whereClause,
        orderBy: { arrivalDate: 'asc' },
        take: 100,
      });

      if (rows.length > 0) {
        // Group by date
        const dateMap = new Map();
        for (const row of rows) {
          const dStr = row.arrivalDate
            ? new Date(row.arrivalDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
            : 'Recent';
          if (!dateMap.has(dStr)) {
            dateMap.set(dStr, {
              date: dStr,
              modalPrice: Number(row.modalPrice) || 0,
              minPrice: Number(row.minPrice) || 0,
              maxPrice: Number(row.maxPrice) || 0,
              count: 1,
            });
          } else {
            const item = dateMap.get(dStr);
            item.modalPrice += Number(row.modalPrice) || 0;
            item.minPrice = Math.min(item.minPrice, Number(row.minPrice) || item.minPrice);
            item.maxPrice = Math.max(item.maxPrice, Number(row.maxPrice) || item.maxPrice);
            item.count += 1;
          }
        }

        trendSeries = Array.from(dateMap.values()).map((item) => ({
          date: item.date,
          modalPrice: Math.round(item.modalPrice / item.count),
          minPrice: Math.round(item.minPrice),
          maxPrice: Math.round(item.maxPrice),
        }));
      }
    } catch (err) {
      logger.debug('Error computing trend series from DB', { error: err.message });
    }

    // If still no trend points, fetch fresh records from API for this commodity
    if (trendSeries.length === 0) {
      const live = await this.getMarketPrices({
        commodity: cleanCrop,
        state: cleanState,
        district: cleanDistrict,
        market: cleanMarket,
        limit: 50,
      });

      if (live.records && live.records.length > 0) {
        const dateMap = new Map();
        for (const r of live.records) {
          const d = r.arrivalDate || 'Today';
          if (!dateMap.has(d)) {
            dateMap.set(d, {
              date: d,
              modalPrice: r.modalPrice,
              minPrice: r.minPrice,
              maxPrice: r.maxPrice,
              count: 1,
            });
          } else {
            const cur = dateMap.get(d);
            cur.modalPrice += r.modalPrice;
            cur.minPrice = Math.min(cur.minPrice, r.minPrice);
            cur.maxPrice = Math.max(cur.maxPrice, r.maxPrice);
            cur.count += 1;
          }
        }
        trendSeries = Array.from(dateMap.values()).map((item) => ({
          date: item.date,
          modalPrice: Math.round(item.modalPrice / item.count),
          minPrice: item.minPrice,
          maxPrice: item.maxPrice,
        }));
      }
    }

    const payload = {
      success: true,
      commodity: cleanCrop,
      state: cleanState,
      district: cleanDistrict,
      days: daysNum,
      series: trendSeries,
    };

    if (trendSeries.length > 0) {
      await this.setInCache(cacheKey, payload, 1800);
    }

    return payload;
  }

  /**
   * 8. ALL CROPS OVERVIEW: Real mandi prices across top commodities in a given location
   */
  static async getAllCropsOverview({ state = 'Uttar Pradesh', district = '' } = {}) {
    const cleanState = (state || 'Uttar Pradesh').trim();
    const cleanDistrict = (district || '').trim();
    const cacheKey = `market-prices:overview:${cleanState.toLowerCase()}:${(cleanDistrict || 'all').toLowerCase()}`;
    const cached = await this.getFromCache(cacheKey);
    if (cached) return cached;

    // Top commodities to query for overview
    const topCrops = [
      { name: 'Tomato', emoji: '🍅' },
      { name: 'Potato', emoji: '🥔' },
      { name: 'Onion', emoji: '🧅' },
      { name: 'Wheat', emoji: '🌾' },
      { name: 'Rice', emoji: '🍚' },
      { name: 'Garlic', emoji: '🧄' },
      { name: 'Green Chilli', emoji: '🌶️' },
      { name: 'Mustard', emoji: '🌼' },
      { name: 'Maize', emoji: '🌽' },
      { name: 'Cauliflower', emoji: '🥦' },
      { name: 'Cabbage', emoji: '🥬' },
      { name: 'Cucumbar(Kheera)', emoji: '🥒' },
    ];

    const results = [];

    for (const crop of topCrops) {
      try {
        const prices = await this.getMarketPrices({
          commodity: crop.name,
          state: cleanState,
          district: cleanDistrict,
          limit: 1,
        });

        if (prices && prices.summary && prices.summary.modalPrice) {
          const firstRecord = prices.records[0] || {};
          results.push({
            crop: crop.name,
            emoji: crop.emoji,
            modalPrice: prices.summary.modalPrice,
            pricePerKg: prices.summary.pricePerKg,
            minPrice: prices.summary.minPrice,
            maxPrice: prices.summary.maxPrice,
            unit: '₹/Quintal',
            unitPerKg: '₹/kg',
            market: firstRecord.market || 'Regional Mandi',
            district: firstRecord.district || cleanDistrict || cleanState,
            state: cleanState,
            arrivalDate: prices.summary.latestDate,
          });
        }
      } catch (err) {
        logger.debug('Skipping crop in overview', { crop: crop.name, error: err.message });
      }
    }

    await this.setInCache(cacheKey, results, 900);
    return results;
  }

  /**
   * 9. MARKET COMPARISON: Compare modal prices across reporting UP mandis for a commodity
   */
  static async getMarketComparison({
    commodity = 'Tomato',
    state = 'Uttar Pradesh',
    district = '',
  } = {}) {
    const cleanCrop = (commodity || 'Tomato').trim();
    const cleanState = (state || 'Uttar Pradesh').trim();
    const cleanDistrict = (district || '').trim();

    const cacheKey = `market-prices:comparison:${cleanCrop.toLowerCase()}:${cleanState.toLowerCase()}:${(cleanDistrict || 'all').toLowerCase()}`;
    const cached = await this.getFromCache(cacheKey);
    if (cached) return cached;

    // Get up to 100 live records across all mandis
    const res = await this.getMarketPrices({
      commodity: cleanCrop,
      state: cleanState,
      district: cleanDistrict === 'All Districts' || cleanDistrict === 'All' ? '' : cleanDistrict,
      market: '',
      limit: 100,
    });

    const records = res.records || [];
    const mandiMap = new Map();

    for (const r of records) {
      if (!r.market || !r.modalPrice) continue;
      const key = r.market;
      if (!mandiMap.has(key)) {
        mandiMap.set(key, {
          market: r.market,
          district: r.district || cleanDistrict || cleanState,
          modalPrice: r.modalPrice,
          minPrice: r.minPrice,
          maxPrice: r.maxPrice,
          pricePerKg: r.pricePerKg,
          variety: r.variety,
          arrivalDate: r.arrivalDate,
        });
      }
    }

    // Sort descending by modalPrice (highest rate first)
    const comparison = Array.from(mandiMap.values()).sort((a, b) => b.modalPrice - a.modalPrice);

    if (comparison.length > 0) {
      await this.setInCache(cacheKey, comparison, 900);
    }

    return comparison;
  }
}

export default MarketPriceService;
