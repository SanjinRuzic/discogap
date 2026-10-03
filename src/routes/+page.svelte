<script lang="ts">
import { artistStore } from '$lib/stores/artistStore';
import { Music, Search, TrendingUp } from 'lucide-svelte';

let searchQuery = $state('');

async function handleSelectArtist(artist: any) {
    artistStore.searchArtist(artist);
    await artistStore.loadArtistAlbums(artist.id);
    artistStore.calculateStatistics();
}

</script>

<div class="min-h-screen bg-gray-900 text-white p-8">
<div class="max-w-4xl mx-auto">

<!--HEADER-->
<div class="flex items-center gap-3 mb-8">
    <Music class="w-8 h-8 translate-y-1" />
    <h1 class="text-3xl font-bold text-white">discogap.</h1>
</div>

<!--SEARCH-->
<div class="flex gap-4 mb-8">
    <input 
    class="border border-gray-600 px-4 py-2 rounded bg-gray-800 flex-1 focus:outline-none focus:border-blue-500"
    type= "text" 
    placeholder= 'Search artist...' 
    bind:value={searchQuery}
    />
    <button
    onclick={() => artistStore.searchArtists(searchQuery)}
    class="px-6 py-2 border border-gray-600 rounded flex hover:bg-blue-700 items-center gap-2"
    >
    <Search class="w-4 h-4"></Search>
    </button>
</div>

<!--LOADING/ERROR-->
{#if $artistStore.loading}
<p class = "text-gray-400">Loading...</p>
{/if}

{#if $artistStore.error}
<p class= "text-red-400">{$artistStore.error}</p>
{/if}

<!--SEARCH RESULTS-->
{#if $artistStore.searchResults.length > 0}
<div class="mb-8">
<h2 class="text-xl font-semibold mb-4">Results</h2>
<ul class="space-y-2">
{#each $artistStore.searchResults as artist}
<li class="list-none">
    <button
        type="button"
        class="w-full p-3 flex bg-gray-800 items-center justify-between rounded cursor-pointer hover:bg-gray-700"
        onclick={() => handleSelectArtist(artist)}>
        <span>{artist.name}</span>
        <span class="text-gray-400 text-sm">Select →</span>
    </button>
</li>
{/each}
</ul>
</div>
{/if}

<!--SELECTED ARTIST & ALBUM DISPLAY-->
{#if $artistStore.selectedArtist}
<div class="mb-8">
<h2 class="text-xl font-semibold mb-4">
    {$artistStore.selectedArtist.name}'s Albums
</h2>
<ul class="space-y-2">
{#each $artistStore.albums as album}
<li class="p-3 flex bg-gray-800 items-center justify-between rounded cursor-pointer hover:bg-gray-700">
<span>{album.title}</span> 

<div class="flex text-sm text-gray-400 gap-4">
    <span>{album.year}</span>

{#if album.gap !== null}
<span>+{album.gap}y</span>
{/if}
</div>
</li>
{/each}
</ul>
</div>
{/if}

<!--STATISTICS-->
{#if $artistStore.statistics}
<div class="bg-gray-800 p-6 rounded-lg border border-gray-600">
<div class="flex border border-gray-600 items-center gap-3 mb-4">
<TrendingUp class="w-6 h-6"></TrendingUp>
<h2 class="text-xl font-semibold">Statistics</h2>
</div>
<div class="border border-gray-600 grid grid-cols-2 md:grid-cols-4 gap-4">
<div class="text-center">
    <p class="text-2xl font-bold text-purple-400">{$artistStore.statistics.totalAlbums}</p>
    <p class="text-sm text-white font-semibold">ALBUMS</p>
</div>
<div class="text-center">
    <p class="text-2xl font-bold text-purple-400">{$artistStore.statistics.averageGap.toFixed(1)}y</p>
    <p class="text-sm text-white font-semibold">AVG GAP</p>
</div>
<div class="text-center">
    <p class="text-2xl font-bold text-purple-400">{$artistStore.statistics.shortestGap}y</p>
    <p class="text-sm text-whitefont-semibold">SHORTEST</p>
</div>
<div class="text-center">
    <p class="text-2xl font-bold text-purple-400">{$artistStore.statistics.medianGap}y</p>
    <p class="text-sm text-white font-semibold">MEDIAN</p>
</div>

</div>
</div>
{/if}


</div>
</div>