import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Header } from './Header.tsx';
import { Panel } from './Panel.tsx';
import "./Card.css";
import { useCardContext } from '../contexts/CardContext.tsx';
import { PanelProvider } from '../contexts/PanelContext.tsx';
export const Card = () => {
    const { panels, updatePanelByNumber } = useCardContext();
    return (_jsxs("div", { className: "card", children: [_jsx(Header, {}), panels.map((panel) => (_jsx(PanelProvider, { panel: panel, onChange: (panel) => updatePanelByNumber(panel.number, panel), children: _jsx(Panel, {}, panel.number) }, panel.number)))] }));
};
