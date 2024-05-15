import { useCallback, useEffect } from 'react';
import cn from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Row from './Row';
import Page from '../../components/Page';

import { useDropzone } from 'react-dropzone';
import useAlert from './useAlert.jsx';
import useConfirm from './useConfirm.jsx';

import { clear, download, downloadSync, upload } from './utils';
import { ct } from '../../utils/i18n';

import { LINK } from '../../constants';

import {
  faFileExport,
  faFileImport,
  faBroomWide,
} from '@awesome.me/kit-ea44dc83ec/icons/sharp/regular';

const DataPage = () => {
  const { open: openAlert, render: renderAlert } = useAlert();

  const handleFileDrop = useCallback(
    acceptedFiles => {
      const file = acceptedFiles[0];
      upload(file)
        .then(() => {
          openAlert({
            title: ct('optionsImportSuccessTitle'),
            message: ct('optionsImportSuccessMessage'),
          });
        })
        .catch(err => {
          openAlert({
            title: ct('optionsImportErrorTitle'),
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

  const handleExportSync = useCallback(() => {
    downloadSync();
  }, []);

  const { open: openConfirm, render: renderConfirm } = useConfirm();
  const handleClear = useCallback(() => {
    openConfirm({
      title: ct('optionsClearConfirmTitle'),
      message: ct('optionsClearConfirmMessage'),
      passphrase: 'clear',
    }).then(isConfirmed => {
      if (!isConfirmed) return;
      clear()
        .then(() => {
          openAlert({
            title: ct('optionsClearSuccessTitle'),
            message: ct('optionsClearSuccessMessage'),
          });
        })
        .catch(err => {
          openAlert({
            title: ct('optionsClearErrorTitle'),
            message: err.message,
          });
        });
    });
  }, [openAlert, openConfirm]);

  return (
    <>
      <Page className="max-w-[500px]">
        <Row
          className="mb-8"
          buttonSlot={
            <button
              className="btn btn-primary min-w-[120px]"
              onClick={handleExport}
            >
              {ct('optionsExport')}
              <FontAwesomeIcon icon={faFileExport} />
            </button>
          }
          description={
            <div>
              <div className="mb-1">{ct('optionsExportDescription')}</div>
              <div>
                {ct('optionsExportExplorer_prefix')}{' '}
                <a
                  href={LINK.EXPLORER}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-xs btn-info btn-outline"
                >
                  {ct('optionsExportExplorer')}
                </a>{' '}
                {ct('optionsExportExplorer_suffix')}
              </div>
            </div>
          }
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
                {ct('optionsImport')}
                <FontAwesomeIcon icon={faFileImport} />
              </button>
            </div>
          }
          description={ct('optionsImportDescription')}
        />
        <Row
          buttonSlot={
            <button
              className="btn btn-error min-w-[120px]"
              onClick={handleClear}
            >
              {ct('optionsClear')}
              <FontAwesomeIcon icon={faBroomWide} />
            </button>
          }
          description={ct('optionsClearDescription')}
        />
        <div className="divider my-8" />
        <Row
          buttonSlot={
            <button className="btn  min-w-[120px]" onClick={handleExportSync}>
              {ct('optionsExportSync')}
              <FontAwesomeIcon icon={faFileExport} />
            </button>
          }
          description={
            <>
              <div className="mb-1">{ct('optionsExportSyncDescription1')}</div>
              <div className="text-warning text-xs">
                {ct('optionsExportSyncDescription2')}
              </div>
            </>
          }
        />
      </Page>
      {renderAlert()}
      {renderConfirm()}
    </>
  );
};

DataPage.propTypes = {};

export default DataPage;
