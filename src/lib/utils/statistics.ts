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

/**
 * Summarizes album counts and release gaps in years, ignoring null or undefined gaps.
 * Expects albums ordered by ascending year; activePeriod is the last year minus the
 * first, and releaseFrequency is albums per year over that span plus one year.
 * Returns all zeros for no albums, and zero gap statistics when no gaps are present.
 */
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

/** Returns the arithmetic mean of the gaps, in the input units, or zero for an empty list. */
export function calculateMean(gaps: number[]) : number {
    if (gaps.length === 0) {
        return 0;
    }
    const sum = gaps.reduce((acc, gap) => acc + gap, 0);
    return sum / gaps.length;
}

/**
 * Returns the median gap in the input units without modifying the list, or zero
 * for an empty list. Averages the two middle values for an even number of gaps.
 */
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
