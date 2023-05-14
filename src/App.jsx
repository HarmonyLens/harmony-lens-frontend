import { useState, useEffect } from "react";
import { Midi } from "@tonejs/midi";
import * as Tone from "tone";
import { fetchPosts, fetchPostDetails } from "./api";
import { Link } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import {
  useExplorePublications,
  useActiveProfile,
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
    limit: 12,
    publicationTypes: ["POST"],
    metadataFilter: {
      restrictPublicationMainFocusTo: ["AUDIO"],
    },
  });

  const [lastUpdatedAt, setLastUpdatedAt] = useState(Date.now());

  useEffect(() => {
    window.addEventListener("scroll", function () {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight &&
        lastUpdatedAt < Date.now()
      ) {
        if (hasMore) {
          console.log("fetching more");
          next();
          setLastUpdatedAt(Date.now() + 3000);
        }
      }
    });

    return () => {
      window.removeEventListener("scroll", () => {});
    };
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
      <div className="overflow-auto max-h-[50vh]">
        <div className="grid grid-cols-2 justify-between gap-10 items-center max-w-[100vw] overflow-auto px-10 py-10 ">
          {publication.map((publication, index) => (
            <div key={index} className="flex justify-center items-center">
              <Link
                to={`/song/${publication.id}`}
                className="cursor-pointer flex flex-col items-center text-center"
              >
                <img
                  src={publication?.metadata?.media[0]?.original?.cover}
                  width={100}
                />
                <div>{publication?.metadata?.content}</div>
              </Link>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            next();
            setLastUpdatedAt(Date.now() + 3000);
          }}
          className="flex text-right justify-end items-end mr-20 ml-auto"
        >
          Load More
        </button>
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

  const inspireHandler = async () => {
    const sentiment = await fetch(
      "http://localhost:3000/emotionOfHandle?handle=alptoksoz.lens"
    ).then((response) => response.json().then((data) => data));

    console.log(
      `Your last 5 tweets' sentiment is ${sentiment.DocSentimentResultString} with ${sentiment.DocSentimentValue} value`
    );

    const notes = await fetch(
      `http://localhost:3000/notes?mood="${sentiment.DocSentimentResultString}"`
    ).then((response) => response.json().then((data) => data));

    console.log(
      `Notes are created. There are ${
        notes.sections.length
      } sections and ${notes.sections
        .map((section) => section.notes.length)
        .reduce((a, b) => a + b, 0)} notes in total.`
    );

    const uri = await fetch("http://localhost:3000/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notes),
    }).then((response) => response.json().then((data) => data.uri));

    console.log(
      `Your song is created. You can listen it from http://harmonylens.infura-ipfs.io/ipfs/${uri}.`
    );
  };

  return (
    <div className="flex flex-col justify-between items-center">
      <div className="relative flex justify-between h-[33vh] w-full bg-main p-4 mb-10">
        <button
          onClick={inspireHandler}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl border border-2 px-4 py-2 rounded-xl hover:scale-125 duration-300"
        >
          Inspire Me
        </button>
        {/* <div className="absolute -bottom-10 lg:-bottom-20 transform left-1/2 -translate-x-1/2">
          <img
            src={
              "https://e0.pxfuel.com/wallpapers/613/325/desktop-wallpaper-aesthetic-neon-music-note-neon-music-notes.jpg"
            }
            className="brightness-50"
          />
          <h2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl">
            Music
          </h2>
        </div> */}
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
