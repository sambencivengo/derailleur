import { Heading } from '@chakra-ui/react';
import { CreateUser } from './components/createUser';

export default function Home() {
  return (
    <>
      <Heading>Hello, Next.js!</Heading>
      <CreateUser />
    </>
  );
}
