const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear un nuevo admin
const createAdmin = async (req, res) => {
  try {
    const { name, email, roleId } = req.body;

    if (!name || !email || !roleId) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const role = await prisma.Roles.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    const newAdmin = await prisma.Profiles.create({
      data: {
        name,
        email,
        roleId,
      },
    });

    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await prisma.Profiles.findMany({
      where: {
        roleId: 2,
      },
    });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un admin por ID
const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await prisma.Profiles.findUnique({
      where: { id: parseInt(id) },
      include: { Role: true },
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin no encontrado' });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un admin
  const updateAdmin = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email } = req.body;
  
      const checkAdmin = await prisma.profiles.findUnique({ where: { id: parseInt(id) } });
      if (!checkAdmin)  return res.status(404).json({ message: 'Admin no encontrado' });
      const updatedAdmin = await prisma.profiles.update({
        where: { id: parseInt(id) },
        data: { name, email },
      });

      res.status(200).json({ updatedAdmin, message: 'Admin actualizado' });
    } catch (error) {
      res.status(500).json({ message: 'erro al actualizar el admin', error});
    }
  };
  
// Eliminar un admin
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.Profiles.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Admin eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Admin no encontrado' });
  }
};

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
