// import { useCallback, useEffect, useRef, useState } from 'react';
// import SpotifyWebApi from 'spotify-web-api-js';
// import { useSpotifyPlayerContext } from '../context/player';
// import { useSpotifyContext } from '../context/spotify';

// interface SpotifyPlayer {
//     playSpotifyTrack: () => void;
//     pauseSpotifyTrack: () => void;
//     elaspedTime: number;
// }
// type SpotifyPlayerHook = () => SpotifyPlayer;

// const useSpotifyPlayer: SpotifyPlayerHook = () => {
//     const { activeDeviceId, setActiveDevice } = useSpotifyContext();
//     const {
//         playbackState,
//         player,
//         setPlayback,
//         playerInstance,
//         playNext,
//         setPlayNext,
//         queue,
//         playTrack
//     } = useSpotifyPlayerContext();

//     const [elaspedTime, setElaspedTime] = useState<number>(
//         playbackState?.position ?? 0
//     );

//     const [artistFullInfo, setArtistFullInfo] = useState<
//         SpotifyApi.ArtistObjectFull
//     >(null);

//     const spotifyApi = useRef(new SpotifyWebApi()).current;

//     const playSpotifyTrack = useCallback(() => {
//         if (playbackState.paused) {
//             player.resume().then(() => console.log('resumed!'));
//         }
//     }, [playbackState?.paused, player]);

//     const pauseSpotifyTrack = useCallback(() => {
//         if (!playbackState.paused) {
//             player.pause().then(() => console.log('paused!'));
//         }
//     }, [playbackState?.paused, player]);

//     const getArtistInfo = useCallback(() => {
//         if (
//             playbackState?.track_window?.current_track?.artists[0].uri !==
//             artistFullInfo?.uri
//         ) {
//             spotifyApi
//                 .getArtist(
//                     playbackState.track_window.current_track.artists[0].uri.replace(
//                         'spotify:artist:',
//                         ''
//                     )
//                 )
//                 .then(data => {
//                     setArtistFullInfo(data);
//                 })
//                 .catch(e => console.error(e));
//         }
//     }, [
//         artistFullInfo?.uri,
//         playbackState?.track_window?.current_track.artists,
//         spotifyApi
//     ]);

//     useEffect(() => {
//         getArtistInfo();
//     }, [getArtistInfo]);

//     const getCurrentPlayerState = useCallback(() => {
//         player.getCurrentState().then(playback => {
//             setPlayback(playback);
//         });
//     }, [player, setPlayback]);

//     useEffect(() => {
//         getCurrentPlayerState();
//     }, [getCurrentPlayerState]);

//     const transferPlayback = useCallback(() => {
//         if (!activeDeviceId && playerInstance?.device_id) {
//             spotifyApi
//                 .transferMyPlayback([playerInstance.device_id])
//                 .then(() => {
//                     setActiveDevice(playerInstance.device_id);
//                 })
//                 .catch(e => console.error('Could not transfer playback', e));
//         }
//     }, [
//         activeDeviceId,
//         playerInstance?.device_id,
//         setActiveDevice,
//         spotifyApi
//     ]);

//     useEffect(() => {
//         transferPlayback();
//     }, [transferPlayback]);

//     const setDocumentHeader = useCallback(() => {
//         const artist =
//             playbackState?.track_window.current_track.artists[0].name;
//         const song = playbackState?.track_window.current_track.name;
//         if (artist && song) {
//             document.title = `${artist} - ${song}`;
//         }
//     }, [
//         playbackState?.track_window?.current_track.artists,
//         playbackState?.track_window?.current_track.name
//     ]);

//     useEffect(() => {
//         setDocumentHeader();
//     }, [setDocumentHeader]);

//     const syncPlayerElaspedTime = useCallback(() => {
//         setElaspedTime(playbackState?.position ?? 0);
//     }, [playbackState?.position]);

//     useEffect(() => {
//         syncPlayerElaspedTime();
//     }, [syncPlayerElaspedTime]);

//     const updatePlayerProgress = useCallback(() => {
//         let intervalId: number;

//         if (playbackState?.paused === false) {
//             intervalId = setInterval(() => {
//                 setElaspedTime(et => et + 500);
//             }, 500);
//         } else if (
//             playbackState?.paused ||
//             elaspedTime > playbackState?.duration
//         ) {
//             if (intervalId) {
//                 clearInterval(intervalId);
//             }
//         }

//         return intervalId;
//     }, [elaspedTime, playbackState?.duration, playbackState?.paused]);

//     useEffect(() => {
//         const intervalId = updatePlayerProgress();

//         return () => clearInterval(intervalId);
//     }, [updatePlayerProgress]);

//     const playNextTrack = useCallback(() => {
//         if (
//             queue.length &&
//             (playbackState?.duration - playbackState?.position < 500 ||
//                 playNext)
//         ) {
//             spotifyApi
//                 .play({ uris: [queue[0].uri] })
//                 .then(() => {
//                     playTrack(queue[0]);
//                 })
//                 .catch(e => console.error('Could not play track', e))
//                 .finally(() => {
//                     if (playNext) {
//                         setPlayNext(false);
//                     }
//                 });
//         }
//     }, [
//         playNext,
//         playTrack,
//         playbackState?.duration,
//         playbackState?.position,
//         queue,
//         setPlayNext,
//         spotifyApi
//     ]);

//     useEffect(() => {
//         playNextTrack();
//     }, [playNextTrack]);

//     return { playSpotifyTrack, pauseSpotifyTrack, elaspedTime };
// };

// export default useSpotifyPlayer;
