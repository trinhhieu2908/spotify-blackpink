import { getSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import MusicContent from "../components/MusicContent";
import Sidebar from "../components/Sidebar";
import Player from "../components/PLayer";

export default function Home() {
  return (
    <div className="h-screen overflow-hidden">
      <main className="flex">
        <Sidebar />
        <MusicContent />
      </main>

      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session: session,
    },
  };
}
