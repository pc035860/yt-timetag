import { useContext } from 'react';
import Context from './Context';

export default function useYouTubeIframePlayer() {
  const { YT, getPlayer } = useContext(Context);

  return { YT, getPlayer };
}
