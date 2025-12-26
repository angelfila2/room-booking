import bcrypt from "bcrypt";
import users from "../data/user.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import { refreshTokens } from "../data/refreshtoken.js";

export const authenticateUser = (username, password) => {
  // 1️⃣ Find user
  const user = users.find((u) => u.username === username);
  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  // 2️⃣ Compare password
  const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!passwordMatch) {
    throw new Error("INVALID_CREDENTIALS");
  }

  // 3️⃣ Create tokens
  const accessToken = signAccessToken({
    userId: user.id,
    role: user.role,
  });

  const refreshToken = signRefreshToken({
    userId: user.id,
  });

  // 4️⃣ Store refresh token (in memory)
  refreshTokens.push({
    token: refreshToken,
    userId: user.id,
    revoked: false,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
};
