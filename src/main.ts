import 'dotenv/config';
import { sequelize } from "./db.js";
import { server } from "./server.js";


await sequelize.sync({force: true})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});