import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import useYouTubeIframePlayer from '../YouTubeIframePlayer/useYouTubeIframePlayer';
import ReactList from 'react-list';
import { countAsciiCharLength } from './utils';

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

  const itemRenderer = useCallback(() => {}, []);

  const itemSizeEstimator = useCallback(
    (index, cache) => {
      const d = dataList[index];
      const { info, tags } = d.info;

      const titleCharLength = countAsciiCharLength(info.title);
      const titleHeight = (Math.floor(titleCharLength / 16) + 1) * 22;

      const shopNamesTextLength = _.sumBy(d.availableShops, 'name.length');
      return 42 + Math.floor(shopNamesTextLength / perRow) * 30;
    },
    [isXL]
  );

  return (
    <div>
      {dataList.map(d => {
        const { info, tags } = d;
        const key = info.videoId;
        return (
          <div key={key} className="mb-4">
            <ReactList
              type="variable"
              length={dataList.length}
              itemsRenderer={itemsRenderer}
              itemRenderer={itemRenderer}
              itemSizeEstimator={itemSizeEstimator}
            />
            <div className="card border border-accent shadow-md dark:shadow-lg">
              <div className="card-body">
                <h2 className="card-title">{info.title}</h2>
                <div className="mt-4">
                  <ul>
                    {tags.map(tag => {
                      const { id, seconds, description } = tag;
                      return (
                        <li key={id} className="mb-2">
                          <a
                            href=""
                            onClick={evt => {
                              evt.preventDefault();
                              loadTag(info.videoId, seconds);
                            }}
                          >
                            <span className="font-bold">{seconds}</span>
                            <span className="ml-2">{description}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

ExplorerVideoList.propTypes = {
  dataPairs: PropTypes.array,
};

export default ExplorerVideoList;
