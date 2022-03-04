import React from "react";
import { getProviders, signIn } from "next-auth/react";

function login({ providers }) {
  console.log(providers);
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <img
        className="w-52 mb-5"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/2560px-Spotify_logo_with_text.svg.png"
        alt="spotify-logo"
      />
      {Object.values(providers).map((provider) => (
        <div key={provider}>
          <button
            className="bg-[#18D860] text-white p-4 px-6  rounded-full"
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            Login to {provider.name} BlackPink theme
          </button>
        </div>
      ))}
    </div>
  );
}

export default login;

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
