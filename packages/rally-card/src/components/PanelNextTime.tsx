import type { FunctionComponent } from 'react';
import { TimePicker } from './TimePicker.tsx';
import "./PanelNextTime.css";
import { usePanelContext } from '../contexts/PanelContext.tsx';

export const PanelNextTime: FunctionComponent = () => {
    const {arrivalTime, setArrivalTime} = usePanelContext();
    return (
        <div className="rally-card-panelNextTime">
            <span className="rally-card-panelNextTime__title">wypełnia<br/>zaawodnik</span>
            <TimePicker title="przewidywany czas przyjazdu" value={arrivalTime} onChange={setArrivalTime} precision="minutes" subtitle="PKC2"
                        className="rally-card-panelNextTime__time"/>
        </div>
    );
}
