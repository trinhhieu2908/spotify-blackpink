import React from "react";
import { useRecoilState } from "recoil";
import useSpotify from "../hooks/useSpotify";
import { millisecondsToMinutesAndSeconds } from "../lib/time";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";

function Song(props) {
  const spotifyApi = useSpotify();
  const { track } = props;

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(track.track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track.track.uri],
    });
  };

  return (
    <div
      className="group grid grid-cols-2 text-gray-500 py-3 px-3 hover:bg-fuchsia-200 hover:rounded-md cursor-pointer"
      onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <p>{props.index + 1}</p>
        <img
          className="h-10 w-10 rounded"
          src={track.track.album.images[1].url}
          alt="song"
        />
        <div>
          <p className="w-36 lg:w-64 truncate text-white group-hover:text-black">{track.track.name}</p>
          <p className="w-40">{track.track.artists[0].name}</p>
        </div>
      </div>

      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-50 hidden md:inline">{track.track.album.name}</p>
        <p>{millisecondsToMinutesAndSeconds(track.track.duration_ms)}</p>
      </div>
    </div>
  );
}

export default Song;
