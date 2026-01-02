import { prisma } from "../config/db.js";

const getAllRooms = async () => {
  return prisma.room.findMany({});
};

export default {
  getAllRooms,
};
