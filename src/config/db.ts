import { Sequelize } from "sequelize-typescript";
import { User } from "../models/User.js";

export const sequelize : Sequelize = new Sequelize(process.env.DB_URL!, {
  logging: false,
  models: [User],
});

try {
  await sequelize.authenticate();
} catch (error) {
  console.error('Unable to connect to the database:', error);
  process.exit(1);
}