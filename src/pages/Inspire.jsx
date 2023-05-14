import React from "react";
// import LoginButton from "../components/LoginButton";
// import LogoutButton from "../components/LogoutButton";
// import {uploadJson} from "./upload";
import {
  AudioType,
  ContentFocus,
  useActiveProfile,
  useCreatePost,
} from "@lens-protocol/react-web";

async function upload() {
  return "https://bafybeiga5doszfextckersvxnj5rcytx3y4uzktulft5glatydiky4k2l4.ipfs.w3s.link/audio-7.mp3";
}

const Home = () => {
  const { data: publisher, loading } = useActiveProfile();

  if (loading) {
    return <p>Loading...</p>;
  }

  return <Compose publisher={publisher} />;
};

function Compose({ publisher }) {
  const { execute: create } = useCreatePost({ publisher, upload });
  const onSubmit = async () => {
    await create({
      contentFocus: ContentFocus.AUDIO,
      locale: "en",
      media: [
        {
          url: "https://bafybeiga5doszfextckersvxnj5rcytx3y4uzktulft5glatydiky4k2l4.ipfs.w3s.link/audio-7.mp3",
          mimeType: AudioType.MP3,
          cover:
            "https://cryptoslate.com/wp-content/uploads/2022/08/lens-protocol-cover.jpg",
        },
      ],
    });
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={onSubmit}
      >
        Inspire Me
      </button>
    </div>
  );
}

export default Home;
