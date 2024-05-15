import yaml from 'js-yaml';

import _ from 'lodash';
import md5 from 'md5';
import { produce } from 'immer';
import LZUTF8 from 'lzutf8';

import { local, sync } from '../../utils/chromeStorage';

import { KEY_STORAGE_SHORTCUTS_SETTINGS } from '../../constants';

export const STORAGE_KEY_PREFIX = 'crState-';

const mergeTags = (source, target, { outdated = false } = {}) => {
  const list = [...source];
  const sourceTagById = _.reduce(
    source,
    (acc, tag, i) => {
      acc[tag.id] = { ...tag, _index: i };
      return acc;
    },
    {}
  );
  _.each(target, tag => {
    const matchedSourceTag = sourceTagById[tag.id];
    if (matchedSourceTag) {
      // matched tag is outdated, replace it with new one
      if (outdated) {
        list.splice(matchedSourceTag._index, 1, tag);
      }
    } else {
      list.push(tag);
    }
  });
  return list;
};
const merge = (source, target) => {
  return produce(source, draft => {
    _.each(draft, (value, key) => {
      const tValue = target[key];
      if (!tValue) {
        return;
      }

      const { info, tags } = value;
      const { info: tInfo, tags: tTags } = tValue;

      // if source is outdated
      let outdated = false;

      if (tInfo.lastUpdated > info.lastUpdated) {
        outdated = true;
        draft[key].info = tInfo;
      }

      draft[key].tags = mergeTags(tags, tTags, { outdated });
    });

    _.each(target, (value, key) => {
      if (!draft[key]) {
        draft[key] = value;
      }
    });
  });
};

export const upload = async file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async e => {
      const yamlContent = e.target.result;
      const list = yaml.load(yamlContent);

      const data = _.reduce(
        list,
        (acc, item) => {
          const videoId = _.get(item, 'info.videoId');
          if (videoId) {
            const key = `${STORAGE_KEY_PREFIX}${videoId}`;
            acc[key] = { ...item, activeTag: '' };
          }
          return acc;
        },
        {}
      );

      local.getAll().then(currentData => {
        const mergedData = merge(currentData, data);

        local.setAll(mergedData).then(
          () => {
            resolve();
          },
          err => {
            reject(err);
          }
        );
      });
    };
    reader.readAsText(file);
  });
};

const _downloadData = data => {
  // to list
  const list = toList(data);

  const yamlContent = yaml.dump(list);
  const hash = md5(yamlContent).substring(0, 8);
  const blob = new Blob([yamlContent], { type: 'application/yaml' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  const filename = `yt-timetag_${hash}.yaml`;
  a.setAttribute('download', filename);
  a.click();
};

export const download = async () => {
  return local.getAll().then(data => {
    return _downloadData(data);
  });
};

// download from sync storage
export const downloadSync = async () => {
  return sync.getAll().then(_data => {
    const promises = _.compact(
      _.map(_.keys(_data), key => {
        if (key.indexOf(STORAGE_KEY_PREFIX) !== 0) {
          // skip non-data key
          return null;
        }
        return new Promise(resolve => {
          LZUTF8.decompressAsync(
            _data[key],
            {
              inputEncoding: 'Base64',
            },
            result => {
              resolve(JSON.parse(result));
            }
          );
        }).then(d => [key, d]);
      })
    );
    return Promise.all(promises).then(pairs => {
      const data = _.fromPairs(pairs);
      return _downloadData(data);
    });
  });
};

export const clear = async () => {
  return local.getAll().then(data => {
    // only keep shortcuts settings
    const shortcutsSettingsOnly = _.pick(data, [
      KEY_STORAGE_SHORTCUTS_SETTINGS,
    ]);
    return local.clear().then(() => {
      return local.setAll(shortcutsSettingsOnly);
    });
  });
};

function toList(data) {
  return _.compact(
    _.map(_.keys(data), key => {
      if (key.indexOf(STORAGE_KEY_PREFIX) !== 0) {
        // skip non-data key
        return null;
      }
      return _.omit(data[key], ['activeTag']);
    })
  );
}
