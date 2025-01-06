const express = require("express");
const router = express.Router();
const resultController = require("../controller/resultController");

/**
 * @swagger
 * tags:
 *   name: Results
 *   description: Operaciones relacionadas con los resultados de los test.
 */

/**
 * @swagger
 * /api/results:
 *   post:
 *     tags: [Results]
 *     summary: Crear un nuevo resultado
 *     description: Crea un nuevo resultado para un test realizado por un perfil (estudiante).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profileId:
 *                 type: integer
 *               testId:
 *                 type: integer
 *               answers:
 *                 type: array
 *                 items:
 *                   type: integer
 *               score:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Resultado creado exitosamente.
 *       400:
 *         description: Bad Request (falta información requerida).
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/results", resultController.createResult);

/**
 * @swagger
 * /api/results/test/{testId}/student/{profileId}:
 *   get:
 *     tags: [Results]
 *     summary: Obtener los resultados de un test para un perfil específico.
 *     description: Obtiene los resultados de un test para un perfil (estudiante) específico.
 *     parameters:
 *       - in: path
 *         name: testId
 *         required: true
 *         description: ID del test.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: profileId
 *         required: true
 *         description: ID del perfil (estudiante).
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles del resultado.
 *       404:
 *         description: No se encontraron resultados.
 *       500:
 *         description: Error al obtener los resultados.
 */
router.get(
  "/results/test/:testId/student/:profileId",
  resultController.getResultsDetail
);

/**
 * @swagger
 * /api/results/report:
 *   get:
 *     tags: [Results]
 *     summary: Obtener resultados agrupados.
 *     description: Obtiene los resultados agrupados por perfil y asignatura.
 *     responses:
 *       200:
 *         description: Resultados agrupados con puntuación y porcentaje.
 *       500:
 *         description: Error al obtener los resultados agrupados.
 */
router.get("/results/report", resultController.getGroupedResults);

module.exports = router;
