const swaggerJSDoc = require("swagger-jsdoc");
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ExamPass",
      version: "1.0.0",
      description: "API para gestionar examenes",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = swaggerDocs;
