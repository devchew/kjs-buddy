import { FunctionComponent } from 'react';
import { Header } from './Header.tsx';
import { Panel } from './Panel.tsx';
import "./Card.css"
import { useCardContext } from '../contexts/CardContext.tsx';
import { PanelProvider } from '../contexts/PanelContext.tsx';

export const Card: FunctionComponent = () => {
    const { panels, updatePanelByNumber, loading } = useCardContext();

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="card">
            <Header />
            {panels.map((panel) => (
                <PanelProvider key={panel.number} panel={panel} onChange={(panel) => updatePanelByNumber(panel.number, panel)}>
                    <Panel key={panel.number} />
                </PanelProvider>
            ))}
        </div>
    )
}
