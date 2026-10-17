import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

// This site has its own Sanity project ("Gary Lowenstein"), separate from any other site.
export const client = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID || 'x032i97y',
  dataset: import.meta.env.SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
  perspective: 'published',
});

const builder = createImageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);

// Local testing only: point SANITY_FIXTURE at a JSON file shaped like
// { "homePage": {...}, "watchPage": {...} } to build without network access.
async function fromFixture(key) {
  const { readFile } = await import('node:fs/promises');
  return JSON.parse(await readFile(process.env.SANITY_FIXTURE, 'utf8'))[key];
}

export async function getHomePage() {
  if (process.env.SANITY_FIXTURE) return fromFixture('homePage');
  return client.fetch(`*[_type == "homePage" && _id == "homePage"][0]`);
}

export async function getWatchPage() {
  if (process.env.SANITY_FIXTURE) return fromFixture('watchPage');
  return client.fetch(`*[_type == "watchPage" && _id == "watchPage"][0]`);
}
