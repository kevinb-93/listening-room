import { SpotifyReducerActionType } from '../../../modules/spotify/context/spotify/reducer/types';
import React, { useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

import { useSpotifyContext } from '../../spotify/context/spotify';

const Settings: React.FC = () => {
    const { devices, dispatch, activeDeviceId } = useSpotifyContext();

    useEffect(() => {
        const s = new SpotifyWebApi();
        s.getMyDevices()
            .then(data =>
                dispatch({
                    type: SpotifyReducerActionType.setDevices,
                    payload: data.devices
                })
            )
            .catch(e => console.error(e));
    }, [dispatch]);

    const isActiveDevice = (id: SpotifyApi.UserDevice['id']) => {
        return id === activeDeviceId;
    };

    const setActiveDeviceHandler = (id: SpotifyApi.UserDevice['id']) => {
        if (!id) return;
        const s = new SpotifyWebApi();
        s.transferMyPlayback([id])
            .then(() =>
                dispatch({
                    type: SpotifyReducerActionType.setActiveDevice,
                    payload: id
                })
            )
            .catch(e => console.error('Could not transfer playback', e));
    };

    return (
        <div>
            {devices.map(d => {
                return (
                    <div key={d.id}>
                        <button
                            onClick={() =>
                                !isActiveDevice(d.id) &&
                                setActiveDeviceHandler(d.id)
                            }
                        >
                            {isActiveDevice(d.id) ? 'Active' : 'Set Active'}
                        </button>
                        <span>{d.name}</span>
                        <span>{d.type}</span>
                        <span>{d.is_active}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default Settings;
