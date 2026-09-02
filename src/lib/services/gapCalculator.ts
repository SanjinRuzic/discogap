import type { Album } from './dataFilter';

export interface AlbumWithGap extends Album {
    gap?: number | null;
}

export function calculateYearGap(albums: Album[]) : AlbumWithGap[] {
    if(albums.length === 0) 
        return [];

    return albums.map((album, index) => {
        const previousAlbum = albums[index - 1];
        const gap = previousAlbum ? album.year - previousAlbum.year : null;
        return { ...album, gap };
    })
    

}
