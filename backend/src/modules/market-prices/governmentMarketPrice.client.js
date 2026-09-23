import axios from 'axios';
import env from '../../config/env.js';
import logger from '../../lib/logger.js';

const TIMEOUT_MS = 10000;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

export class GovernmentMarketPriceClient {
  /**
   * Helper: Format Date or date string to DD/MM/YYYY
   */
  static formatArrivalDate(dateInput) {
    if (!dateInput) return null;
    if (typeof dateInput === 'string') {
      const clean = dateInput.trim();
      // Already DD/MM/YYYY
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(clean)) return clean;
      // ISO YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}/.test(clean)) {
        const [year, month, day] = clean.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
      }
    }
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return null;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Fetch variety-wise daily records from Data.gov.in
   */
  static async fetchRecords({
    state,
    district,
    market,
    commodity,
    variety,
    arrivalDate,
    limit = 100,
    offset = 0,
    sortByDateDesc = true,
  } = {}) {
    const url = `${env.DATA_GOV_BASE_URL}/${env.DATA_GOV_MANDI_RESOURCE_ID}`;
    const params = {
      'api-key': env.DATA_GOV_API_KEY,
      format: 'json',
      limit: Math.min(Math.max(Number(limit) || 50, 1), 500),
      offset: Math.max(Number(offset) || 0, 0),
    };

    if (sortByDateDesc) {
      params['sort[Arrival_Date]'] = 'desc';
    }

    if (state && state !== 'All' && state !== 'ALL' && state !== 'All States') {
      params['filters[State]'] = state.trim();
    }
    if (district && district !== 'All' && district !== 'ALL' && district !== 'All Districts') {
      params['filters[District]'] = district.trim();
    }
    if (commodity && commodity !== 'All' && commodity !== 'ALL' && commodity !== 'All Commodities' && commodity !== 'All Crops') {
      params['filters[Commodity]'] = commodity.trim();
    }

    const formattedDate = this.formatArrivalDate(arrivalDate);
    if (formattedDate) {
      params['filters[Arrival_Date]'] = formattedDate;
    }

    // Safe logging params (EXCLUDE api-key)
    const logParams = { ...params };
    delete logParams['api-key'];

    const startTime = Date.now();

    for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
      try {
        logger.info('Calling Data.gov.in Mandi API', {
          resourceId: env.DATA_GOV_MANDI_RESOURCE_ID,
          filters: logParams,
          attempt,
        });

        const response = await axios.get(url, {
          params,
          timeout: TIMEOUT_MS,
          headers: {
            Accept: 'application/json',
            'User-Agent': 'KrishiSetu-Backend/2.0',
          },
        });

        const durationMs = Date.now() - startTime;
        const data = response.data || {};
        const records = Array.isArray(data.records) ? data.records : [];
        const total = Number(data.total) || records.length;

        logger.info('Data.gov.in Mandi API succeeded', {
          durationMs,
          recordCount: records.length,
          total,
          status: response.status,
        });

        return {
          success: true,
          records,
          total,
          count: records.length,
          limit: params.limit,
          offset: params.offset,
          updatedDate: data.updated_date,
        };
      } catch (error) {
        const durationMs = Date.now() - startTime;
        const isLastAttempt = attempt > MAX_RETRIES;
        const status = error.response?.status;
        const isTransient = !status || status >= 500 || error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';

        logger.warn('Data.gov.in Mandi API attempt failed', {
          attempt,
          durationMs,
          status,
          code: error.code,
          message: error.message,
          isTransient,
        });

        if (isLastAttempt || !isTransient) {
          return {
            success: false,
            records: [],
            total: 0,
            count: 0,
            limit: params.limit,
            offset: params.offset,
            error: error.message || 'Upstream Data.gov.in request failed',
            status,
          };
        }

        // Wait with backoff before retry
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * attempt));
      }
    }

    return {
      success: false,
      records: [],
      total: 0,
      count: 0,
      error: 'Max retries exceeded for Data.gov.in Mandi API',
    };
  }
}

export default GovernmentMarketPriceClient;
