import { FunctionComponent } from 'react';
import "./PanelStrip.css";

export const PanelStrip: FunctionComponent<{ number: number }> = ({number}) => (
    <div className="panelStrip">
        <span className="panelStrip__previous">{number > 1 && (<>PKC<br/>{number - 1}</>)}</span>
        <span className="panelStrip__current">PKC<br/>{number}</span>
    </div>
)
