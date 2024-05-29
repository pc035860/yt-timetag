import { useCallback, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import _ from 'lodash';

import { ct } from '../../utils/i18n';

const IS_MAC = navigator.userAgent.toLowerCase().indexOf('macintosh') >= 0;

const ARROW_MAP = {
  left: '←',
  up: '↑',
  right: '→',
  down: '↓',
};

const getIsValidInput = value => {
  if (!value) {
    return true;
  }
  return /[a-zA-B]{1}/.test(value);
};

const defaultOnChange = (shortcutKey, key) => null;
const ShortcutInput = ({
  shortcutKey,
  shortcuts,
  onChange = defaultOnChange,
  readOnly = false,
}) => {
  const value = shortcuts[shortcutKey];
  const [draftValue, setDraftValue] = useState(value[0]);

  const isValid = useMemo(() => {
    return getIsValidInput(draftValue);
  }, [draftValue]);
  const isInvalid = !isValid;

  const getIsDuplicated = useCallback(
    v => {
      const otherShortcuts = _.omit(shortcuts, shortcutKey);
      let hit = false;
      _.each(otherShortcuts, list => {
        _.each(list, key => {
          if (key && key === v) {
            hit = true;
          }
        });
      });
      return hit;
    },
    [shortcutKey, shortcuts]
  );

  const isDuplicated = useMemo(() => {
    return getIsDuplicated(draftValue);
  }, [draftValue, getIsDuplicated]);

  const displayValue = useMemo(() => {
    return value.map(shortcut =>
      shortcut
        .split('+')
        .map(v => {
          let buf = v;
          if (IS_MAC) {
            buf = buf.replace('alt', 'option');
          }
          return ARROW_MAP[buf] || buf;
        })
        .join(' + ')
    );
  }, [value]);

  const handleChange = useCallback(
    evt => {
      const newValue = evt.target.value;
      setDraftValue(newValue);

      if (getIsValidInput(newValue) && !getIsDuplicated(newValue)) {
        onChange(shortcutKey, newValue);
      }
    },
    [getIsDuplicated, onChange, shortcutKey]
  );

  /**
   * sync updated value from props
   */
  const v0 = value[0];
  useEffect(() => {
    if (v0 !== draftValue) {
      setDraftValue(v0);
    }
  }, [draftValue, v0]);

  return (
    <>
      {displayValue.map((v, i) => {
        return (
          <div
            key={i}
            className={cn({
              'mt-1': i > 0,
            })}
          >
            <input
              type="text"
              className={cn('input input-bordered w-full input-sm', {
                'input-error': (isInvalid || isDuplicated) && !readOnly,
              })}
              value={readOnly ? displayValue[i] : draftValue[0]}
              readOnly={readOnly}
              disabled={readOnly}
              onChange={handleChange}
              maxLength={1}
            />
          </div>
        );
      })}
      {(isInvalid || isDuplicated) && (
        <div className="label">
          <span className="label-text-alt text-error">
            {isInvalid && ct('optionsShortcutsErrorInvalid')}
            {isDuplicated && ct('optionsShortcutsErrorDuplicated')}
          </span>
        </div>
      )}
    </>
  );
};

ShortcutInput.propTypes = {
  shortcutKey: PropTypes.string.isRequired,
  shortcuts: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
};

export default ShortcutInput;
