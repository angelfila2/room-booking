import bcrypt from "bcrypt";
import users from "../data/user.js";

const login = async ({ username, password }) => {
  const user = users.find((u) => u.username === username);

  if (!user) return null;

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;

  return {
    id: user.id,
    username: user.username,
    role: user.role,
  };
};

export default { login };
