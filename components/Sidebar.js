import React, { useEffect, useState } from "react";

import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  HeartIcon,
  RssIcon,
  PlusCircleIcon,
} from "@heroicons/react/outline";

import { useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [pickedPlaylistId, setPickedPlaylistId] =
    useRecoilState(playlistIdState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  const playlistPickHandler = (playlistId) => {
    setPickedPlaylistId(playlistId);
    console.log(pickedPlaylistId);
    console.log(playlistId);
  };

  // console.log(playlists)
  return (
    <div className="bg-fuchsia-300 text-gray-500 p-5 text-xs lg:text-sm border-r border-fuchsia-300 overflow-y-scroll scrollbar-hide h-screen sm:w-52 lg:w-72 w-52 pb-36">
      <div className="space-y-4">
        <div className="flex items-center justify-center">
          <img
            className="w-24 h-24 mb-5"
            src="https://pnggrid.com/wp-content/uploads/2021/05/Spotify-Logo-Black-Square-1024x1024.png"
            alt="spotify-logo"
          />
        </div>
        <button className="flex items-center space-x-2 text-gray-700 hover:text-black">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 text-gray-700 hover:text-black">
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 text-gray-700 hover:text-black">
          <LibraryIcon className="h-5 w-5" />
          <p>Your Library</p>
        </button>
        <hr className="border-t-[0.1px]" />

        <button className="flex items-center space-x-2 text-gray-700 hover:text-black">
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 text-gray-700 hover:text-black">
          <HeartIcon className="h-5 w-5" />
          <p>Liked songs</p>
        </button>
        <button className="flex items-center space-x-2 text-gray-700 hover:text-black">
          <RssIcon className="h-5 w-5" />
          <p>Your Episodes</p>
        </button>
        <hr className="border-t-[0.1px]" />
        {playlists.map((playlist) => (
          <p
            key={playlist.id}
            onClick={playlistPickHandler.bind(this, playlist.id)}
            className="cursor-pointer text-gray-700 hover:text-black"
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
