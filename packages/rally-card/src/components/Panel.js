import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import "./Panel.css";
import { PanelDetails } from './PanelDetails.tsx';
import { PanelStrip } from './PanelStrip.tsx';
import { PanelNextTime } from './PanelNextTime.tsx';
import { useCardContext } from '../contexts/CardContext.tsx';
import { usePanelContext } from '../contexts/PanelContext.tsx';
import { PiTrash } from 'react-icons/pi';
export const Panel = () => {
    const { deletePanel, updatePanelName, isEditMode } = useCardContext();
    const { number, name } = usePanelContext();
    const [editableName, setEditableName] = useState(name);
    // Sync the editable name with the context when name changes or when edit mode is toggled
    useEffect(() => {
        setEditableName(name);
    }, [name, isEditMode]);
    // Update the name in the context when it changes
    const handleNameChange = (e) => {
        setEditableName(e.target.value);
        updatePanelName(number, e.target.value);
    };
    // Handle panel deletion - no confirmation needed
    const handleDelete = () => {
        deletePanel(number);
    };
    return (_jsxs("div", { className: "panel", children: [isEditMode && (_jsx("div", { className: "panel__deleteButton", onClick: handleDelete, children: _jsx(PiTrash, { size: 20, color: "#ef476f" }) })), _jsx(PanelStrip, {}), _jsxs("div", { className: "panel__main", children: [isEditMode && number > 1 && (_jsx("input", { type: "text", className: "panel__nameInput", value: editableName, onChange: handleNameChange, placeholder: "Enter panel name" })), _jsx(PanelDetails, {})] }), _jsx(PanelNextTime, {})] }));
};
