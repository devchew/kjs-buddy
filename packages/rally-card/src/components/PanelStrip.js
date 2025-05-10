import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import "./PanelStrip.css";
import { usePanelContext } from '../contexts/PanelContext.tsx';
export const PanelStrip = () => {
    const { number } = usePanelContext();
    return (_jsxs("div", { className: "panelStrip", children: [_jsx("span", { className: "panelStrip__previous", children: number > 1 && (_jsxs(_Fragment, { children: ["PKC", _jsx("br", {}), number - 1] })) }), _jsxs("span", { className: "panelStrip__current", children: ["PKC", _jsx("br", {}), number] })] }));
};
