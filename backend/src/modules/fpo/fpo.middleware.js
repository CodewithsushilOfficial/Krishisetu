import prisma from '../../db/prisma.js';
import { UnauthorizedError, ForbiddenError, NotFoundError } from '../../lib/errors.js';

/**
 * Resolve current FPO context from authenticated session and enforce multi-tenant isolation
 */
export async function resolveFpoContext(req, _res, next) {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required', 'AUTH_REQUIRED');
    }

    let fpo = null;
    let staffMember = null;

    // 1. Direct FPO profile owner
    fpo = await prisma.fpoProfile.findFirst({
      where: { userId: req.user.id },
    });

    // 2. Staff member of an FPO
    if (!fpo) {
      staffMember = await prisma.fpoStaff.findFirst({
        where: {
          OR: [
            { userId: req.user.id },
            { email: req.user.email },
          ],
          status: 'ACTIVE',
        },
        include: { fpo: true },
      });

      if (staffMember && staffMember.fpo) {
        fpo = staffMember.fpo;
      }
    }

    // 3. Fallback for admin or demo accounts
    if (!fpo && ['ADMIN', 'CONTROL_ADMIN', 'FPO'].includes(req.user.role)) {
      const headerFpoId = req.headers['x-fpo-id'];
      if (headerFpoId) {
        fpo = await prisma.fpoProfile.findUnique({ where: { id: headerFpoId } });
      } else {
        fpo = await prisma.fpoProfile.findFirst({
          where: {
            OR: [
              { registrationNumber: 'FPO-UP-0456' },
              { id: 'FPO-001' },
            ],
          },
        });
      }
    }

    if (!fpo) {
      throw new NotFoundError('No authorized FPO organization linked to this account', 'FPO_TENANT_NOT_FOUND');
    }

    req.fpo = fpo;
    req.fpoStaff = staffMember;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Guard that verifies FPO tenant access is resolved
 */
export function requireFpoAccess(req, _res, next) {
  if (!req.fpo) {
    return next(new ForbiddenError('Access to FPO resources requires valid FPO tenant membership', 'FORBIDDEN_FPO_ACCESS'));
  }
  next();
}

/**
 * Guard for granular RBAC permission inside an FPO
 */
export function requireFpoPermission(permission) {
  return (req, _res, next) => {
    if (!req.fpo) {
      return next(new ForbiddenError('FPO organization context required', 'FPO_CONTEXT_MISSING'));
    }

    // FPO profile owner or Platform Admins have full access
    if (req.user.id === req.fpo.userId || ['ADMIN', 'CONTROL_ADMIN'].includes(req.user.role)) {
      return next();
    }

    // If request comes from staff, check permissions
    if (req.fpoStaff) {
      const perms = req.fpoStaff.permissions || [];
      if (perms.includes('*') || perms.includes(permission)) {
        return next();
      }
      return next(
        new ForbiddenError(
          `Staff permission '${permission}' required. Role: ${req.fpoStaff.role}`,
          'FORBIDDEN_STAFF_PERMISSION'
        )
      );
    }

    return next(new ForbiddenError('Unauthorized operational action for this FPO role', 'FORBIDDEN_ROLE'));
  };
}
