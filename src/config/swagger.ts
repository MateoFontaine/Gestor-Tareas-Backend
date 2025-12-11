import swaggerUi from "swagger-ui-express";
import { Express } from "express";

// Cargamos el archivo JSON directamente
// Nota: require es la forma más fácil en Node.js para cargar JSONs estáticos
const swaggerDocument = require("../swagger.json");

export const swaggerDocs = (app: Express, port: number) => {
  // Simplemente servimos ese documento
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  
  console.log(`📄 Documentación (Modo JSON) disponible en http://localhost:${port}/api-docs`);
};