import type { FunctionComponent } from 'react';
import "./PanelStrip.css";
import { usePanelContext } from '../contexts/PanelContext.tsx';

export const PanelStrip: FunctionComponent = () => {

    const { number } = usePanelContext();
    return (
        <div className="rally-card-panelStrip">
            <span className="rally-card-panelStrip__previous">{number > 1 && (<>PKC<br/>{number - 1}</>)}</span>
            <span className="rally-card-panelStrip__current">PKC<br/>{number}</span>
        </div>
    );
}
