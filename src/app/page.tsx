import Nav from '../components/nav';
import { Button } from '../components/ui/button';

export default function Home() {
  return (
    <main className="p-10">
      <Nav />
      <section className="py-10 flex flex-col items-center gap-8">
        <h1>Shadcn is awesome</h1>
        <p>Example test from the application that will make sense</p>
      </section>
      <div>
        <div className="flex gap-6 py-6">
          <Button>Learn More</Button>
          <Button>Enroll Now</Button>
        </div>
      </div>
    </main>
  );
}
