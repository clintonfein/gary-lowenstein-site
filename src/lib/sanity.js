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

export async function getHomePage() {
  // Local testing only: point SANITY_FIXTURE at a JSON export to build without network access.
  if (process.env.SANITY_FIXTURE) {
    const { readFile } = await import('node:fs/promises');
    return JSON.parse(await readFile(process.env.SANITY_FIXTURE, 'utf8'));
  }
  return client.fetch(`*[_type == "homePage" && _id == "homePage"][0]`);
}
