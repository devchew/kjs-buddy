import { FunctionComponent } from 'react';
import "./Panel.css";
import { PanelDetails } from './PanelDetails.tsx';
import { PanelStrip } from './PanelStrip.tsx';
import { PanelNextTime } from './PanelNextTime.tsx';

export const Panel: FunctionComponent<{number: number}> = ({number}) => {
    return (
        <div className="panel">
            <PanelStrip number={number} />
            <PanelDetails starting={number === 1} />
            <PanelNextTime />
        </div>
    )
}
