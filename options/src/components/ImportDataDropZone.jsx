import { useCallback } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import _ from 'lodash';
import { parse } from 'yaml';

import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { STORAGE_KEY_PREFIX } from '../pages/Data/utils';

const defaultOnImport = data => null;

const ImportDataDropZone = ({ className, onImport = defaultOnImport }) => {
  const handleFileDrop = useCallback(
    acceptedFiles => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = e => {
        const yamlContent = e.target.result;
        const list = parse(yamlContent);

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

        onImport(data);
      };
      reader.readAsText(file);
    },
    [onImport]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop: handleFileDrop,
    accept: {
      'application/yaml': ['.yaml'],
      'application/x-yaml': ['.yaml'],
      'text/yaml': ['.yaml'],
      'text/x-yaml': ['.yaml'],
    },
  });

  const { t } = useTranslation();

  return (
    <div
      className={cn('w-full flex justify-center items-center', className)}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div className={cn('text-center')}>
        <div className="mb-8">
          {isDragAccept && (
            <FontAwesomeIcon
              icon="fa-sharp fa-regular fa-treasure-chest"
              size="4x"
              className="text-success"
            />
          )}
          {isDragReject && (
            <FontAwesomeIcon
              icon="fa-sharp fa-regular fa-dungeon"
              size="4x"
              className="text-error"
            />
          )}
          {!isDragActive && (
            <FontAwesomeIcon icon="fa-sharp fa-regular fa-dungeon" size="4x" />
          )}
        </div>
        <div className="text-xl">{t('dropFileDescription')}</div>
      </div>
    </div>
  );
};

ImportDataDropZone.propTypes = {
  className: PropTypes.string,
  onImport: PropTypes.func,
};

export default ImportDataDropZone;
