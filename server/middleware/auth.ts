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

  if (userIdHeader) {
    const user = cloudDb.getUserById(userIdHeader);
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
    const user = cloudDb.getUserByEmail(userEmailHeader);
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
    // For academic prototype, tokens can encode user id or email
    if (token.startsWith('user:')) {
      const uId = token.replace('user:', '');
      const user = cloudDb.getUserById(uId);
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

  // Default to Aarav Kumar for public demo testing if no auth specified, or proceed with guest
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
