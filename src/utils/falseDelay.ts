export async function falseDelay(timeMS: number) {
  await new Promise((resolve) => setTimeout(resolve, timeMS));
  return `Waited ${timeMS} ms`;
}
