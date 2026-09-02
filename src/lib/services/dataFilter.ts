export interface Release {
    id: number;
    title: string;
    year: number;
    format?: string;
    type: string;
    role: string;
}

export interface Album {
    id: number;
    title: string;
    year: number;
}

export function filterAlbums(releases: Release[]): Album[] {
    return releases.filter(
        (release) => 
        release.type === 'master' 
        && release.role === 'Main'
        && Number.isInteger(release.year) &&
        release.year > 0
)
        .map((release) => ({
        id: release.id,
        title: release.title,
        year: release.year,
    }))
    .sort((a, b) => a.year - b.year);
}