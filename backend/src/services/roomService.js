import { prisma } from "../config/db.js";

const getAllRooms = async () => {
  return prisma.room.findMany({});
};

const getRoomById = async (roomId) => {
  return prisma.room.findUnique({
    where: { id: roomId },
  });
};

export default {
  getAllRooms,
  getRoomById,
};
