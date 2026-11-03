import { Request, Response, NextFunction } from 'express';
import { cloudDb } from '../services/dbService.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'patient' | 'doctor' | 'admin';
    name: string;
  };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const userEmailHeader = req.headers['x-user-email'] as string;
  const userIdHeader = req.headers['x-user-id'] as string;
  const userRoleHeader = req.headers['x-user-role'] as 'patient' | 'doctor' | 'admin' | undefined;

  let uId = userIdHeader;
  if (!uId && authHeader && authHeader.startsWith('Bearer ')) {
    const rawToken = authHeader.split(' ')[1];
    if (rawToken.startsWith('user:')) {
      uId = rawToken.replace('user:', '');
    } else if (rawToken.startsWith('firebase:')) {
      uId = rawToken.replace('firebase:', '');
    } else if (rawToken) {
      uId = rawToken;
    }
  }

  if (uId) {
    let user = cloudDb.getUserById(uId);
    if (!user && (userEmailHeader || uId)) {
      const email = userEmailHeader || `${uId}@smartcare.cloud`;
      const targetRole = email === 'yadasomesh46@gmail.com' ? 'admin' : (userRoleHeader || 'patient');
      user = cloudDb.ensureUserWithRole(email, targetRole);
      // Ensure the id matches uId
      user.id = uId;
      (cloudDb as any).users.set(uId, user);
    } else if (user && userRoleHeader && user.role !== userRoleHeader) {
      user.role = userRoleHeader;
    }

    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      };
      return next();
    }
  }

  if (userEmailHeader) {
    let user = cloudDb.getUserByEmail(userEmailHeader);
    if (!user) {
      const targetRole = userEmailHeader === 'yadasomesh46@gmail.com' ? 'admin' : (userRoleHeader || 'patient');
      user = cloudDb.ensureUserWithRole(userEmailHeader, targetRole);
    }
    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      };
      return next();
    }
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token.startsWith('user:') || token.startsWith('firebase:')) {
      const parsedId = token.replace(/^(user:|firebase:)/, '');
      const user = cloudDb.getUserById(parsedId);
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        };
        return next();
      }
    }
  }

  return next();
}

export function requireRole(...allowedRoles: Array<'patient' | 'doctor' | 'admin'>) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication Required',
        message: 'Please sign in to access this cloud resource.',
        code: 'AUTH_REQUIRED',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access Restricted',
        message: `Your role (${req.user.role.toUpperCase()}) does not possess authorization to access this endpoint. Required: ${allowedRoles.join(', ')}`,
        code: 'FORBIDDEN_ROLE',
        allowedRoles,
        currentRole: req.user.role,
      });
    }

    next();
  };
}
