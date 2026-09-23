import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedFarmerDashboard() {
  console.log('🌾 Seeding KrishiSetu Phase 2.3 Farmer Dashboard Connected Data...');

  // 1. Ensure all 5 crops exist with high quality vector assets
  const cropsData = [
    {
      id: 'CROP-POTATO',
      cropCode: 'POTATO',
      cropName: 'Potato',
      category: 'VEGETABLE',
      unit: 'KG',
      season: 'Rabi',
      active: true,
      imageUrl: '/assets/crops/potato.svg',
    },
    {
      id: 'CROP-ONION',
      cropCode: 'ONION',
      cropName: 'Onion',
      category: 'VEGETABLE',
      unit: 'KG',
      season: 'Rabi/Kharif',
      active: true,
      imageUrl: '/assets/crops/onion.svg',
    },
    {
      id: 'CROP-TOMATO',
      cropCode: 'TOMATO',
      cropName: 'Tomato',
      category: 'VEGETABLE',
      unit: 'KG',
      season: 'Kharif/Rabi',
      active: true,
      imageUrl: '/assets/crops/tomato.svg',
    },
    {
      id: 'CROP-WHEAT',
      cropCode: 'WHEAT',
      cropName: 'Wheat',
      category: 'GRAIN',
      unit: 'KG',
      season: 'Rabi',
      active: true,
      imageUrl: '/assets/crops/wheat.svg',
    },
    {
      id: 'CROP-CHILLI',
      cropCode: 'CHILLI',
      cropName: 'Chilli',
      category: 'SPICE',
      unit: 'KG',
      season: 'Kharif',
      active: true,
      imageUrl: '/assets/crops/chilli.svg',
    },
  ];

  for (const c of cropsData) {
    await prisma.crop.upsert({
      where: { id: c.id },
      update: c,
      create: c,
    });
  }
  console.log('✓ Crops synchronized (5 crops active)');

  // 2. Demo Farmer User & Profile: Ramesh Kumar
  await prisma.user.update({
    where: { email: 'farmer001@krishisetu.demo' },
    data: {
      fullName: 'Ramesh Kumar',
    },
  });

  const farmerProfile = await prisma.farmerProfile.upsert({
    where: { id: 'FAR-001' },
    update: {
      profilePhoto: '/assets/roles/farmer.png',
      village: 'Rohania',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      pincode: '221005',
      farmerType: 'Progressive Farmer',
      farmName: 'Kashi Green Acres',
      totalLandArea: 8.5,
      landUnit: 'ACRE',
      farmingType: 'Organic & Precision',
      primaryCrops: ['Potato', 'Onion', 'Tomato', 'Wheat', 'Chilli'],
      irrigationType: 'DRIP & TUBE_WELL',
      kycStatus: 'VERIFIED',
    },
    create: {
      id: 'FAR-001',
      userId: 'USR-FAR-001',
      profilePhoto: '/assets/roles/farmer.png',
      village: 'Rohania',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      pincode: '221005',
      farmerType: 'Progressive Farmer',
      farmName: 'Kashi Green Acres',
      totalLandArea: 8.5,
      landUnit: 'ACRE',
      farmingType: 'Organic & Precision',
      primaryCrops: ['Potato', 'Onion', 'Tomato', 'Wheat', 'Chilli'],
      irrigationType: 'DRIP & TUBE_WELL',
      kycStatus: 'VERIFIED',
    },
  });
  console.log('✓ Demo farmer profile updated: Ramesh Kumar (Varanasi, UP)');

  // 3. Farm holdings & plots
  const farms = [
    {
      id: 'FARM-001',
      farmerId: 'FAR-001',
      farmName: 'Kashi Green Acres - Plot A',
      areaAcres: 3.5,
      soilType: 'Alluvial Loam',
      irrigationType: 'DRIP',
      latitude: 25.3176,
      longitude: 82.9739,
    },
    {
      id: 'FARM-001-B',
      farmerId: 'FAR-001',
      farmName: 'Kashi Green Acres - Plot B',
      areaAcres: 2.5,
      soilType: 'Clay Loam',
      irrigationType: 'SPRINKLER',
      latitude: 25.321,
      longitude: 82.978,
    },
    {
      id: 'FARM-001-C',
      farmerId: 'FAR-001',
      farmName: 'Kashi Green Acres - Plot C',
      areaAcres: 2.5,
      soilType: 'Sandy Loam',
      irrigationType: 'CANAL',
      latitude: 25.325,
      longitude: 82.982,
    },
  ];

  for (const f of farms) {
    await prisma.farm.upsert({
      where: { id: f.id },
      update: f,
      create: f,
    });
  }
  console.log('✓ 3 Farm plots configured for Ramesh Kumar');

  // 4. Produce records and linked Inventory Lots
  const produceLots = [
    {
      produce: {
        id: 'PROD-FAR-01',
        farmerId: 'FAR-001',
        farmId: 'FARM-001',
        cropId: 'CROP-POTATO',
        harvestDate: new Date('2026-09-01'),
        grade: 'A',
        quantityKg: 5000,
        expectedPricePerKg: 24.0,
        qualityScore: 9.4,
        organic: true,
      },
      lot: {
        id: 'LOT-FAR-01',
        produceId: 'PROD-FAR-01',
        farmerId: 'FAR-001',
        cropId: 'CROP-POTATO',
        availableQtyKg: 5000,
        reservedQtyKg: 0,
        warehouseLocation: 'Cold Storage Varanasi',
        status: 'AVAILABLE',
        askingPricePerKg: 24.0,
      },
    },
    {
      produce: {
        id: 'PROD-FAR-02',
        farmerId: 'FAR-001',
        farmId: 'FARM-001-B',
        cropId: 'CROP-ONION',
        harvestDate: new Date('2026-09-05'),
        grade: 'A',
        quantityKg: 2000,
        expectedPricePerKg: 28.0,
        qualityScore: 9.1,
        organic: false,
      },
      lot: {
        id: 'LOT-FAR-02',
        produceId: 'PROD-FAR-02',
        farmerId: 'FAR-001',
        cropId: 'CROP-ONION',
        availableQtyKg: 1000,
        reservedQtyKg: 1000,
        warehouseLocation: 'Varanasi Mandi Warehouse',
        status: 'RESERVED',
        askingPricePerKg: 28.0,
      },
    },
    {
      produce: {
        id: 'PROD-FAR-03',
        farmerId: 'FAR-001',
        farmId: 'FARM-001',
        cropId: 'CROP-TOMATO',
        harvestDate: new Date('2026-09-10'),
        grade: 'B',
        quantityKg: 1500,
        expectedPricePerKg: 32.0,
        qualityScore: 8.7,
        organic: true,
      },
      lot: {
        id: 'LOT-FAR-03',
        produceId: 'PROD-FAR-03',
        farmerId: 'FAR-001',
        cropId: 'CROP-TOMATO',
        availableQtyKg: 1500,
        reservedQtyKg: 0,
        warehouseLocation: 'On-Farm Polyhouse',
        status: 'AVAILABLE',
        askingPricePerKg: 32.0,
      },
    },
    {
      produce: {
        id: 'PROD-FAR-04',
        farmerId: 'FAR-001',
        farmId: 'FARM-001-C',
        cropId: 'CROP-WHEAT',
        harvestDate: new Date('2026-08-20'),
        grade: 'A',
        quantityKg: 3000,
        expectedPricePerKg: 22.0,
        qualityScore: 9.6,
        organic: true,
      },
      lot: {
        id: 'LOT-FAR-04',
        produceId: 'PROD-FAR-04',
        farmerId: 'FAR-001',
        cropId: 'CROP-WHEAT',
        availableQtyKg: 0,
        reservedQtyKg: 0,
        warehouseLocation: 'FPO Aggregation Hub',
        status: 'SOLD',
        askingPricePerKg: 22.0,
      },
    },
    {
      produce: {
        id: 'PROD-FAR-05',
        farmerId: 'FAR-001',
        farmId: 'FARM-001-B',
        cropId: 'CROP-CHILLI',
        harvestDate: new Date('2026-09-12'),
        grade: 'A',
        quantityKg: 1000,
        expectedPricePerKg: 40.0,
        qualityScore: 9.2,
        organic: true,
      },
      lot: {
        id: 'LOT-FAR-05',
        produceId: 'PROD-FAR-05',
        farmerId: 'FAR-001',
        cropId: 'CROP-CHILLI',
        availableQtyKg: 1000,
        reservedQtyKg: 0,
        warehouseLocation: 'Kashi Agro Center',
        status: 'AVAILABLE',
        askingPricePerKg: 40.0,
      },
    },
  ];

  for (const item of produceLots) {
    await prisma.produce.upsert({
      where: { id: item.produce.id },
      update: item.produce,
      create: item.produce,
    });
    await prisma.inventoryLot.upsert({
      where: { id: item.lot.id },
      update: item.lot,
      create: item.lot,
    });
  }
  console.log('✓ 5 Produce items & inventory lots seeded');

  // 5. Connect Real Orders, Shipments & Payments
  // Check bulk buyer existence or seed demo buyer
  let buyer = await prisma.bulkBuyerProfile.findFirst();
  if (!buyer) {
    const buyerUser = await prisma.user.create({
      data: {
        id: 'USR-BUY-001',
        email: 'buyer001@krishisetu.demo',
        phone: '918000000001',
        fullName: 'Hotel A (Procurement), Lucknow',
        passwordHash: '$2b$10$YdyH4mK1cE0hEqDXWBeJCOBIpQ9PCAgNwI6i3Uz3.JKNq592CJZpO',
        role: 'BULK_BUYER',
        status: 'ACTIVE',
      },
    });
    buyer = await prisma.bulkBuyerProfile.create({
      data: {
        id: 'BUY-001',
        userId: buyerUser.id,
        businessName: 'Hotel A, Lucknow',
        businessType: 'Hospitality & Bulk Buyer',
        district: 'Lucknow',
        state: 'Uttar Pradesh',
        pincode: '226001',
      },
    });
  }

  // Ensure logistics & vehicle exist
  let logistics = await prisma.logisticsProfile.findFirst({
    include: { vehicles: true },
  });
  if (!logistics) {
    const logUser = await prisma.user.create({
      data: {
        id: 'USR-LOG-001',
        email: 'logistics001@krishisetu.demo',
        phone: '919000000001',
        fullName: 'Kashi Agri-Logistics Fleet',
        passwordHash: '$2b$10$YdyH4mK1cE0hEqDXWBeJCOBIpQ9PCAgNwI6i3Uz3.JKNq592CJZpO',
        role: 'LOGISTICS',
        status: 'ACTIVE',
      },
    });
    logistics = await prisma.logisticsProfile.create({
      data: {
        id: 'LOG-001',
        userId: logUser.id,
        businessName: 'Kashi Agri-Logistics',
        businessType: 'Cold-Chain & Reefer Fleet',
        contactPerson: 'Suresh Yadav',
        district: 'Varanasi',
        state: 'Uttar Pradesh',
      },
      include: { vehicles: true },
    });
  }

  // Use existing vehicle and its logistics provider
  const anyVehicle = await prisma.vehicle.findFirst();
  const vehicleId = anyVehicle.id;
  const logisticsId = anyVehicle.logisticsId;

  // Seed 4 connected orders for Ramesh Kumar
  const orders = [
    {
      id: 'KS001',
      buyerId: buyer.id,
      lotId: 'LOT-FAR-01',
      cropId: 'CROP-POTATO',
      quantityKg: 2000,
      unitPrice: 24.0,
      totalAmount: 48000.0,
      status: 'IN_TRANSIT',
      orderDate: new Date('2026-09-18'),
      shipment: {
        id: 'SHIP-KS001',
        logisticsId: logisticsId,
        vehicleId: vehicleId,
        origin: 'Rohania Farm, Varanasi',
        destination: 'Hotel A, Hazratganj, Lucknow',
        status: 'IN_TRANSIT',
        distanceKm: 285.0,
        etaHours: 3.5,
      },
      payment: {
        id: 'PAY-KS001',
        amount: 48000.0,
        method: 'ESCROW_ACCOUNT',
        status: 'ESCROW_LOCKED',
        transactionRef: 'TXN-UPI-982143',
      },
    },
    {
      id: 'KS002',
      buyerId: buyer.id,
      lotId: 'LOT-FAR-02',
      cropId: 'CROP-ONION',
      quantityKg: 1000,
      unitPrice: 28.0,
      totalAmount: 28000.0,
      status: 'DELIVERED',
      orderDate: new Date('2026-09-12'),
      shipment: {
        id: 'SHIP-KS002',
        logisticsId: logisticsId,
        vehicleId: vehicleId,
        origin: 'Rohania Farm, Varanasi',
        destination: 'Retail Mart, Varanasi Hub',
        status: 'DELIVERED',
        distanceKm: 22.0,
        etaHours: 0.0,
      },
      payment: {
        id: 'PAY-KS002',
        amount: 28000.0,
        method: 'DIRECT_BANK_TRANSFER',
        status: 'SETTLED',
        transactionRef: 'TXN-NEFT-673192',
      },
    },
    {
      id: 'KS003',
      buyerId: buyer.id,
      lotId: 'LOT-FAR-03',
      cropId: 'CROP-TOMATO',
      quantityKg: 1500,
      unitPrice: 32.0,
      totalAmount: 48000.0,
      status: 'CONFIRMED',
      orderDate: new Date('2026-09-20'),
      payment: {
        id: 'PAY-KS003',
        amount: 48000.0,
        method: 'ESCROW_ACCOUNT',
        status: 'ESCROW_LOCKED',
        transactionRef: 'TXN-UPI-441290',
      },
    },
    {
      id: 'KS004',
      buyerId: buyer.id,
      lotId: 'LOT-FAR-04',
      cropId: 'CROP-WHEAT',
      quantityKg: 3000,
      unitPrice: 22.0,
      totalAmount: 66000.0,
      status: 'PENDING',
      orderDate: new Date('2026-09-21'),
      payment: {
        id: 'PAY-KS004',
        amount: 24000.0, // Pending settlement amount matching reference UI
        method: 'ESCROW_ACCOUNT',
        status: 'PENDING',
        transactionRef: 'TXN-PENDING-001',
      },
    },
  ];

  for (const ord of orders) {
    const { shipment, payment, ...orderData } = ord;
    await prisma.order.upsert({
      where: { id: ord.id },
      update: orderData,
      create: orderData,
    });

    if (shipment) {
      await prisma.shipment.upsert({
        where: { id: shipment.id },
        update: { ...shipment, orderId: ord.id },
        create: { ...shipment, orderId: ord.id },
      });
    }

    if (payment) {
      await prisma.payment.upsert({
        where: { id: payment.id },
        update: { ...payment, orderId: ord.id },
        create: { ...payment, orderId: ord.id },
      });
    }
  }
  console.log('✓ 4 Real Orders with shipments and payments configured (KS001 - KS004)');

  // 6. Additional Historical Settled Payments to reach ₹1,24,800 Total Earnings matching reference
  // KS002 = ₹28,000. We add historical settled orders for previous months:
  const historicalSettled = [
    { id: 'ORD-HIST-01', month: 'March 2026', date: new Date('2026-03-24'), amount: 12000 },
    { id: 'ORD-HIST-02', month: 'April 2026', date: new Date('2026-04-20'), amount: 18500 },
    { id: 'ORD-HIST-03', month: 'May 2026', date: new Date('2026-05-18'), amount: 22000 },
    { id: 'ORD-HIST-04', month: 'June 2026', date: new Date('2026-06-25'), amount: 19500 },
    { id: 'ORD-HIST-05', month: 'July 2026', date: new Date('2026-07-28'), amount: 24800 },
  ];

  for (const h of historicalSettled) {
    await prisma.order.upsert({
      where: { id: h.id },
      update: {
        buyerId: buyer.id,
        lotId: 'LOT-FAR-01',
        cropId: 'CROP-POTATO',
        quantityKg: h.amount / 20,
        unitPrice: 20.0,
        totalAmount: h.amount,
        status: 'DELIVERED',
        orderDate: h.date,
      },
      create: {
        id: h.id,
        buyerId: buyer.id,
        lotId: 'LOT-FAR-01',
        cropId: 'CROP-POTATO',
        quantityKg: h.amount / 20,
        unitPrice: 20.0,
        totalAmount: h.amount,
        status: 'DELIVERED',
        orderDate: h.date,
      },
    });

    await prisma.payment.upsert({
      where: { id: `PAY-${h.id}` },
      update: {
        orderId: h.id,
        amount: h.amount,
        method: 'DIRECT_BANK_TRANSFER',
        status: 'SETTLED',
        transactionRef: `TXN-HIST-${h.id}`,
        createdAt: h.date,
      },
      create: {
        id: `PAY-${h.id}` ,
        orderId: h.id,
        amount: h.amount,
        method: 'DIRECT_BANK_TRANSFER',
        status: 'SETTLED',
        transactionRef: `TXN-HIST-${h.id}`,
        createdAt: h.date,
      },
    });
  }
  console.log('✓ Historical settled payments configured (Total settled = ₹1,24,800)');

  // 7. Market Prices for Varanasi & Mandis across 30 days
  const now = new Date();
  const mandiPrices = [
    // Potato: 30 days curve rising from 17 to 24
    { cropId: 'CROP-POTATO', base: 17, target: 24 },
    { cropId: 'CROP-ONION', base: 22, target: 28 },
    { cropId: 'CROP-TOMATO', base: 26, target: 32 },
    { cropId: 'CROP-WHEAT', base: 19, target: 22 },
    { cropId: 'CROP-CHILLI', base: 34, target: 40 },
  ];

  for (const m of mandiPrices) {
    for (let day = 30; day >= 0; day--) {
      const priceDate = new Date(now);
      priceDate.setDate(priceDate.getDate() - day);
      const progress = (30 - day) / 30;
      // Slight fluctuation around curve
      const noise = (Math.sin(day * 1.5) * 1.2);
      const computedPrice = Math.max(10, Number((m.base + (m.target - m.base) * progress + noise).toFixed(2)));
      const id = `MP-${m.cropId}-${priceDate.toISOString().split('T')[0]}`;

      await prisma.marketPrice.upsert({
        where: { id },
        update: {
          date: priceDate,
          market: 'Varanasi Mandi (Main)',
          cropId: m.cropId,
          pricePerKg: computedPrice,
          arrivalsKg: 45000 + Math.floor(Math.random() * 8000),
        },
        create: {
          id,
          date: priceDate,
          market: 'Varanasi Mandi (Main)',
          cropId: m.cropId,
          pricePerKg: computedPrice,
          arrivalsKg: 45000 + Math.floor(Math.random() * 8000),
        },
      });
    }
  }
  console.log('✓ 30-day realistic Market Price timeseries seeded for 5 crops');

  // 8. AI Recommendations in PostgreSQL
  const recommendations = [
    {
      id: 'REC-FAR-01',
      farmerId: 'FAR-001',
      cropId: 'CROP-POTATO',
      type: 'BEST_TIME_TO_SELL',
      recommendation: 'Potato prices may increase by 8-12% in next 7 days. Consider holding 20% of your stock for upcoming festive demand.',
      confidence: 0.92,
    },
    {
      id: 'REC-FAR-02',
      farmerId: 'FAR-001',
      cropId: 'CROP-ONION',
      type: 'HIGH_DEMAND',
      recommendation: 'High demand for Onion detected in Lucknow wholesale mandis (~15 MT deficit). Higher net margins available.',
      confidence: 0.88,
    },
    {
      id: 'REC-FAR-03',
      farmerId: 'FAR-001',
      cropId: 'CROP-TOMATO',
      type: 'WEATHER_RISK',
      recommendation: 'Possible rainfall expected in 2 days. Plan harvesting accordingly for exposed plots to avoid waterlogging.',
      confidence: 0.85,
    },
    {
      id: 'REC-FAR-04',
      farmerId: 'FAR-001',
      cropId: 'CROP-POTATO',
      type: 'STORAGE_INTELLIGENCE',
      recommendation: 'Nearby verified cold storage facility available (5 km away, Rohania) at ₹1.5/kg/month with zero spoilage guarantee.',
      confidence: 0.94,
    },
  ];

  for (const r of recommendations) {
    await prisma.aIRecommendation.upsert({
      where: { id: r.id },
      update: r,
      create: r,
    });
  }
  console.log('✓ AI Recommendations stored in PostgreSQL database');

  console.log('🎉 Farmer Dashboard Database Initialization Complete!\n');
}

// Allow direct execution
if (process.argv[1].endsWith('seed-farmer-dashboard.js')) {
  seedFarmerDashboard()
    .catch((e) => {
      console.error('Error seeding farmer dashboard:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
