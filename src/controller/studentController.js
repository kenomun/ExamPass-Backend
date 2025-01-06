const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sendOk, badRequest } = require("../helpers/http");

// Crear un nuevo estudiante con asignaturas
const createStudent = async (req, res) => {
  try {
    const { name, schoolName, email, subjectIds } = req.body;

    // Validar los datos
    if (
      !name ||
      !schoolName ||
      !email ||
      !subjectIds ||
      !Array.isArray(subjectIds)
    ) {
      return res.status(400).json({
        message:
          "Todos los campos son requeridos y subjectIds debe ser un arreglo",
      });
    }

    // Verificar si ya existe un perfil con el email proporcionado
    let profile = await prisma.profiles.findUnique({
      where: { email: email },
    });

    if (profile) {
      return res
        .status(500)
        .json({ message: "El email del alumno ya se encuentra registrado" });
    }

    // Si no existe el perfil, crearlo
    if (!profile) {
      profile = await prisma.profiles.create({
        data: {
          name,
          email,
          roleId: 3,
        },
      });
    }

    // Crear el estudiante
    const newStudent = await prisma.students.create({
      data: {
        schoolName,
        profileId: profile.id,
      },
      include: {
        Profile: true,
      },
    });

    // Crear las relaciones en la tabla profileSubject
    const profileSubjects = subjectIds.map((subjectId) => ({
      profileId: profile.id,
      subjectId: subjectId,
      isDone: false,
    }));

    // Insertar las relaciones en la tabla profileSubject
    await prisma.profileSubject.createMany({
      data: profileSubjects,
    });

    // Obtener nuevamente el estudiante con las asignaturas asociadas
    const studentWithSubjects = await prisma.students.findUnique({
      where: { id: newStudent.id },
      include: {
        Profile: {
          include: {
            Role: true,
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
        },
      },
    });

    res.status(201).json(studentWithSubjects); // Devolver los datos completos del estudiante
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear estudiante", details: error.message });
  }
};

// Obtener todos los estudiantes
const getAllStudents = async (req, res) => {
  try {
    const students = await prisma.profiles.findMany({
      where: {
        roleId: 3, // Filtrar por rolId 3 (por ejemplo, estudiantes con rol específico)
      },
      include: {
        Students: {
          // Incluir la información de la tabla Students
          select: {
            schoolName: true, // Solo el nombre de la escuela
          },
        },
        Role: true, // Incluir el rol del perfil
        Subjects: {
          select: {
            Subject: {
              select: {
                id: true,
                name: true, // Solo id y nombre de las asignaturas
              },
            },
          },
        },
      },
    });

    console.log("Estudiantes encontrados: ", students);

    // Formatear la respuesta
    const studentsWithSubjects = students.map((student) => ({
      schoolId: student.id,
      schoolName: student.Students.schoolName,
      id: student.id,
      name: student.name,
      email: student.email,
      roleId: student.roleId,
      subjects: student.Subjects.map((ps) => ps.Subject), // Asignaturas asociadas
    }));

    return sendOk(res, "Usuarios encontrados", studentsWithSubjects);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener estudiantes",
      details: error.message,
    });
  }
};

// Obtener un estudiante por su ID
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el perfil por ID, incluir la relación con Students
    const profile = await prisma.profiles.findUnique({
      where: { id: parseInt(id) }, // Buscar el perfil con el ID de la URL
      include: {
        Students: true, // Incluir la información de la relación 'Students'
        Role: true,
        Subjects: {
          select: {
            Subject: {
              select: {
                id: true,
                name: true, // Solo el nombre de la asignatura
              },
            },
          },
        },
      },
    });

    // Verificar si se encontró el perfil
    if (profile) {
      res.status(200).json(profile); // Retornar el perfil con los datos asociados
    } else {
      res.status(404).json({ error: "Estudiante no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener estudiante", details: error.message });
  }
};

// Actualizar un estudiante
const updateStudent = async (req, res) => {
  console.log(req);
  try {
    const { id } = req.params; // Este es el profileId
    const { schoolName, name, email, subjects } = req.body;

    // Verificar si el perfil existe
    const profile = await prisma.profiles.findUnique({
      where: { id: parseInt(id) },
    });

    if (!profile) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    // Verificar si el estudiante asociado al perfil existe
    const student = await prisma.students.findUnique({
      where: { profileId: parseInt(id) },
    });

    if (!student) {
      return res
        .status(404)
        .json({ message: "Estudiante asociado no encontrado" });
    }

    // Actualizar el perfil con el nombre y el correo electrónico nuevos
    const updatedProfile = await prisma.profiles.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
      },
    });

    // Actualizar el estudiante con el nuevo colegio
    const updatedStudent = await prisma.students.update({
      where: { profileId: parseInt(id) },
      data: {
        schoolName,
      },
    });

    // Si se proporciona una lista de asignaturas, actualízala
    if (Array.isArray(subjects)) {
      // Eliminar las asignaturas antiguas y crear las nuevas
      await prisma.profileSubject.deleteMany({
        where: {
          profileId: parseInt(id),
        },
      });

      const updatedSubjects = subjects.map((subjectId) => ({
        profileId: parseInt(id),
        subjectId,
        isDone: false,
      }));

      // Crear las nuevas relaciones de asignaturas para el perfil
      await prisma.profileSubject.createMany({
        data: updatedSubjects,
      });
    }

    // Volver a obtener el estudiante con las asignaturas actualizadas
    const updateStudentData = await prisma.students.findUnique({
      where: { profileId: parseInt(id) },
      include: {
        Profile: {
          include: {
            Role: true,
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
        },
      },
    });

    res.status(200).json({
      updateStudentData,
    });
  } catch (error) {
    console.error("Error en actualización de estudiante:", error);
    res.status(500).json({
      error: "Error al actualizar estudiante",
      details: error.message,
    });
  }
};

// Eliminar un estudiante
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("ID recibido en la URL:", id);

    // Buscar el perfil con el id recibido en la URL (el id es de Profile)
    const profile = await prisma.profiles.findUnique({
      where: { id: parseInt(id) },
      include: {
        Students: true,
        Subjects: true,
        Role: true,
      },
    });

    console.log("Perfil encontrado:", profile);

    // Verificar si el perfil existe
    if (!profile) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    // Eliminar la relación de perfil con asignaturas (profileSubject)
    if (profile.Subjects.length > 0) {
      await prisma.profileSubject.deleteMany({
        where: {
          profileId: profile.id,
        },
      });
    }

    // Si el perfil tiene un estudiante asociado, eliminamos el estudiante
    if (profile.Students) {
      // Primero eliminamos el estudiante
      await prisma.students.delete({
        where: { id: profile.Students.id },
      });
    }

    // Eliminar el perfil
    await prisma.profiles.delete({
      where: { id: profile.id },
    });

    res
      .status(200)
      .json({ message: "Estudiante y perfil eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar estudiante y perfil" });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
