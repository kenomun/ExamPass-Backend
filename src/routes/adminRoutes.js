const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");

/**
 * @swagger
 * /admins:
 *   post:
 *     summary: Crear un nuevo administrador
 *     tags: [Admin]
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
 *               roleId:
 *                 type: integer
 *
 *     responses:
 *       201:
 *         description: Admin creado exitosamente (Role 2 paracrear un Admin)
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/admins", adminController.createAdmin);

/**
 * @swagger
 * /admins:
 *   get:
 *     summary: Obtener todos los administradores
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Lista de administradores
 *       500:
 *         description: Error interno del servidor
 */
router.get("/admins", adminController.getAllAdmins);

/**
 * @swagger
 * /admin/{id}:
 *   get:
 *     summary: Obtener un administrador por ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del administrador a obtener
 *     responses:
 *       200:
 *         description: Admin encontrado
 *       404:
 *         description: Admin no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/admin/:id", adminController.getAdminById);

/**
 * @swagger
 * /admin/{id}:
 *   put:
 *     summary: Actualizar un administrador
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del administrador a actualizar
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
 *     responses:
 *       200:
 *         description: Admin actualizado correctamente
 *       404:
 *         description: Admin no encontrado
 *       500:
 *         description: Error al actualizar el admin
 */
router.put("/admin/:id", adminController.updateAdmin);

/**
 * @swagger
 * /admin/{id}:
 *   delete:
 *     summary: Eliminar un administrador
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del administrador a eliminar
 *     responses:
 *       200:
 *         description: Admin eliminado correctamente
 *       500:
 *         description: Error al eliminar el admin
 */
router.delete("/admin/:id", adminController.deleteAdmin);

module.exports = router;
