import type { NextApiRequest, NextApiResponse } from 'next';
import createUser from './createUser';



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST')
  {
    const { username } = req.body;
    return createUser(username, res);
  } else
  {

  }
}

