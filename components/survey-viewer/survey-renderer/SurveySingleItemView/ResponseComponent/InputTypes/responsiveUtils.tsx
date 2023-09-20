import clsx from "clsx";
import React from "react";
import { getClassName } from "../../utils";

const bootstrapBreakpoints = ['sm', 'md', 'lg', 'xl', 'xxl'];

interface BreakpointModeDef {
  start?: string;
  end?: string;
  variant: Variant;
}

export type Variant = BipolarLikertScaleVariant | SingleChoiceVariant;

type SingleChoiceVariant = 'vertical' | 'horizontal' | 'table';
type BipolarLikertScaleVariant = 'vertical' | 'withLabelRow' | 'table';

const getModeForBreakpont = (bp: string, styles?: Array<{ key: string, value: string }>): Variant | undefined => {
  if (!styles) { return undefined };
  const bpMode = styles.find(style => style.key === `${bp}Mode`);
  if (!bpMode) {
    return undefined;
  }
  return bpMode.value as Variant;
}

const getDefaultMode = (styles?: Array<{ key: string, value: string }>): Variant | undefined => {
  if (!styles) { return undefined };
  const bpMode = styles.find(style => style.key === 'defaultMode');
  if (!bpMode) {
    return 'vertical';
  }
  return bpMode.value as Variant;
}

export const getResponsiveModes = (renderMode: (variant: Variant, namePrefix: string) => React.ReactNode, styles?: Array<{ key: string, value: string }>) => {
  const breakpointModes: Array<BreakpointModeDef> = [];
  const defaultMode = getDefaultMode(styles);
  if (!defaultMode) {
    return <p>No default mode found.</p>
  }
  let currentMode: BreakpointModeDef = {
    variant: defaultMode
  };

  bootstrapBreakpoints.forEach(bp => {
    const mode = getModeForBreakpont(bp, styles);
    if (mode === undefined) {
      return;
    }
    currentMode.end = bp;
    breakpointModes.push(currentMode);
    currentMode = {
      start: bp,
      variant: mode,
    }
  });
  breakpointModes.push(currentMode);

  const className = getClassName(styles);

  return (
    <React.Fragment>
      {
        breakpointModes.map((bm, index) => <div
          key={index.toString()}
          className={clsx(
            'overflow-visible',
            {
              'd-none': bm.start !== undefined,
              [`d-${bm.start}-block`]: bm.start !== undefined,
              [`d-${bm.end}-none`]: bm.end !== undefined
            },
            className,
          )}
        >
          {renderMode(bm.variant, bm.start ? bm.start : 'default')}
        </div>)
      }
    </React.Fragment>
  )
}
