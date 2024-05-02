import { useEffect } from 'react';

import { local } from '../../utils/chromeStorage';

const DataPage = () => {
  useEffect(() => {
    local.getAll().then(data => {
      console.log('@data', data);
    });
  }, []);

  return <div>data page</div>;
};

DataPage.propTypes = {};

export default DataPage;
