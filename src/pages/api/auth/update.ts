import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(
    req: NextApiRequest, 
    res: NextApiResponse
    ) {
  const { id, name, email, password } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        password
      },
    });

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
}
