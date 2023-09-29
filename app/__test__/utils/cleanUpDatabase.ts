
// TODO: Better typing for this cleanup function
export async function cleanUpTable(table: any[]) {
  await Promise.all(table.map((table) => table.deleteMany({})));
}