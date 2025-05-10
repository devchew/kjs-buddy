import type { FunctionComponent } from 'react';
import "./PanelStrip.css";
import { usePanelContext } from '../contexts/PanelContext.tsx';

export const PanelStrip: FunctionComponent = () => {

    const { number } = usePanelContext();
    return (
        <div className="panelStrip">
            <span className="panelStrip__previous">{number > 1 && (<>PKC<br/>{number - 1}</>)}</span>
            <span className="panelStrip__current">PKC<br/>{number}</span>
        </div>
    );
}
