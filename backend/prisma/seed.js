import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // 1️⃣ Create user
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "admin123",
      email: "admin@example.com",
      password: hashedPassword,
    },
  });

  // 2️⃣ Create rooms
  const roomsData = [
    { roomCode: "CRoom1", location: "Block A - 101" },
    { roomCode: "CRoom2", location: "Block A - 102" },
    { roomCode: "CRoom3", location: "Block B - 201" },
    { roomCode: "CRoom4", location: "Block B - 202" },
    { roomCode: "CRoom5", location: "Block C - 301" },
  ];

  const rooms = [];

  for (const room of roomsData) {
    const createdRoom = await prisma.room.upsert({
      where: { roomCode: room.roomCode },
      update: {},
      create: room,
    });

    rooms.push(createdRoom);
  }

  // 3️⃣ Create bookings
  const room1 = rooms.find((r) => r.roomCode === "CRoom1");
  if (!room1) {
    throw new Error("CRoom1 not found");
  }

  // Normalize date to midnight UTC (DATE-only semantic)
  const courseDate = new Date("2025-12-22T00:00:00.000Z");

  await prisma.booking.createMany({
    data: [
      {
        userId: user.id,
        roomId: room1.id,
        courseCode: "ICT210",
        courseDate,
        startTime: new Date("2025-12-22T09:00:00.000Z"),
        endTime: new Date("2025-12-22T11:00:00.000Z"),
      },
      {
        userId: user.id,
        roomId: room1.id,
        courseCode: "ICT100",
        courseDate,
        startTime: new Date("2025-12-22T14:00:00.000Z"),
        endTime: new Date("2025-12-22T16:00:00.000Z"),
      },
    ],
  });

  console.log("Seeding completed successfully");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
