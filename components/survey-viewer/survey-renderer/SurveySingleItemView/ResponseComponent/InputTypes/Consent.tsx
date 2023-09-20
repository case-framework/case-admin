import React, { useState, useEffect } from 'react';
import { ItemGroupComponent, ResponseItem } from 'survey-engine/data_types';
import { CommonResponseComponentProps, getClassName, getLocaleStringTextByCode } from '../../utils';
import clsx from 'clsx';
import { renderFormattedContent } from '../../renderUtils';
import ConsentDialog from '../../../components/ConsentDialog';


interface ConsentProps extends CommonResponseComponentProps {
}

const Consent: React.FC<ConsentProps> = (props) => {
  const [response, setResponse] = useState<ResponseItem | undefined>(props.prefill);
  const [touched, setTouched] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const checked = response?.items?.length === 1;

  useEffect(() => {
    if (touched) {
      const timer = setTimeout(() => {
        props.responseChanged(response);
      }, 200);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const setResponseForKey = (key: string | undefined) => (response: ResponseItem | undefined) => {
    if (!key || !props.compDef.key) { return; }
    setTouched(true);
    // console.log(response);

    if (!response) {
      setResponse({ key: props.compDef.key, items: [] });
    } else {
      setResponse({ key: props.compDef.key, items: [{ ...response }] });
    }
  }

  const accept = () => {
    setDialogOpen(false);
    if (!props.compDef.key) { return; }
    setTouched(true);
    setResponse({ key: props.compDef.key, items: [{ key: 'consent' }] })
  }

  const reject = () => {
    setDialogOpen(false);
    setTouched(true);
    setResponse(undefined);
  }


  const optionKey = props.parentKey + '.' + props.compDef.key;

  const items = (props.compDef as ItemGroupComponent).items;
  if (!items) {
    return <span>Items not found</span>
  }
  const labelComp = items.find(item => item.role === 'label');
  const contentComp = items.find(item => item.role === 'content')
  const dialogTitle = getLocaleStringTextByCode(items.find(item => item.role === 'title')?.content, props.languageCode)
  const dialogAcceptBtn = getLocaleStringTextByCode(items.find(item => item.role === 'acceptBtn')?.content, props.languageCode)
  const dialogRejectBtn = getLocaleStringTextByCode(items.find(item => item.role === 'rejectBtn')?.content, props.languageCode)

  if (labelComp === undefined || contentComp === undefined) {
    return <span>Items not found</span>
  }

  return (
    <React.Fragment>
      <div
        className={clsx('d-flex', getClassName(props.compDef.style))}
        onClick={() => {
          setDialogOpen(true);
        }}
      >
        <input
          className="form-check-input cursor-pointer me-2"
          type="checkbox"
          name={props.parentKey}
          id={props.parentKey}
          checked={checked}
          onChange={(event) => { }}
        />

        <label htmlFor={optionKey}
          className="flex-grow-1 cursor-pointer"
        >
          {renderFormattedContent(labelComp, props.languageCode, 'cursor-pointer', props.dateLocales)}
        </label>

      </div>
      <ConsentDialog
        open={dialogOpen}
        acceptBtn={dialogAcceptBtn ? dialogAcceptBtn : 'Accept'}
        cancelBtn={dialogRejectBtn ? dialogRejectBtn : 'Reject'}
        title={dialogTitle ? dialogTitle : 'Consent'}
        content={getLocaleStringTextByCode(contentComp.content, props.languageCode)}
        onConfirmed={() => accept()}
        onCancelled={() => reject()}
      />
    </React.Fragment>
  );
};

export default Consent;
