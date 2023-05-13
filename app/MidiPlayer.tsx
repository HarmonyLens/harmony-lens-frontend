import React, { useEffect, useState } from 'react';
import { Midi } from '@tonejs/midi';
import * as Tone from 'tone';

interface MidiPlayerProps {
  src: string;
}

const MidiPlayer: React.FC<MidiPlayerProps> = ({ src }) => {
  const [synth, setSynth] = useState<Tone.PolySynth | null>(null);
  const [midi, setMidi] = useState<Midi | null>(null);

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
      polySynth.triggerAttackRelease(note.name, note.duration, note.time + now, note.velocity);
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

export default MidiPlayer;
