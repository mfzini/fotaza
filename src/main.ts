import 'dotenv/config';
import { sequelize } from "./config/db.js";
import { server } from "./config/server.js";
const PORT = process.env.PORT || 3000;

server.listen(PORT, async (err) => {
  await sequelize.sync({ alter: true });  
});