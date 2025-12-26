import { authenticateUser } from "../services/auth.service.js";

export const login = (req, res) => {
  try {
    // 1️⃣ Extract data from request
    const { username, password } = req.body;

    // 2️⃣ Call service (business logic)
    const { accessToken, refreshToken } = authenticateUser(username, password);

    // 3️⃣ Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
    });

    // 4️⃣ Send access token in response
    res.status(200).json({ accessToken });
  } catch (err) {
    // 5️⃣ Handle known errors
    if (err.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        error: "Invalid username or password",
      });
    }

    // 6️⃣ Fallback error
    res.status(500).json({ error: "Server error" });
  }
};
