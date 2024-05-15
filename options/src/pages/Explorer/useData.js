/* global chrome */

import { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';

import { local } from '../../utils/chromeStorage';

import { KEY_STORAGE_SHORTCUTS_SETTINGS } from '../../constants';

const getData = () => {
  return local.getAll();
};

export default function useData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getData()
      .then(_data => {
        const list = _.compact(
          _.map(_.keys(_data), key => {
            if (key === KEY_STORAGE_SHORTCUTS_SETTINGS) {
              return null;
            }
            return _.omit(_data[key], ['activeTag']);
          })
        );
        setData(list);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();

    const handleChanged = (changes, areaName) => {
      if (areaName === 'local') {
        load();
      }
    };

    if (chrome && chrome.storage) {
      chrome.storage.onChanged.addListener(handleChanged);
    }
    return () => {
      if (chrome && chrome.storage) {
        chrome.storage.onChanged.removeListener(handleChanged);
      }
    };
  }, [load]);

  return { data, loading, error };
}
