import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TimePicker } from './TimePicker.tsx';
import "./PanelNextTime.css";
import { usePanelContext } from '../contexts/PanelContext.tsx';
export const PanelNextTime = () => {
    const { arrivalTime, setArrivalTime } = usePanelContext();
    return (_jsxs("div", { className: "panelNextTime", children: [_jsxs("span", { className: "panelNextTime__title", children: ["wype\u0142nia", _jsx("br", {}), "zaawodnik"] }), _jsx(TimePicker, { title: "przewidywany czas przyjazdu", value: arrivalTime, onChange: setArrivalTime, precision: "minutes", subtitle: "PKC2", className: "panelNextTime__time" })] }));
};
