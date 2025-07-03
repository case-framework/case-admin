import { cn } from '@/lib/utils';
import React from 'react';
import { ColorVariant, IconVariant } from '../utils';
import { Ampersands, BadgeCheck, Blocks, BookCheck, Box, Braces, Brackets, Calendar, CalendarClock, CalendarDays, CalendarRange, CalendarX2, CircleSlash2, ClipboardCheck, Code, CopyCheck, CopyPlus, CopyX, CornerDownRight, Database, Diamond, Equal, ExternalLink, FormInput, FunctionSquare, LayoutList, Link, Link2, Link2Off, ListX, Mail, PackageCheck, Parentheses, Play, Plus, Pyramid, RefreshCcw, Regex, Signpost, Split, Square, SquareCode, Tag, Tags, Tally2, Tally5, Terminal, TextCursor, Trash2, Triangle, UserCheck, Variable, FilePlus2, FileX, FilePen, FileKey, ListChecks, ListTodo, ListCheck, Sigma, Minus, Clock4, Dice6, KeyRound, ListPlus, CircleQuestionMark, MailQuestionMark, AppWindow, Package, PackageSearch, SendHorizonal, PackageOpen } from 'lucide-react';

interface ExpressionIconProps {
    icon?: IconVariant;
    color?: ColorVariant;
}


const getIconNode = (icon?: IconVariant) => {
    switch (icon) {
        case 'braces':
            return <Braces />;
        case 'function':
            return <FunctionSquare />;
        case 'code':
            return <Code />;
        case 'variable':
            return <Variable />;
        case 'brackets':
            return <Brackets />;
        case 'regex':
            return <Regex />;
        case 'square-code':
            return <SquareCode />;
        case 'terminal':
            return <Terminal />;
        case 'signpost':
            return <Signpost />;
        case 'layout-list':
            return <LayoutList />;
        case 'tag':
            return <Tag />;
        case 'tags':
            return <Tags />;
        case 'text-cursor':
            return <TextCursor />;
        case 'calendar':
            return <Calendar />;
        case 'form-input':
            return <FormInput />;
        case 'parentheses':
            return <Parentheses />;
        case 'pyramid':
            return <Pyramid />;
        case 'triangle':
            return <Triangle />;
        case 'square':
            return <Square />;
        case 'diamond':
            return <Diamond />;
        case 'database':
            return <Database />;
        case 'split':
            return <Split />;
        case 'circle-slash':
            return <CircleSlash2 />;
        case 'blocks':
            return <Blocks />;
        case 'ampersands':
            return <Ampersands />;
        case 'tally':
            return <Tally2 />;
        case 'clipboard-check':
            return <ClipboardCheck />;
        case 'user-check':
            return <UserCheck />;
        case 'badge-check':
            return <BadgeCheck />;
        case 'package-check':
            return <PackageCheck />;
        case 'copy-check':
            return <CopyCheck />;
        case 'copy-x':
            return <CopyX />;
        case 'copy-plus':
            return <CopyPlus />;
        case 'list-check':
            return <ListCheck />;
        case 'less-than':
            return <LessThanIcon />;
        case 'less-than-or-equal':
            return <LessThanOrEqualIcon />;
        case 'greater-than':
            return <GreaterThanIcon />;
        case 'greater-than-or-equal':
            return <GreaterThanOrEqualIcon />;
        case 'equal':
            return <Equal />;
        case 'sigma':
            return <Sigma />;
        case 'dice':
            return <Dice6 />;
        case 'minus':
            return <Minus />;
        case 'corner-down-right':
            return <CornerDownRight />;
        case 'tally-5':
            return <Tally5 />;
        case 'calendar-days':
            return <CalendarDays />;
        case 'calendar-range':
            return <CalendarRange />;
        case 'refresh-ccw':
            return <RefreshCcw />;
        case 'book-check':
            return <BookCheck />;
        case 'play':
            return <Play />;
        case 'list-x':
            return <ListX />;
        case 'list-checks':
            return <ListChecks />;
        case 'list-todo':
            return <ListTodo />;
        case 'list-plus':
            return <ListPlus />;
        case 'mail':
            return <Mail />;
        case 'plus':
            return <Plus />;
        case 'trash':
            return <Trash2 />;
        case 'calendar-clock':
            return <CalendarClock />;
        case 'calendar-x-2':
            return <CalendarX2 />;
        case 'link-2':
            return <Link2 />;
        case 'link-2-off':
            return <Link2Off />;
        case 'link':
            return <Link />;
        case 'external-link':
            return <ExternalLink />;
        case 'file-plus':
            return <FilePlus2 />;
        case 'file-x':
            return <FileX />;
        case 'file-pen':
            return <FilePen />;
        case 'file-key':
            return <FileKey />;
        case 'clock':
            return <Clock4 />;
        case 'key-round':
            return <KeyRound />;
        case 'circle-question-mark':
            return <CircleQuestionMark />;
        case 'mail-question-mark':
            return <MailQuestionMark />;
        case 'send-horizontal':
            return <SendHorizonal />;
        case 'app-window':
            return <AppWindow />;
        case 'package':
            return <Package />;
        case 'package-search':
            return <PackageSearch />;
        case 'package-open':
            return <PackageOpen />;
        case 'box':
        default:
            return <Box />;
    }
}


const ExpressionIcon: React.FC<ExpressionIconProps> = (props) => {
    return (
        <span className={cn(
            {
                'text-orange-600': props.color === 'orange',
                'text-blue-600': props.color === 'blue',
                'text-green-700': props.color === 'green',
                'text-yellow-700': props.color === 'yellow',
                'text-purple-700': props.color === 'purple',
                'text-teal-700': props.color === 'teal',
                'text-cyan-800': props.color === 'cyan',
                'text-lime-700': props.color === 'lime',
            })}>
            <span className='flex items-center justify-center w-4 h-4'>
                {getIconNode(props.icon)}
            </span>
        </span>
    );
};

const LessThanOrEqualIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg">
        <polyline points="16 6 8 12 16 18" />
        <line x1="8" y1="21" x2="16" y2="21" />
    </svg>
);

const LessThanIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg">
        <polyline points="16 6 8 12 16 18" />
    </svg>
);

const GreaterThanOrEqualIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg">
        <polyline points="8 6 16 12 8 18" />
        <line x1="8" y1="21" x2="16" y2="21" />
    </svg>
);

const GreaterThanIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg">
        <polyline points="8 6 16 12 8 18" />
    </svg>
);


export default ExpressionIcon;
