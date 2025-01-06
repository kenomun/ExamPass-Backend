const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear un nuevo profesor
const createProfessor = async (req, res) => {
  try {
    const { name, email, roleId, subjectIds } = req.body;

    // Validar datos
    if (!name || !email || !roleId || !subjectIds || subjectIds.length === 0) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Crear un nuevo perfil para el profesor
    const professor = await prisma.profiles.create({
      data: {
        name,
        email,
        roleId,
        Subjects: {
          create: subjectIds.map(subjectId => ({
            subjectId, 
            isDone: false,
          })),
        },
      },
    });

    res.status(201).json(professor);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el profesor" });
  }
};

// Obtener todos los profesores
const getAllProfessors = async (req, res) => {
  try {
    const professors = await prisma.profiles.findMany({
      where: {
        roleId: 1,
      },
      include: {
        Subjects: {
          select: {
            Subject: {
              select: {
                id: true,     
                name: true,    
              },
            },
          },
        },
      },
    });

    res.status(200).json(professors);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los profesores" });
  }
};

// Obtener un profesor por ID
const getProfessorById = async (req, res) => {
  try {
    const { id } = req.params;
    const professor = await prisma.profiles.findUnique({
      where: { id: parseInt(id) },
      include: {
        Subjects: {
          select: {
            Subject: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    if (!professor) {
      return res.status(404).json({ error: "Profesor no encontrado" });
    }
    res.status(200).json(professor);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el profesor" });
  }
};


// Actualizar un profesor
const updateProfessor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, subjectIds } = req.body;

    if (!subjectIds || subjectIds.length === 0) {
      return res.status(400).json({ message: 'Debe proporcionar al menos una asignatura' });
    }

    // Actualizar el perfil del profesor
    const updatedProfessor = await prisma.profiles.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        Subjects: {
          deleteMany: {},
          create: subjectIds.map(subjectId => ({
            subjectId,
            isDone: false,
          })),
        },
      },
      include: {
        Subjects: {
          select: {
            Subject: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json(updatedProfessor);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el profesor" });
  }
};


// Eliminar un profesor
const deleteProfessor = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.profileSubject.deleteMany({
      where: { profileId: parseInt(id) },
    });

    // Eliminar el perfil del profesor
    const deletedProfessor = await prisma.profiles.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Profesor eliminado exitosamente", deletedProfessor });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el profesor" });
  }
};


module.exports = {
  createProfessor,
  getAllProfessors,
  getProfessorById,
  updateProfessor,
  deleteProfessor,
};
