const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sendOk, badRequest } = require("../helpers/http");

// Crear un resultado
const createResult = async (req, res) => {
  try {
    const { profileId, testId, answers, score } = req.body;

    // Validaciones simples
    if (
      !profileId ||
      !testId ||
      !answers ||
      !Array.isArray(answers) ||
      answers.length === 0 ||
      !score
    ) {
      return res.status(400).json({ error: "Faltan datos necesarios." });
    }

    // Crear el resultado
    const result = await prisma.result.create({
      data: {
        profileId,
        testId,
        answers: answers,
        score,
      },
    });

    // return res.status(201).json(result);
    return sendOk(res, "resultado guardados", result);
  } catch (error) {
    console.error("Error al crear el resultado:", error);
    return res.status(500).json({ error: "Error al crear el resultado" });
  }
};

// Controlador para obtener los resultados según profileId y testId
const getResultsDetail = async (req, res) => {
  const { profileId, testId } = req.params;

  try {
    // Obtener el resultado del perfil y test relacionados al profileId y testId
    const result = await prisma.result.findFirst({
      where: {
        profileId: parseInt(profileId),
        testId: parseInt(testId),
      },
      select: {
        id: true,
        profile: {
          select: {
            id: true,
            name: true,
          },
        },
        test: {
          select: {
            id: true,
            name: true,
          },
        },
        score: true, // Incluir la columna score en la respuesta
      },
    });

    if (!result) {
      return res.status(404).json({ message: "No se encontraron resultados." });
    }

    // Devolver los resultados con la columna score incluida
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error al obtener los resultados." });
  }
};

const getGroupedResults = async (req, res) => {
  try {
    const results = await prisma.result.findMany({
      include: {
        profile: {
          select: {
            id: true,
            name: true,
          },
        },
        test: {
          include: {
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

    // Agrupar resultados
    const groupedResults = results.reduce(async (accPromise, result) => {
      const acc = await accPromise;

      const profileId = result.profile.id;
      const profileName = result.profile.name;
      const subjectId = result.test.Subject.id;
      const subjectName = result.test.Subject.name;

      // Obtener los perfiles de la tabla ProfileSubject que están asociados a este Subject
      const profiles = await prisma.profileSubject.findMany({
        where: {
          subjectId: subjectId,
        },
        include: {
          Profile: {
            select: {
              id: true,
              name: true,
              roleId: true,
            },
          },
        },
      });

      // Filtrar los perfiles que tengan roleId == 3 (profesores)
      const professors = profiles
        .filter((ps) => ps.Profile.roleId === 3)
        .map((ps) => ps.Profile.name)
        .join(", ");

      // Buscar si ya existe una entrada para el perfil y la asignatura
      const existing = acc.find(
        (entry) =>
          entry.ProfileId === profileId && entry.SubjectId === subjectId
      );

      if (existing) {
        existing.Score += result.score;
        existing.Count += 1;
      } else {
        // Si no existe, creamos una nueva entrada
        acc.push({
          ProfileId: profileId,
          ProfileName: profileName,
          SubjectId: subjectId,
          SubjectName: subjectName,
          Score: result.score,
          ProfessorName: professors,
          Count: 1,
        });
      }

      return acc;
    }, Promise.resolve([]));

    // Calcular porcentaje para cada agrupación
    const resultsWithPercentage = await (
      await groupedResults
    ).map((entry) => {
      const maxScorePerRecord = 70;
      const maxScore = entry.Count * maxScorePerRecord;
      const percentage = Math.ceil((entry.Score / maxScore) * 100);

      return {
        ...entry,
        Percentage: `${percentage}`,
        maxScore: maxScore,
      };
    });

    res.status(200).json(resultsWithPercentage);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al obtener los resultados agrupados." });
  }
};

module.exports = {
  createResult,
  getResultsDetail,
  getGroupedResults,
};
