import AppbarBaseForTools from '@/components/navbar/AppbarBaseForTools';
import EditorsIcon from '@/components/tool-icons/EditorsIcons';
import React from 'react';

interface EditorsAppbarProps {
}

const EditorsAppbarBase: React.FC<EditorsAppbarProps> = (props) => {
    return (
        <AppbarBaseForTools
            toolName='Standalone Editors'
            toolIcon={<EditorsIcon size="md" />}
            isBordered
        >
        </AppbarBaseForTools>
    );
};

export default EditorsAppbarBase;
