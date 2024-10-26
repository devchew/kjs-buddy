import { FunctionComponent } from 'react';
import "./Panel.css";
import { PanelDetails } from './PanelDetails.tsx';
import { PanelStrip } from './PanelStrip.tsx';
import { PanelNextTime } from './PanelNextTime.tsx';

export const Panel: FunctionComponent = () => {
    return (
        <div className="panel">
            <PanelStrip number={1} />
            <PanelDetails />
            <PanelNextTime />
        </div>
    )
}
