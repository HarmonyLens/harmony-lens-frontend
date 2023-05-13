import React, { useEffect, useState } from "react";
import { Midi } from "@tonejs/midi";
import * as Tone from "tone";

const MidiPlayer = ({ src }) => {
  const [synth, setSynth] = useState(null);
  const [midi, setMidi] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [part, setPart] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    const initMidi = async () => {
      const response = await fetch(src);
      const midiData = await response.arrayBuffer();
      const parsedMidi = new Midi(midiData);
      setMidi(parsedMidi);

      // Set the total time of the music
      console.log(parsedMidi.duration);
      setTotalTime(parsedMidi.duration);

      await Tone.start();
      const polySynth = new Tone.PolySynth().toDestination();
      setSynth(polySynth);

      const midiPart = new Tone.Part((time, note) => {
        polySynth.triggerAttackRelease(
          note.name,
          note.duration,
          time,
          note.velocity
        );
      }, parsedMidi.tracks[0].notes).start(0);
      setPart(midiPart);
    };

    initMidi();
  }, [src]);

  useEffect(() => {
    const updateCurrentTime = () => {
      if (isPlaying) {
        setCurrentTime(Tone.Transport.seconds);
        requestAnimationFrame(updateCurrentTime);
      }
    };
    updateCurrentTime();
  }, [isPlaying]);

  const startPlayback = async () => {
    if (!isPlaying) {
      setIsPlaying(true);
      await Tone.start();
      Tone.Transport.start();
    } else {
      setIsPlaying(false);
      Tone.Transport.pause();
    }
  };

  const stopPlayback = () => {
    if (synth) {
      synth.releaseAll();
    }
    Tone.Transport.stop();
    setIsPlaying(false);
    setCurrentTime(0); // Reset currentTime when the music is stopped
  };

  return (
    <div className="text-white">
      <p>Current time: {currentTime.toFixed(2)} seconds</p>
      <p>Total time: {totalTime.toFixed(2)} seconds</p>
      <button onClick={startPlayback}>{isPlaying ? "Pause" : "Start"}</button>
      <button onClick={stopPlayback}>Reset</button>
    </div>
  );
};

export default MidiPlayer;
