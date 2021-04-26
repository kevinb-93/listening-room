import { ReducerAction } from 'types/react';
import { SpotifyContextState } from '../types';

export enum SpotifyReducerActionType {
    setDevices,
    setActiveDevice
}
export interface SpotifyReducer {
    (
        state: SpotifyContextState,
        payload: SpotifyReducerActionPayload
    ): SpotifyContextState;
}

type SetActiveDevicePayload = SpotifyApi.UserDevice['id'];
type SetDevicesPayload = SpotifyApi.UserDevice[];

export type SpotifyReducerAction =
    | ReducerAction<
          SpotifyReducerActionType.setActiveDevice,
          SetActiveDevicePayload
      >
    | ReducerAction<SpotifyReducerActionType.setDevices, SetDevicesPayload>;

export type SpotifyReducerActionPayload =
    | SetActiveDevicePayload
    | SetDevicesPayload;
