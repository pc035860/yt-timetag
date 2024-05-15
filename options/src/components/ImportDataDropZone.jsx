import { useCallback } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import _ from 'lodash';
import yaml from 'js-yaml';

import Logo from './Logo';

import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

import { STORAGE_KEY_PREFIX } from '../pages/Data/utils';

const defaultOnImport = data => null;

const defaultChildren = ({ isDragAccept, isDragReject, getRootProps }) => null;

const ImportDataDropZone = ({
  className,
  backgroundMode,
  onImport = defaultOnImport,
  children = defaultChildren,
}) => {
  const handleFileDrop = useCallback(
    acceptedFiles => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = e => {
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

        onImport(data);
      };
      reader.readAsText(file);
    },
    [onImport]
  );

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      onDropAccepted: handleFileDrop,
      accept: {
        'application/yaml': ['.yaml'],
        'application/x-yaml': ['.yaml'],
        'text/yaml': ['.yaml'],
        'text/x-yaml': ['.yaml'],
      },
      noClick: true,
    });

  const { t } = useTranslation();

  return (
    <>
      <div
        className={cn('w-full flex justify-center items-center', className)}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div
          className={cn('relative mt-[-20vh] text-center', {
            hidden: backgroundMode,
          })}
        >
          <div className="mb-8">
            <Logo className="mx-auto w-20 h-20" />
          </div>
          <div className="text-xl">{t('dropFileDescription')}</div>
        </div>
      </div>
      {children({ isDragAccept, isDragReject, getRootProps })}
    </>
  );
};

ImportDataDropZone.propTypes = {
  className: PropTypes.string,
  backgroundMode: PropTypes.bool,
  onImport: PropTypes.func,
  children: PropTypes.func,
};

export default ImportDataDropZone;
