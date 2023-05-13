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

  useEffect(() => {
    const initMidi = async () => {
      const response = await fetch(src);
      const midiData = await response.arrayBuffer();
      const parsedMidi = new Midi(midiData);
      setMidi(parsedMidi);

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

  const startPlayback = async () => {
    if (!isPlaying) {
      setIsPlaying(true);
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
  };

  return (
    <div>
      <h3>Playing MIDI</h3>
      <button onClick={startPlayback}>{isPlaying ? 'Pause' : 'Start'}</button>
      <button onClick={stopPlayback}>Reset</button>
    </div>
  );
};

export default MidiPlayer;
