const express = require("express");
const router = express.Router();
const studentController = require("../controller/studentController");

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Crear un nuevo estudiante
 *     tags: [Student]
 *     description: Crea un nuevo estudiante con asignaturas asociadas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del estudiante
 *               schoolName:
 *                 type: string
 *                 description: Nombre de la escuela del estudiante
 *               email:
 *                 type: string
 *                 description: Correo electrónico del estudiante
 *               subjectIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Lista de IDs de asignaturas asociadas al estudiante
 *     responses:
 *       201:
 *         description: Estudiante creado exitosamente
 *       400:
 *         description: Bad Request (campos requeridos no proporcionados)
 *       500:
 *         description: Error al crear el estudiante
 */
router.post("/students", studentController.createStudent);

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Obtener todos los estudiantes
 *     tags: [Student]
 *     description: Obtiene todos los estudiantes registrados en el sistema.
 *     responses:
 *       200:
 *         description: Lista de estudiantes
 *       500:
 *         description: Error al obtener los estudiantes
 */
router.get("/students", studentController.getAllStudents);

/**
 * @swagger
 * /api/student/{id}:
 *   get:
 *     summary: Obtener un estudiante por ID
 *     tags: [Student]
 *     description: Obtiene la información de un estudiante según su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del estudiante
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Información del estudiante
 *       404:
 *         description: Estudiante no encontrado
 *       500:
 *         description: Error al obtener el estudiante
 */
router.get("/student/:id", studentController.getStudentById);

/**
 * @swagger
 * /api/student/{id}:
 *   put:
 *     summary: Actualizar un estudiante
 *     tags: [Student]
 *     description: Actualiza la información de un estudiante existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del estudiante a actualizar
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
 *         description: Estudiante actualizado exitosamente
 *       400:
 *         description: Bad Request (campos requeridos no proporcionados)
 *       500:
 *         description: Error al actualizar el estudiante
 */
router.put("/student/:id", studentController.updateStudent);

/**
 * @swagger
 * /api/student/{id}:
 *   delete:
 *     summary: Eliminar un estudiante
 *     tags: [Student]
 *     description: Elimina un estudiante del sistema según su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del estudiante a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estudiante eliminado exitosamente
 *       500:
 *         description: Error al eliminar el estudiante
 */
router.delete("/student/:id", studentController.deleteStudent);

module.exports = router;
