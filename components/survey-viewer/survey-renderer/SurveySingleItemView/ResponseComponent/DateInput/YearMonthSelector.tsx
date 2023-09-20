import React, { useEffect, useState } from 'react';
import { getYear, format, eachMonthOfInterval, startOfYear, getMonth, endOfYear } from 'date-fns';


interface YearMonthSelectorProps {
  currentDate?: Date;
  onChange: (date?: Date) => void;
  minDate: Date;
  maxDate: Date;
  onlyYear?: boolean;
  languageCode: string;
  dateLocales?: Array<{ code: string, locale: any, format: string }>;
}


const YearMonthSelector: React.FC<YearMonthSelectorProps> = (props) => {
  const [selectedYear, setSelectedYear] = useState<number | undefined>(props.currentDate ? getYear(props.currentDate) : undefined);
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(props.currentDate ? getMonth(props.currentDate) : undefined);

  useEffect(() => {
    setSelectedYear(props.currentDate ? getYear(props.currentDate) : undefined);
    setSelectedMonth(props.currentDate ? getMonth(props.currentDate) : undefined);
  }, [props.currentDate]);

  useEffect(() => {
    if (!selectedYear) {
      props.onChange(undefined);
      return;
    }
    if (props.onlyYear) {
      props.onChange(new Date(selectedYear, 0, 2));
      return;
    }

    if (selectedMonth === undefined) {
      props.onChange(undefined);
      return;
    }
    props.onChange(new Date(selectedYear, selectedMonth, 2));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, selectedMonth]);

  const years = new Array<number>();
  for (let i = getYear(props.minDate); i <= getYear(props.maxDate); i++) {
    years.push(i);
  }
  years.reverse();

  const referenceYear = getYear(new Date());
  const months = eachMonthOfInterval({
    start: startOfYear(new Date(referenceYear, 0, 2)),
    end: endOfYear(new Date(referenceYear, 0, 2)),
  }).map(m => {
    return {
      label: format(m, 'MMMM', { locale: props.dateLocales?.find(l => l.code === props.languageCode)?.locale }),
      value: getMonth(m)
    }
  });

  const yearSelector = <select
    id='year-selector'
    className="form-select border-none rounded focus:outline-none focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600/50"
    value={selectedYear !== undefined && selectedYear.toString() !== 'NaN' ? selectedYear : 'NaN'}
    onChange={({ target: { value } }) => setSelectedYear(value && value !== '-1' ? parseInt(value) : undefined)}
    aria-label='year selector'
  >
    <option value={'NaN'}></option>
    {years.map(option => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>

  const monthSelector = <select
    id='month-selector'
    className="form-select border-none rounded focus:outline-none focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600/50"
    value={selectedMonth !== undefined ? selectedMonth : 'NaN'}
    aria-label='month selector'
    onChange={({ target: { value } }) => {
      if (value === 'NaN') {
        setSelectedYear(undefined);
        setSelectedMonth(undefined);
        return;
      }
      setSelectedMonth(parseInt(value));
    }}
  >
    <option value="NaN"></option>
    {
      months.map(option => (
        <option key={option.label} value={option.value}>
          {option.label}
        </option>
      ))
    }
  </select>;

  return (
    <div
      className="flex flex-col sm:flex-row gap-3"
    >
      <div className="">
        {yearSelector}
      </div>

      {selectedYear && !props.onlyYear ?
        <div className="">
          {monthSelector}
        </div> : null}
    </div>
  );
};

export default YearMonthSelector;
