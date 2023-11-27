import { Form } from '~/components';
import { Button, Container } from '~/components/ui';

export default function Page() {
  return (
    <Container>
      <h1>Log in</h1>
      <Form action="/api/login">
        <label htmlFor="username">Username</label>
        <input name="username" id="username" />
        <br />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <br />
        <Button type="submit">Log In</Button>
      </Form>
    </Container>
  );
}
