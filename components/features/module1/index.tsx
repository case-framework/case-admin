"use client";

import { useState } from "react";
import ModuleHeader from "./header";
import ModuleList from "./module-list";


interface Module1ComponentProps {
    studyKey: string;
}

const Module1Component = ({ studyKey }: Module1ComponentProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <h1>Module 1</h1>
            <ModuleHeader />
            <ModuleList />
        </div>
    )
}

export default Module1Component;