import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPostById } from "../api";
import MidiPlayer from "../components/MidiPlayer";
export default function Song() {
  const id = useParams().id;
  const [song, setSong] = useState(null);

  useEffect(() => {
    const fetchSong = async () => {
      const song = await fetchPostById(id);
      setSong(song);
    };

    fetchSong();
  });

  console.log(song);

  return (
    <div className="flex flex-col justify-center items-center">
      <h1>Song {id}</h1>
      <img src={song?.metadata?.image} />
      <MidiPlayer src={song?.metadata.midi} />
    </div>
  );
}
