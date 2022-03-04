import React, { useEffect, useState, useCallback } from "react";
import useSpotify from "../hooks/useSpotify";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";
import {
  RewindIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
  SwitchHorizontalIcon,
} from "@heroicons/react/solid";

import { debounce } from "lodash";

function PlayerMusic() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const [volume, setVolume] = useState(100);

  const songInfo = useSongInfo();

  const fetchCurrentTrack = useCallback(() => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  }, [spotifyApi, songInfo, setCurrentTrackId, setIsPlaying]);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentTrack();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session, fetchCurrentTrack]);

  const playPauseHandler = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((error) => {});
    }, 200),
    [spotifyApi]
  );

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume, debouncedAdjustVolume]);

  const ImageSongLoader = ({ src }) => {
    return `${songInfo?.album.images?.[0].url}`;
  };

  return (
    <div className="h-24 bg-gradient-to-b from-fuchsia-300 to-black text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline rounded h-10 w-10"
          src={songInfo?.album.images?.[0].url}
          alt="song"
        />
        <div>
          <h3 className="text-fuchsia-300 text-2xl">{songInfo?.name}</h3>
          <p className="text-gray-300">{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />

        <RewindIcon className="button" />

        {isPlaying ? (
          <PauseIcon onClick={playPauseHandler} className="button w-10 h-10" />
        ) : (
          <PlayIcon onClick={playPauseHandler} className="button w-10 h-10" />
        )}

        <FastForwardIcon className="button" />

        <ReplyIcon className="button" />
      </div>

      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />
        <input
          className="w-14 md:w-28 rounded-lg overflow-hidden appearance-none bg-gray-400 h-3"
          type="range"
          value={volume}
          min={0}
          max={100}
          onChange={(event) => setVolume(Number(event.target.value))}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  );
}

export default PlayerMusic;
