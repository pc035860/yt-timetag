import PropTypes from 'prop-types';
import usePlaybackInfo from './PlaybackInfo/usePlaybackInfo';
import { toTag } from '../utils/ytTime';

const PlaybackCurrentTime = ({ className }) => {
  const info = usePlaybackInfo();

  if (!info) {
    return null;
  }

  return <div className={className}>{toTag(info.currentTime)}</div>;
};

PlaybackCurrentTime.propTypes = {
  className: PropTypes.string,
};

export default PlaybackCurrentTime;
