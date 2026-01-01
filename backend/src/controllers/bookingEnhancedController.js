import { prisma } from "../config/db.js";

const getAll = async () => {
  return prisma.booking.findMany({
    include: {
      room: true,
      dailyOverview: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });
};

export default {
  getAll,
};
