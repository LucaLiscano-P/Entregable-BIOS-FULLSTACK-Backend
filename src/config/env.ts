import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'defaultsecret',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'defaultaccesssecret',
  jwtRefreshSecret : process.env.JWT_REFRESH_SECRET || 'defaultrefreshsecret',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  jwtIssuer: process.env.JWT_ISSUER || 'myapp',
  jwtAudience: process.env.JWT_AUDIENCE || 'myapp-users',
  dbUri: process.env.DB_URI || 'mongodb://localhost:27017/mydatabase'
};