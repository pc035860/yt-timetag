import { useContext } from 'react';
import Context from './Context';

export default function usePlaybackInfo() {
  const info = useContext(Context);
  return info;
}
