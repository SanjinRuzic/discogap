import { DiscogsClient } from '@lionralfs/discogs-client';
import { json, type RequestEvent } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const client = new DiscogsClient({
    userAgent: 'Discogap/1.0',
    auth: {
        userToken: env.SECRET_DISCOGS_USER_TOKEN
    }
});

export async function GET({ params }: RequestEvent) {
    const artistId = Number(params.id);
    if (!Number.isInteger(artistId) || artistId <= 0) {
        return json({ error: 'Invalid artistId parameter' }, { status: 400 });
    }

    const releases = await client.database().getArtistReleases(artistId);
    return json(releases);
}