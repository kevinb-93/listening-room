import { SpotifyIdentityContextState } from '../types';
import { ReducerAction } from '../../../../../types/react';

export enum SpotifyIdentityReducerActionType {
    spotifyLogin,
    spotifyLogout,
    restoreState
}

export interface SpotifyIdentityReducer {
    (
        state: SpotifyIdentityContextState,
        payload: SpotifyIdentityReducerActionPayload
    ): SpotifyIdentityContextState;
}

interface SpotifyLoginPayload {
    spotifyToken: SpotifyIdentityContextState['spotifyToken'];
    spotifyRefreshToken: SpotifyIdentityContextState['spotifyRefreshToken'];
    spotifyExpirationDate: SpotifyIdentityContextState['spotifyExpirationDate'];
}

type RestoreStatePayload = boolean;

export type SpotifyIdentityReducerAction =
    | ReducerAction<
          SpotifyIdentityReducerActionType.spotifyLogin,
          SpotifyLoginPayload
      >
    | ReducerAction<SpotifyIdentityReducerActionType.spotifyLogout, null>
    | ReducerAction<
          SpotifyIdentityReducerActionType.restoreState,
          RestoreStatePayload
      >;

type SpotifyIdentityReducerActionPayload =
    | SpotifyLoginPayload
    | RestoreStatePayload
    | null;
