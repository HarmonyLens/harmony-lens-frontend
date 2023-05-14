import { useState, useEffect } from "react";
import { Midi } from "@tonejs/midi";
import * as Tone from "tone";
import { fetchPosts, fetchPostDetails } from "./api";
import { Link } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import {
  useExplorePublications,
  PublicationMainFocus,
} from "@lens-protocol/react-web";
import { Audio } from "react-loader-spinner";

function LatestSongs({ posts }) {
  const {
    data: publication,
    loading,
    hasMore,
    next,
  } = useExplorePublications({
    limit: 5,
    metadataFilter: {
      restrictPublicationMainFocusTo: ["AUDIO"],
    },
  });

  if (loading) {
    return (
      <Audio
        height="80"
        width="80"
        radius="9"
        color="purple"
        ariaLabel="three-dots-loading"
        wrapperStyle
        wrapperClass
      />
    );
  }

  return (
    <div className="flex flex-col justify-between items-center text-white space-y-2">
      <h1> Latest Songs </h1>
      <div className="flex flex-row justify-between space-x-20 items-center max-w-[100vw] overflow-auto px-10">
        {publication.map((publication) => (
          <div key={publication.id}>
            <Link to={`/song/${publication.id}`} className="cursor-pointer">
              <img
                src={publication?.metadata?.media[0]?.original?.cover}
                width={100}
              />
            </Link>
            <div>{publication?.metadata?.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchPosts().then(async (posts) => {
      const postDetails = posts.data.posts.map((post, index) =>
        fetchPostDetails(post)
      );
      await Promise.all(postDetails);
      setPosts(posts.data.posts);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Audio
          height="80"
          width="80"
          radius="9"
          color="purple"
          ariaLabel="three-dots-loading"
          wrapperStyle
          wrapperClass
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between items-center">
      <div className="relative flex justify-between h-[33vh] w-full bg-purple-500 p-4 mb-40">
        <Navbar />
        <div className="absolute -bottom-10 lg:-bottom-20 transform left-1/2 -translate-x-1/2">
          <img
            src={
              "https://e0.pxfuel.com/wallpapers/613/325/desktop-wallpaper-aesthetic-neon-music-note-neon-music-notes.jpg"
            }
            className="brightness-50"
          />
          <h2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl">
            Music
          </h2>
        </div>
      </div>
      {/* <PlayingMusic
        image={reactLogo}
        name="Song Name"
        artist="Artist"
        length="3:00"
      /> */}
      {/* <MidiPlayer
        src={
          "https://bafybeiapnsiidoolozm7rmw2sjn6guf5tho4q4h64evrzjasxolwzd3d2m.ipfs.w3s.link/ipfs/bafybeiapnsiidoolozm7rmw2sjn6guf5tho4q4h64evrzjasxolwzd3d2m/audio.mid"
        }
      /> */}
      {/* <CreateMusic /> */}
      <LatestSongs posts={posts} />
    </div>
  );
}

export default App;
