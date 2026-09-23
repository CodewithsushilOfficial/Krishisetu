import bcrypt from 'bcrypt';
import prisma from '../src/db/prisma.js';

const DEMO_PASSWORD = 'Demo@12345';

export async function seedLogisticsDashboard() {
  console.log('🚚 Seeding KrishiSetu Phase 2.5 Logistics Partner Connected Data...');

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // 1. Ensure Suresh Yadav User exists (both canonical email and demo login compatibility)
  const sureshUser = await prisma.user.upsert({
    where: { email: 'suresh.yadav@krishisetu.demo' },
    update: {
      fullName: 'Suresh Yadav',
      phone: '938100000099',
      role: 'LOGISTICS',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: true,
      passwordHash,
    },
    create: {
      id: 'USR-LOG-SURESH-001',
      email: 'suresh.yadav@krishisetu.demo',
      phone: '938100000099',
      fullName: 'Suresh Yadav',
      passwordHash,
      role: 'LOGISTICS',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: true,
    },
  });

  // Also sync logistics001@krishisetu.demo for quick one-click demo login
  const demoLog001 = await prisma.user.findUnique({
    where: { email: 'logistics001@krishisetu.demo' },
  });
  if (demoLog001) {
    await prisma.user.update({
      where: { id: demoLog001.id },
      data: {
        fullName: 'Suresh Yadav',
        passwordHash,
      },
    });
  }

  // 2. Upsert Logistics Partner Profile: Suresh Yadav / Yadav Agri-Transporters
  const logisticsProfile = await prisma.logisticsProfile.upsert({
    where: { userId: sureshUser.id },
    update: {
      partnerCode: 'LP-UP-001',
      businessName: 'Yadav Agri-Transporters',
      contactPerson: 'Suresh Yadav',
      contactName: 'Suresh Yadav',
      email: 'suresh.yadav@krishisetu.demo',
      mobile: '9876543210',
      phone: '9876543210',
      addressLine: 'GT Road Transport Nagar, Bay 4',
      city: 'Varanasi',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      pincode: '221002',
      serviceArea: 'Eastern UP & Regional Corridors',
      serviceAreas: ['Varanasi', 'Lucknow', 'Kanpur', 'Prayagraj', 'Jaunpur', 'Indore'],
      vehicleTypes: ['Tata 10 Ton', 'Eicher 16 Ton', 'Mahindra 5 Ton'],
      vehicleCount: 3,
      minCapacityKg: 5000,
      maxCapacityKg: 16000,
      verificationStatus: 'VERIFIED',
      availabilityStatus: 'AVAILABLE',
      rating: 4.80,
      totalTrips: 142,
      completedTrips: 138,
      cancelledTrips: 4,
      totalEarnings: 384500.00,
    },
    create: {
      id: 'LP-SURESH-001',
      userId: sureshUser.id,
      partnerCode: 'LP-UP-001',
      businessName: 'Yadav Agri-Transporters',
      businessType: 'Agri-Fleet Transport Partner',
      contactPerson: 'Suresh Yadav',
      contactName: 'Suresh Yadav',
      email: 'suresh.yadav@krishisetu.demo',
      mobile: '9876543210',
      phone: '9876543210',
      addressLine: 'GT Road Transport Nagar, Bay 4',
      city: 'Varanasi',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      pincode: '221002',
      serviceArea: 'Eastern UP & Regional Corridors',
      serviceAreas: ['Varanasi', 'Lucknow', 'Kanpur', 'Prayagraj', 'Jaunpur', 'Indore'],
      vehicleTypes: ['Tata 10 Ton', 'Eicher 16 Ton', 'Mahindra 5 Ton'],
      vehicleCount: 3,
      minCapacityKg: 5000,
      maxCapacityKg: 16000,
      verificationStatus: 'VERIFIED',
      availabilityStatus: 'AVAILABLE',
      rating: 4.80,
      totalTrips: 142,
      completedTrips: 138,
      cancelledTrips: 4,
      totalEarnings: 384500.00,
    },
  });

  // If logistics001 exists as a separate user, also ensure it has a linked profile pointing to Yadav Agri-Transporters
  if (demoLog001 && demoLog001.id !== sureshUser.id) {
    await prisma.logisticsProfile.upsert({
      where: { userId: demoLog001.id },
      update: {
        partnerCode: 'LP-UP-001-DEMO',
        businessName: 'Yadav Agri-Transporters',
        contactPerson: 'Suresh Yadav',
        contactName: 'Suresh Yadav',
        email: 'logistics001@krishisetu.demo',
        mobile: '9876543210',
        phone: '9876543210',
        city: 'Varanasi',
        district: 'Varanasi',
        state: 'Uttar Pradesh',
        availabilityStatus: 'AVAILABLE',
      },
      create: {
        userId: demoLog001.id,
        partnerCode: 'LP-UP-001-DEMO',
        businessName: 'Yadav Agri-Transporters',
        contactPerson: 'Suresh Yadav',
        contactName: 'Suresh Yadav',
        email: 'logistics001@krishisetu.demo',
        mobile: '9876543210',
        phone: '9876543210',
        district: 'Varanasi',
        state: 'Uttar Pradesh',
        city: 'Varanasi',
        availabilityStatus: 'AVAILABLE',
      },
    });
  }

  // 3. Upsert Vehicles (UP65XX1234, UP78YY5678, UP32ZZ9012)
  console.log('-> Seeding fleet vehicles...');
  const v1 = await prisma.vehicle.upsert({
    where: { vehicleNumber: 'UP65XX1234' },
    update: {
      logisticsId: logisticsProfile.id,
      vehicleType: 'Tata 10 Ton',
      brand: 'Tata Motors',
      model: 'LPT 1109 Hexa',
      capacityKg: 10000,
      capacityTon: 10.0,
      fuelType: 'Diesel',
      gpsEnabled: true,
      gpsDeviceId: 'GPS-TATA-1234',
      status: 'ACTIVE',
      insuranceExpiry: new Date(Date.now() + 180 * 86400000),
      fitnessExpiry: new Date(Date.now() + 240 * 86400000),
      permitExpiry: new Date(Date.now() + 300 * 86400000),
      pollutionExpiry: new Date(Date.now() + 90 * 86400000),
      lastServiceDate: new Date(Date.now() - 30 * 86400000),
      nextServiceDate: new Date(Date.now() + 60 * 86400000),
      refrigerated: true,
      imageUrl: '/assets/dashboard/crops/potato.png',
    },
    create: {
      id: 'VEH-UP65XX1234',
      logisticsId: logisticsProfile.id,
      vehicleNumber: 'UP65XX1234',
      vehicleType: 'Tata 10 Ton',
      brand: 'Tata Motors',
      model: 'LPT 1109 Hexa',
      capacityKg: 10000,
      capacityTon: 10.0,
      fuelType: 'Diesel',
      gpsEnabled: true,
      gpsDeviceId: 'GPS-TATA-1234',
      status: 'ACTIVE',
      insuranceExpiry: new Date(Date.now() + 180 * 86400000),
      fitnessExpiry: new Date(Date.now() + 240 * 86400000),
      permitExpiry: new Date(Date.now() + 300 * 86400000),
      pollutionExpiry: new Date(Date.now() + 90 * 86400000),
      lastServiceDate: new Date(Date.now() - 30 * 86400000),
      nextServiceDate: new Date(Date.now() + 60 * 86400000),
      refrigerated: true,
      imageUrl: '/assets/dashboard/crops/potato.png',
    },
  });

  const v2 = await prisma.vehicle.upsert({
    where: { vehicleNumber: 'UP78YY5678' },
    update: {
      logisticsId: logisticsProfile.id,
      vehicleType: 'Eicher 16 Ton',
      brand: 'Eicher',
      model: 'Pro 3019',
      capacityKg: 16000,
      capacityTon: 16.0,
      fuelType: 'Diesel',
      gpsEnabled: false,
      gpsDeviceId: 'GPS-EICHER-5678',
      status: 'IN_MAINTENANCE',
      insuranceExpiry: new Date(Date.now() + 45 * 86400000),
      fitnessExpiry: new Date(Date.now() + 60 * 86400000),
      permitExpiry: new Date(Date.now() + 120 * 86400000),
      pollutionExpiry: new Date(Date.now() + 15 * 86400000),
      lastServiceDate: new Date(Date.now() - 120 * 86400000),
      nextServiceDate: new Date(Date.now() - 5 * 86400000), // Overdue!
      refrigerated: false,
    },
    create: {
      id: 'VEH-UP78YY5678',
      logisticsId: logisticsProfile.id,
      vehicleNumber: 'UP78YY5678',
      vehicleType: 'Eicher 16 Ton',
      brand: 'Eicher',
      model: 'Pro 3019',
      capacityKg: 16000,
      capacityTon: 16.0,
      fuelType: 'Diesel',
      gpsEnabled: false,
      gpsDeviceId: 'GPS-EICHER-5678',
      status: 'IN_MAINTENANCE',
      insuranceExpiry: new Date(Date.now() + 45 * 86400000),
      fitnessExpiry: new Date(Date.now() + 60 * 86400000),
      permitExpiry: new Date(Date.now() + 120 * 86400000),
      pollutionExpiry: new Date(Date.now() + 15 * 86400000),
      lastServiceDate: new Date(Date.now() - 120 * 86400000),
      nextServiceDate: new Date(Date.now() - 5 * 86400000),
      refrigerated: false,
    },
  });

  const v3 = await prisma.vehicle.upsert({
    where: { vehicleNumber: 'UP32ZZ9012' },
    update: {
      logisticsId: logisticsProfile.id,
      vehicleType: 'Mahindra 5 Ton',
      brand: 'Mahindra',
      model: 'Furio 7 CNG',
      capacityKg: 5000,
      capacityTon: 5.0,
      fuelType: 'CNG',
      gpsEnabled: true,
      gpsDeviceId: 'GPS-MAHINDRA-9012',
      status: 'ACTIVE',
      insuranceExpiry: new Date(Date.now() + 210 * 86400000),
      fitnessExpiry: new Date(Date.now() + 290 * 86400000),
      permitExpiry: new Date(Date.now() + 350 * 86400000),
      pollutionExpiry: new Date(Date.now() + 80 * 86400000),
      lastServiceDate: new Date(Date.now() - 15 * 86400000),
      nextServiceDate: new Date(Date.now() + 75 * 86400000),
      refrigerated: false,
    },
    create: {
      id: 'VEH-UP32ZZ9012',
      logisticsId: logisticsProfile.id,
      vehicleNumber: 'UP32ZZ9012',
      vehicleType: 'Mahindra 5 Ton',
      brand: 'Mahindra',
      model: 'Furio 7 CNG',
      capacityKg: 5000,
      capacityTon: 5.0,
      fuelType: 'CNG',
      gpsEnabled: true,
      gpsDeviceId: 'GPS-MAHINDRA-9012',
      status: 'ACTIVE',
      insuranceExpiry: new Date(Date.now() + 210 * 86400000),
      fitnessExpiry: new Date(Date.now() + 290 * 86400000),
      permitExpiry: new Date(Date.now() + 350 * 86400000),
      pollutionExpiry: new Date(Date.now() + 80 * 86400000),
      lastServiceDate: new Date(Date.now() - 15 * 86400000),
      nextServiceDate: new Date(Date.now() + 75 * 86400000),
      refrigerated: false,
    },
  });

  // 4. Upsert Available Shipments (LS001, LS002, LS003, LS004)
  console.log('-> Seeding marketplace available shipments...');
  const shipmentsData = [
    {
      loadId: 'LS001',
      product: 'Tomato',
      cropName: 'Tomato',
      origin: 'Varanasi',
      destination: 'Lucknow',
      distanceKm: 320,
      quantityKg: 6000,
      unit: 'Ton',
      pickupDate: new Date(Date.now() + 1 * 86400000),
      estimatedEarnings: 18000,
      requiredVehicleCapacity: 6.0,
      status: 'AVAILABLE',
      priority: 'HIGH',
    },
    {
      loadId: 'LS002',
      product: 'Onion',
      cropName: 'Onion',
      origin: 'Prayagraj',
      destination: 'Kanpur',
      distanceKm: 210,
      quantityKg: 5000,
      unit: 'Ton',
      pickupDate: new Date(Date.now() + 2 * 86400000),
      estimatedEarnings: 12500,
      requiredVehicleCapacity: 5.0,
      status: 'AVAILABLE',
      priority: 'NORMAL',
    },
    {
      loadId: 'LS003',
      product: 'Potato',
      cropName: 'Potato',
      origin: 'Jaunpur',
      destination: 'Lucknow',
      distanceKm: 280,
      quantityKg: 8000,
      unit: 'Ton',
      pickupDate: new Date(Date.now() + 2 * 86400000),
      estimatedEarnings: 16800,
      requiredVehicleCapacity: 8.0,
      status: 'AVAILABLE',
      priority: 'NORMAL',
    },
    {
      loadId: 'LS004',
      product: 'Wheat',
      cropName: 'Wheat',
      origin: 'Varanasi',
      destination: 'Indore',
      distanceKm: 820,
      quantityKg: 15000,
      unit: 'Ton',
      pickupDate: new Date(Date.now() + 3 * 86400000),
      estimatedEarnings: 45000,
      requiredVehicleCapacity: 15.0,
      status: 'AVAILABLE',
      priority: 'URGENT',
    },
  ];

  for (const s of shipmentsData) {
    await prisma.shipment.upsert({
      where: { loadId: s.loadId },
      update: {
        ...s,
        updatedAt: new Date(),
      },
      create: {
        id: `SHIP-${s.loadId}`,
        ...s,
      },
    });
  }

  // 5. Active Current Trip matching screenshot:
  // Order #KSF001, Potato - 8 Ton, From: Suryoday FPO (Varanasi), To: AgroMart (Lucknow), Vehicle: UP65XX1234, Driver: Suresh Yadav
  console.log('-> Seeding active Current Trip & telemetry...');
  const currentTrip = await prisma.trip.upsert({
    where: { tripCode: 'TR-KSF001' },
    update: {
      logisticsPartnerId: logisticsProfile.id,
      vehicleId: v1.id,
      orderId: 'KSF001',
      driverName: 'Suresh Yadav',
      driverPhone: '9876543210',
      cropName: 'Potato',
      quantity: '8 Ton',
      quantityKg: 8000,
      fpoName: 'Suryoday FPO',
      buyerName: 'AgroMart',
      fromLocation: 'Suryoday FPO, Varanasi',
      toLocation: 'AgroMart, Lucknow',
      status: 'IN_TRANSIT',
      currentStage: 'EN_ROUTE_TO_DELIVERY',
      pickupTime: new Date(new Date().setHours(8, 30, 0, 0)),
      eta: '02:30 PM',
      distanceKm: 320,
      earningsAmount: 16800,
      notes: 'Cold chain transit maintained at 12°C for premium table potatoes',
    },
    create: {
      id: 'TRIP-KSF001',
      tripCode: 'TR-KSF001',
      logisticsPartnerId: logisticsProfile.id,
      vehicleId: v1.id,
      orderId: 'KSF001',
      driverName: 'Suresh Yadav',
      driverPhone: '9876543210',
      cropName: 'Potato',
      quantity: '8 Ton',
      quantityKg: 8000,
      fpoName: 'Suryoday FPO',
      buyerName: 'AgroMart',
      fromLocation: 'Suryoday FPO, Varanasi',
      toLocation: 'AgroMart, Lucknow',
      status: 'IN_TRANSIT',
      currentStage: 'EN_ROUTE_TO_DELIVERY',
      pickupTime: new Date(new Date().setHours(8, 30, 0, 0)),
      eta: '02:30 PM',
      distanceKm: 320,
      earningsAmount: 16800,
      notes: 'Cold chain transit maintained at 12°C for premium table potatoes',
    },
  });

  // Clear and seed Trip Stops
  await prisma.tripStop.deleteMany({ where: { tripId: currentTrip.id } });
  await prisma.tripStop.createMany({
    data: [
      {
        tripId: currentTrip.id,
        sequence: 1,
        stopName: 'Suryoday FPO',
        location: 'Varanasi',
        stopType: 'PICKUP',
        crop: 'Potato',
        quantityKg: 8000,
        scheduledTime: new Date(new Date().setHours(8, 0, 0, 0)),
        completedTime: new Date(new Date().setHours(8, 30, 0, 0)),
        status: 'COMPLETED',
        latitude: 25.3176,
        longitude: 82.9739,
      },
      {
        tripId: currentTrip.id,
        sequence: 2,
        stopName: 'Jaunpur Bypass NH 731',
        location: 'Jaunpur',
        stopType: 'WAYPOINT',
        scheduledTime: new Date(new Date().setHours(10, 45, 0, 0)),
        completedTime: new Date(new Date().setHours(10, 50, 0, 0)),
        status: 'COMPLETED',
        latitude: 25.7464,
        longitude: 82.6837,
      },
      {
        tripId: currentTrip.id,
        sequence: 3,
        stopName: 'AgroMart Hub',
        location: 'Lucknow',
        stopType: 'DELIVERY',
        crop: 'Potato',
        quantityKg: 8000,
        scheduledTime: new Date(new Date().setHours(14, 30, 0, 0)),
        status: 'PENDING',
        latitude: 26.8467,
        longitude: 80.9462,
      },
    ],
  });

  // Clear and seed Location Updates for live tracking
  await prisma.locationUpdate.deleteMany({ where: { tripId: currentTrip.id } });
  await prisma.locationUpdate.createMany({
    data: [
      {
        tripId: currentTrip.id,
        vehicleId: v1.id,
        latitude: 25.3176,
        longitude: 82.9739,
        speed: 0,
        heading: 320,
        batteryPct: 98,
        recordedAt: new Date(new Date().setHours(8, 30, 0, 0)),
      },
      {
        tripId: currentTrip.id,
        vehicleId: v1.id,
        latitude: 25.7464,
        longitude: 82.6837,
        speed: 55,
        heading: 315,
        batteryPct: 94,
        recordedAt: new Date(new Date().setHours(10, 50, 0, 0)),
      },
      {
        tripId: currentTrip.id,
        vehicleId: v1.id,
        latitude: 26.0500,
        longitude: 82.3500, // Near Sultanpur corridor
        speed: 62.0,
        heading: 312,
        batteryPct: 90,
        recordedAt: new Date(),
      },
    ],
  });

  // 6. Recent Historical Trips (TR001, TR002, TR003)
  console.log('-> Seeding recent trips history...');
  const historicalTrips = [
    {
      tripCode: 'TR001',
      cropName: 'Tomato',
      fromLocation: 'Varanasi',
      toLocation: 'Lucknow',
      deliveredTime: new Date(Date.now() - 1 * 86400000),
      status: 'DELIVERED',
      currentStage: 'DELIVERED',
      distanceKm: 320,
      earningsAmount: 14800,
      vehicleId: v1.id,
    },
    {
      tripCode: 'TR002',
      cropName: 'Onion',
      fromLocation: 'Kanpur',
      toLocation: 'Delhi',
      deliveredTime: new Date(Date.now() - 3 * 86400000),
      status: 'DELIVERED',
      currentStage: 'DELIVERED',
      distanceKm: 480,
      earningsAmount: 28000,
      vehicleId: v2.id,
    },
    {
      tripCode: 'TR003',
      cropName: 'Potato',
      fromLocation: 'Varanasi',
      toLocation: 'Kanpur',
      deliveredTime: new Date(Date.now() - 5 * 86400000),
      status: 'DELIVERED',
      currentStage: 'DELIVERED',
      distanceKm: 340,
      earningsAmount: 16200,
      vehicleId: v3.id,
    },
  ];

  for (const ht of historicalTrips) {
    await prisma.trip.upsert({
      where: { tripCode: ht.tripCode },
      update: {
        logisticsPartnerId: logisticsProfile.id,
        ...ht,
      },
      create: {
        id: `TRIP-${ht.tripCode}`,
        logisticsPartnerId: logisticsProfile.id,
        ...ht,
      },
    });
  }

  // 7. Seed Maintenance Records & Alerts
  console.log('-> Seeding maintenance alerts & logs...');
  await prisma.maintenanceRecord.deleteMany({ where: { logisticsPartnerId: logisticsProfile.id } });
  await prisma.maintenanceRecord.createMany({
    data: [
      {
        logisticsPartnerId: logisticsProfile.id,
        vehicleId: v2.id,
        maintenanceType: 'SERVICE',
        description: 'Engine oil change and brake check required.',
        cost: 4500,
        serviceDate: new Date(),
        nextServiceDate: new Date(Date.now() - 3 * 86400000),
        status: 'DUE',
        severity: 'HIGH',
        serviceProvider: 'Eicher Authorized Service Center, Varanasi',
        notes: 'Vehicle withheld from dispatch until brake pads are replaced',
      },
      {
        logisticsPartnerId: logisticsProfile.id,
        vehicleId: v1.id,
        maintenanceType: 'TYRE_CHECK',
        description: 'Front left tyre pressure is below recommended level.',
        cost: 250,
        serviceDate: new Date(),
        status: 'DUE',
        severity: 'MEDIUM',
        serviceProvider: 'GT Road Express Tyre Care',
        notes: 'Current pressure: 26 PSI (Recommended: 34 PSI)',
      },
      {
        logisticsPartnerId: logisticsProfile.id,
        vehicleId: v3.id,
        maintenanceType: 'INSPECTION',
        description: 'CNG kit leakage and valve compliance certification.',
        cost: 1800,
        serviceDate: new Date(Date.now() - 15 * 86400000),
        nextServiceDate: new Date(Date.now() + 75 * 86400000),
        status: 'COMPLETED',
        severity: 'LOW',
        serviceProvider: 'Mahindra Commercial Care',
        notes: 'Certified leak-free with valid government safety hologram',
      },
    ],
  });

  // 8. Seed Fuel & Expenses
  console.log('-> Seeding fuel expenses...');
  await prisma.fuelExpense.deleteMany({ where: { logisticsPartnerId: logisticsProfile.id } });
  await prisma.fuelExpense.createMany({
    data: [
      {
        logisticsPartnerId: logisticsProfile.id,
        vehicleId: v1.id,
        expenseType: 'FUEL',
        amount: 5400,
        quantity: 60,
        unitPrice: 90,
        odometer: 48200,
        station: 'Indian Oil NH 731 Fuel Plaza',
        notes: 'Diesel refill before Varanasi departure',
      },
      {
        logisticsPartnerId: logisticsProfile.id,
        vehicleId: v1.id,
        expenseType: 'TOLL',
        amount: 850,
        station: 'Sultanpur Toll Plaza',
        notes: 'FASTag electronic toll deduction',
      },
      {
        logisticsPartnerId: logisticsProfile.id,
        vehicleId: v2.id,
        expenseType: 'REPAIR',
        amount: 2800,
        station: 'Eicher Workshop Kanpur',
        notes: 'Hydraulic fluid top-up and filter check',
      },
      {
        logisticsPartnerId: logisticsProfile.id,
        vehicleId: v3.id,
        expenseType: 'FUEL',
        amount: 3350,
        quantity: 45,
        unitPrice: 74.4,
        odometer: 29400,
        station: 'GAIL Green CNG Station Lucknow',
        notes: 'Full CNG cylinder fill',
      },
    ],
  });

  // 9. Seed Earnings
  console.log('-> Seeding earnings summary records...');
  await prisma.logisticsEarning.deleteMany({ where: { logisticsPartnerId: logisticsProfile.id } });
  await prisma.logisticsEarning.createMany({
    data: [
      {
        logisticsPartnerId: logisticsProfile.id,
        grossAmount: 24000,
        fuelCost: 6500,
        otherExpenses: 1200,
        netAmount: 16300,
        paymentStatus: 'PAID',
        paymentDate: new Date(Date.now() - 21 * 86400000),
        transactionRef: 'TXN-UP-LOG-W1-01',
      },
      {
        logisticsPartnerId: logisticsProfile.id,
        grossAmount: 38500,
        fuelCost: 9800,
        otherExpenses: 1800,
        netAmount: 26900,
        paymentStatus: 'PAID',
        paymentDate: new Date(Date.now() - 14 * 86400000),
        transactionRef: 'TXN-UP-LOG-W2-02',
      },
      {
        logisticsPartnerId: logisticsProfile.id,
        grossAmount: 52000,
        fuelCost: 14200,
        otherExpenses: 2500,
        netAmount: 35300,
        paymentStatus: 'PAID',
        paymentDate: new Date(Date.now() - 7 * 86400000),
        transactionRef: 'TXN-UP-LOG-W3-03',
      },
      {
        logisticsPartnerId: logisticsProfile.id,
        grossAmount: 42800,
        fuelCost: 12400,
        otherExpenses: 1900,
        netAmount: 28500,
        paymentStatus: 'PAID',
        paymentDate: new Date(),
        transactionRef: 'TXN-UP-LOG-W4-04',
      },
    ],
  });

  // 10. Seed Notifications & Messages
  console.log('-> Seeding notifications & messages...');
  await prisma.notification.deleteMany({ where: { logisticsPartnerId: logisticsProfile.id } });
  await prisma.notification.createMany({
    data: [
      {
        logisticsPartnerId: logisticsProfile.id,
        type: 'LOGISTICS',
        title: 'New High-Value Shipment: Varanasi to Indore',
        message: '15 Ton Wheat available for pickup on 9 Sept. Estimated payout: ₹45,000.',
        read: false,
        link: '/logistics/shipments',
      },
      {
        logisticsPartnerId: logisticsProfile.id,
        type: 'VEHICLE',
        title: 'Vehicle UP78YY5678: Scheduled Maintenance Due',
        message: 'Brake overhaul and oil change due. Vehicle is flagged for safety review.',
        read: false,
        link: '/logistics/maintenance',
      },
      {
        logisticsPartnerId: logisticsProfile.id,
        type: 'TRIP',
        title: 'Consignment #KSF001: Pickup Completed',
        message: '8 Ton Potato consignment picked up from Suryoday FPO, Varanasi at 08:30 AM.',
        read: false,
        link: '/logistics/trips',
      },
      {
        logisticsPartnerId: logisticsProfile.id,
        type: 'PAYMENT',
        title: 'Payment Credited: ₹14,800',
        message: 'Settlement for TR001 (Varanasi to Lucknow) has been transferred to your account.',
        read: false,
        link: '/logistics/earnings',
      },
      {
        logisticsPartnerId: logisticsProfile.id,
        type: 'MAINTENANCE',
        title: 'Tyre Pressure Low: Vehicle UP65XX1234',
        message: 'Front-left tyre sensor reports 26 PSI. Check pressure before highway cruising.',
        read: false,
        link: '/logistics/maintenance',
      },
    ],
  });

  await prisma.message.deleteMany({ where: { logisticsPartnerId: logisticsProfile.id } });
  await prisma.message.createMany({
    data: [
      {
        logisticsPartnerId: logisticsProfile.id,
        senderId: 'USR-FPO-ANIL-0456',
        senderName: 'Anil Singh (Suryoday FPO)',
        senderRole: 'FPO',
        subject: 'Potato consignment loading bay update',
        content: 'Hi Suresh, the 8 Ton potato consignment is staged at Bay 2. Crates are pre-cooled to 12°C. Documentation is signed.',
        read: false,
      },
      {
        logisticsPartnerId: logisticsProfile.id,
        senderId: 'USR-BUYER-RAJESH-01',
        senderName: 'Rajesh Sharma (AgroMart)',
        senderRole: 'BULK_BUYER',
        subject: 'Delivery unloading gate in Lucknow',
        content: 'Please instruct driver to enter from Gate 3 on Faizabad Road. Unloading crew is on standby until 4:00 PM.',
        read: false,
      },
      {
        logisticsPartnerId: logisticsProfile.id,
        senderId: 'USR-ADMIN-SUPPORT',
        senderName: 'KrishiSetu Route Support',
        senderRole: 'ADMIN',
        subject: 'NH 731 Highway Advisory',
        content: 'Road work reported near Jagdishpur bypass. Average delay 20 mins. AI route optimizer has synced alternate bypass.',
        read: false,
      },
    ],
  });

  // 11. Seed Ratings
  await prisma.logisticsRating.deleteMany({ where: { logisticsPartnerId: logisticsProfile.id } });
  await prisma.logisticsRating.createMany({
    data: [
      {
        logisticsPartnerId: logisticsProfile.id,
        reviewerName: 'Suryoday FPO',
        reviewerRole: 'FPO',
        rating: 5,
        comment: 'Punctual arrival, clean refrigerated vehicle, and extremely careful loading of delicate tomatoes.',
      },
      {
        logisticsPartnerId: logisticsProfile.id,
        reviewerName: 'AgroMart Lucknow',
        reviewerRole: 'BUYER',
        rating: 5,
        comment: 'Fresh produce delivered on-time with zero spoilage. Excellent telemetry updates.',
      },
      {
        logisticsPartnerId: logisticsProfile.id,
        reviewerName: 'Kisan Pragati FPO',
        reviewerRole: 'FPO',
        rating: 4,
        comment: 'Reliable fleet and driver was courteous. Slight delay at toll plaza but communicated proactively.',
      },
    ],
  });

  console.log('✅ KrishiSetu Phase 2.5 Logistics Partner seed completed successfully!');
}

// Allow direct execution: node backend/prisma/seed-logistics-dashboard.js
if (process.argv[1]?.includes('seed-logistics-dashboard.js')) {
  seedLogisticsDashboard()
    .catch((err) => {
      console.error('❌ Failed to seed logistics dashboard data:', err);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}

export default seedLogisticsDashboard;
