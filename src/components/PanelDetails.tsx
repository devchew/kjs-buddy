import { FunctionComponent, PropsWithChildren } from 'react';
import { PiCaretRightFill, PiFlagCheckeredFill, PiFlagFill } from 'react-icons/pi';
import { TimePicker } from './TimePicker.tsx';
import "./PanelDetails.css";

const IconInRedCircle: FunctionComponent<PropsWithChildren<{ className?: string }>> = ({children, className}) => (
    <div className={["iconInRedCircle", className].join(' ')}>
        {children}
    </div>
)
export const PanelDetails: FunctionComponent = () => (
    <div className="panelDetails">
        <span className="panelDetails__name">PS1 - Krosno</span>
        <div className="panelDetails__finish">
            <IconInRedCircle className="panelDetails__finish__icon"><PiFlagCheckeredFill fill="#000"
                                                                                         size={22}/></IconInRedCircle>
            <TimePicker title="Czas Mety" value={6646460} precision="miliseconds"/>
        </div>
        <div className="panelDetails__times">
            <TimePicker title="Prowizoryczny start" value={6646460} precision="minutes"/>
            <PiCaretRightFill size={25} className="panelDetails__times__arrow"/>
            <TimePicker title="Faktyczny start" value={6646460} precision="minutes" style="gray"/>
            <IconInRedCircle className="panelDetails__times__icon"><PiFlagFill fill="#000" size={22}/></IconInRedCircle>
            <PiCaretRightFill size={25} className="panelDetails__times__arrow"/>
            <TimePicker title="Czas przejazdu" value={6646460} precision="minutes"/>
        </div>
        <div className="panelDetails__results">
            <IconInRedCircle className="panelDetails__results__icon">start</IconInRedCircle>
            <TimePicker subtitle="Wynik" value={6646460} precision="milisecondsWithoutHours"/>
            <TimePicker subtitle="PKC2" value={6646460} precision="minutes" style="gray"/>
        </div>
    </div>
)
