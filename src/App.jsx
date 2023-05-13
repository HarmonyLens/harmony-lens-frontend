import { useState, useEffect } from "react";
import { Midi } from "@tonejs/midi";
import * as Tone from "tone";
import { fetchPosts, fetchPostDetails } from "./api";
import { Link } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

const PlayingMusic = ({ image, name, artist, length }) => {
  return (
    <div className="flex flex-row bg-gray-600">
      <img src={image} />
      <h1>{name}</h1>
      <h2>{artist}</h2>
      <h3>{length}</h3>
    </div>
  );
};

const MidiPlayer = ({ src }) => {
  const [synth, setSynth] = useState(null);
  const [midi, setMidi] = useState(null);

  useEffect(() => {
    const initMidi = async () => {
      const response = await fetch(src);
      const midiData = await response.arrayBuffer();
      const parsedMidi = new Midi(midiData);
      setMidi(parsedMidi);
    };

    initMidi();
  }, [src]);

  const startPlayback = async () => {
    if (!midi) return;

    await Tone.start();
    const polySynth = new Tone.PolySynth().toDestination();
    setSynth(polySynth);

    const now = Tone.now();
    midi.tracks[0].notes.forEach((note) => {
      polySynth.triggerAttackRelease(
        note.name,
        note.duration,
        note.time + now,
        note.velocity
      );
    });
  };

  const stopPlayback = () => {
    if (synth) {
      synth.releaseAll();
    }
    Tone.Transport.stop();
    Tone.Transport.cancel();
  };

  return (
    <div>
      <h3>Playing MIDI</h3>
      <button onClick={startPlayback}>Start</button>
      <button onClick={stopPlayback}>Stop</button>
    </div>
  );
};

function CreateMusic() {
  return (
    <div className="flex flex-col justify-between items-center text-white space-y-2">
      <h1> Create Music </h1>
      <div className="flex flex-col justify-between items-center">
        <div className="flex flex-col justify-between items-center">
          <h2> Name it </h2>
          <input type="text" />
        </div>
        <div className="flex flex-col justify-between items-center">
          <h2> Add Description </h2>
          <input type="text" />
        </div>
      </div>
      <button className="bg-purple-500 p-4 rounded-lg"> Create </button>
    </div>
  );
}

function LatestSongs({ posts }) {
  return (
    <div className="flex flex-col justify-between items-center text-white space-y-2">
      <h1> Latest Songs </h1>
      <div className="flex flex-row justify-between space-x-20 items-center max-w-[100vw] overflow-auto px-10">
        {posts.map((post) => {
          // console.log(post);
          return (
            <div className="flex flex-col">
              <Link to={`/song/${post.id}`} className="cursor-pointer">
                <img src={post.metadata?.image} className="w-full" />
              </Link>
              <h2 className="text-center"> {post.profileId.handle} </h2>
              {/* <h3> {post.description} </h3> */}
            </div>
          );
        })}
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
      <h1 className="mx-auto text-center mt-20 text-5xl text-white">
        Loading...
      </h1>
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
