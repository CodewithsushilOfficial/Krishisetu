import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { seedFarmerDashboard } from './seed-farmer-dashboard.js';
import { seedLogisticsDashboard } from './seed-logistics-dashboard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

// Locate mock data directory
const possibleDirs = [
  path.resolve(__dirname, '../../Docs/KrishiSetu_Connected_Mock_Data'),
  path.resolve(__dirname, '../../docs/krishisetu-mock-data'),
  path.resolve(process.cwd(), 'Docs/KrishiSetu_Connected_Mock_Data'),
  path.resolve(process.cwd(), 'docs/krishisetu-mock-data'),
];

let mockDataDir = possibleDirs.find((d) => fs.existsSync(d));
if (!mockDataDir) {
  console.error('❌ Could not locate mock data directory. Checked:', possibleDirs);
  process.exit(1);
}

/**
 * Robust CSV parser that correctly handles quoted strings, escaped quotes, and commas
 */
function parseCSV(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV file not found: ${filePath}`);
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.trim().split(/\r?\n/);
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const row = [];
    let inQuotes = false;
    let field = '';

    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        row.push(field.trim().replace(/^"|"$/g, ''));
        field = '';
      } else {
        field += ch;
      }
    }
    row.push(field.trim().replace(/^"|"$/g, ''));

    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = row[idx] !== undefined ? row[idx] : '';
    });
    rows.push(obj);
  }

  return rows;
}

const DEMO_PASSWORD = 'Demo@12345';

async function main() {
  console.log('========================================');
  console.log('🌱 KrishiSetu Connected Demo Data Seeder');
  console.log('========================================');
  console.log(`Source data: ${mockDataDir}`);

  // 1. Password hashing (generate once for efficiency)
  const saltRounds = 10;
  const commonPasswordHash = await bcrypt.hash(DEMO_PASSWORD, saltRounds);

  // 2. Load and sanitize Users
  console.log('\n[1/21] Seeding Users...');
  const rawUsers = parseCSV(path.join(mockDataDir, '01_users.csv'));

  // Disambiguate demo admin/control admin vs consumer to guarantee uniqueness
  const sanitizedUsers = [];
  const seenEmails = new Set();
  const seenPhones = new Set();
  const seenUserIds = new Set();

  for (const u of rawUsers) {
    let userId = u.user_id;
    let email = u.email.trim().toLowerCase();
    let phone = u.phone.trim();
    let role = u.role.trim();

    // Disambiguate the collision between early USR-CON rows and consumer/admin accounts
    if (userId === 'USR-ADM-001' && email === 'demo.admin1@krishisetu.demo') {
      // Row 201 has USR-ADMIN-001, keep that one
      continue;
    }
    if (userId === 'USR-ADM-002' && email === 'demo.admin2@krishisetu.demo') {
      userId = 'USR-ADMIN-002';
      phone = '9000002002';
    }
    if (userId === 'USR-CON-001' && role === 'CONTROL_ADMIN') {
      // Row 202 has USR-CADMIN-001, keep that one
      continue;
    }
    if (userId === 'USR-CON-002' && role === 'CONTROL_ADMIN') {
      userId = 'USR-CADMIN-002';
      email = 'demo.controladmin2@krishisetu.demo';
      phone = '9000003002';
    }

    if (seenEmails.has(email) || seenPhones.has(phone) || seenUserIds.has(userId)) {
      continue;
    }

    seenEmails.add(email);
    seenPhones.add(phone);
    seenUserIds.add(userId);

    sanitizedUsers.push({
      id: userId,
      email,
      phone,
      fullName: deriveFullName(u),
      passwordHash: commonPasswordHash,
      role,
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: true,
    });
  }

  for (const u of sanitizedUsers) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {
        email: u.email,
        phone: u.phone,
        passwordHash: u.passwordHash,
        role: u.role,
        status: u.status,
        emailVerified: u.emailVerified,
        phoneVerified: u.phoneVerified,
      },
      create: u,
    });
  }
  console.log(`✓ Users seeded: ${sanitizedUsers.length}`);

  // 3. Farmer Profiles
  console.log('[2/21] Seeding Farmer Profiles...');
  const rawFarmers = parseCSV(path.join(mockDataDir, '02_farmer_profiles.csv'));
  for (const f of rawFarmers) {
    await prisma.farmerProfile.upsert({
      where: { id: f.farmer_id },
      update: {
        village: f.village,
        district: f.district,
        state: f.state,
        pincode: f.pincode,
        farmerType: f.farmer_type,
        farmingType: f.farming_type,
        primaryCrops: [f.primary_crop],
        irrigationType: f.irrigation_type,
        kycStatus: f.kyc_status,
      },
      create: {
        id: f.farmer_id,
        userId: f.user_id,
        gender: f.gender,
        village: f.village,
        district: f.district,
        state: f.state,
        pincode: f.pincode,
        farmerType: f.farmer_type,
        farmingType: f.farming_type,
        primaryCrops: [f.primary_crop],
        irrigationType: f.irrigation_type,
        kycStatus: f.kyc_status,
        totalLandArea: 5.0,
      },
    });
  }
  console.log(`✓ Farmer Profiles seeded: ${rawFarmers.length}`);

  // 4. FPO Profiles
  console.log('[3/21] Seeding FPO Profiles...');
  const rawFpos = parseCSV(path.join(mockDataDir, '03_fpo_profiles.csv'));
  for (const f of rawFpos) {
    await prisma.fpoProfile.upsert({
      where: { id: f.fpo_id },
      update: {
        fpoName: f.name,
        registrationNumber: f.registration_number,
        state: f.state,
        district: f.district,
        addressLine: f.address,
        pincode: f.pincode,
        memberCount: parseInt(f.member_count, 10) || 0,
        primaryCrops: f.primary_crops ? f.primary_crops.split(';').map((s) => s.trim()) : [],
        verificationStatus: f.verification_status === 'VERIFIED' ? 'VERIFIED' : 'PENDING',
      },
      create: {
        id: f.fpo_id,
        userId: f.user_id,
        fpoName: f.name,
        registrationNumber: f.registration_number,
        state: f.state,
        district: f.district,
        addressLine: f.address,
        pincode: f.pincode,
        memberCount: parseInt(f.member_count, 10) || 0,
        primaryCrops: f.primary_crops ? f.primary_crops.split(';').map((s) => s.trim()) : [],
        verificationStatus: f.verification_status === 'VERIFIED' ? 'VERIFIED' : 'PENDING',
      },
    });
  }
  console.log(`✓ FPO Profiles seeded: ${rawFpos.length}`);

  // 5. Logistics Profiles
  console.log('[4/21] Seeding Logistics Profiles...');
  const rawLogistics = parseCSV(path.join(mockDataDir, '04_logistics_profiles.csv'));
  for (const l of rawLogistics) {
    await prisma.logisticsProfile.upsert({
      where: { id: l.logistics_id },
      update: {
        businessName: l.company_name,
        contactPerson: l.contact_person,
        state: l.state,
        district: l.district,
        serviceArea: l.service_area,
        verificationStatus: l.verification_status,
        rating: parseFloat(l.rating) || 4.5,
      },
      create: {
        id: l.logistics_id,
        userId: l.user_id,
        businessName: l.company_name,
        contactPerson: l.contact_person,
        state: l.state,
        district: l.district,
        serviceArea: l.service_area,
        verificationStatus: l.verification_status,
        rating: parseFloat(l.rating) || 4.5,
      },
    });
  }
  console.log(`✓ Logistics Profiles seeded: ${rawLogistics.length}`);

  // 6. Bulk Buyer Profiles
  console.log('[5/21] Seeding Bulk Buyer Profiles...');
  const rawBuyers = parseCSV(path.join(mockDataDir, '05_buyer_profiles.csv'));
  for (const b of rawBuyers) {
    await prisma.bulkBuyerProfile.upsert({
      where: { id: b.buyer_id },
      update: {
        businessName: b.business_name,
        businessType: b.business_type,
        gstNumber: b.gst_number,
        state: b.state,
        district: b.district,
        pincode: b.pincode,
        procurementFrequency: b.procurement_frequency,
        preferredCrops: b.preferred_crops ? b.preferred_crops.split(';').map((s) => s.trim()) : [],
        verificationStatus: b.verification_status,
      },
      create: {
        id: b.buyer_id,
        userId: b.user_id,
        businessName: b.business_name,
        businessType: b.business_type,
        gstNumber: b.gst_number,
        state: b.state,
        district: b.district,
        pincode: b.pincode,
        procurementFrequency: b.procurement_frequency,
        preferredCrops: b.preferred_crops ? b.preferred_crops.split(';').map((s) => s.trim()) : [],
        verificationStatus: b.verification_status,
      },
    });
  }
  console.log(`✓ Bulk Buyer Profiles seeded: ${rawBuyers.length}`);

  // 7. Consumer Profiles
  console.log('[6/21] Seeding Consumer Profiles...');
  const rawConsumers = parseCSV(path.join(mockDataDir, '06_consumer_profiles.csv'));
  for (const c of rawConsumers) {
    await prisma.consumerProfile.upsert({
      where: { id: c.consumer_id },
      update: {
        fullName: c.full_name,
        state: c.state,
        district: c.district,
        addressLine: c.address,
        pincode: c.pincode,
        verificationStatus: c.verification_status,
      },
      create: {
        id: c.consumer_id,
        userId: c.user_id,
        fullName: c.full_name,
        state: c.state,
        district: c.district,
        addressLine: c.address,
        pincode: c.pincode,
        verificationStatus: c.verification_status,
      },
    });
  }
  console.log(`✓ Consumer Profiles seeded: ${rawConsumers.length}`);

  // 8. Farms
  console.log('[7/21] Seeding Farms...');
  const rawFarms = parseCSV(path.join(mockDataDir, '07_farms.csv'));
  for (const f of rawFarms) {
    await prisma.farm.upsert({
      where: { id: f.farm_id },
      update: {
        farmName: f.farm_name,
        areaAcres: parseFloat(f.area_acres),
        soilType: f.soil_type,
        irrigationType: f.irrigation_type,
        latitude: parseFloat(f.latitude) || null,
        longitude: parseFloat(f.longitude) || null,
      },
      create: {
        id: f.farm_id,
        farmerId: f.farmer_id,
        farmName: f.farm_name,
        areaAcres: parseFloat(f.area_acres),
        soilType: f.soil_type,
        irrigationType: f.irrigation_type,
        latitude: parseFloat(f.latitude) || null,
        longitude: parseFloat(f.longitude) || null,
      },
    });
  }
  console.log(`✓ Farms seeded: ${rawFarms.length}`);

  // 9. FPO Memberships
  console.log('[8/21] Seeding FPO Memberships...');
  const rawMemberships = parseCSV(path.join(mockDataDir, '08_fpo_memberships.csv'));
  for (const m of rawMemberships) {
    await prisma.fpoMembership.upsert({
      where: { id: m.membership_id },
      update: {
        status: m.status,
        joinedDate: new Date(m.joined_date),
      },
      create: {
        id: m.membership_id,
        fpoId: m.fpo_id,
        farmerId: m.farmer_id,
        status: m.status,
        joinedDate: new Date(m.joined_date),
      },
    });
  }
  console.log(`✓ FPO Memberships seeded: ${rawMemberships.length}`);

  // 10. Vehicles
  console.log('[9/21] Seeding Vehicles...');
  const rawVehicles = parseCSV(path.join(mockDataDir, '09_vehicles.csv'));
  for (const v of rawVehicles) {
    await prisma.vehicle.upsert({
      where: { id: v.vehicle_id },
      update: {
        vehicleNumber: v.vehicle_number,
        vehicleType: v.vehicle_type,
        capacityKg: parseFloat(v.capacity_kg),
        refrigerated: v.refrigerated === 'true',
      },
      create: {
        id: v.vehicle_id,
        logisticsId: v.logistics_id,
        vehicleNumber: v.vehicle_number,
        vehicleType: v.vehicle_type,
        capacityKg: parseFloat(v.capacity_kg),
        refrigerated: v.refrigerated === 'true',
      },
    });
  }
  console.log(`✓ Vehicles seeded: ${rawVehicles.length}`);

  // 11. Crops
  console.log('[10/21] Seeding Crops and Linking Images...');
  const rawCrops = parseCSV(path.join(mockDataDir, '10_crops.csv'));
  const cropImageMap = {
    'CROP-TOMATO': '/assets/crops/tomato.svg',
    'CROP-POTATO': '/assets/crops/potato.svg',
    'CROP-ONION': '/assets/crops/onion.svg',
  };

  for (const c of rawCrops) {
    const imageUrl = cropImageMap[c.crop_id] || null;
    await prisma.crop.upsert({
      where: { id: c.crop_id },
      update: {
        cropCode: c.crop_code,
        cropName: c.crop_name,
        category: c.category,
        unit: c.unit,
        season: c.season,
        active: c.active === 'true',
        imageUrl,
      },
      create: {
        id: c.crop_id,
        cropCode: c.crop_code,
        cropName: c.crop_name,
        category: c.category,
        unit: c.unit,
        season: c.season,
        active: c.active === 'true',
        imageUrl,
      },
    });
  }
  console.log(`✓ Crops seeded: ${rawCrops.length} (Images mapped: Tomato, Potato, Onion)`);

  // 12. Produce
  console.log('[11/21] Seeding Produce...');
  const rawProduce = parseCSV(path.join(mockDataDir, '11_produce.csv'));
  for (const p of rawProduce) {
    await prisma.produce.upsert({
      where: { id: p.produce_id },
      update: {
        harvestDate: new Date(p.harvest_date),
        grade: p.grade,
        quantityKg: parseFloat(p.quantity_kg),
        expectedPricePerKg: parseFloat(p.expected_price_per_kg),
        qualityScore: parseFloat(p.quality_score),
        organic: p.organic === 'true',
      },
      create: {
        id: p.produce_id,
        farmerId: p.farmer_id,
        farmId: p.farm_id,
        cropId: p.crop_id,
        harvestDate: new Date(p.harvest_date),
        grade: p.grade,
        quantityKg: parseFloat(p.quantity_kg),
        expectedPricePerKg: parseFloat(p.expected_price_per_kg),
        qualityScore: parseFloat(p.quality_score),
        organic: p.organic === 'true',
      },
    });
  }
  console.log(`✓ Produce seeded: ${rawProduce.length}`);

  // 13. Inventory Lots
  console.log('[12/21] Seeding Inventory Lots...');
  const rawLots = parseCSV(path.join(mockDataDir, '12_inventory_lots.csv'));
  for (const l of rawLots) {
    await prisma.inventoryLot.upsert({
      where: { id: l.lot_id },
      update: {
        availableQtyKg: parseFloat(l.available_qty_kg),
        reservedQtyKg: parseFloat(l.reserved_qty_kg),
        warehouseLocation: l.warehouse_location,
        status: l.status,
        askingPricePerKg: parseFloat(l.asking_price_per_kg),
      },
      create: {
        id: l.lot_id,
        produceId: l.produce_id,
        farmerId: l.farmer_id,
        cropId: l.crop_id,
        availableQtyKg: parseFloat(l.available_qty_kg),
        reservedQtyKg: parseFloat(l.reserved_qty_kg),
        warehouseLocation: l.warehouse_location,
        status: l.status,
        askingPricePerKg: parseFloat(l.asking_price_per_kg),
      },
    });
  }
  console.log(`✓ Inventory Lots seeded: ${rawLots.length}`);

  // 14. Market Prices
  console.log('[13/21] Seeding Market Prices...');
  const rawPrices = parseCSV(path.join(mockDataDir, '13_market_prices.csv'));
  for (const pr of rawPrices) {
    await prisma.marketPrice.upsert({
      where: { id: pr.price_id },
      update: {
        date: new Date(pr.date),
        market: pr.market,
        pricePerKg: parseFloat(pr.price_per_kg),
        arrivalsKg: parseFloat(pr.arrivals_kg),
      },
      create: {
        id: pr.price_id,
        cropId: pr.crop_id,
        date: new Date(pr.date),
        market: pr.market,
        pricePerKg: parseFloat(pr.price_per_kg),
        arrivalsKg: parseFloat(pr.arrivals_kg),
      },
    });
  }
  console.log(`✓ Market Prices seeded: ${rawPrices.length}`);

  // 15. Demands
  console.log('[14/21] Seeding Demands...');
  const rawDemands = parseCSV(path.join(mockDataDir, '14_demands.csv'));
  for (const d of rawDemands) {
    await prisma.demand.upsert({
      where: { id: d.demand_id },
      update: {
        requiredQtyKg: parseFloat(d.required_qty_kg),
        targetPricePerKg: parseFloat(d.target_price_per_kg),
        deliveryCity: d.delivery_city,
        requiredBy: new Date(d.required_by),
        status: d.status,
      },
      create: {
        id: d.demand_id,
        buyerId: d.buyer_id,
        cropId: d.crop_id,
        requiredQtyKg: parseFloat(d.required_qty_kg),
        targetPricePerKg: parseFloat(d.target_price_per_kg),
        deliveryCity: d.delivery_city,
        requiredBy: new Date(d.required_by),
        status: d.status,
      },
    });
  }
  console.log(`✓ Demands seeded: ${rawDemands.length}`);

  // 16. Demand Pools
  console.log('[15/21] Seeding Demand Pools...');
  const rawPools = parseCSV(path.join(mockDataDir, '15_demand_pools.csv'));
  for (const dp of rawPools) {
    await prisma.demandPool.upsert({
      where: { id: dp.pool_id },
      update: {
        pooledQtyKg: parseFloat(dp.pooled_qty_kg),
        buyersCount: parseInt(dp.buyers_count, 10),
        status: dp.status,
      },
      create: {
        id: dp.pool_id,
        cropId: dp.crop_id,
        pooledQtyKg: parseFloat(dp.pooled_qty_kg),
        buyersCount: parseInt(dp.buyers_count, 10),
        status: dp.status,
      },
    });
  }
  console.log(`✓ Demand Pools seeded: ${rawPools.length}`);

  // 17. Matchings
  console.log('[16/21] Seeding Matchings...');
  const rawMatchings = parseCSV(path.join(mockDataDir, '16_matchings.csv'));
  for (const m of rawMatchings) {
    await prisma.matching.upsert({
      where: { id: m.matching_id },
      update: {
        matchScore: parseFloat(m.match_score),
        recommendedPricePerKg: parseFloat(m.recommended_price_per_kg),
        status: m.status,
      },
      create: {
        id: m.matching_id,
        demandId: m.demand_id,
        lotId: m.lot_id,
        matchScore: parseFloat(m.match_score),
        recommendedPricePerKg: parseFloat(m.recommended_price_per_kg),
        status: m.status,
      },
    });
  }
  console.log(`✓ Matchings seeded: ${rawMatchings.length}`);

  // 18. Orders
  console.log('[17/21] Seeding Orders...');
  const rawOrders = parseCSV(path.join(mockDataDir, '17_orders.csv'));
  for (const o of rawOrders) {
    await prisma.order.upsert({
      where: { id: o.order_id },
      update: {
        quantityKg: parseFloat(o.quantity_kg),
        unitPrice: parseFloat(o.unit_price),
        totalAmount: parseFloat(o.total_amount),
        status: o.status,
        orderDate: new Date(o.order_date),
      },
      create: {
        id: o.order_id,
        buyerId: o.buyer_id,
        lotId: o.lot_id,
        cropId: o.crop_id,
        quantityKg: parseFloat(o.quantity_kg),
        unitPrice: parseFloat(o.unit_price),
        totalAmount: parseFloat(o.total_amount),
        status: o.status,
        orderDate: new Date(o.order_date),
      },
    });
  }
  console.log(`✓ Orders seeded: ${rawOrders.length}`);

  // 19. Payments
  console.log('[18/21] Seeding Payments...');
  const rawPayments = parseCSV(path.join(mockDataDir, '18_payments.csv'));
  for (const py of rawPayments) {
    await prisma.payment.upsert({
      where: { id: py.payment_id },
      update: {
        amount: parseFloat(py.amount),
        method: py.method,
        status: py.status,
        transactionRef: py.transaction_ref,
      },
      create: {
        id: py.payment_id,
        orderId: py.order_id,
        amount: parseFloat(py.amount),
        method: py.method,
        status: py.status,
        transactionRef: py.transaction_ref,
      },
    });
  }
  console.log(`✓ Payments seeded: ${rawPayments.length}`);

  // 20. Shipments & Tracking
  console.log('[19/21] Seeding Shipments & Tracking...');
  const rawShipments = parseCSV(path.join(mockDataDir, '19_shipments.csv'));
  for (const s of rawShipments) {
    await prisma.shipment.upsert({
      where: { id: s.shipment_id },
      update: {
        origin: s.origin,
        destination: s.destination,
        status: s.status,
        distanceKm: parseFloat(s.distance_km),
        etaHours: parseFloat(s.eta_hours),
      },
      create: {
        id: s.shipment_id,
        orderId: s.order_id,
        logisticsId: s.logistics_id,
        vehicleId: s.vehicle_id,
        origin: s.origin,
        destination: s.destination,
        status: s.status,
        distanceKm: parseFloat(s.distance_km),
        etaHours: parseFloat(s.eta_hours),
      },
    });
  }
  console.log(`✓ Shipments seeded: ${rawShipments.length}`);

  const rawTracking = parseCSV(path.join(mockDataDir, '20_tracking.csv'));
  for (const t of rawTracking) {
    await prisma.tracking.upsert({
      where: { id: t.tracking_id },
      update: {
        latitude: parseFloat(t.latitude),
        longitude: parseFloat(t.longitude),
        temperatureC: t.temperature_c ? parseFloat(t.temperature_c) : null,
        recordedAt: new Date(t.recorded_at),
      },
      create: {
        id: t.tracking_id,
        shipmentId: t.shipment_id,
        latitude: parseFloat(t.latitude),
        longitude: parseFloat(t.longitude),
        temperatureC: t.temperature_c ? parseFloat(t.temperature_c) : null,
        recordedAt: new Date(t.recorded_at),
      },
    });
  }
  console.log(`✓ Tracking points seeded: ${rawTracking.length}`);

  // 21. AI Models (Forecasts, Supply Gaps, Recommendations, Route Optimizations)
  console.log('[20/21] Seeding AI Models...');
  const rawForecasts = parseCSV(path.join(mockDataDir, '21_ai_forecasts.csv'));
  for (const fc of rawForecasts) {
    await prisma.aIForecast.upsert({
      where: { id: fc.forecast_id },
      update: {
        market: fc.market,
        forecastDate: new Date(fc.forecast_date),
        predictedDemandKg: parseFloat(fc.predicted_demand_kg),
        predictedSupplyKg: parseFloat(fc.predicted_supply_kg),
        confidence: parseFloat(fc.confidence),
      },
      create: {
        id: fc.forecast_id,
        cropId: fc.crop_id,
        market: fc.market,
        forecastDate: new Date(fc.forecast_date),
        predictedDemandKg: parseFloat(fc.predicted_demand_kg),
        predictedSupplyKg: parseFloat(fc.predicted_supply_kg),
        confidence: parseFloat(fc.confidence),
      },
    });
  }

  const rawGaps = parseCSV(path.join(mockDataDir, '22_ai_supply_gaps.csv'));
  for (const g of rawGaps) {
    await prisma.aISupplyGap.upsert({
      where: { id: g.gap_id },
      update: {
        region: g.region,
        forecastDemandKg: parseFloat(g.forecast_demand_kg),
        forecastSupplyKg: parseFloat(g.forecast_supply_kg),
        gapKg: parseFloat(g.gap_kg),
        severity: g.severity,
      },
      create: {
        id: g.gap_id,
        cropId: g.crop_id,
        region: g.region,
        forecastDemandKg: parseFloat(g.forecast_demand_kg),
        forecastSupplyKg: parseFloat(g.forecast_supply_kg),
        gapKg: parseFloat(g.gap_kg),
        severity: g.severity,
      },
    });
  }

  const rawRecs = parseCSV(path.join(mockDataDir, '23_ai_recommendations.csv'));
  for (const r of rawRecs) {
    await prisma.aIRecommendation.upsert({
      where: { id: r.recommendation_id },
      update: {
        type: r.type,
        recommendation: r.recommendation,
        confidence: parseFloat(r.confidence),
      },
      create: {
        id: r.recommendation_id,
        farmerId: r.farmer_id,
        cropId: r.crop_id,
        type: r.type,
        recommendation: r.recommendation,
        confidence: parseFloat(r.confidence),
      },
    });
  }

  const rawRoutes = parseCSV(path.join(mockDataDir, '24_ai_route_optimization.csv'));
  for (const rt of rawRoutes) {
    await prisma.aIRouteOptimization.upsert({
      where: { id: rt.route_id },
      update: {
        distanceKm: parseFloat(rt.distance_km),
        estimatedTimeHours: parseFloat(rt.estimated_time_hours),
        fuelCostEstimate: parseFloat(rt.fuel_cost_estimate),
        riskScore: parseFloat(rt.risk_score),
        recommended: rt.recommended === 'true',
      },
      create: {
        id: rt.route_id,
        shipmentId: rt.shipment_id,
        distanceKm: parseFloat(rt.distance_km),
        estimatedTimeHours: parseFloat(rt.estimated_time_hours),
        fuelCostEstimate: parseFloat(rt.fuel_cost_estimate),
        riskScore: parseFloat(rt.risk_score),
        recommended: rt.recommended === 'true',
      },
    });
  }
  console.log(`✓ AI Datasets seeded: Forecasts (${rawForecasts.length}), Gaps (${rawGaps.length}), Recommendations (${rawRecs.length}), Routes (${rawRoutes.length})`);

  // 22. Control Tower Alerts
  console.log('[21/21] Seeding Control Tower Alerts...');
  const rawAlerts = parseCSV(path.join(mockDataDir, '25_control_tower_alerts.csv'));
  for (const alt of rawAlerts) {
    await prisma.controlTowerAlert.upsert({
      where: { id: alt.alert_id },
      update: {
        type: alt.type,
        severity: alt.severity,
        region: alt.region,
        message: alt.message,
        status: alt.status,
      },
      create: {
        id: alt.alert_id,
        type: alt.type,
        severity: alt.severity,
        region: alt.region,
        message: alt.message,
        status: alt.status,
      },
    });
  }
  console.log(`✓ Control Tower Alerts seeded: ${rawAlerts.length}`);

  // 23. Verification of all entities and counts
  console.log('\n========================================');
  console.log('KrishiSetu Demo Data Seeder');
  console.log('========================================');

  const counts = {
    users: await prisma.user.count(),
    farmers: await prisma.farmerProfile.count(),
    fpos: await prisma.fpoProfile.count(),
    logistics: await prisma.logisticsProfile.count(),
    buyers: await prisma.bulkBuyerProfile.count(),
    consumers: await prisma.consumerProfile.count(),
    crops: await prisma.crop.count(),
    farms: await prisma.farm.count(),
    fpoMemberships: await prisma.fpoMembership.count(),
    vehicles: await prisma.vehicle.count(),
    produce: await prisma.produce.count(),
    lots: await prisma.inventoryLot.count(),
    marketPrices: await prisma.marketPrice.count(),
    demands: await prisma.demand.count(),
    pools: await prisma.demandPool.count(),
    matchings: await prisma.matching.count(),
    orders: await prisma.order.count(),
    payments: await prisma.payment.count(),
    shipments: await prisma.shipment.count(),
    tracking: await prisma.tracking.count(),
    aiForecasts: await prisma.aIForecast.count(),
    aiSupplyGaps: await prisma.aISupplyGap.count(),
    aiRecommendations: await prisma.aIRecommendation.count(),
    aiRoutes: await prisma.aIRouteOptimization.count(),
    alerts: await prisma.controlTowerAlert.count(),
  };

  printRow('Users', counts.users);
  printRow('Farmers', counts.farmers);
  printRow('FPOs', counts.fpos);
  printRow('Logistics', counts.logistics);
  printRow('Bulk Buyers', counts.buyers);
  printRow('Consumers', counts.consumers);
  printRow('Crops', counts.crops);
  printRow('Farms', counts.farms);
  printRow('FPO Memberships', counts.fpoMemberships);
  printRow('Vehicles', counts.vehicles);
  printRow('Produce', counts.produce);
  printRow('Inventory Lots', counts.lots);
  printRow('Market Prices', counts.marketPrices);
  printRow('Demands', counts.demands);
  printRow('Demand Pools', counts.pools);
  printRow('Matchings', counts.matchings);
  printRow('Orders', counts.orders);
  printRow('Payments', counts.payments);
  printRow('Shipments', counts.shipments);
  printRow('Tracking', counts.tracking);
  printRow('AI Forecasts', counts.aiForecasts);
  printRow('AI Supply Gaps', counts.aiSupplyGaps);
  printRow('AI Recommendations', counts.aiRecommendations);
  printRow('AI Routes', counts.aiRoutes);
  printRow('Alerts', counts.alerts);

  console.log('========================================');
  console.log('Demo credentials verified');
  console.log('========================================');

  const demoAccounts = [
    { role: 'FARMER', email: 'farmer001@krishisetu.demo' },
    { role: 'FPO', email: 'fpo001@krishisetu.demo' },
    { role: 'LOGISTICS', email: 'logistics001@krishisetu.demo' },
    { role: 'BULK_BUYER', email: 'buyer001@krishisetu.demo' },
    { role: 'CONSUMER', email: 'consumer001@krishisetu.demo' },
    { role: 'ADMIN', email: 'demo.admin1@krishisetu.demo' },
    { role: 'CONTROL_ADMIN', email: 'demo.controladmin1@krishisetu.demo' },
  ];

  for (const acc of demoAccounts) {
    const user = await prisma.user.findUnique({ where: { email: acc.email } });
    if (!user) {
      throw new Error(`CRITICAL: Demo account not found: ${acc.email}`);
    }
    const match = await bcrypt.compare(DEMO_PASSWORD, user.passwordHash);
    if (!match) {
      throw new Error(`CRITICAL: Password hash mismatch for ${acc.email}`);
    }
    console.log(`✓ Verified: ${acc.role.padEnd(14)} ${acc.email} [ACTIVE, Password: ${DEMO_PASSWORD}, OTP: 123456]`);
  }

  // Phase 2.3 Connected Farmer Dashboard Seeding
  await seedFarmerDashboard();

  // Phase 2.5 Connected Logistics Dashboard Seeding
  await seedLogisticsDashboard();

  console.log('========================================');
  console.log('Status: SUCCESS');
  console.log('========================================\n');
}

function printRow(label, count) {
  const dots = '.'.repeat(Math.max(2, 30 - label.length));
  console.log(`${label} ${dots} ${count}`);
}

function deriveFullName(u) {
  const parts = u.email.split('@')[0].split('.');
  if (parts.length > 1) {
    return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  }
  return u.user_id;
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed with error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
