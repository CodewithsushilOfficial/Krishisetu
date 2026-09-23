import prisma from '../../db/prisma.js';
import { UnauthorizedError, ForbiddenError, NotFoundError } from '../../lib/errors.js';

/**
 * Resolve current Logistics Partner context from authenticated session and enforce multi-tenant isolation
 */
export async function resolveLogisticsContext(req, _res, next) {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required', 'AUTH_REQUIRED');
    }

    let logistics = null;

    // 1. Direct Logistics profile owner
    logistics = await prisma.logisticsProfile.findFirst({
      where: { userId: req.user.id },
    });

    // 2. Guaranteed demo account binding for Suresh Yadav
    if (['logistics001@krishisetu.demo', 'suresh.yadav@krishisetu.demo'].includes(req.user.email)) {
      const sureshProfile = await prisma.logisticsProfile.findFirst({
        where: {
          OR: [
            { id: 'LP-SURESH-001' },
            { partnerCode: 'LP-UP-001' },
          ],
        },
      });
      if (sureshProfile) {
        logistics = sureshProfile;
      }
    }

    // 3. Fallback for admin or demo accounts
    if (!logistics && ['ADMIN', 'CONTROL_ADMIN', 'LOGISTICS'].includes(req.user.role)) {
      const headerLogisticsId = req.headers['x-logistics-id'];
      if (headerLogisticsId) {
        logistics = await prisma.logisticsProfile.findUnique({ where: { id: headerLogisticsId } });
      } else {
        logistics = await prisma.logisticsProfile.findFirst({
          where: {
            OR: [
              { partnerCode: 'LP-UP-001' },
              { businessName: 'Yadav Agri-Transporters' },
            ],
          },
        });
      }
    }

    if (!logistics) {
      throw new NotFoundError(
        'No authorized Logistics Partner profile linked to this account',
        'LOGISTICS_PROFILE_NOT_FOUND'
      );
    }

    req.logistics = logistics;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Guard that verifies Logistics context is resolved
 */
export function requireLogisticsAccess(req, _res, next) {
  if (!req.logistics) {
    return next(
      new ForbiddenError(
        'Access to logistics operational resources requires a valid logistics partner profile',
        'FORBIDDEN_LOGISTICS_ACCESS'
      )
    );
  }
  next();
}

/**
 * Verify vehicle belongs to authenticated logistics partner
 */
export async function requireVehicleOwnership(req, _res, next) {
  try {
    const vehicleId = req.params.id || req.params.vehicleId || req.body.vehicleId;
    if (!vehicleId) return next();

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      throw new NotFoundError('Vehicle not found', 'VEHICLE_NOT_FOUND');
    }

    if (vehicle.logisticsId !== req.logistics.id && !['ADMIN', 'CONTROL_ADMIN'].includes(req.user.role)) {
      throw new ForbiddenError('You do not have permission to manage this vehicle', 'FORBIDDEN_VEHICLE_OWNERSHIP');
    }

    req.vehicle = vehicle;
    next();
  } catch (err) {
    next(err);
  }
}
