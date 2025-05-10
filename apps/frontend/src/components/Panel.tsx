import { FunctionComponent, PropsWithChildren } from 'react';
import "./Panel.css";

export const Panel:FunctionComponent<PropsWithChildren> = ({children}) => {

    return (
        <div className="panel-box">
            {children}
        </div>
    )
}
