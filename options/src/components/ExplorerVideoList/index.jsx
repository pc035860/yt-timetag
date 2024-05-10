import { useCallback } from 'react';
import PropTypes from 'prop-types';
import useYouTubeIframePlayer from '../YouTubeIframePlayer/useYouTubeIframePlayer';
import ReactList from 'react-list';
import { countAsciiCharLength } from './utils';
import Delay from '../Delay';
import { toTag } from '../../utils/ytTime';

const getScrollParent = () => {
  return window;
};

const ExplorerVideoList = ({ dataList }) => {
  const { player } = useYouTubeIframePlayer();

  const loadTag = useCallback(
    (videoId, seconds) => {
      player.loadVideoById(videoId, seconds);
    },
    [player]
  );

  const itemsRenderer = useCallback((items, ref) => {
    return <div ref={ref}>{items}</div>;
  }, []);

  const itemRenderer = useCallback(
    (index, key) => {
      const d = dataList[index];
      const { info, tags } = d;
      return (
        <div
          key={info.videoId}
          className="card border border-accent shadow-md dark:shadow-lg mb-6"
        >
          <div className="card-body">
            <h2 className="card-title">{info.title}</h2>
            <div className="mt-4">
              <ul>
                {tags.map(tag => {
                  const { id, seconds, description } = tag;
                  return (
                    <li
                      key={id}
                      className="mb-2 flex justify-between items-start"
                    >
                      <a
                        href=""
                        onClick={evt => {
                          evt.preventDefault();
                          loadTag(info.videoId, seconds);
                        }}
                        className="shrink-0 w-[80px] text-right font-mono text-timetag-light dark:text-timetag-dark"
                      >
                        {toTag(seconds)}
                      </a>
                      <span className="ml-3 grow">{description}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      );
    },
    [dataList, loadTag]
  );

  const itemSizeEstimator = useCallback(
    (index, cache) => {
      const d = dataList[index];
      const { info, tags } = d;

      const titleCharLength = countAsciiCharLength(info.title);
      const titleHeight = (Math.floor(titleCharLength / 16) + 1) * 28;
      const tagsHeight = tags.length * 32;
      const paddingHeight = 65 + 16;

      const h = titleHeight + tagsHeight + paddingHeight;
      return h;
    },
    [dataList]
  );

  return (
    <Delay wait={20}>
      <ReactList
        type="variable"
        length={dataList.length}
        itemsRenderer={itemsRenderer}
        itemRenderer={itemRenderer}
        itemSizeEstimator={itemSizeEstimator}
        scrollParentGetter={getScrollParent}
        threshold={200}
      />
    </Delay>
  );
};

ExplorerVideoList.propTypes = {
  dataList: PropTypes.array,
};

export default ExplorerVideoList;
