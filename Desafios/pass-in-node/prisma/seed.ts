import { prisma } from "./../src/lib/prisma";

async function seed() {
  await prisma.event.create({
    data: {
      id: "c38a0b68-e741-4f64-9da4-8343d777468a",
      title: "Unite Summit",
      details: "Unite summit event",
      slug: "unite-summit",
      maximumAttendees: 120,
    },
  });
}

seed().then(() => {
  console.log("seeded");
  prisma.$disconnect();
});
