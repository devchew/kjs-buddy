import { FunctionComponent } from 'react';
import { TimePicker } from './TimePicker.tsx';
import "./PanelNextTime.css";

export const PanelNextTime: FunctionComponent = () => (
    <div className="panelNextTime">
        <span className="panelNextTime__title">wypełnia<br/>zaawodnik</span>
        <TimePicker title="przewidywany czas przyjazdu" value={6646460} precision="minutes" subtitle="PKC2"
                    className="panelNextTime__time"/>
    </div>
)
