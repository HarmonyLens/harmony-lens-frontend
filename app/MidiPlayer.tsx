import React, { useEffect, useState } from 'react';
import { Midi } from '@tonejs/midi';
import * as Tone from 'tone';

interface MidiPlayerProps {
  src: string;
}

const MidiPlayer: React.FC<MidiPlayerProps> = ({ src }) => {
  const [synth, setSynth] = useState<Tone.PolySynth | null>(null);
  const [midi, setMidi] = useState<Midi | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [part, setPart] = useState<Tone.Part<any> | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);

  useEffect(() => {
    const initMidi = async () => {
      const response = await fetch(src);
      const midiData = await response.arrayBuffer();
      const parsedMidi = new Midi(midiData);
      setMidi(parsedMidi);

      // Set the total time of the music
      setTotalTime(parsedMidi.duration);

      await Tone.start();
      const polySynth = new Tone.PolySynth().toDestination();
      setSynth(polySynth);

      const midiPart = new Tone.Part((time, note) => {
        polySynth.triggerAttackRelease(note.name, note.duration, time, note.velocity);
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
    <div>
      <h3>Playing MIDI</h3>
      <p>Current time: {currentTime.toFixed(2)} seconds</p>
      <p>Total time: {totalTime.toFixed(2)} seconds</p>
      <button onClick={startPlayback}>{isPlaying ? 'Pause' : 'Start'}</button>
      <button onClick={stopPlayback}>Reset</button>
    </div>
  );
};

export default MidiPlayer;
