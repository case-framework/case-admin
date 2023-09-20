import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { isItemGroupComponent, ItemComponent, ItemGroupComponent, ResponseItem } from 'survey-engine/data_types';
import { renderFormattedContent } from '../../renderUtils';
import { CommonResponseComponentProps, getClassName } from '../../utils';
import { getResponsiveModes, Variant } from './responsiveUtils';

interface ResponsiveSingleChoiceArrayProps extends CommonResponseComponentProps {

}

interface VerticalModeOptionProps {
  slotFullKey: string;
  optionKey?: string;
  className?: string;
  optionDef: ItemComponent;
  isLast: boolean;
  isChecked: boolean;
  languageCode: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  dateLocales: Array<{ code: string, locale: any, format: string }>
}

const VerticalModeOption: React.FC<VerticalModeOptionProps> = (props) => {
  const optionFullKey = props.slotFullKey + '.' + props.optionKey;
  return <div className={clsx(
    "form-check d-flex align-items-center",
    {
      'mb-2': !props.isLast,
    },
    props.className,
  )}
    key={optionFullKey} >
    <div>
      <input
        className="form-check-input cursor-pointer"
        type="radio"
        name={props.slotFullKey}
        id={optionFullKey}
        value={props.optionKey}
        onChange={props.onChange}
        checked={props.isChecked}
      />
    </div>
    <label className="form-check-label cursor-pointer flex-grow-1" htmlFor={optionFullKey}>
      {renderFormattedContent(props.optionDef, props.languageCode, 'cursor-pointer', props.dateLocales)}
    </label>
  </div>
}


const ResponsiveSingleChoiceArray: React.FC<ResponsiveSingleChoiceArrayProps> = (props) => {
  const [response, setResponse] = useState<ResponseItem | undefined>(props.prefill);
  const [touched, setTouched] = useState(false);

  const [options, setOptions] = useState<ItemGroupComponent | undefined>();


  useEffect(() => {
    if (!isItemGroupComponent(props.compDef)) {
      console.warn('ResponsiveSingleChoiceArray: no components found.');
      return;
    }
    const options = props.compDef.items.find(item => item.role === 'options');

    if (options === undefined || !isItemGroupComponent(options)) {
      console.warn('ResponsiveSingleChoiceArray: no options found.');
      return;
    }
    setOptions(options);
  }, [props.compDef]);

  useEffect(() => {
    if (touched) {
      const timer = setTimeout(() => {
        props.responseChanged(response);
      }, 200);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);


  const radioSelectionChanged = (rowKey: string | undefined) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!rowKey) { return; }
    const selectedValue = event.target.value;

    setTouched(true);
    setResponse(prev => {
      if (!prev || !prev.items) {
        return {
          key: props.compDef.key ? props.compDef.key : 'no key found',
          items: [{
            key: rowKey, items: [{ key: selectedValue }]
          }]
        }
      }

      const rowIndex = prev.items.findIndex(item => item.key === rowKey);
      const items = [...prev.items];
      if (rowIndex > -1) {
        items[rowIndex].items = [{ key: selectedValue }];
      } else {
        items.push({
          key: rowKey, items: [{ key: selectedValue }]
        });
      }

      return {
        ...prev,
        items: items
      }
    });
  }


  const isResponseSet = (rowKey: string | undefined, itemKey: string | undefined): boolean => {
    if (!rowKey || !itemKey) { return false; }

    if (!response || !response.items || response.items.length < 1) {
      return false;
    }
    const rowResponse = response.items.find(item => item.key === rowKey);
    if (!rowResponse || !rowResponse.items || rowResponse.items.length < 1) { return false; }
    const resp = rowResponse.items.find(item => item.key === itemKey);
    return resp !== undefined;
  }

  const renderVerticalMode = (namePrefix: string) => {
    if (!isItemGroupComponent(props.compDef)) {
      return <p>Empty</p>;
    }

    if (!options) {
      return <p>No options found.</p>;
    }

    const reverseOrder = props.compDef.style?.find(s => s.key === 'verticalModeReverseOrder')?.value === 'true';

    const rows = props.compDef.items;

    return <React.Fragment>
      {rows.map((item, index) => {
        if (item.displayCondition === false) {
          return null;
        }
        switch (item.role) {
          case 'row':
            const rowKey = namePrefix + '_' + props.compDef.key + '.' + item.key;
            const htmlKey = `${props.parentKey}.${item.key}-vertical`;
            const sortedOptions = reverseOrder ? options.items.slice().reverse() : options.items;
            const rowClassName = item.style?.find(s => s.key === 'verticalModeClassName')?.value;
            return <div key={item.key}
              className={clsx(
                { 'mb-2 pb-2': index !== rows.length - 1 },
                rowClassName,
              )}
            >
              <h6
                id={rowKey + 'label'}
                className={clsx(
                  'fw-bold'
                )}
              >
                {renderFormattedContent(item, props.languageCode, undefined, props.dateLocales)}
              </h6>
              <fieldset
                id={props.compDef.key + '.' + item.key}
                name={htmlKey}
                aria-describedby={rowKey + 'label'}
              >
                {sortedOptions.map((option, index) => {
                  const optionClassName = getClassName(option.style);

                  return <VerticalModeOption
                    key={option.key}
                    slotFullKey={htmlKey}
                    optionKey={option.key}
                    optionDef={option}
                    className={optionClassName}
                    isLast={index === options.items.length - 1}
                    isChecked={isResponseSet(item.key, option.key)}
                    languageCode={props.languageCode}
                    onChange={radioSelectionChanged(item.key)}
                    dateLocales={props.dateLocales}
                  />
                })}
              </fieldset>
            </div>;
          case 'options':
            return undefined;
          default:
            return <p>Unknown item role: {item.role}</p>
        }
      })}
    </React.Fragment>
  }

  const renderHorizontalRow = (rowDef: ItemComponent, options: ItemGroupComponent, isLast: boolean, namePrefix: string) => {
    const rowKey = rowDef.key;

    const labelOnTop = rowDef.style?.find(s => s.key === 'horizontalModeLabelPlacement')?.value === 'top';
    const hideLabel = rowDef.style?.find(s => s.key === 'horizontalModeLabelPlacement')?.value === 'none';
    const rowClassName = rowDef.style?.find(s => s.key === 'horizontalModeClassName')?.value;
    const htmlKey = `${namePrefix}_${props.parentKey}.${rowKey}-horizontal`;
    const htmlLabelKey = `${htmlKey}-label`;

    return <div
      key={rowKey}
      className={clsx(
        { 'mb-2 pb-2': !isLast },
        rowClassName,
      )}
    >
      <h6 id={htmlLabelKey}

        className={clsx(
          'fw-bold'
        )}
      >
        {renderFormattedContent(rowDef, props.languageCode, undefined, props.dateLocales)}
      </h6>
      <fieldset
        id={htmlKey}
        name={htmlKey}
        className={clsx(
          "d-flex",
        )}
        aria-describedby={htmlLabelKey}
      >
        {
          options.items.map(
            option => {
              const optionKey = option.key;
              const htmlKeyForOption = htmlKey + optionKey;
              const radioBtn = (<div
                className={clsx(
                  "text-center",
                )}
              >
                <input
                  className="form-check-input cursor-pointer"
                  type="radio"
                  name={htmlKey}
                  id={htmlKeyForOption}
                  onChange={radioSelectionChanged(rowKey)}
                  value={option.key}
                  checked={isResponseSet(rowKey, option.key)}
                />
              </div>);

              const optionLabelClassName = getClassName(option.style)

              const label = hideLabel ? null : (<div className={clsx(
                {
                  "text-center": !optionLabelClassName,
                },
                optionLabelClassName
              )}>
                <label htmlFor={htmlKeyForOption} >
                  {renderFormattedContent(option, props.languageCode, 'cursor-pointer', props.dateLocales)}
                </label>
              </div>);

              return <div
                key={option.key}
                className={clsx(
                  "flex-grow-1",
                )}
                style={{ flexBasis: 0 }}
              >
                {labelOnTop ? label : null}
                {radioBtn}
                {!labelOnTop ? label : null}
              </div>
            }
          )
        }
      </fieldset>
    </div>
  }

  const renderHorizontalMode = (namePrefix: string) => {
    if (!isItemGroupComponent(props.compDef)) {
      return <p>Empty</p>;
    }

    if (!options) {
      return <p>No options found.</p>;
    }

    const rows = props.compDef.items;

    return <React.Fragment>
      {rows.map((item, index) => {
        if (item.displayCondition === false) {
          return null;
        }
        switch (item.role) {
          case 'row':
            return renderHorizontalRow(item, options, index === rows.length - 1, namePrefix);
          case 'options':
            return undefined;
          default:
            return <p>Unknown item role: {item.role}</p>
        }
      })}
    </React.Fragment>
  }

  const renderTableMode = (namePrefix: string) => {
    if (!isItemGroupComponent(props.compDef)) {
      return <p>Empty</p>;
    }

    if (!options) {
      return <p>No options found.</p>;
    }

    const useFixedLayout = props.compDef.style?.find(st => st.key === 'tableModeLayout')?.value === 'fixed';
    const useFirstColWidth = props.compDef.style?.find(st => st.key === 'tableModeFirstColWidth')?.value;
    const tableClassName = props.compDef.style?.find(st => st.key === 'tableModeClassName')?.value;
    const tableOptionsClassName = options.style?.find(st => st.key === 'tableModeClassName')?.value;

    return <table className={clsx(
      "table m-0",
      tableClassName
    )}
      style={useFixedLayout ? {
        tableLayout: 'fixed',
      } : undefined}
    >
      <thead>
        <tr className={tableOptionsClassName}>
          <th scope="col" style={useFirstColWidth ? {
            width: useFirstColWidth
          } : undefined}></th>

          {options.items.map(item => <th
            key={props.compDef + '.' + item.key}
            scope="col"
            className="text-center"
          >
            {renderFormattedContent(item, props.languageCode, 'cursor-pointer', props.dateLocales)}
          </th>)}

        </tr>
      </thead>
      <tbody>
        {props.compDef.items.map(item => {
          let rowContent = <td colSpan={options.items.length + 1}>Unknown row type: {item.role}</td>;
          if (item.displayCondition === false) {
            return null;
          }
          switch (item.role) {
            case 'row':
              const htmlKey = `${namePrefix}.${props.parentKey}.${item.key}-table`;
              rowContent = <React.Fragment>
                <th scope="row">
                  {renderFormattedContent(item, props.languageCode, undefined, props.dateLocales)}
                </th>
                {options.items.map(oi => <td
                  key={props.compDef + '.' + oi.key}
                  className="text-center align-middle"
                >
                  <input
                    className="form-check-input cursor-pointer"
                    type="radio"
                    name={htmlKey}
                    onChange={radioSelectionChanged(item.key)}
                    value={oi.key}
                    checked={isResponseSet(item.key, oi.key)}
                  />
                </td>)}
              </React.Fragment>
              break;
            case 'options':
              return undefined;
            default:
              break;
          }
          const rowClassName = item.style?.find(st => st.key === 'tableModeClassName')?.value;
          return <tr key={props.compDef + '.' + item.key}
            className={rowClassName}
          >
            {rowContent}
          </tr>
        })}
      </tbody>
    </table>
  }

  const renderMode = (mode: Variant, namePrefix: string) => {
    switch (mode) {
      case 'vertical':
        return renderVerticalMode(namePrefix);
      case 'horizontal':
        return renderHorizontalMode(namePrefix);
      case 'table':
        return renderTableMode(namePrefix);
      default:
        return <p>unknown mode: {mode}</p>
    }
  }


  return (
    <React.Fragment>
      {getResponsiveModes(renderMode, props.compDef.style)}
    </React.Fragment>
  );
};

export default ResponsiveSingleChoiceArray;
