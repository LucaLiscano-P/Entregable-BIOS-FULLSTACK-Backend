import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'defaultsecret',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'defaultaccesssecret',
  dbUri: process.env.DB_URI || 'mongodb://localhost:27017/mydatabase'
};