import React, { useEffect } from "react";
import Image from "next/image";

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

  const ImagePlaylistLoader = ({ src }) => {
    return `${playlist?.images?.[0]?.url}`;
  };
  const ImageProfileLoader = ({ src }) => {
    return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyx3vOqyU0fzzNggJpFvs-8E5B010c0noBNA&usqp=CAU"
  }
  return (
    <div className="flex-grow bg-black h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center text-fuchsia-300 space-x-3 bg-black opacity-90 hover:opacity-70 cursor-pointer rounded-full p-1 pr-2"
          onClick={() => {
            signOut();
          }}
        >
          <Image
          loader={ImageProfileLoader}
            className="rounded-full"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyx3vOqyU0fzzNggJpFvs-8E5B010c0noBNA&usqp=CAU"
            alt="profile"
            width={40}
            height={40}
          />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section className="flex items-end space-x-7 bg-gradient-to-b from-fuchsia-300 to-black h-80 text-white p-8">
        <Image
          loader={ImagePlaylistLoader}
          className="shadow-2xl rounded"
          src={`${playlist?.images?.[0]?.url}`}
          alt="playlist"
          width={208}
          height={208}
        />
        <div>
          <p className="text-sm">PLAYLIST</p>
          <h1 className="text-5xl md:text-7xl xl:text-8xl font-bold">
            {playlist?.name}
          </h1>
        </div>
      </section>
      <hr className="py-4 mt-4 opacity-30" />
      <div>
        <Songs />
      </div>
    </div>
  );
}

export default MusicContent;
