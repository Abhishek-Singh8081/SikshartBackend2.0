import jwt from "jsonwebtoken";

export const generateToken = (userId, role, res) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const accessToken = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign({ userId, role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    domain: "localhost",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    domain: "localhost",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return { accessToken, refreshToken };
};
