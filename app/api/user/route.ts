import type { NextApiRequest, NextApiResponse } from 'next';
import createUser from './createUser';



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST')
  {
    const { username } = req.body;
  } else
  {

  }
}


export async function POST(request: NextApiRequest, response: NextApiResponse) {
  return createUser(request, response);
}