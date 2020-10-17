import * as React from 'react';
import SpotifyApi from 'spotify-web-api-js';

const Settings: React.FC = () => {
    React.useEffect(() => {
        const spotifyApi = new SpotifyApi();
        spotifyApi.getMe().then(
            (data) => {
                console.log('profile', data);
            },
            (err) => {
                console.error(err);
            }
        );
    }, []);

    return (
        <div>
            <p>Settings</p>
        </div>
    );
};

export default Settings;
