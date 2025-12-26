import bcrypt from "bcrypt";

const result = await bcrypt.hash("password123", 10);

console.log(result);
