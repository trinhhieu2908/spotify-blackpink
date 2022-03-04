import React, { useEffect } from "react";

import { signOut, useSession } from "next-auth/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";

import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

function MusicContent() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const pickedPlaylistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    spotifyApi
      .getPlaylist(pickedPlaylistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => {
        console.error("Some thing went wrong", err);
      });
  }, [spotifyApi, pickedPlaylistId]);

  // console.log(playlist);
  return (
    <div className="flex-grow bg-black h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center text-fuchsia-300 space-x-3 bg-black opacity-90 hover:opacity-70 cursor-pointer rounded-full p-1 pr-2"
          onClick={() => {
            signOut();
          }}
        >
          <img
            className="rounded-full w-10 h-10"
            src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"
            alt="profile"
          />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section className="flex items-end space-x-7 bg-gradient-to-b from-fuchsia-300 to-black h-80 text-white p-8">
        <img
          className="h-44 w-44 shadow-2xl rounded"
          src={playlist?.images?.[0]?.url}
          alt="playlist"
        />
        <div>
          <p className="text-sm">PLAYLIST</p>
          <h1 className="text-5xl md:text-7xl xl:text-8xl font-bold">
            {playlist?.name}
          </h1>
        </div>
      </section>
          <hr className="py-4 mt-4 opacity-40"/>
      <div>
        <Songs />
      </div>
    </div>
  );
}

export default MusicContent;
