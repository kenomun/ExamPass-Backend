require("dotenv").config();
const express = require("express");
const cors = require("cors");
const adminRoutes = require("./src/routes/adminRoutes");
const professorRoutes = require("./src/routes/professorRoutes");
const studentRoutes = require("./src/routes/studentroutes");
const testRoutes = require("./src/routes/testRoutes");
const resultRoutes = require("./src/routes/resultRoutes");
const loginRoutes = require("./src/routes/loginRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./src/config/swagger");
// Inicializa la app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Bienvenido a la API de ExamPass");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas
app.use("/api", loginRoutes);
app.use("/api", adminRoutes);
app.use("/api", professorRoutes);
app.use("/api", studentRoutes);
app.use("/api", testRoutes);
app.use("/api", resultRoutes);

// Levantar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
