import React, { useState, useEffect } from 'react';
import { ItemComponent, ResponseItem } from 'survey-engine/data_types';
import { getLocaleStringTextByCode } from '../../utils';
import Slider from '../../../components/Slider';

interface SliderNumericProps {
  parentKey: string;
  compDef: ItemComponent;
  prefill?: ResponseItem;
  responseChanged: (response: ResponseItem | undefined) => void;
  languageCode: string;
}

const SliderNumeric: React.FC<SliderNumericProps> = (props) => {
  const [response, setResponse] = useState<ResponseItem | undefined>(props.prefill);
  const [touched, setTouched] = useState(false);

  const [inputValue, setInputValue] = useState<number>(
    props.prefill && props.prefill.value ? parseFloat(props.prefill.value) : 0
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

  const handleSliderChange = (key: string | undefined) => (value?: number) => {
    if (!key) { return; }
    setTouched(true);

    setInputValue(value as number);

    setResponse(prev => {
      if (value === undefined) {
        return undefined;
      }
      if (!prev) {
        return {
          key: props.compDef.key ? props.compDef.key : 'no key found',
          dtype: 'number',
          value: value.toString()
        }
      }
      return {
        ...prev,
        dtype: 'number',
        value: value.toString()
      }
    })
  };

  const fullKey = [props.parentKey, props.compDef.key].join('.');
  const noResponseText = getLocaleStringTextByCode(props.compDef.description, props.languageCode);

  return (
    <React.Fragment>
      {props.compDef.content ?
        <label htmlFor={fullKey} className="me-2">
          <span className='text-gray-600 text-sm'>
            {getLocaleStringTextByCode(props.compDef.content, props.languageCode)}
          </span>
          <span className="ms-2 text-lg font-bold text-primary-600">{response ? inputValue : noResponseText}</span>
        </label>
        : null}
      <div className="flex py-2">
        <div className="grow">
          <Slider
            id={fullKey}
            aria-labelledby={props.compDef.content ? "slider-numeric" : undefined}
            value={typeof inputValue === 'number' ? inputValue : 0}
            onChange={handleSliderChange(props.compDef.key)}
            min={props.compDef.properties?.min as number}
            max={props.compDef.properties?.max as number}
            step={props.compDef.properties?.stepSize as number}
          />
          <div className="flex px-1 font-bold text-lg">
            <span className="text-center">
              {props.compDef.properties?.min as number}
            </span>
            <span className='grow'></span>
            <span className="text-center">
              {props.compDef.properties?.max as number}
            </span>
          </div>
        </div>

      </div>
    </React.Fragment>
  );
};

export default SliderNumeric;
