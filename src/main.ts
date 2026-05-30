import 'dotenv/config';
import { sequelize } from "./config/db.js";
import { server } from "./config/server.js";
const PORT = process.env.PORT || 3000;

server.listen(PORT, async (err) => {
  const production = process.env.NODE_ENV == 'production';
  if (err) {
    console.error(err);
    if (production) {
      process.exit(1);
    }
  } else {
    if (!production) await sequelize.sync({ alter: true });
    console.log(production? "Up and runnig!" : `http://localhost:${PORT}`);
  }
  
});