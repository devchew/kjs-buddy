import { type FunctionComponent, useState, useEffect } from 'react';
import "./Panel.css";
import { PanelDetails } from './PanelDetails.tsx';
import { PanelStrip } from './PanelStrip.tsx';
import { PanelNextTime } from './PanelNextTime.tsx';
import { useCardContext } from '../contexts/CardContext.tsx';
import { usePanelContext } from '../contexts/PanelContext.tsx';
import { PiTrash } from 'react-icons/pi';

export const Panel: FunctionComponent = () => {
    const { deletePanel, updatePanelName, isEditMode } = useCardContext();
    const { number, name } = usePanelContext();
    const [editableName, setEditableName] = useState(name);

    // Sync the editable name with the context when name changes or when edit mode is toggled
    useEffect(() => {
        setEditableName(name);
    }, [name, isEditMode]);

    // Update the name in the context when it changes
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditableName(e.target.value);
        updatePanelName(number, e.target.value);
    };

    // Handle panel deletion - no confirmation needed
    const handleDelete = () => {
        deletePanel(number);
    };

    return (
        <div className="rally-card-panel">
            {isEditMode && (
                <div className="rally-card-panel__deleteButton" onClick={handleDelete}>
                    <PiTrash size={20} color="#ef476f" />
                </div>
            )}
            <PanelStrip />
            <div className="rally-card-panel__main">
                {isEditMode && number > 1 && (
                    <input
                        type="text"
                        className="rally-card-panel__nameInput"
                        value={editableName}
                        onChange={handleNameChange}
                        placeholder="Enter panel name"
                    />
                )}
                <PanelDetails />
            </div>
            <PanelNextTime />
        </div>
    );
}
