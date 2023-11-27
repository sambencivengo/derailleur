import { redirect } from 'next/navigation';
import { Form } from '~/components';
import { Button, Container } from '~/components/ui';
import * as context from 'next/headers';
import { auth } from '~/auth';

export default async function Page() {
  const authRequest = auth.handleRequest('GET', context);

  const session = await authRequest.validate();
  if (session) redirect('/');
  return (
    <Container>
      <h1>Sign Up</h1>
      <Form action="/api/signup">
        <label htmlFor="username">Username</label>
        <input name="username" id="username" />
        <br />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <br />
        <Button type="submit">Sign In</Button>
      </Form>
    </Container>
  );
}
