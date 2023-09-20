import React, { useEffect, useState } from 'react';
import { ItemComponent, ItemGroupComponent, ResponseItem } from 'survey-engine/data_types';
import { CommonResponseComponentProps, getClassName, getLocaleStringTextByCode } from '../../utils';
import clsx from 'clsx';

interface LikertScaleProps extends CommonResponseComponentProps {

}


const LikertScale: React.FC<LikertScaleProps> = (props) => {
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

  const handleSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = (event.target as HTMLInputElement).value;
    setTouched(true);
    setResponse(prev => {
      if (!prev) {
        return {
          key: props.compDef.key ? props.compDef.key : 'no key found',
          items: [{ key: key }]
        }
      }

      return {
        ...prev,
        items: [{ key: key }]
      }
    });
  };

  const getSelectedKey = (): string | undefined => {
    if (!response || !response.items || response.items.length < 1) {
      return '';
    }
    return response.items[0].key;
  }

  const shouldStackOnSmallScreen = (): boolean => {
    const responseBehaviour = props.compDef.style?.find(s => s.key === 'responsive')
    return responseBehaviour?.value === 'stackOnSmallScreen';
  }

  const labelPlacementBefore = (): boolean => {
    const v = props.compDef.style?.find(s => s.key === 'labelPlacement')
    return v?.value === 'before';
  }

  const renderOption = (option: ItemComponent) => {
    const optionKey = props.parentKey + '.' + option.key;
    const isDisabled = option.disabled === true;
    const content = getLocaleStringTextByCode(option.content, props.languageCode);
    const className = getClassName(option.style);

    const radioBtn = (<div
      className={clsx(
        "text-center",
        {
          "d-inline-block d-sm-block ": shouldStackOnSmallScreen(),
        })}
    >
      <input
        className="form-check-input cursor-pointer"
        type="radio"
        name={props.parentKey}
        id={optionKey}
        value={option.key}
        checked={getSelectedKey() === option.key}
        disabled={isDisabled}
        onChange={handleSelectionChange}
      />
    </div>);

    const label = (<div className={clsx(
      {
        "text-center": !className && !shouldStackOnSmallScreen(),
        "d-inline-block d-sm-block ms-2 ms-sm-0 text-start text-sm-center": shouldStackOnSmallScreen()
      },
      "flex-grow-1",
      className
    )}>
      {content ? <label
        htmlFor={optionKey}
        className="w-100 cursor-pointer"
      >{content}</label> : null}
    </div>);

    return <div
      key={option.key}
      className={clsx(
        "flex-grow-1",
        {
          "d-flex d-sm-block mb-2 mb-sm-1 align-items-center": shouldStackOnSmallScreen(),
        })}
      style={{ flexBasis: 0 }}
    >
      {labelPlacementBefore() ? label : null}
      {radioBtn}
      {!labelPlacementBefore() ? label : null}
    </div>
  }

  return (
    <div
      id={props.parentKey}
      className={clsx(
        "d-flex",
        {
          "flex-column flex-sm-row": shouldStackOnSmallScreen()
        }
      )}
      aria-label="likert scale"
    >
      {
        (props.compDef as ItemGroupComponent).items.map((option, index) =>
          renderOption(option)
          // renderResponseOption(option, (props.compDef as ItemGroupComponent).items.length - 1 === index)
        )
      }
    </div>
  );
};

export default LikertScale;
