import pDefer from 'p-defer';
import _ from 'lodash';
import raf from 'raf';

/**
 * state
 * -1: unstarted
 * 0: ended
 * 1: playing
 * 2: paused
 * 3: buffering
 * 5: video cued
 */

export default function enhancePlayer(player) {
  const loadVideoDfdList = [];
  const seekDfdList = [];

  const nextPlayer = {
    loadVideoById,
    seekTo,
  };

  const stateSequence = [];

  function dispatchStateSequence({ addtionalSeq2Str } = {}) {
    const seq2Str = stateSequence.slice(-2).join(',');
    const seq4Str = stateSequence.slice(-4).join(',');

    if (
      seq4Str === '-1,3,-1,3' ||
      seq4Str === '-1,3,-1,1' ||
      seq4Str === '-1,3,-1,2'
    ) {
      _.each(loadVideoDfdList, dfd => {
        const end = performance.now();
        dfd.resolve(end - dfd._start);
      });
      loadVideoDfdList.length = 0;
    }

    if (
      seq2Str === '3,1' ||
      seq2Str === '3,2' ||
      (addtionalSeq2Str && seq2Str === addtionalSeq2Str)
    ) {
      _.each(seekDfdList, dfd => {
        const end = performance.now();
        dfd.resolve(end - dfd._start);
      });
      seekDfdList.length = 0;
    }
  }

  function handleStateChange(evt) {
    const state = evt.data;
    stateSequence.push(state);
    if (stateSequence.length > 6) {
      stateSequence.shift();
    }
    // console.log('@seq', stateSequence);

    dispatchStateSequence();
  }

  player.addEventListener('onStateChange', handleStateChange);

  function loadVideoById(videoId, seconds = null) {
    const videoData = player.getVideoData();

    const currentState = player.getPlayerState();

    // if video is in "cued" state, we can't call seekTo directly
    if (currentState !== 5 && videoData && videoData.video_id === videoId) {
      return seekTo(seconds);
    }

    const startingState = currentState;

    player.loadVideoById(videoId, seconds);
    const dfd = pDefer();
    dfd._start = performance.now();
    loadVideoDfdList.push(dfd);
    return dfd.promise.then(timeDiff => {
      if (seconds !== null) {
        return seekTo(seconds, { immediateDispatch: true }).then(seekDiff => {
          if (startingState === 2) {
            raf(() => {
              player.playVideo();
            });
          }
          return seekDiff;
        });
      }

      if (startingState === 2) {
        raf(() => {
          player.playVideo();
        });
      }
      return timeDiff;
    });
  }

  function seekTo(seconds, { immediateDispatch = false } = {}) {
    player.seekTo(seconds, true);
    const dfd = pDefer();
    dfd._start = performance.now();
    seekDfdList.push(dfd);

    if (immediateDispatch) {
      raf(() => {
        dispatchStateSequence({ addtionalSeq2Str: '-1,1' });
      });
    }

    return dfd.promise.then(seekDiff => {
      return seekDiff;
    });
  }

  return nextPlayer;
}
