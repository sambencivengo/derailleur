'use client';
import prisma from '../api/prisma';

async function main() {
  const setTimer = async (time: number) =>
    await new Promise((resolve) => {
      setTimeout(resolve, time * 1000);
    });
  const newUser = await prisma.user.create({
    data: {
      username: 'sammy',
    },
  });
  console.log('user created', newUser);

  const userId = newUser.id;

  setTimer(2);
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  console.log('user found', user);

  setTimer(2);
  const deleteUser = await prisma.user.delete({
    where: {
      id: userId,
    },
  });
  console.log('user deleted', deleteUser);
}
export default function Page() {
  return (
    <>
      <h1>Hello, Next.js!</h1>
      <button onClick={() => main()}>Click Me</button>
    </>
  );
}
