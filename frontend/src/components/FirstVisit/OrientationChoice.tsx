import React from 'react';
import { RectangleHorizontal, RectangleVertical } from 'lucide-react';
import { StoryOrientation } from '../../types/story';
import ChoiceScreen from './ChoiceScreen';

const OPTIONS = [
  { value: 'landscape-primary', label: 'Landscape', icon: RectangleHorizontal },
  { value: 'portrait', label: 'Portrait', icon: RectangleVertical },
] as const;

const OrientationChoice: React.FC<{ onChoose: (orientation: StoryOrientation) => void }> = ({ onChoose }) => (
  <ChoiceScreen title="How do you want to play?" options={OPTIONS} onChoose={onChoose} />
);

export default OrientationChoice;
