import jwt from "jsonwebtoken";

export const signAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
};

export const signRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });
};

export const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};
