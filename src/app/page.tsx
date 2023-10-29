'use client';
import { Button } from '../components/ui/button';
import { ToggleDarkModeButton } from '../components/toggleDarkModeButton';

export default function Home() {
  return (
    <main>
      <section className="py-10 flex flex-col items-center gap-8">
        <h1>Home Page</h1>
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
