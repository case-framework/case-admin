import React from 'react';
import { ItemComponent } from 'survey-engine/data_types';
import { getClassName, getLocaleStringTextByCode } from '../utils';
import clsx from 'clsx';

interface WarningComponentProps {
  compDef: ItemComponent;
  languageCode: string;
}

const WarningComponent: React.FC<WarningComponentProps> = (props) => {
  return (
    <p
      className={
        clsx(
          "m-0 mt-3",
          "font-bold text-orange-500",
          getClassName(props.compDef.style),
        )
      }>
      {getLocaleStringTextByCode(props.compDef.content, props.languageCode)}
    </p>
  );
};

export default WarningComponent;
