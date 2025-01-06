const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendOk, badRequest } = require('../helpers/http') 

// Obtener un usuario por su email (login)
const getLoginByEmail = async (req, res) => {
    try {
      const { email } = req.params; 
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: 'Email inválido o no proporcionado' });
      }
      
      // Buscar al usuario en la base de datos por su email
      const user = await prisma.profiles.findUnique({
        where: { email: email },
        select: {
            id: true,
            name: true,
            email: true,
            roleId: true,
        },
      });
  
      // Si el usuario no existe
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Si el usuario existe, devolver solo los campos requeridos
      return sendOk(res, 'usuario encontrado', user)
    } catch (error) {
      res.status(500).json({ error: 'Error al realizar login', details: error.message });
    }
  };
  
  

  module.exports = {
    getLoginByEmail

  }