import crypto from 'node:crypto';

export class MarketPriceNormalizer {
  /**
   * Parse Data.gov.in date string "DD/MM/YYYY" to Date object
   */
  static parseArrivalDate(dateStr) {
    if (!dateStr) return new Date();
    if (dateStr instanceof Date) return dateStr;
    const cleanStr = String(dateStr).replace(/\\/g, '').trim();
    if (cleanStr.includes('/')) {
      const parts = cleanStr.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        const d = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
        if (!isNaN(d.getTime())) return d;
      }
    }
    if (cleanStr.includes('-')) {
      const parts = cleanStr.split('-');
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          // YYYY-MM-DD
          const [year, month, day] = parts;
          const d = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
          if (!isNaN(d.getTime())) return d;
        } else {
          // DD-MM-YYYY
          const [day, month, year] = parts;
          const d = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
          if (!isNaN(d.getTime())) return d;
        }
      }
    }
    const d = new Date(cleanStr);
    return isNaN(d.getTime()) ? new Date() : d;
  }

  /**
   * Helper: Generate unique MD5 hash for a mandi record
   */
  static generateRecordHash(record) {
    const raw = [
      (record.state || '').trim().toLowerCase(),
      (record.district || '').trim().toLowerCase(),
      (record.market || '').trim().toLowerCase(),
      (record.commodity || '').trim().toLowerCase(),
      (record.variety || '').trim().toLowerCase(),
      (record.grade || '').trim().toLowerCase(),
      record.arrivalDateIso || record.arrivalDate || '',
    ].join('|');
    return crypto.createHash('md5').update(raw).digest('hex');
  }

  /**
   * Normalize single raw Data.gov.in or DB record
   */
  static normalizeRecord(raw) {
    if (!raw) return null;

    const commodity = (raw.Commodity || raw.commodity || '').trim();
    const state = (raw.State || raw.state || '').trim();
    const district = (raw.District || raw.district || '').trim();
    const market = (raw.Market || raw.market || '').trim();
    const variety = (raw.Variety || raw.variety || 'Other').trim();
    const grade = (raw.Grade || raw.grade || 'FAQ').trim();

    const rawArrival = raw.Arrival_Date || raw.arrival_date || raw.arrivalDate;
    const parsedDate = this.parseArrivalDate(rawArrival);
    const arrivalDateIso = parsedDate.toISOString().split('T')[0];

    const day = String(parsedDate.getUTCDate()).padStart(2, '0');
    const month = String(parsedDate.getUTCMonth() + 1).padStart(2, '0');
    const year = parsedDate.getUTCFullYear();
    const arrivalDateDisplay = `${day}/${month}/${year}`;

    const minPrice = parseFloat(raw.Min_Price || raw.min_price || raw.minPrice) || 0;
    const maxPrice = parseFloat(raw.Max_Price || raw.max_price || raw.maxPrice) || 0;
    let modalPrice = parseFloat(raw.Modal_Price || raw.modal_price || raw.modalPrice) || 0;
    if (!modalPrice && (minPrice || maxPrice)) {
      modalPrice = (minPrice + maxPrice) / 2;
    }
    const pricePerKg = Number((modalPrice / 100).toFixed(2));

    const recordHash = this.generateRecordHash({
      state,
      district,
      market,
      commodity,
      variety,
      grade,
      arrivalDateIso,
    });

    return {
      commodity,
      variety,
      grade,
      state,
      district,
      market,
      arrivalDate: arrivalDateDisplay,
      arrivalDateIso,
      minPrice: Math.round(minPrice),
      maxPrice: Math.round(maxPrice),
      modalPrice: Math.round(modalPrice),
      pricePerKg,
      unit: '₹/Quintal',
      unitPerKg: '₹/kg',
      recordHash,
    };
  }

  /**
   * Normalize an array of records and generate statistical summary
   */
  static normalizeBatch(records = []) {
    if (!Array.isArray(records)) records = [];

    const normalized = records
      .map((r) => this.normalizeRecord(r))
      .filter((r) => r && r.commodity && r.market);

    if (normalized.length === 0) {
      return {
        records: [],
        summary: {
          minPrice: null,
          maxPrice: null,
          modalPrice: null,
          pricePerKg: null,
          averagePrice: null,
          marketsCount: 0,
          varietiesCount: 0,
          latestDate: null,
        },
      };
    }

    const validMins = normalized.map((r) => r.minPrice).filter((p) => p > 0);
    const validMaxs = normalized.map((r) => r.maxPrice).filter((p) => p > 0);
    const validModals = normalized.map((r) => r.modalPrice).filter((p) => p > 0);

    const minPrice = validMins.length > 0 ? Math.min(...validMins) : 0;
    const maxPrice = validMaxs.length > 0 ? Math.max(...validMaxs) : 0;
    const avgModal =
      validModals.length > 0
        ? Math.round(validModals.reduce((a, b) => a + b, 0) / validModals.length)
        : 0;
    const pricePerKg = Number((avgModal / 100).toFixed(2));

    const marketsSet = new Set(normalized.map((r) => r.market.toLowerCase()));
    const varietiesSet = new Set(normalized.map((r) => r.variety.toLowerCase()));

    // Find the newest arrival date
    const sortedDates = [...normalized].sort(
      (a, b) => new Date(b.arrivalDateIso).getTime() - new Date(a.arrivalDateIso).getTime()
    );
    const latestDate = sortedDates[0]?.arrivalDate || null;

    return {
      records: normalized,
      summary: {
        minPrice,
        maxPrice,
        modalPrice: avgModal,
        pricePerKg,
        averagePrice: avgModal,
        marketsCount: marketsSet.size,
        varietiesCount: varietiesSet.size,
        latestDate,
      },
    };
  }
}

export default MarketPriceNormalizer;
