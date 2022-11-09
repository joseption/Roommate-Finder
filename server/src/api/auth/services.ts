import db from '../../utils/db';
import { hashToken } from 'utils/jwt';

export function addRefreshTokenToWhitelist({ jti, refreshToken, userId }: { jti:string, refreshToken:string, userId:string }) {
  return db.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId
    },
  });
}

export function findRefreshTokenById(id:string) {
  return db.refreshToken.findUnique({
    where: {
      id,
    },
  });
}

export function deleteRefreshToken(id:string) {
  return db.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true
    }
  });
}

export function revokeTokens(userId:string) {
  return db.refreshToken.updateMany({
    where: {
      userId
    },
    data: {
      revoked: true
    }
  });
}

export function VerifySudo(userId:string) {
  return db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      is_superuser: true,
    }
  });
}