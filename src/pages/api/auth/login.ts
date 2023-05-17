import type { NextApiRequest, NextApiResponse } from "next";
import { sign } from "jsonwebtoken";
import prisma from "../../../lib/prisma";
import { User } from "@prisma/client";

// POST /api/auth/login
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, name, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { name },
      ],
    },
  });

  if (!user) {
    res.status(401).json({ message: "Email / Nom incorrect" });
    return;
  }
  if (user.password !== password) {
    res.status(401).json({ message: "Mot de passe incorrect" });
    return;
  }

  const userCopied = { ...user } as Partial<User>;
  delete userCopied.password;

  const token = sign(userCopied, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });

  console.log("Generated token:", token);
  console.log("JWT secret:", process.env.JWT_SECRET);

  res.status(200).json({
    user,
    token,
  });
}
