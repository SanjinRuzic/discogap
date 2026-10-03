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

/** Creates a subscribable store for artist search, selection, albums, and statistics. */
function createArtistStore() {
    const { subscribe, set, update } = writable(initialState);

    return {
        subscribe,
        /**
         * Searches for artists and replaces the stored results, using an empty list
         * when the response omits results. Sets loading and clears the previous error.
         * Request, HTTP status, JSON parsing, and result mapping errors are caught:
         * sets "Search failed", keeps prior results, and clears loading.
         */
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
        /** Selects an artist without fetching albums or clearing existing results or statistics. */
        searchArtist: async (artist: any) => {
            update(state => ({ ...state, selectedArtist: artist}));
        },
        /**
         * Fetches albums for a Discogs artist ID and stores the parsed JSON without
         * checking HTTP status or response shape. Sets loading and clears the previous
         * error. Request and JSON parsing failures are caught: keeps prior albums,
         * sets "Failed to load albums of artist", and clears loading.
         * Does not update statistics.
         */
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
        /**
         * Replaces statistics using the currently stored albums.
         * @throws {TypeError} If albums contains a non-array JSON error response.
         */
        calculateStatistics: () => {
            update(state => ({...state, statistics: calculateStatistics(state.albums)}));

    },
    /** Clears results, selection, albums, statistics, loading, and errors; pending requests continue. */
    reset: () => set(initialState)
};
}

export const artistStore = createArtistStore()
