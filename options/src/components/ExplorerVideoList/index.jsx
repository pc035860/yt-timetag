import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import _ from 'lodash';

import ReactList from 'react-list';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Delay from '../Delay';

import { useTranslation } from 'react-i18next';
import useYouTubeIframePlayer from '../YouTubeIframePlayer/useYouTubeIframePlayer';

import { countAsciiCharLength } from './utils';
import { toTag } from '../../utils/ytTime';
import Highlighter from 'react-highlight-words';
import usePlaybackInfo from '../PlaybackInfo/usePlaybackInfo';

const getScrollParent = () => {
  return window;
};

const EMPTY_SEARCH_WORDS = [];

const ExplorerVideoList = ({ dataList: optDataList }) => {
  const { player } = useYouTubeIframePlayer();

  const [currentVideoId, setCurrentVideoId] = useState(null);

  const loadTag = useCallback(
    (videoId, seconds) => {
      player.loadVideoById(videoId, seconds);
      setCurrentVideoId(videoId);
    },
    [player]
  );

  const [searchText, setSearchText] = useState('');
  const handleSearchTextChange = useCallback(evt => {
    setSearchText(evt.target.value);
  }, []);
  const [showHighlightWords, setShowHighlightWords] = useState(true);
  const handleShowHighlightWordsChange = useCallback(evt => {
    setShowHighlightWords(evt.target.checked);
  }, []);
  const searchWords = useMemo(() => {
    if (!showHighlightWords) {
      return EMPTY_SEARCH_WORDS;
    }
    return searchText.split(/\s+/);
  }, [searchText, showHighlightWords]);
  const handleClearSearchText = useCallback(() => {
    setSearchText('');
  }, []);
  const handleSearchTextKeyDown = useCallback(
    evt => {
      if (evt.key === 'Escape') {
        setSearchText('');
      }
    },
    [setSearchText]
  );

  const dataList = useMemo(() => {
    if (!searchText) {
      return optDataList;
    }
    // filter optDataList with searchText, inlcuding title and tag description
    const words = searchText.split(/\s+/).map(w => w.toLowerCase());
    return optDataList.filter(d => {
      const { info, tags } = d;
      return (
        words.every(word => {
          return (
            info.title.toLowerCase().includes(word) ||
            tags.some(tag => tag.description.toLowerCase().includes(word))
          );
        }) && tags.length > 0
      );
    });
  }, [optDataList, searchText]);

  const itemsRenderer = useCallback((items, ref) => {
    return (
      <div ref={ref} className="pb-8">
        {items}
      </div>
    );
  }, []);

  const info = usePlaybackInfo();
  const currentTime = _.get(info, 'currentTime', null);

  const itemRenderer = useCallback(
    index => {
      const d = dataList[index];
      const { info, tags } = d;

      const isVideoActive = currentVideoId === info.videoId;

      const key = info.videoId;

      return (
        <div
          key={key}
          className={cn(
            'card shadow-md dark:shadow-md-light mb-6 border border-neutral-200 dark:border-neutral-600',
            {
              '!border-secondary': isVideoActive,
            }
          )}
        >
          <div className="card-body p-6">
            <h2 className="card-title text-base">
              <a
                href={`https://www.youtube.com/watch?v=${info.videoId}`}
                target="_blank"
                rel="noreferrer"
              >
                <Highlighter
                  searchWords={searchWords}
                  autoEscape={true}
                  textToHighlight={info.title}
                />
              </a>
            </h2>
            <div className="mt-4">
              <ul>
                {tags.map((tag, i) => {
                  const { id, seconds, description } = tag;

                  const nextTag = tags[i + 1];
                  const nextSeconds = _.get(nextTag, 'seconds', Infinity);

                  const isActive =
                    isVideoActive &&
                    currentTime > seconds &&
                    currentTime < nextSeconds;

                  return (
                    <li
                      key={id}
                      className="mb-2 flex justify-between items-start text-sm"
                    >
                      <a
                        href=""
                        onClick={evt => {
                          evt.preventDefault();
                          loadTag(info.videoId, seconds);
                        }}
                        className="shrink-0 w-[74px] text-right font-mono text-timetag-light dark:text-timetag-dark"
                      >
                        <div>{toTag(seconds)}</div>
                      </a>
                      <span className="ml-3 grow">
                        <Highlighter
                          searchWords={searchWords}
                          autoEscape={true}
                          textToHighlight={description}
                          className={cn({
                            'font-bold dark:text-neutral-200': isActive,
                          })}
                        />
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      );
    },
    [currentTime, currentVideoId, dataList, loadTag, searchWords]
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

  const { t } = useTranslation();

  return (
    <>
      <div className="video-list-toolbar-wrap fixed z-10 top-24 w-[420px]">
        <div className="video-list-toolbar w-full">
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder={t('search')}
              value={searchText}
              onChange={handleSearchTextChange}
              onKeyDown={handleSearchTextKeyDown}
            />
            {searchText && (
              <button
                className="btn btn-circle btn-sm bg-transparent hover:bg-transparent no-animation border-0"
                onClick={handleClearSearchText}
              >
                <FontAwesomeIcon icon="fa-sharp fa-regular fa-xmark" />
              </button>
            )}
          </label>
          <div className="form-control">
            <label className="label cursor-pointer justify-start">
              <input
                type="checkbox"
                className="checkbox checkbox-xs"
                checked={showHighlightWords}
                onChange={handleShowHighlightWordsChange}
              />
              <span className="label-text ml-2">
                {t('searchHighlightWords')}
              </span>
            </label>
          </div>
        </div>
      </div>
      {/* placeholder */}
      <div className="h-[118px] mb-5">&nbsp;</div>
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
    </>
  );
};

ExplorerVideoList.propTypes = {
  dataList: PropTypes.array,
};

export default ExplorerVideoList;
