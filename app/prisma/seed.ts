import { faker } from '@faker-js/faker';
import { cats, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const data: cats[] = [];
  for (let i = 1; i <= 50; i++) {
    data.push({
      id: i,
      name: faker.animal.cat(),
      color: faker.color.human(),
      weight: faker.number.int({ min: 10, max: 80 }).toString(),
      eyes_color: faker.color.human(),
    });
  }

  const cats = await prisma.cats.createMany({ data, skipDuplicates: true });
  // Comment the following line if you don't use PostgreSQL
  await prisma.$queryRaw`SELECT setval(pg_get_serial_sequence('"cats"', 'id'), coalesce(max("id")+1, 1), false) FROM "cats";`;
  console.log({ cats });
}

main().catch(async (err) => {
  console.log(err);
  await prisma.$disconnect();
  process.exit(1);
});
