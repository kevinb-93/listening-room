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

export type UserItem = {
    userToken: string;
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
    if (!item) return;

    let localStorageItem = '';

    if (typeof item !== 'string') {
        localStorageItem = JSON.stringify(item);
    }

    localStorage.setItem(itemName, localStorageItem);
};

export const getLocalStorage = <K extends keyof LocalStorage>(
    itemName: K
): LocalStorage[K] => {
    const localItem = localStorage.getItem(itemName);
    if (!localItem) return;

    let parsedItem: LocalStorage[K];
    try {
        parsedItem = JSON.parse(localItem);
    } catch (e) {
        return;
    }

    return parsedItem;
};

export const removeLocalStorage = <K extends keyof LocalStorage>(
    itemName: K
) => {
    localStorage.removeItem(itemName);
};
