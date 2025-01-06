const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sendOk, badRequest } = require("../helpers/http");

// Crear un Test con Preguntas y Respuestas
const createTest = async (req, res) => {
  try {
    const { testName, subjectId, questions } = req.body;

    if (!testName || !subjectId || !questions || questions.length < 1) {
      return res.status(400).json({
        message:
          "Faltan datos: nombre del test, asignatura, y al menos una pregunta.",
      });
    }

    // Crear el test
    let test = await prisma.test.create({
      data: {
        name: testName,
        subjectId: subjectId,
        Questions: {
          create: await Promise.all(
            questions.map(async (question) => {
              // Crear el contenido primero
              const content = await prisma.content.create({
                data: {
                  description: question.content.description,
                },
              });

              return {
                // Crear la pregunta, ahora incluyendo la propiedad 'question'
                question: question.question, // Este es el campo que faltaba
                contentId: content.id,
                Answers: {
                  create: question.answers.map((answer) => ({
                    answer: answer.answer,
                    isCorrect: answer.isCorrect,
                  })),
                },
              };
            })
          ),
        },
      },
      include: {
        Subject: true,
        Questions: {
          include: {
            content: true,
            Answers: true,
          },
        },
      },
    });

    return sendOk(res, "test guardado", test);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al crear el test", details: error.message });
  }
};

// Obtener todos los tests con preguntas, respuestas y contenido
const getAllTests = async (req, res) => {
  try {
    const tests = await prisma.test.findMany({
      include: {
        Subject: true,
        Questions: {
          include: {
            content: true,
            Answers: true,
          },
        },
      },
    });

    if (!tests || tests.length === 0) {
      return res.status(404).json({ message: "No se encontraron tests." });
    }

    res.json(tests);
  } catch (error) {
    console.error("Error al obtener los tests:", error);
    res
      .status(500)
      .json({ error: "Error al obtener los tests", details: error.message });
  }
};

// Obtener un test por ID con preguntas, respuestas y contenido
const getTestById = async (req, res) => {
  const { id } = req.params;
  try {
    const test = await prisma.test.findUnique({
      where: { id: Number(id) },
      include: {
        Subject: true,
        Questions: {
          include: {
            content: true,
            Answers: true,
          },
        },
      },
    });

    if (!test) {
      return res.status(404).json({ error: "Test no encontrado" });
    }

    res.json(test);
  } catch (error) {
    console.error("Error al obtener el test por ID:", error);
    res
      .status(500)
      .json({ error: "Error al obtener el test", details: error.message });
  }
};

//revisa si alumno ya tiene registro en el test
const checkStudenttestExist = async (req, res) => {
  const { profileId, testId } = req.params;

  if (!profileId || !testId) {
    return res
      .status(400)
      .json({ message: "Faltan parámetros profileId o testId" });
  }

  try {
    const result = await prisma.result.findFirst({
      where: {
        AND: [{ profileId: parseInt(profileId) }, { testId: parseInt(testId) }],
      },
    });

    if (result) {
      return res.status(200).json({ hasTaken: true });
    } else {
      return res.status(200).json({ hasTaken: false });
    }
  } catch (error) {
    console.error("Error al comprobar el examen:", error);
    return res
      .status(500)
      .json({ message: "Error en el servidor al verificar el examen" });
  }
};

// Actualizar el test
const updateTest = async (req, res) => {
  const { id } = req.params;
  const { testName, subjectId, questions } = req.body;

  try {
    // Verificar si el test existe
    const testExists = await prisma.test.findUnique({
      where: { id: parseInt(id) },
    });

    if (!testExists)
      return res.status(404).json({ error: "Test no encontrado." });

    // Actualizar el test
    const updatedTest = await prisma.test.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: testName,
        Subject: {
          connect: { id: subjectId },
        },
        Questions: {
          update: questions.map((question) => ({
            where: {
              id: question.id,
            },
            data: {
              question: question.question,
              content: {
                update: {
                  description: question.contentDescription,
                },
              },
              Answers: {
                deleteMany: {},
                create: question.answers.map((answer) => ({
                  answer: answer.answer,
                  isCorrect: answer.isCorrect,
                })),
              },
            },
          })),
        },
      },
      include: {
        Subject: true,
        Questions: {
          include: {
            content: true,
            Answers: true,
          },
        },
      },
    });

    return res.status(200).json(updatedTest);
  } catch (error) {
    console.error("Error al actualizar el test:", error);
    return res.status(500).json({ error: "Error al actualizar el test." });
  }
};

//Buscar todos los test por asignatura
const getTestsBySubjectId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ message: "El ID de la asignatura es obligatorio." });
    }

    // Buscar los tests asociados a la asignatura
    const tests = await prisma.test.findMany({
      where: {
        subjectId: parseInt(id),
      },
      include: {
        Subject: true,
        // Questions: {
        //   include: {
        //     content: true,
        //     Answers: true,
        //   },
        // },
      },
    });

    if (tests.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron tests para esta asignatura." });
    }

    res.status(200).json(tests);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al buscar los tests por asignatura",
      details: error.message,
    });
  }
};

// Eliminar un test por ID con preguntas, respuestas y contenido
const deleteTest = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTest = await prisma.test.delete({
      where: {
        id: parseInt(id),
      },
    });

    return res.status(200).json({
      message: "Test y todas las relaciones eliminadas correctamente.",
    });
  } catch (error) {
    console.error("Error al eliminar el test:", error);
    return res.status(500).json({ error: "Error al eliminar el test." });
  }
};

module.exports = {
  createTest,
  getAllTests,
  getTestById,
  getTestsBySubjectId,
  checkStudenttestExist,
  updateTest,
  deleteTest,
};
