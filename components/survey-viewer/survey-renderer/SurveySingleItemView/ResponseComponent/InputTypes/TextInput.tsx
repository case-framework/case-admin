import React, { useState, useEffect } from 'react';
import { ResponseItem } from 'survey-engine/data_types';
import { CommonResponseComponentProps, getClassName, getInputMaxWidth, getLocaleStringTextByCode, getStyleValueByKey } from '../../utils';
import clsx from 'clsx';

interface TextInputProps extends CommonResponseComponentProps {
  updateDelay?: number;
  onClick?: () => void;
  nonFullWidth?: boolean;
  defaultClassName?: string;
  inputClassName?: string;
}

const TextInput: React.FC<TextInputProps> = (props) => {
  const [response, setResponse] = useState<ResponseItem | undefined>(props.prefill);
  const [touched, setTouched] = useState(false);

  const [inputValue, setInputValue] = useState<string>(
    props.prefill && props.prefill.value ? props.prefill.value : ''
  );

  useEffect(() => {
    if (touched) {
      const timer = setTimeout(() => {
        props.responseChanged(response);
      }, props.updateDelay !== undefined ? props.updateDelay : 200);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);


  const transformCase = getStyleValueByKey(props.compDef.style, 'transformCase');

  const handleInputValueChange = (key: string | undefined) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!key) { return; }
    setTouched(true);

    let value = (event.target as HTMLInputElement).value;

    if (transformCase === 'upper') {
      value = value.toUpperCase();
    } else if (transformCase === 'lower') {
      value = value.toLowerCase();
    }

    setInputValue(value);

    value = value.trim();
    setResponse(prev => {
      if (value.length < 1) {
        return undefined;
      }
      if (!prev) {
        return {
          key: props.compDef.key ? props.compDef.key : 'no key found',
          value: value
        }
      }
      return {
        ...prev,
        value: value
      }
    })
  };

  const labelText = getLocaleStringTextByCode(props.compDef.content, props.languageCode);
  const inputMaxWidth = getInputMaxWidth(props.compDef.style);
  const maxLengthValue = getStyleValueByKey(props.compDef.style, 'maxLength');

  const fullKey = [props.parentKey, props.compDef.key].join('.');
  return (
    <div
      className={clsx(
        props.defaultClassName,
        "flex items-center flex-wrap",
        {
          'w-full': !props.nonFullWidth,
        },
        getClassName(props.compDef.style),
      )}
      onClick={props.onClick}
    >
      <label htmlFor={fullKey} className={clsx("grow",
        {
          "me-2": labelText !== undefined && labelText.length > 0
        }
      )}
        style={{ maxWidth: 'fit-content' }}
      >
        {getLocaleStringTextByCode(props.compDef.content, props.languageCode)}
      </label>
      <input
        className={clsx("form-input border-0 grow rounded focus:outline-none focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600/50", props.inputClassName)}
        style={{
          flexBasis: 0,
          minWidth: 40,
          maxWidth: inputMaxWidth,
        }}
        autoComplete="off"
        id={fullKey}
        placeholder={getLocaleStringTextByCode(props.compDef.description, props.languageCode)}
        value={inputValue}
        maxLength={maxLengthValue ? parseInt(maxLengthValue) : 4000}
        onChange={handleInputValueChange(props.compDef.key)}
        disabled={props.compDef.disabled === true || props.disabled === true}
      />
    </div>
  );
};

export default TextInput;
