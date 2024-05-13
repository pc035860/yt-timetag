/* global chrome */

import { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';

import { local } from '../../utils/chromeStorage';

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
        const list = _.map(_.keys(_data), key => {
          return _.omit(_data[key], ['activeTag']);
        });
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
