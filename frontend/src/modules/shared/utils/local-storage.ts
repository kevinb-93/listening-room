export enum LocalStorageItemNames {
    NowPlaying = 'ls_now_playing',
    Spotify = 'ls_spotify',
    Queue = 'ls_queue',
    User = 'ls_user'
}

type NowPlayingItem = SpotifyApi.TrackObjectFull;

type SpotifyItem = {
    spotifyToken: string;
    spotifyRefreshToken: string;
    spotifyExpirationDate: Date;
};

type QueueItem = SpotifyApi.TrackObjectFull[];

type UserItem = {
    token: string;
    refreshToken: string;
};

interface LocalStorage {
    [LocalStorageItemNames.User]?: UserItem;
    [LocalStorageItemNames.NowPlaying]?: NowPlayingItem;
    [LocalStorageItemNames.Spotify]?: SpotifyItem;
    [LocalStorageItemNames.Queue]?: QueueItem;
}

export const setLocalStorage = <K extends keyof LocalStorage>(
    itemName: K,
    item: LocalStorage[K]
) => {
    let localStorageItem: string;

    if (typeof item !== 'string') {
        localStorageItem = JSON.stringify(item);
    }

    localStorage.setItem(itemName, localStorageItem);
};

export const getLocalStorage = <K extends keyof LocalStorage>(
    itemName: K
): LocalStorage[K] => {
    const localItem = localStorage.getItem(itemName);

    return JSON.parse(localItem);
};

export const removeLocalStorage = <K extends keyof LocalStorage>(
    itemName: K
) => {
    localStorage.removeItem(itemName);
};
