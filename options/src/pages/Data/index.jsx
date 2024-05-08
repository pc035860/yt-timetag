import { useCallback, useEffect } from 'react';
import cn from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Row from './Row';

import { useDropzone } from 'react-dropzone';
import useAlert from './useAlert.jsx';
import useConfirm from './useConfirm.jsx';

import { clear, download, upload } from './utils';
import { t } from '../../utils/i18n';

const DataPage = () => {
  const { open: openAlert, render: renderAlert } = useAlert();

  const handleFileDrop = useCallback(
    acceptedFiles => {
      console.log('@acceptedFiles', acceptedFiles);

      const file = acceptedFiles[0];
      upload(file)
        .then(() => {
          openAlert({
            title: t('optionsImportSuccessTitle'),
            message: t('optionsImportSuccessMessage'),
          });
        })
        .catch(err => {
          openAlert({
            title: t('optionsImportErrorTitle'),
            message: err.message,
          });
        });
    },
    [openAlert]
  );
  const { getRootProps, getInputProps, open, isDragActive, isDragAccept } =
    useDropzone({
      noClick: true,
      onDrop: handleFileDrop,
      accept: {
        'application/yaml': ['.yaml'],
        'application/x-yaml': ['.yaml'],
        'text/yaml': ['.yaml'],
        'text/x-yaml': ['.yaml'],
      },
    });

  const handleImport = useCallback(() => {
    open();
  }, [open]);

  const handleExport = useCallback(() => {
    download();
  }, []);

  const { open: openConfirm, render: renderConfirm } = useConfirm();
  const handleClear = useCallback(() => {
    openConfirm({
      title: t('optionsClearConfirmTitle'),
      message: t('optionsClearConfirmMessage'),
      passphrase: 'clear',
    }).then(isConfirmed => {
      if (!isConfirmed) return;
      clear()
        .then(() => {
          openAlert({
            title: t('optionsClearSuccessTitle'),
            message: t('optionsClearSuccessMessage'),
          });
        })
        .catch(err => {
          openAlert({
            title: t('optionsClearErrorTitle'),
            message: err.message,
          });
        });
    });
  }, [openAlert, openConfirm]);

  return (
    <>
      <div className="container mx-auto py-12 max-w-[400px]">
        <Row
          className="mb-8"
          buttonSlot={
            <button
              className="btn btn-primary min-w-[120px]"
              onClick={handleExport}
            >
              {t('optionsExport')}
              <FontAwesomeIcon icon="fa-sharp fa-regular fa-file-export" />
            </button>
          }
          description={t('optionsExportDescription')}
        />
        <Row
          className={'mb-8'}
          buttonSlot={
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <button
                className={cn('btn min-w-[120px]', {
                  'btn-primary': !isDragActive || !isDragAccept,
                  'btn-success': isDragActive && isDragAccept,
                })}
                onClick={handleImport}
              >
                {t('optionsImport')}
                <FontAwesomeIcon icon="fa-sharp fa-regular fa-file-import" />
              </button>
            </div>
          }
          description={t('optionsImportDescription')}
        />
        <Row
          buttonSlot={
            <button
              className="btn btn-error min-w-[120px]"
              onClick={handleClear}
            >
              {t('optionsClear')}
              <FontAwesomeIcon icon="fa-sharp fa-regular fa-broom-wide" />
            </button>
          }
          description={t('optionsClearDescription')}
        />
      </div>
      {renderAlert()}
      {renderConfirm()}
    </>
  );
};

DataPage.propTypes = {};

export default DataPage;
