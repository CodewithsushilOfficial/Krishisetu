import bcrypt from 'bcrypt';
import prisma from '../src/db/prisma.js';

const DEMO_PASSWORD = 'Demo@12345';

export async function seedFpoDashboard() {
  console.log('🌾 Seeding KrishiSetu Phase 2.4 FPO Dashboard Connected Data...');

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // 1. Ensure Anil Singh User exists
  const anilUser = await prisma.user.upsert({
    where: { email: 'anil.singh@suryodayfpo.org' },
    update: {
      fullName: 'Anil Singh',
      phone: '928000000456',
      role: 'FPO',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: true,
      passwordHash,
    },
    create: {
      id: 'USR-FPO-ANIL-0456',
      email: 'anil.singh@suryodayfpo.org',
      phone: '928000000456',
      fullName: 'Anil Singh',
      passwordHash,
      role: 'FPO',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: true,
    },
  });

  // 2. Also ensure demo fpo001 user points to or has access to Suryoday FPO for quick login compatibility
  const demoFpo001 = await prisma.user.findUnique({
    where: { email: 'fpo001@krishisetu.demo' },
  });
  if (demoFpo001) {
    await prisma.user.update({
      where: { id: demoFpo001.id },
      data: { fullName: 'Anil Singh' },
    });
  }

  // 3. Upsert FPO Profile: Suryoday Farmer Producer Company
  const fpoProfile = await prisma.fpoProfile.upsert({
    where: { id: 'FPO-UP-0456' },
    update: {
      userId: anilUser.id,
      fpoName: 'Suryoday Farmer Producer Company',
      shortName: 'Suryoday FPO',
      fpoType: 'Farmer Producer Company (FPC)',
      registrationNumber: 'FPO-UP-0456',
      establishedYear: 2021,
      officialEmail: 'contact@suryodayfpo.org',
      officialPhone: '+91 542 2288901',
      website: 'https://suryodayfpo.krishisetu.org',
      logo: '/assets/fpo/suryoday-logo.svg',
      representativeName: 'Anil Singh',
      designation: 'Manager, Suryoday FPO',
      representativeMobile: '928000000456',
      representativeEmail: 'anil.singh@suryodayfpo.org',
      addressLine: 'Agriculture Complex, Sarnath Road',
      villageTownCity: 'Varanasi',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      pincode: '221007',
      memberCount: 248,
      primaryCrops: ['Potato', 'Onion', 'Tomato', 'Wheat', 'Chilli'],
      operatingDistricts: ['Varanasi', 'Chandauli', 'Jaunpur', 'Mirzapur', 'Ghazipur'],
      storageAvailable: true,
      aggregationCapacity: 1250,
      verificationStatus: 'VERIFIED',
      tagline: 'Stronger Farmers, Brighter Futures',
      description: 'Empowering small farmers through collective action and technology.',
      panNumber: 'AAACS1234K',
      gstNumber: '09AAACS1234K1Z5',
      bankName: 'State Bank of India',
      bankAccountNumber: '389201948201',
      bankIfscCode: 'SBIN0001234',
    },
    create: {
      id: 'FPO-UP-0456',
      userId: anilUser.id,
      fpoName: 'Suryoday Farmer Producer Company',
      shortName: 'Suryoday FPO',
      fpoType: 'Farmer Producer Company (FPC)',
      registrationNumber: 'FPO-UP-0456',
      establishedYear: 2021,
      officialEmail: 'contact@suryodayfpo.org',
      officialPhone: '+91 542 2288901',
      website: 'https://suryodayfpo.krishisetu.org',
      logo: '/assets/fpo/suryoday-logo.svg',
      representativeName: 'Anil Singh',
      designation: 'Manager, Suryoday FPO',
      representativeMobile: '928000000456',
      representativeEmail: 'anil.singh@suryodayfpo.org',
      addressLine: 'Agriculture Complex, Sarnath Road',
      villageTownCity: 'Varanasi',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      pincode: '221007',
      memberCount: 248,
      primaryCrops: ['Potato', 'Onion', 'Tomato', 'Wheat', 'Chilli'],
      operatingDistricts: ['Varanasi', 'Chandauli', 'Jaunpur', 'Mirzapur', 'Ghazipur'],
      storageAvailable: true,
      aggregationCapacity: 1250,
      verificationStatus: 'VERIFIED',
      tagline: 'Stronger Farmers, Brighter Futures',
      description: 'Empowering small farmers through collective action and technology.',
      panNumber: 'AAACS1234K',
      gstNumber: '09AAACS1234K1Z5',
      bankName: 'State Bank of India',
      bankAccountNumber: '389201948201',
      bankIfscCode: 'SBIN0001234',
    },
  });

  // Also update FPO-001 (demo FPO) to match Suryoday so whichever account is logged in sees the accurate company
  if (demoFpo001) {
    const existing001 = await prisma.fpoProfile.findUnique({ where: { id: 'FPO-001' } });
    if (existing001) {
      await prisma.fpoProfile.update({
        where: { id: 'FPO-001' },
        data: {
          fpoName: 'Suryoday Farmer Producer Company',
          shortName: 'Suryoday FPO',
          registrationNumber: 'FPO-UP-0456',
          district: 'Varanasi',
          state: 'Uttar Pradesh',
          memberCount: 248,
          tagline: 'Stronger Farmers, Brighter Futures',
          description: 'Empowering small farmers through collective action and technology.',
          primaryCrops: ['Potato', 'Onion', 'Tomato', 'Wheat', 'Chilli'],
        },
      });
    }
  }

  // 4. Seed Crops (Potato, Onion, Tomato, Wheat, Chilli)
  const crops = [
    { id: 'CROP-POTATO', cropCode: 'POTATO', cropName: 'Potato', category: 'VEGETABLE', unit: 'KG', season: 'Rabi', imageUrl: '/assets/crops/potato.svg' },
    { id: 'CROP-ONION', cropCode: 'ONION', cropName: 'Onion', category: 'VEGETABLE', unit: 'KG', season: 'Rabi/Kharif', imageUrl: '/assets/crops/onion.svg' },
    { id: 'CROP-TOMATO', cropCode: 'TOMATO', cropName: 'Tomato', category: 'VEGETABLE', unit: 'KG', season: 'Kharif/Rabi', imageUrl: '/assets/crops/tomato.svg' },
    { id: 'CROP-WHEAT', cropCode: 'WHEAT', cropName: 'Wheat', category: 'GRAIN', unit: 'KG', season: 'Rabi', imageUrl: '/assets/crops/wheat.svg' },
    { id: 'CROP-CHILLI', cropCode: 'CHILLI', cropName: 'Chilli', category: 'SPICE', unit: 'KG', season: 'Kharif', imageUrl: '/assets/crops/chilli.svg' },
  ];

  for (const c of crops) {
    await prisma.crop.upsert({
      where: { id: c.id },
      update: { cropName: c.cropName, imageUrl: c.imageUrl, active: true },
      create: { ...c, active: true },
    });
  }

  // 5. Seed Collection Centers
  const collectionCenters = [
    {
      id: 'CC-VAR-01',
      code: 'CC-01',
      name: 'Varanasi Central Hub',
      address: 'Main Agriculture Yard, Sarnath Road',
      district: 'Varanasi',
      block: 'Sarnath',
      village: 'Sarnath',
      managerName: 'Rajesh Patel',
      contactPhone: '928000000458',
      capacityKg: 500000,
      storageCapacityKg: 450000,
      status: 'ACTIVE',
    },
    {
      id: 'CC-VAR-02',
      code: 'CC-02',
      name: 'Arajiline Collection Center',
      address: 'Near Block Development Office',
      district: 'Varanasi',
      block: 'Arajiline',
      village: 'Arajiline',
      managerName: 'Sunita Maurya',
      contactPhone: '928000000460',
      capacityKg: 350000,
      storageCapacityKg: 300000,
      status: 'ACTIVE',
    },
    {
      id: 'CC-VAR-03',
      code: 'CC-03',
      name: 'Pindra Agri Collection Center',
      address: 'Airport Link Road, Babatpur',
      district: 'Varanasi',
      block: 'Pindra',
      village: 'Pindra',
      managerName: 'Vikram Yadav',
      contactPhone: '928000000459',
      capacityKg: 400000,
      storageCapacityKg: 350000,
      status: 'ACTIVE',
    },
  ];

  for (const cc of collectionCenters) {
    await prisma.collectionCenter.upsert({
      where: { fpoId_code: { fpoId: 'FPO-UP-0456', code: cc.code } },
      update: { ...cc, fpoId: 'FPO-UP-0456' },
      create: { ...cc, fpoId: 'FPO-UP-0456' },
    });
  }

  // 6. Seed Staff Members
  const staffList = [
    {
      id: 'STAFF-001',
      email: 'anil.singh@suryodayfpo.org',
      fullName: 'Anil Singh',
      phone: '928000000456',
      role: 'FPO_MANAGER',
      department: 'Executive Management',
      employeeId: 'EMP-0456-01',
      status: 'ACTIVE',
      permissions: ['*'],
      assignedCenterIds: ['CC-VAR-01', 'CC-VAR-02', 'CC-VAR-03'],
    },
    {
      id: 'STAFF-002',
      email: 'priya.sharma@suryodayfpo.org',
      fullName: 'Priya Sharma',
      phone: '928000000457',
      role: 'FPO_ACCOUNTANT',
      department: 'Finance & Accounts',
      employeeId: 'EMP-0456-02',
      status: 'ACTIVE',
      permissions: ['payments.read', 'payments.create', 'payments.approve', 'reports.read', 'reports.export'],
      assignedCenterIds: ['CC-VAR-01'],
    },
    {
      id: 'STAFF-003',
      email: 'rajesh.patel@suryodayfpo.org',
      fullName: 'Rajesh Patel',
      phone: '928000000458',
      role: 'FPO_PROCUREMENT_MANAGER',
      department: 'Procurement & Quality',
      employeeId: 'EMP-0456-03',
      status: 'ACTIVE',
      permissions: ['farmer.read', 'produce.read', 'produce.create', 'produce.update', 'inventory.read', 'inventory.update'],
      assignedCenterIds: ['CC-VAR-01', 'CC-VAR-02'],
    },
    {
      id: 'STAFF-004',
      email: 'vikram.yadav@suryodayfpo.org',
      fullName: 'Vikram Yadav',
      phone: '928000000459',
      role: 'FPO_LOGISTICS_MANAGER',
      department: 'Supply Chain & Logistics',
      employeeId: 'EMP-0456-04',
      status: 'ACTIVE',
      permissions: ['logistics.read', 'logistics.create', 'logistics.update', 'orders.read'],
      assignedCenterIds: ['CC-VAR-01', 'CC-VAR-03'],
    },
    {
      id: 'STAFF-005',
      email: 'sunita.maurya@suryodayfpo.org',
      fullName: 'Sunita Maurya',
      phone: '928000000460',
      role: 'FPO_FIELD_OFFICER',
      department: 'Farmer Extension',
      employeeId: 'EMP-0456-05',
      status: 'ACTIVE',
      permissions: ['farmer.read', 'farmer.create', 'produce.create'],
      assignedCenterIds: ['CC-VAR-02'],
    },
  ];

  for (const s of staffList) {
    await prisma.fpoStaff.upsert({
      where: { fpoId_email: { fpoId: 'FPO-UP-0456', email: s.email } },
      update: { ...s, fpoId: 'FPO-UP-0456' },
      create: { ...s, fpoId: 'FPO-UP-0456' },
    });
  }

  // 7. Seed Featured Member Farmers from Screenshot
  const featuredFarmers = [
    { id: 'FAR-FPO-01', name: 'Ram Prasad', village: 'Sarnath', crop: 'Potato', cropId: 'CROP-POTATO', qty: 2.5, phone: '919000000001' },
    { id: 'FAR-FPO-02', name: 'Sita Devi', village: 'Arajiline', crop: 'Onion', cropId: 'CROP-ONION', qty: 1.8, phone: '919000000002' },
    { id: 'FAR-FPO-03', name: 'Mohan Yadav', village: 'Cholapur', crop: 'Tomato', cropId: 'CROP-TOMATO', qty: 3.2, phone: '919000000003' },
    { id: 'FAR-FPO-04', name: 'Shankar Lal', village: 'Pindra', crop: 'Wheat', cropId: 'CROP-WHEAT', qty: 4.0, phone: '919000000004' },
    { id: 'FAR-FPO-05', name: 'Rekha Verma', village: 'Harahua', crop: 'Potato', cropId: 'CROP-POTATO', qty: 2.1, phone: '919000000005' },
  ];

  for (const f of featuredFarmers) {
    const user = await prisma.user.upsert({
      where: { phone: f.phone },
      update: { fullName: f.name },
      create: {
        id: `USR-${f.id}`,
        email: `${f.id.toLowerCase()}@krishisetu.demo`,
        phone: f.phone,
        fullName: f.name,
        passwordHash,
        role: 'FARMER',
        status: 'ACTIVE',
        emailVerified: true,
        phoneVerified: true,
      },
    });

    const farmer = await prisma.farmerProfile.upsert({
      where: { id: f.id },
      update: {
        village: f.village,
        district: 'Varanasi',
        state: 'Uttar Pradesh',
        pincode: '221001',
        farmerType: 'Smallholder',
        primaryCrops: [f.crop],
      },
      create: {
        id: f.id,
        userId: user.id,
        village: f.village,
        district: 'Varanasi',
        state: 'Uttar Pradesh',
        pincode: '221001',
        farmerType: 'Smallholder',
        primaryCrops: [f.crop],
        totalLandArea: 3.5,
      },
    });

    // Link Membership to Suryoday FPO
    await prisma.fpoMembership.upsert({
      where: { fpoId_farmerId: { fpoId: 'FPO-UP-0456', farmerId: farmer.id } },
      update: { status: 'ACTIVE' },
      create: {
        id: `MEM-${farmer.id}`,
        fpoId: 'FPO-UP-0456',
        farmerId: farmer.id,
        status: 'ACTIVE',
      },
    });

    // Farm
    const farm = await prisma.farm.upsert({
      where: { id: `FARM-${f.id}` },
      update: { farmName: `${f.name}'s Field`, areaAcres: 3.5 },
      create: {
        id: `FARM-${f.id}`,
        farmerId: farmer.id,
        farmName: `${f.name}'s Field`,
        areaAcres: 3.5,
      },
    });

    // Produce record
    await prisma.produce.upsert({
      where: { id: `PROD-${f.id}` },
      update: {
        quantityKg: f.qty * 1000,
        fpoId: 'FPO-UP-0456',
        collectionCenterId: 'CC-VAR-01',
      },
      create: {
        id: `PROD-${f.id}`,
        farmerId: farmer.id,
        farmId: farm.id,
        cropId: f.cropId,
        fpoId: 'FPO-UP-0456',
        collectionCenterId: 'CC-VAR-01',
        harvestDate: new Date('2026-08-15'),
        grade: 'A',
        quantityKg: f.qty * 1000,
        expectedPricePerKg: 20,
        qualityScore: 9.2,
      },
    });
  }

  // 8. Seed Aggregated Inventory Lots exactly matching screenshot numbers:
  // Potato: Available 52 Ton (52000), Reserved 18 Ton (18000), In Transit 12 Ton (12000), Sold 35 Ton (35000), Total 117 Ton
  // Onion: Available 28 Ton (28000), Reserved 6 Ton (6000), In Transit 5 Ton (5000), Sold 14 Ton (14000), Total 53 Ton
  // Tomato: Available 18 Ton (18000), Reserved 4 Ton (4000), In Transit 6 Ton (6000), Sold 10 Ton (10000), Total 38 Ton
  // Wheat: Available 22 Ton (22000), Reserved 0 Ton (0), In Transit 3 Ton (3000), Sold 7 Ton (7000), Total 32 Ton
  // Chilli: Available 5 Ton (5000), Reserved 2 Ton (2000), In Transit 1 Ton (1000), Sold 4 Ton (4000), Total 12 Ton
  const lots = [
    {
      id: 'LOT-FPO-POTATO-01',
      lotNumber: 'LOT-POT-001',
      cropId: 'CROP-POTATO',
      produceId: 'PROD-FAR-FPO-01',
      farmerId: 'FAR-FPO-01',
      availableQtyKg: 52000,
      reservedQtyKg: 18000,
      inTransitQtyKg: 12000,
      soldQtyKg: 35000,
      qualityGrade: 'Grade A',
      askingPricePerKg: 18.0,
      warehouseLocation: 'Varanasi Central Hub - Chamber 1',
    },
    {
      id: 'LOT-FPO-ONION-01',
      lotNumber: 'LOT-ONI-001',
      cropId: 'CROP-ONION',
      produceId: 'PROD-FAR-FPO-02',
      farmerId: 'FAR-FPO-02',
      availableQtyKg: 28000,
      reservedQtyKg: 6000,
      inTransitQtyKg: 5000,
      soldQtyKg: 14000,
      qualityGrade: 'Grade A',
      askingPricePerKg: 24.0,
      warehouseLocation: 'Varanasi Central Hub - Chamber 2',
    },
    {
      id: 'LOT-FPO-TOMATO-01',
      lotNumber: 'LOT-TOM-001',
      cropId: 'CROP-TOMATO',
      produceId: 'PROD-FAR-FPO-03',
      farmerId: 'FAR-FPO-03',
      availableQtyKg: 18000,
      reservedQtyKg: 4000,
      inTransitQtyKg: 6000,
      soldQtyKg: 10000,
      qualityGrade: 'Grade A+',
      askingPricePerKg: 22.0,
      warehouseLocation: 'Varanasi Central Cold Storage',
    },
    {
      id: 'LOT-FPO-WHEAT-01',
      lotNumber: 'LOT-WHT-001',
      cropId: 'CROP-WHEAT',
      produceId: 'PROD-FAR-FPO-04',
      farmerId: 'FAR-FPO-04',
      availableQtyKg: 22000,
      reservedQtyKg: 0,
      inTransitQtyKg: 3000,
      soldQtyKg: 7000,
      qualityGrade: 'FAQ Sharbati',
      askingPricePerKg: 28.0,
      warehouseLocation: 'Pindra Agri Silos',
    },
    {
      id: 'LOT-FPO-CHILLI-01',
      lotNumber: 'LOT-CHL-001',
      cropId: 'CROP-CHILLI',
      produceId: 'PROD-FAR-FPO-05',
      farmerId: 'FAR-FPO-05',
      availableQtyKg: 5000,
      reservedQtyKg: 2000,
      inTransitQtyKg: 1000,
      soldQtyKg: 4000,
      qualityGrade: 'G4 Green Export',
      askingPricePerKg: 65.0,
      warehouseLocation: 'Arajiline Spice Chamber',
    },
  ];

  for (const l of lots) {
    await prisma.inventoryLot.upsert({
      where: { id: l.id },
      update: {
        fpoId: 'FPO-UP-0456',
        lotNumber: l.lotNumber,
        availableQtyKg: l.availableQtyKg,
        reservedQtyKg: l.reservedQtyKg,
        inTransitQtyKg: l.inTransitQtyKg,
        soldQtyKg: l.soldQtyKg,
        qualityGrade: l.qualityGrade,
        askingPricePerKg: l.askingPricePerKg,
        warehouseLocation: l.warehouseLocation,
        status: 'AVAILABLE',
      },
      create: {
        id: l.id,
        fpoId: 'FPO-UP-0456',
        lotNumber: l.lotNumber,
        cropId: l.cropId,
        produceId: l.produceId,
        farmerId: l.farmerId,
        availableQtyKg: l.availableQtyKg,
        reservedQtyKg: l.reservedQtyKg,
        inTransitQtyKg: l.inTransitQtyKg,
        soldQtyKg: l.soldQtyKg,
        qualityGrade: l.qualityGrade,
        askingPricePerKg: l.askingPricePerKg,
        warehouseLocation: l.warehouseLocation,
        status: 'AVAILABLE',
      },
    });

    // Create Initial Intake Transaction
    await prisma.inventoryTransaction.upsert({
      where: { id: `TXN-INTAKE-${l.id}` },
      update: { balanceAfterKg: l.availableQtyKg },
      create: {
        id: `TXN-INTAKE-${l.id}`,
        lotId: l.id,
        fpoId: 'FPO-UP-0456',
        type: 'INTAKE',
        quantityKg: l.availableQtyKg,
        balanceAfterKg: l.availableQtyKg,
        referenceType: 'PRODUCE',
        referenceId: l.produceId,
        notes: `Initial aggregated lot intake for ${l.lotNumber}`,
        createdBy: 'Anil Singh',
      },
    });
  }

  // 9. Seed Bulk Buyers and Recent Orders from Screenshot
  // Order ID | Buyer | Crop | Quantity | Status
  // KSF001 | BigBasket | Potato | 20 Ton | Confirmed
  // KSF002 | Lucknow Hotel Co. | Onion | 10 Ton | In Transit
  // KSF003 | FreshMart | Tomato | 8 Ton | Pending
  // KSF004 | Food Processor Ltd. | Wheat | 15 Ton | Delivered
  // KSF005 | Retail Chain | Potato | 12 Ton | Confirmed
  const buyers = [
    { id: 'BUY-FPO-BB', name: 'BigBasket Wholesale', city: 'Lucknow', email: 'procurement.bb@krishisetu.demo', phone: '949000000001' },
    { id: 'BUY-FPO-LHC', name: 'Lucknow Hotel Co.', city: 'Lucknow', email: 'supply.lhc@krishisetu.demo', phone: '949000000002' },
    { id: 'BUY-FPO-FM', name: 'FreshMart Organics', city: 'Varanasi', email: 'orders.fm@krishisetu.demo', phone: '949000000003' },
    { id: 'BUY-FPO-FPL', name: 'Food Processor Ltd.', city: 'Kanpur', email: 'rawmaterials.fpl@krishisetu.demo', phone: '949000000004' },
    { id: 'BUY-FPO-RC', name: 'Retail Chain Enterprises', city: 'Prayagraj', email: 'buyer.rc@krishisetu.demo', phone: '949000000005' },
  ];

  for (const b of buyers) {
    const buyerUser = await prisma.user.upsert({
      where: { phone: b.phone },
      update: { fullName: b.name },
      create: {
        id: `USR-${b.id}`,
        email: b.email,
        phone: b.phone,
        fullName: b.name,
        passwordHash,
        role: 'BULK_BUYER',
        status: 'ACTIVE',
        emailVerified: true,
      },
    });

    await prisma.bulkBuyerProfile.upsert({
      where: { id: b.id },
      update: { businessName: b.name, city: b.city, district: b.city, state: 'Uttar Pradesh', pincode: '226001' },
      create: {
        id: b.id,
        userId: buyerUser.id,
        businessName: b.name,
        city: b.city,
        district: b.city,
        state: 'Uttar Pradesh',
        pincode: '226001',
      },
    });
  }

  const orders = [
    {
      id: 'KSF001',
      buyerId: 'BUY-FPO-BB',
      lotId: 'LOT-FPO-POTATO-01',
      cropId: 'CROP-POTATO',
      quantityKg: 20000,
      unitPrice: 18.0,
      totalAmount: 360000,
      platformFee: 18000,
      netAmount: 342000,
      status: 'CONFIRMED',
      orderDate: new Date('2026-08-18'),
    },
    {
      id: 'KSF002',
      buyerId: 'BUY-FPO-LHC',
      lotId: 'LOT-FPO-ONION-01',
      cropId: 'CROP-ONION',
      quantityKg: 10000,
      unitPrice: 22.0,
      totalAmount: 220000,
      platformFee: 11000,
      netAmount: 209000,
      status: 'IN_TRANSIT',
      orderDate: new Date('2026-08-19'),
    },
    {
      id: 'KSF003',
      buyerId: 'BUY-FPO-FM',
      lotId: 'LOT-FPO-TOMATO-01',
      cropId: 'CROP-TOMATO',
      quantityKg: 8000,
      unitPrice: 25.0,
      totalAmount: 200000,
      platformFee: 10000,
      netAmount: 190000,
      status: 'PENDING',
      orderDate: new Date('2026-08-20'),
    },
    {
      id: 'KSF004',
      buyerId: 'BUY-FPO-FPL',
      lotId: 'LOT-FPO-WHEAT-01',
      cropId: 'CROP-WHEAT',
      quantityKg: 15000,
      unitPrice: 28.0,
      totalAmount: 420000,
      platformFee: 21000,
      netAmount: 399000,
      status: 'DELIVERED',
      orderDate: new Date('2026-08-10'),
    },
    {
      id: 'KSF005',
      buyerId: 'BUY-FPO-RC',
      lotId: 'LOT-FPO-POTATO-01',
      cropId: 'CROP-POTATO',
      quantityKg: 12000,
      unitPrice: 18.0,
      totalAmount: 216000,
      platformFee: 10800,
      netAmount: 205200,
      status: 'CONFIRMED',
      orderDate: new Date('2026-08-21'),
    },
  ];

  for (const o of orders) {
    await prisma.order.upsert({
      where: { id: o.id },
      update: {
        fpoId: 'FPO-UP-0456',
        quantityKg: o.quantityKg,
        unitPrice: o.unitPrice,
        totalAmount: o.totalAmount,
        platformFee: o.platformFee,
        netAmount: o.netAmount,
        status: o.status,
        orderDate: o.orderDate,
      },
      create: {
        id: o.id,
        fpoId: 'FPO-UP-0456',
        buyerId: o.buyerId,
        lotId: o.lotId,
        cropId: o.cropId,
        quantityKg: o.quantityKg,
        unitPrice: o.unitPrice,
        totalAmount: o.totalAmount,
        platformFee: o.platformFee,
        netAmount: o.netAmount,
        status: o.status,
        orderDate: o.orderDate,
      },
    });

    // Create connected payment
    await prisma.payment.upsert({
      where: { id: `PAY-${o.id}` },
      update: {
        fpoId: 'FPO-UP-0456',
        amount: o.totalAmount,
        status: o.status === 'DELIVERED' ? 'PAID' : 'ESCROW_LOCKED',
      },
      create: {
        id: `PAY-${o.id}`,
        orderId: o.id,
        fpoId: 'FPO-UP-0456',
        amount: o.totalAmount,
        method: 'ESCROW_NEFT',
        status: o.status === 'DELIVERED' ? 'PAID' : 'ESCROW_LOCKED',
        transactionRef: `TXN-${o.id}-8901`,
      },
    });
  }

  // 10. Seed Logistics & Active Shipment from Screenshot
  // Vehicle UP65XX1234 Enroute to Lucknow ETA: 2 hrs
  const logProfile = await prisma.logisticsProfile.upsert({
    where: { id: 'LOG-KASHI-01' },
    update: { businessName: 'Purvanchal Agri Logistics' },
    create: {
      id: 'LOG-KASHI-01',
      userId: anilUser.id,
      businessName: 'Purvanchal Agri Logistics',
      contactPerson: 'Vikram Yadav',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
    },
  });

  const vehicle = await prisma.vehicle.upsert({
    where: { id: 'VEH-UP65XX1234' },
    update: { vehicleNumber: 'UP65XX1234' },
    create: {
      id: 'VEH-UP65XX1234',
      logisticsId: logProfile.id,
      vehicleNumber: 'UP65XX1234',
      vehicleType: '10-Ton Eicher Refrigerated',
      capacityKg: 10000,
      refrigerated: true,
    },
  });

  await prisma.shipment.upsert({
    where: { id: 'SHIP-KSF002' },
    update: {
      fpoId: 'FPO-UP-0456',
      status: 'IN_TRANSIT',
      origin: 'Varanasi Central Hub',
      destination: 'Lucknow Hotel Co., Lucknow',
      distanceKm: 285,
      etaHours: 2.0,
    },
    create: {
      id: 'SHIP-KSF002',
      orderId: 'KSF002',
      fpoId: 'FPO-UP-0456',
      logisticsId: logProfile.id,
      vehicleId: vehicle.id,
      origin: 'Varanasi Central Hub',
      destination: 'Lucknow Hotel Co., Lucknow',
      status: 'IN_TRANSIT',
      distanceKm: 285,
      etaHours: 2.0,
    },
  });

  // Additional vehicles and shipments
  const vehicle2 = await prisma.vehicle.upsert({
    where: { id: 'VEH-UP65AB5678' },
    update: { vehicleNumber: 'UP65AB5678' },
    create: {
      id: 'VEH-UP65AB5678',
      logisticsId: logProfile.id,
      vehicleNumber: 'UP65AB5678',
      vehicleType: '14-Ton Multi-Axle Container',
      capacityKg: 14000,
      refrigerated: false,
    },
  });

  await prisma.shipment.upsert({
    where: { id: 'SHIP-KSF001' },
    update: {
      fpoId: 'FPO-UP-0456',
      status: 'ASSIGNED',
      origin: 'Cholapur Collection Center',
      destination: 'BigBasket Wholesale, Patna',
      distanceKm: 260,
      etaHours: 5.5,
    },
    create: {
      id: 'SHIP-KSF001',
      orderId: 'KSF001',
      fpoId: 'FPO-UP-0456',
      logisticsId: logProfile.id,
      vehicleId: vehicle2.id,
      origin: 'Cholapur Collection Center',
      destination: 'BigBasket Wholesale, Patna',
      status: 'ASSIGNED',
      distanceKm: 260,
      etaHours: 5.5,
    },
  });

  const vehicle3 = await prisma.vehicle.upsert({
    where: { id: 'VEH-UP65XY9988' },
    update: { vehicleNumber: 'UP65XY9988' },
    create: {
      id: 'VEH-UP65XY9988',
      logisticsId: logProfile.id,
      vehicleNumber: 'UP65XY9988',
      vehicleType: '12-Ton Heavy Carrier',
      capacityKg: 12000,
      refrigerated: false,
    },
  });

  await prisma.shipment.upsert({
    where: { id: 'SHIP-KSF004' },
    update: {
      fpoId: 'FPO-UP-0456',
      status: 'DELIVERED',
      origin: 'Pindra Collection Center',
      destination: 'Food Processor Ltd., Prayagraj',
      distanceKm: 125,
      etaHours: 0.0,
    },
    create: {
      id: 'SHIP-KSF004',
      orderId: 'KSF004',
      fpoId: 'FPO-UP-0456',
      logisticsId: logProfile.id,
      vehicleId: vehicle3.id,
      origin: 'Pindra Collection Center',
      destination: 'Food Processor Ltd., Prayagraj',
      status: 'DELIVERED',
      distanceKm: 125,
      etaHours: 0.0,
    },
  });

  // Seed live tracking telemetry for active shipment SHIP-KSF002
  const trackingPoints = [
    { id: 'TRK-001', shipmentId: 'SHIP-KSF002', latitude: 25.3176, longitude: 82.9739, temperatureC: 18.2, recordedAt: new Date(Date.now() - 7200000) },
    { id: 'TRK-002', shipmentId: 'SHIP-KSF002', latitude: 25.5542, longitude: 82.8124, temperatureC: 18.0, recordedAt: new Date(Date.now() - 5400000) },
    { id: 'TRK-003', shipmentId: 'SHIP-KSF002', latitude: 25.7464, longitude: 82.6837, temperatureC: 17.8, recordedAt: new Date(Date.now() - 1800000) },
  ];

  for (const pt of trackingPoints) {
    await prisma.tracking.upsert({
      where: { id: pt.id },
      update: pt,
      create: pt,
    });
  }

  // 11. Seed Notifications & Messages
  const notifications = [
    {
      id: 'NOTIF-01',
      title: 'New buyer demand received',
      message: 'BigBasket submitted bulk demand for 20 Ton Potato at ₹18/kg.',
      type: 'BUYER',
      link: '/fpo/demand',
    },
    {
      id: 'NOTIF-02',
      title: 'Payment locked in escrow',
      message: '₹3,60,000 received for Order KSF001 from BigBasket.',
      type: 'PAYMENT',
      link: '/fpo/payments',
    },
    {
      id: 'NOTIF-03',
      title: 'Shipment UP65XX1234 enroute',
      message: 'Vehicle departed Varanasi Central Hub for Lucknow. ETA: 2 hrs.',
      type: 'LOGISTICS',
      link: '/fpo/logistics',
    },
  ];

  for (const n of notifications) {
    await prisma.notification.upsert({
      where: { id: n.id },
      update: { ...n, fpoId: 'FPO-UP-0456', read: false },
      create: { ...n, fpoId: 'FPO-UP-0456', read: false },
    });
  }

  const messages = [
    {
      id: 'MSG-01',
      senderId: 'BUY-FPO-BB',
      senderName: 'BigBasket Procurement',
      senderRole: 'BUYER',
      subject: 'Weekly Potato Supply Expansion',
      content: 'Can we increase weekly Potato intake to 30 Ton from next month?',
    },
    {
      id: 'MSG-02',
      senderId: 'FAR-FPO-01',
      senderName: 'Ram Prasad',
      senderRole: 'FARMER',
      subject: 'Harvest Ready Notice',
      content: 'Ready to harvest next 5 Ton Potato batch tomorrow morning.',
    },
    {
      id: 'MSG-03',
      senderId: 'BUY-FPO-LHC',
      senderName: 'Lucknow Hotel Co.',
      senderRole: 'BUYER',
      subject: 'Delivery Timing Confirmation',
      content: 'Delivery timing confirmed for 4:00 PM at Lucknow Central Kitchen.',
    },
    {
      id: 'MSG-04',
      senderId: 'BUY-FPO-FM',
      senderName: 'FreshMart Organics',
      senderRole: 'BUYER',
      subject: 'Grade A Sample Check',
      content: 'Awaiting lab moisture report for the recent tomato batch.',
    },
    {
      id: 'MSG-05',
      senderId: 'STAFF-005',
      senderName: 'Sunita Maurya (Field Officer)',
      senderRole: 'STAFF',
      subject: 'Harahua Cluster Harvest Summary',
      content: 'Field survey complete. 45 farmers ready with kharif harvest.',
    },
  ];

  for (const m of messages) {
    await prisma.message.upsert({
      where: { id: m.id },
      update: { ...m, fpoId: 'FPO-UP-0456', read: false },
      create: { ...m, fpoId: 'FPO-UP-0456', read: false },
    });
  }

  console.log('✅ KrishiSetu Phase 2.4 FPO Dashboard Connected Data successfully seeded!');
}

if (process.argv[1] && process.argv[1].endsWith('seed-fpo-dashboard.js')) {
  seedFpoDashboard()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Failed to seed FPO dashboard:', err);
      process.exit(1);
    });
}
