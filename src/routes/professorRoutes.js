const express = require("express");
const router = express.Router();
const professorController = require("../controller/professorController");

/**
 * @swagger
 * /api/professors:
 *   post:
 *     summary: Crear un nuevo profesor
 *     tags: [Professor]
 *     description: Crea un nuevo profesor en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del profesor
 *               email:
 *                 type: string
 *                 description: Correo electrónico del profesor
 *               roleId:
 *                 type: integer
 *                 description: ID del rol del profesor
 *               subjectIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Lista de IDs de asignaturas
 *     responses:
 *       201:
 *         description: Profesor creado exitosamente
 *       400:
 *         description: Bad Request (campos requeridos no proporcionados)
 *       500:
 *         description: Error al crear el profesor
 */
router.post("/professors", professorController.createProfessor);

/**
 * @swagger
 * /api/professors:
 *   get:
 *     summary: Obtener todos los profesores
 *     tags: [Professor]
 *     description: Obtiene todos los profesores registrados en el sistema.
 *     responses:
 *       200:
 *         description: Lista de profesores
 *       500:
 *         description: Error al obtener los profesores
 */
router.get("/professors", professorController.getAllProfessors);

/**
 * @swagger
 * /api/professor/{id}:
 *   get:
 *     summary: Obtener un profesor por ID
 *     tags: [Professor]
 *     description: Obtiene la información de un profesor según su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del profesor
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Información del profesor
 *       404:
 *         description: Profesor no encontrado
 *       500:
 *         description: Error al obtener el profesor
 */
router.get("/professor/:id", professorController.getProfessorById);

/**
 * @swagger
 * /api/professor/{id}:
 *   put:
 *     summary: Actualizar un profesor
 *     tags: [Professor]
 *     description: Actualiza la información de un profesor existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del profesor a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               subjectIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Profesor actualizado exitosamente
 *       400:
 *         description: Bad Request (no se proporcionaron asignaturas)
 *       500:
 *         description: Error al actualizar el profesor
 */
router.put("/professor/:id", professorController.updateProfessor);

/**
 * @swagger
 * /api/professor/{id}:
 *   delete:
 *     summary: Eliminar un profesor
 *     tags: [Professor]
 *     description: Elimina un profesor del sistema según su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del profesor a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profesor eliminado exitosamente
 *       500:
 *         description: Error al eliminar el profesor
 */
router.delete("/professor/:id", professorController.deleteProfessor);

module.exports = router;
