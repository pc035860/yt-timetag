import { useContext } from 'react';
import Context from './Context';

export default function useYouTubeIframePlayer() {
  const { YT, getPlayer, player } = useContext(Context);

  return { YT, getPlayer, player };
}
