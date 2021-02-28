import { SpotifyPlayerContextState } from '../types';
import { CurrentTrack } from '../../../../../../../api/src/models/party';

interface ReducerAction<
    T extends SpotifyPlayerReducerActionType,
    P extends SpotifyPlayerReducerActionPayload
> {
    type: T;
    payload: P;
}

export enum SpotifyPlayerReducerActionType {
    setPlayback,
    setPlayer,
    setPlayerInstance,
    setPlayNext,
    SetPlaybackPosition,
    QueueSet,
    QueueAdd,
    QueueDelete,
    NowPlaying
}

export type SetPlayNextPayload = boolean;
export interface PlaybackPositionPayload {
    position: Spotify.PlaybackState['position'];
}
export type PlaybackPayload = Spotify.PlaybackState;
export type PlayerInstancePayload = Spotify.WebPlaybackInstance;
export type PlayerPayload = Spotify.SpotifyPlayer;
export type NowPlayingPayload = SpotifyApi.TrackObjectFull;
export interface QueueAddPayload {
    track: SpotifyApi.TrackObjectFull;
}
export interface QueueDeletePayload {
    trackId: SpotifyApi.TrackObjectFull['id'];
}
export interface QueueSetPayload {
    queue: SpotifyApi.TrackObjectFull[];
}

export type SpotifyPlayerReducerAction =
    | ReducerAction<SpotifyPlayerReducerActionType.setPlayback, PlaybackPayload>
    | ReducerAction<SpotifyPlayerReducerActionType.setPlayer, PlayerPayload>
    | ReducerAction<
          SpotifyPlayerReducerActionType.setPlayerInstance,
          PlayerInstancePayload
      >
    | ReducerAction<
          SpotifyPlayerReducerActionType.SetPlaybackPosition,
          PlaybackPositionPayload
      >
    | ReducerAction<SpotifyPlayerReducerActionType.QueueSet, QueueSetPayload>
    | ReducerAction<SpotifyPlayerReducerActionType.QueueAdd, QueueAddPayload>
    | ReducerAction<
          SpotifyPlayerReducerActionType.QueueDelete,
          QueueDeletePayload
      >
    | ReducerAction<
          SpotifyPlayerReducerActionType.NowPlaying,
          NowPlayingPayload
      >
    | ReducerAction<
          SpotifyPlayerReducerActionType.setPlayNext,
          SetPlayNextPayload
      >;

export type SpotifyPlayerReducerActionPayload =
    | NowPlayingPayload
    | QueueAddPayload
    | QueueDeletePayload
    | QueueSetPayload
    | SetPlayNextPayload
    | PlaybackPositionPayload
    | PlaybackPayload
    | PlayerInstancePayload
    | PlayerPayload;

export interface SpotifyPlayerReducer {
    (
        state: SpotifyPlayerContextState,
        payload: SpotifyPlayerReducerActionPayload
    ): SpotifyPlayerContextState;
}
