const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Prueba para listar los Admins (vacío inicialmente)
  const admins = await prisma.admin.findMany();
  console.log('Admins:', admins);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
