export function createImageUrl(slug: string): string {
  const PROD = process.env.NODE_ENV === 'production';
  return `${PROD ? 'https://d203wdkr6gpe3h.cloudfront.net/' : 'https://d2z0y093pyq347.cloudfront.net/'}${slug}`;
}