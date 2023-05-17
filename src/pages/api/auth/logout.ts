import type { NextApiRequest, NextApiResponse } from 'next';

// POST /api/auth/logout
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    'Set-Cookie',
    `token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`
  );

  res.status(200).json({ message: 'Déconnexion réussie' });
}
