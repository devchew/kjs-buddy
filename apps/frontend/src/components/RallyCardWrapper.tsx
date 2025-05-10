import { FunctionComponent, PropsWithChildren } from 'react';
import './RallyCardWrapper.css';

export const RallyCardWrapper: FunctionComponent<PropsWithChildren> = ({children}) => (
    <div className="rally-card-wrapper">
        {children}
    </div>
)
