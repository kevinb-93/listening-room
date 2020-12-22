import React, { useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

import { useSpotifyContext } from '../../spotify/context/spotify';

const Settings: React.FC = () => {
    const {
        devices,
        setDevices,
        setActiveDevice,
        activeDeviceId
    } = useSpotifyContext();

    useEffect(() => {
        const s = new SpotifyWebApi();
        s.getMyDevices()
            .then(data => setDevices(data.devices))
            .catch(e => console.error(e));
    }, [setDevices]);

    const isActiveDevice = (id: SpotifyApi.UserDevice['id']) => {
        return id === activeDeviceId;
    };

    const setActiveDeviceHandler = (id: SpotifyApi.UserDevice['id']) => {
        const s = new SpotifyWebApi();
        s.transferMyPlayback([id])
            .then(() => setActiveDevice(id))
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
