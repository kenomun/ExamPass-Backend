const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// async function main() {
//   // Insertar los roles
//   const roles = [
//     { description: 'admin' },
//     { description: 'professor' },
//     { description: 'student' },
//   ];

//   // Creamos los roles
//   const createdRoles = await Promise.all(
//     roles.map((role) =>
//       prisma.Roles.create({  // Usar prisma.Roles.create para coincidir con el modelo
//         data: role,
//       })
//     )
//   );

//   console.log('Roles seeded successfully!');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });


async function main() {
  // Agregar asignaturas (puedes agregar las asignaturas que necesites)
  const subjects = await prisma.subjects.createMany({
    data: [
      { name: 'Matemáticas' },
      { name: 'Lengua y Literatura' },
      { name: 'Ciencias' },
      { name: 'Historia' },
      { name: 'Geografía' },
      { name: 'Inglés' },
      { name: 'Arte' },
      { name: 'Educación Física' },
    ],
  });

  console.log('Asignaturas creadas:', subjects);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });