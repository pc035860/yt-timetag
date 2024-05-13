import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import Context from './Context';

const PlaybackInfo = ({ children }) => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const handleMessage = evt => {
      if (evt.origin.indexOf('youtube.com') === -1) {
        return;
      }

      let json;
      try {
        json = JSON.parse(evt.data);
      } catch (e) {
        return;
      }

      if (json.event !== 'infoDelivery') {
        return;
      }

      const currentTime = _.get(json.info, 'currentTime', null);
      if (currentTime === null) {
        // only save info with currentTime
        return;
      }

      setInfo(_.omit(json.info, ['progressState']));
    };
    window.addEventListener('message', handleMessage, false);
    return () => {
      window.removeEventListener('message', handleMessage, false);
    };
  }, []);

  return <Context.Provider value={info}>{children}</Context.Provider>;
};

PlaybackInfo.propTypes = {
  children: PropTypes.node,
};

export default PlaybackInfo;
