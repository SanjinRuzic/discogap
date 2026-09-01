import { DiscogsClient } from '@lionralfs/discogs-client';
import { json, type RequestEvent } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const client = new DiscogsClient({
    userAgent: 'Discogap/1.0',
    auth: {
        userToken: env.SECRET_DISCOGS_USER_TOKEN 
    }
});

export async function GET({ url }: RequestEvent) {
  const query = url.searchParams.get('q')?.trim();
  if (!query) return json({ error: 'Missing query parameter' }, { status: 400 });
  
  const results = await client.database().search({ query, type: 'artist' });
  return json(results);
}
