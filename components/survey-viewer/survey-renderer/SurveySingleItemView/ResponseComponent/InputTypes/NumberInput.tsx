import React, { useState, useEffect } from 'react';
import { ResponseItem } from 'survey-engine/data_types';
import { CommonResponseComponentProps, getClassName, getInputMaxWidth, getLabelPlacementStyle, getLocaleStringTextByCode } from '../../utils';
import clsx from 'clsx';

interface NumberInputProps extends CommonResponseComponentProps {
  ignoreClassName?: boolean;
  nonFullWidth?: boolean;
  defaultClassName?: string;
  inputClassName?: string;
}

const NumberInput: React.FC<NumberInputProps> = (props) => {
  const [response, setResponse] = useState<ResponseItem | undefined>(props.prefill);
  const [touched, setTouched] = useState(false);

  const [inputValue, setInputValue] = useState<string>(
    props.prefill && props.prefill.value ? parseFloat(props.prefill.value).toString() : ''
  );

  useEffect(() => {
    if (touched) {
      const timer = setTimeout(() => {
        props.responseChanged(response);
      }, 200);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  useEffect(() => {
    let value = inputValue;

    if (props.compDef.properties?.min !== undefined) {
      const numVal = parseFloat(value);
      if (numVal < (props.compDef.properties?.min as number)) {
        value = "";
      }
    }
    if (props.compDef.properties?.max !== undefined) {
      const numVal = parseFloat(value);
      if (numVal > (props.compDef.properties?.max as number)) {
        value = "";
      }
    }

    setResponse(prev => {
      if (value.length < 1) {
        return undefined;
      }
      if (!prev) {
        return {
          key: props.compDef.key ? props.compDef.key : 'no key found',
          dtype: 'number',
          value: value
        }
      }
      return {
        ...prev,
        dtype: 'number',
        value: value
      }
    })
  }, [inputValue])


  const handleInputValueChange = (key: string | undefined) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!key) { return; }
    setTouched(true);

    let value = (event.target as HTMLInputElement).value;

    if (props.compDef.properties?.stepSize === 1.0) {
      const numVal = parseFloat(value);
      if (!isNaN(numVal) && !Number.isInteger(numVal)) {
        value = Math.round(numVal).toString();
      }
    }

    setInputValue(value);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!event || !event.currentTarget) { return; }
    (event.currentTarget as HTMLInputElement).select();
  };

  const minValue = props.compDef.properties?.min;
  const maxValue = props.compDef.properties?.max;
  const stepSize = props.compDef.properties?.stepSize;

  const content = props.compDef.content;
  const placeAfter = getLabelPlacementStyle(props.compDef.style) === 'after';
  const inputMaxWidth = getInputMaxWidth(props.compDef.style);
  const fullKey = [props.parentKey, props.compDef.key].join('.');

  const labelText = getLocaleStringTextByCode(content, props.languageCode);

  return <div
    className={clsx(
      props.defaultClassName,
      "flex items-center",
      {
        'w-full': !props.nonFullWidth,
      },
      props.ignoreClassName !== true ? getClassName(props.compDef.style) : undefined
    )}
  >
    {!placeAfter ? <label htmlFor={fullKey} className={clsx(
      "grow",
      {
        "me-2": labelText !== undefined && labelText.length > 0
      }
    )}
      style={{ maxWidth: 'fit-content' }}
    >
      {getLocaleStringTextByCode(content, props.languageCode)}
    </label> : null}

    <input
      style={{
        flexBasis: 0,
        minWidth: 60,
        maxWidth: inputMaxWidth,
      }}
      className={clsx("form-input border-none grow rounded focus:outline-none focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600/50", props.inputClassName)}
      type="number"
      autoComplete="off"
      inputMode='decimal'
      id={fullKey}
      placeholder={getLocaleStringTextByCode(props.compDef.description, props.languageCode)}
      value={inputValue}
      maxLength={30}
      onFocus={handleFocus}
      onClick={(e) => (e.target as HTMLInputElement).select()}
      onWheel={(e) => {
        e.currentTarget.blur()
      }}
      onChange={handleInputValueChange(props.compDef.key)}
      disabled={props.compDef.disabled !== undefined || props.disabled === true}
      min={minValue !== undefined ? minValue as number : undefined}
      max={maxValue !== undefined ? maxValue as number : undefined}
      step={stepSize ? stepSize as number : undefined}
    />

    {placeAfter ? <label htmlFor={fullKey} className="ms-1">
      {getLocaleStringTextByCode(content, props.languageCode)}
    </label> : null}
  </div>
};

export default NumberInput;
