import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import ChoiceScreen from './ChoiceScreen';

const OPTIONS = [
  { value: true, label: 'Audio on', icon: Volume2 },
  { value: false, label: 'Audio off', icon: VolumeX },
] as const;

const SoundChoice: React.FC<{ onChoose: (soundOn: boolean) => void }> = ({ onChoose }) => (
  <ChoiceScreen title="Do you want sound?" options={OPTIONS} onChoose={onChoose} />
);

export default SoundChoice;
