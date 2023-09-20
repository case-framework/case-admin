import clsx from 'clsx';
import React, { useState, useEffect } from 'react';
import { ResponseItem, ItemGroupComponent } from 'survey-engine/data_types';
import { CommonResponseComponentProps, getLocaleStringTextByCode } from '../../utils';


interface DropDownGroupProps extends CommonResponseComponentProps {
  fullWidth?: boolean;
  defaultClassName?: string;
}


const DropDownGroup: React.FC<DropDownGroupProps> = (props) => {
  const [response, setResponse] = useState<ResponseItem | undefined>(props.prefill);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched) {
      const timer = setTimeout(() => {
        props.responseChanged(response);
      }, 200);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const getSelectedKey = (): string | undefined => {
    if (!response || !response.items || response.items.length < 1) {
      return '';
    }
    return response.items[0].key;
  }

  const handleSelectionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTouched(true);
    const key = (event.target as HTMLInputElement).value as string;
    setResponse(prev => {
      if (!key || key === '') {
        return undefined;
      }
      if (!prev) {
        return {
          key: props.compDef.key ? props.compDef.key : 'no key found',
          items: [{ key: key }]
        }
      }
      return {
        ...prev,
        items: [
          { key }
        ]
      }
    });
  };

  const renderedInput = <select
    id={props.parentKey}
    className="form-select border-none grow rounded focus:outline-none focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600/50"
    aria-label="Select"
    value={getSelectedKey()}
    onChange={handleSelectionChange}
  >
    <option aria-label="None" value="">{getLocaleStringTextByCode(props.compDef.description, props.languageCode)}</option>
    {
      (props.compDef as ItemGroupComponent).items.map(
        item => {
          if (item.displayCondition) {
            return null;
          }
          return <option
            value={item.key}
            key={item.key}>
            {getLocaleStringTextByCode(item.content, props.languageCode)}
          </option>
        }
      )
    }
  </select>;

  return (
    <div className={clsx(
      props.defaultClassName,
      "flex items-center my-2")}>
      {props.compDef.content ?
        <label
          htmlFor={props.parentKey}
          className="m-0 me-2 shrink" style={{ minWidth: 80 }}>
          {getLocaleStringTextByCode(props.compDef.content, props.languageCode)}
        </label>
        : null}
      {renderedInput}
    </div>
  );
};

export default DropDownGroup;
