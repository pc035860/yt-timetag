import { useCallback } from 'react';
import cn from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Page from '../../components/Page';
import ShortcutInput from './ShortcutInput';

import useShortcutsSettings from './useShortcutsSettings';

import { ct } from '../../utils/i18n';

import { faCircleInfo } from '@awesome.me/kit-ea44dc83ec/icons/sharp/regular';

const CONFIG = [
  {
    sectionName: ct('optionsShortcutsDividerGeneral'),
    list: [
      {
        key: 'playPause',
        label: ct('optionsShortcutsKeyPlayPause'),
        readOnly: true,
      },
      {
        key: 'addTag',
        label: ct('optionsShortcutsKeyAddTag'),
        readOnly: false,
      },
      {
        key: 'clearActive',
        label: ct('optionsShortcutsKeyClearActive'),
        readOnly: true,
      },
    ],
  },
  {
    sectionName: ct('optionsShortcutsDividerTag'),
    list: [
      {
        key: 'focusDescription',
        label: ct('optionsShortcutsKeyFocusDescription'),
        readOnly: false,
      },
      {
        key: 'removeTag',
        label: ct('optionsShortcutsKeyRemoveTag'),
        readOnly: true,
      },
      {
        key: 'backward',
        label: ct('optionsShortcutsKeyBackward'),
        readOnly: true,
      },
      {
        key: 'backwardMinor',
        label: ct('optionsShortcutsKeyBackwardMinor'),
        readOnly: true,
      },
      {
        key: 'forward',
        label: ct('optionsShortcutsKeyForward'),
        readOnly: true,
      },
      {
        key: 'forwardMinor',
        label: ct('optionsShortcutsKeyForwardMinor'),
        readOnly: true,
      },
    ],
  },
];

const ShortcutsPage = () => {
  const {
    shortcuts,
    updateShortcut,
    resetShortcuts,
    isEnabled,
    toggleEnabled,
  } = useShortcutsSettings();

  const handleShortcutInputChange = useCallback(
    (shortcutKey, key) => {
      updateShortcut(shortcutKey, [key]);
    },
    [updateShortcut]
  );

  const handleEnabledChange = useCallback(() => {
    toggleEnabled();
  }, [toggleEnabled]);

  const handleReset = useCallback(() => {
    resetShortcuts();
  }, [resetShortcuts]);

  if (!shortcuts) {
    return null;
  }

  return (
    <Page className="max-w-[740px]">
      <div className="mb-8">
        <div className="form-control w-52 mx-auto mb-4">
          <label className="cursor-pointer label">
            <span className="label-text">{ct('optionsShortcutsEnable')}</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={isEnabled}
              onChange={handleEnabledChange}
            />
          </label>
        </div>
        <div className="alert max-w-[420px] mx-auto">
          <FontAwesomeIcon
            icon={faCircleInfo}
            className="shrink-0 text-info w-6 h-6 self-start"
          />
          <ul className="list-disc ml-6 text-sm">
            <li className="mb-1">{ct('optionsShortcutsNote1')}</li>
            <li className="">{ct('optionsShortcutsNote2')}</li>
          </ul>
        </div>
      </div>
      <div
        className={cn('transition-opacity duration-200', {
          'opacity-30 pointer-events-none': !isEnabled,
        })}
      >
        <div className="flex justify-between items-start mb-16">
          {CONFIG.map(({ sectionName, list }) => {
            return (
              <div key={sectionName}>
                <div className="divider mx-auto max-w-[200px]">
                  {sectionName}
                </div>
                <table className="table shortcuts-table">
                  <thead>
                    <tr>
                      <th>{ct('optionsShortcutsFieldAction')}</th>
                      <th className="w-[160px]">
                        {ct('optionsShortcutsFieldShortcut')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map(({ key, label, readOnly }) => {
                      return (
                        <tr key={key}>
                          <td className="text-right">{label}</td>
                          <td>
                            <ShortcutInput
                              shortcutKey={key}
                              shortcuts={shortcuts}
                              readOnly={readOnly}
                              onChange={handleShortcutInputChange}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <button type="button" className="btn" onClick={handleReset}>
            {ct('optionsShortcutsReset')}
          </button>
        </div>
      </div>
    </Page>
  );
};

ShortcutsPage.propTypes = {};

export default ShortcutsPage;
