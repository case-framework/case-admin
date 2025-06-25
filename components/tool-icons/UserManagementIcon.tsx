import React from 'react';
import { BsPersonFillGear } from 'react-icons/bs';
import ToolIconBase from './ToolIconBase';

interface UserManagementIconProps {
    size: 'md' | 'lg';
}

const UserManagementIcon: React.FC<UserManagementIconProps> = (props) => {
    return (
        <ToolIconBase
            size={props.size}
            icon={<BsPersonFillGear />}
            color='bg-linear-to-b from-emerald-400 to-emerald-600 text-white'
        />
    );
};

export default UserManagementIcon;
