import { FunctionComponent } from 'react';
import "./Panel.css";
import { PanelDetails } from './PanelDetails.tsx';
import { PanelStrip } from './PanelStrip.tsx';
import { PanelNextTime } from './PanelNextTime.tsx';

export const Panel: FunctionComponent = () =>
    (
        <div className="panel">
            <PanelStrip/>
            <PanelDetails/>
            <PanelNextTime/>
        </div>
    )
