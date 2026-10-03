import { writable } from 'svelte/store';
import type { AlbumWithGap } from '$lib/services/gapCalculator';
import type { AlbumStatistics } from '$lib/utils/statistics';
import { calculateStatistics } from '$lib/utils/statistics';

interface ArtistState {
    searchResults: Array<{id: number; name: string; resource_url: string }>;
    selectedArtist: { id: number; name: string; resource_url: string } | null;
    albums: AlbumWithGap[];
    statistics: AlbumStatistics | null;
    loading: boolean;
    error: string | null;
}

const initialState: ArtistState = {
    searchResults: [],
    selectedArtist: null,
    albums: [],
    statistics: null,
    loading: false,
    error: null
};

function createArtistStore() {
    const { subscribe, set, update } = writable(initialState);

    return {
        subscribe,
        searchArtists: async (query: string) => {

            update(state => ({ ...state, loading: true, error: null  }));
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            if(!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            const body = await response.json();
            const results = (body?.data?.results ?? [] ).map((result: any) => ({
                id: result.id,
                name: result.title,
                resource_url: result.resource_url
            }));

            update(state => ({ ...state, searchResults: results, loading: false }));
        }
        catch (err) {
            console.error('Error searching artists:', err);
            update(state => ({ ...state, error: 'Search failed', loading: false }));
        }
        
        },
        searchArtist: async (artist: any) => {
            update(state => ({ ...state, selectedArtist: artist}));
        },
        loadArtistAlbums: async (artistId: any) => {
            update(state => ({ ...state, loading: true, error: null}));
            try {
                const response = await fetch(`/api/artist/${encodeURIComponent(artistId)}`);
                const albums = await response.json();
            update(state => ({ ...state, albums, loading: false}));
            }
            catch {
                update(state => ({...state, error: 'Failed to load albums of artist', loading: false}));
            }
        },
        calculateStatistics: () => {
            update(state => ({...state, statistics: calculateStatistics(state.albums)}));

    },
    reset: () => set(initialState)
};
}

export const artistStore = createArtistStore()
