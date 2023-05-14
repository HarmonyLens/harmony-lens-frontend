import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPostById } from "../api";
import MidiPlayer from "../components/MidiPlayer";
import { usePublication } from "@lens-protocol/react-web";
import { Media, Player, controls, withMediaProps } from "react-media-player";
import { Audio } from "react-loader-spinner";

const {
  PlayPause,
  CurrentTime,
  Progress,
  SeekBar,
  Duration,
  MuteUnmute,
  Volume,
  Fullscreen,
} = controls;

export default function Song() {
  const id = useParams().id;

  const { data: publication, loading } = usePublication({
    publicationId: id,
  });

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

  console.log(publication);

  return (
    <div className="flex flex-col justify-center items-center">
      <h1>Song {id}</h1>
      <img
        src={publication?.metadata?.media[0]?.original?.cover}
        className="absolute top-0 max-w-[80vw] max-h-[50vh] object-fit z-20 rounded-b-full"
      />
      <img
        src={publication?.metadata?.media[0]?.original?.cover}
        className="absolute top-0 h-screen w-full blur-lg object-fit"
      />
      <div className="absolute bottom-10 text-white">
        <Media>
          <div className="media">
            <div className="media-player">
              <Player src={publication?.metadata?.media[0]?.original?.url} />
            </div>
            <div className="space-x-10">
              <PlayPause />
              <Volume />
              <span>
                <CurrentTime /> / <Duration />
              </span>
            </div>
          </div>
        </Media>
      </div>

      {/* <img src={song?.metadata?.image} /> */}
      {/* <MidiPlayer src={song?.metadata.midi} /> */}
    </div>
  );
}
