import { FunctionComponent, PropsWithChildren } from 'react';
import './Pill.css';

export const Pill: FunctionComponent<PropsWithChildren> = ({children}) => (
    <span className="rally-pill">{children}</span>
)
