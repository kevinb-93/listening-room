type GetTrackImage = (
    track: SpotifyApi.TrackObjectFull
) => SpotifyApi.ImageObject;
type GetArtists = (track: SpotifyApi.TrackObjectFull) => string;

export const getArtists: GetArtists = track => {
    const artist = track.artists.map(a => a.name).join(', ') ?? '';
    return artist;
};

export const getTrackImage: GetTrackImage = track => {
    const height = 64;
    const image = track.album.images.find(i => i.height === height);
    return image;
};
