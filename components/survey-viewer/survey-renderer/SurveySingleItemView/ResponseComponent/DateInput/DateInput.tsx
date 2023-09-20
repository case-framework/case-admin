import React, { useState, useEffect, useRef } from 'react';
import { ResponseItem } from 'survey-engine/data_types';
// import DatePicker, { registerLocale } from "react-datepicker";
import { CommonResponseComponentProps, getClassName, getLocaleStringTextByCode } from '../../utils';
import { format, getYear, getMonth } from 'date-fns';
import { addYears, getUnixTime, eachMonthOfInterval, startOfYear, endOfYear } from 'date-fns';
import YearMonthSelector from './YearMonthSelector';
import clsx from 'clsx';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { ArrowRightIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import NotImplemented from '@/components/NotImplemented';


interface DateInputProps extends CommonResponseComponentProps {
    openCalendar: boolean | undefined;
    defaultClassName?: string;
}

const DateInput: React.FC<DateInputProps> = (props) => {
    const [response, setResponse] = useState<ResponseItem | undefined>(props.prefill);
    const [touched, setTouched] = useState(false);
    // const datePickerRef = useRef<DatePicker>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        props.prefill && props.prefill.value ? new Date(parseInt(props.prefill.value) * 1000) : undefined,
    );

    useEffect(() => {
        props.dateLocales?.forEach(loc => {
            // registerLocale(loc.code, loc.locale);
        })
    }, [props.dateLocales]);

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
        if (props.openCalendar) {
            // datePickerRef.current?.setOpen(true)
        }
    }, [props.openCalendar]);

    const handleDateChange = (date: Date | undefined) => {
        setTouched(true);

        setSelectedDate(date);
        if (!date) {
            setResponse(undefined);
            return;
        }

        setResponse(prev => {
            if (!date) { return undefined; }
            if (!prev) {
                return {
                    key: props.compDef.key ? props.compDef.key : 'no key found',
                    dtype: 'date',
                    value: getUnixTime(date).toString(),
                }
            }
            return {
                ...prev,
                dtype: 'date',
                value: getUnixTime(date).toString(),
            }
        });
    }

    const minDate = props.compDef.properties?.min ? new Date((props.compDef.properties?.min as number) * 1000) : new Date(1900, 1);
    const maxDate = props.compDef.properties?.max ? new Date((props.compDef.properties?.max as number) * 1000) : addYears(new Date(), 100);

    const DatepickerContainer = ({ className, children }: any) => {
        return (
            <div className="shadow bg-white">
                <div className="react-datepicker__triangle"></div>
                <span className={className} >{children}</span>
            </div>
        )
    }

    const DatepickerHeader = ({ date, decreaseMonth, increaseMonth, changeYear, changeMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }: any) => {
        const years = new Array<number>();
        for (let i = getYear(minDate); i <= getYear(maxDate); i++) {
            years.push(i);
        }
        years.reverse();

        const referenceYear = getYear(new Date());
        const months = eachMonthOfInterval({
            start: startOfYear(new Date(referenceYear, 0, 2)),
            end: endOfYear(new Date(referenceYear, 0, 2)),
        }).map(m => {
            return format(m, 'MMM', { locale: props.dateLocales?.find(l => l.code === props.languageCode)?.locale })
        });

        return (
            <div className="my-1 flex justify-between items-center">
                <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="datepicker-arrow-btn p-0 ms-3 ">
                    <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <select
                    className='form-select rounded text-black'
                    value={getYear(date)}
                    onChange={({ target: { value } }) => changeYear(value)}
                    style={{ minWidth: 95 }}
                >
                    {years.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

                <select
                    className='form-select rounded text-black ms-1'
                    value={months[getMonth(date)]}
                    onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
                >
                    {months.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

                <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="datepicker-arrow-btn p-0 me-3">
                    <ArrowRightIcon className='w-5 h-5' />
                </button>
            </div>
        )
    }

    let datepicker = <p>{'...'}</p>;
    switch (props.compDef.properties?.dateInputMode) {
        case 'YM':
            datepicker = <YearMonthSelector
                currentDate={selectedDate}
                minDate={minDate}
                maxDate={maxDate}
                onChange={handleDateChange}
                languageCode={props.languageCode}
                dateLocales={props.dateLocales}
            />
            break;
        case 'Y':
            datepicker = <YearMonthSelector
                currentDate={selectedDate}
                minDate={minDate}
                maxDate={maxDate}
                onlyYear={true}
                onChange={handleDateChange}
                languageCode={props.languageCode}
                dateLocales={props.dateLocales}
            />
            break;
        default:
            datepicker = <div
                ref={wrapperRef}
                tabIndex={0}
                className="border-0 bg-white p-0 flex flex-row items-center rounded focus:outline-none focus:ring-2 focus:ring-primary-600/60"
            // onClick={() => datePickerRef.current?.setOpen(true)}
            >
                <NotImplemented>
                    date picker for preview
                </NotImplemented>
                {/*}
        <DatePicker
          id={props.parentKey}
          ref={datePickerRef}
          className="form-control border-0 shadow-none p-2 rounded focus:ring-0 focus:outline-none"
          selected={selectedDate}
          locale={props.languageCode}
          onChange={(date) => handleDateChange(date ? date as Date : undefined)}
          dateFormat={props.dateLocales?.find(loc => loc.code === props.languageCode)?.format}
          placeholderText={getLocaleStringTextByCode(props.compDef.description, props.languageCode)}
          minDate={props.compDef.properties?.min ? new Date((props.compDef.properties?.min as number) * 1000) : undefined}
          maxDate={props.compDef.properties?.max ? new Date((props.compDef.properties?.max as number) * 1000) : undefined}
          onCalendarOpen={() => wrapperRef.current?.focus()}
          autoComplete="off"
          disabled={props.compDef.disabled !== undefined || props.disabled === true}
          popperPlacement="top"
          disabledKeyboardNavigation
          calendarContainer={DatepickerContainer}
          renderCustomHeader={DatepickerHeader}
        />
  <CalendarDaysIcon className="m-1 hidden sm:inline-block w-5 h-5" />*/}
            </div>
            break;
    }

    return (
        <div className={clsx(
            props.defaultClassName,
            "flex items-center",
            getClassName(props.compDef.style)
        )}>
            {props.compDef.content ?
                <label className="me-1"
                    htmlFor={props.parentKey}
                >
                    {getLocaleStringTextByCode(props.compDef.content, props.languageCode)}
                </label>
                : null}
            {datepicker}
        </div >
    );
};

export default DateInput;
