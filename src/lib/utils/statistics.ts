import type { AlbumWithGap } from '$lib/services/gapCalculator';

export interface AlbumStatistics {
    shortestGap: number;
    longestGap: number;
    averageGap: number;
    medianGap: number;
    totalAlbums: number;
    activePeriod: number;
    releaseFrequency: number;
}

export function calculateStatistics(albums: AlbumWithGap[]) : AlbumStatistics {
    if (albums.length === 0) {
        return {
            shortestGap: 0,
            longestGap: 0,
            averageGap: 0,
            medianGap: 0,
            totalAlbums: 0,
            activePeriod: 0,
            releaseFrequency: 0
        };
    }
    const gaps = albums.map(a => a.gap).filter((gap): gap is number => gap !== null && gap !== undefined);
    
    const activePeriod = albums[albums.length - 1].year - albums[0].year;

    return {
        shortestGap: gaps.length > 0 ? Math.min(...gaps) : 0,
        longestGap: gaps.length > 0 ? Math.max(...gaps) : 0,
        averageGap: calculateMean(gaps),
        medianGap: calculateMedian(gaps),
        totalAlbums: albums.length,
        activePeriod,
        releaseFrequency: albums.length / (activePeriod + 1)
    };


}

export function calculateMean(gaps: number[]) : number {
    if (gaps.length === 0) {
        return 0;
    }
    const sum = gaps.reduce((acc, gap) => acc + gap, 0);
    return sum / gaps.length;
}

export function calculateMedian(gaps: number[]) : number {
    if (gaps.length === 0) {
        return 0;
    }
    const sortedGaps = [...gaps].sort((a, b) => a - b);
    const mid = Math.floor(sortedGaps.length / 2);
    if (sortedGaps.length % 2 === 0) {
        return (sortedGaps[mid - 1] + sortedGaps[mid]) / 2;
    }
    return sortedGaps[mid]
}
