import { Form } from '~/components/form';
import { Button, Container } from '~/components/ui';

export default async function Page() {
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
