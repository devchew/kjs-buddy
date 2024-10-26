import { FunctionComponent } from 'react';
import { Header } from './Header.tsx';
import { Panel } from './Panel.tsx';
import "./Card.css"

export const Card: FunctionComponent = () => {
    return (
        <div className="card">
            <Header />
            <Panel number={1} />
            <Panel number={2} />
        </div>
    )
}
