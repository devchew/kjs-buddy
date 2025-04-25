import { FunctionComponent, PropsWithChildren } from 'react';
import { PiCaretRightFill, PiFlagCheckeredFill, PiFlagFill } from 'react-icons/pi';
import { TimePicker } from './TimePicker.tsx';
import "./PanelDetails.css";
import { usePanelContext } from '../contexts/PanelContext.tsx';
import { useEditModeContext } from '../contexts/EditModeContext.tsx';

const IconInRedCircle: FunctionComponent<PropsWithChildren<{ className?: string }>> = ({children, className}) => (
    <div className={["iconInRedCircle", className].join(' ')}>
        {children}
    </div>
)

export const PanelDetails: FunctionComponent = () => {
    const { isEditMode } = useEditModeContext();
    const {
        actualStartTime,
        setActualStartTime,
        drivingTime,
        setDrivingTime,
        finishTime,
        setFinishTime,
        name,
        nextPKCTime,
        setNextPKCTime,
        number,
        provisionalStartTime,
        setProvisionalStartTime,
        resultTime,
        setResultTime
    } = usePanelContext();

    return (
        <div className="panelDetails">
            {/* Only show name in detail section when not in edit mode */}
            {!isEditMode && <span className="panelDetails__name">{name}</span>}
            
            {number > 1 && <div className="panelDetails__finish">
              <IconInRedCircle className="panelDetails__finish__icon"><PiFlagCheckeredFill
                fill="#000"/></IconInRedCircle>
              <TimePicker title="Czas Mety" value={finishTime} precision="miliseconds" onChange={setFinishTime} />
            </div>}
            <div className="panelDetails__times">
                {number > 1 ? <>
                    <TimePicker title="Prowizoryczny start" value={provisionalStartTime} onChange={setProvisionalStartTime} precision="minutes"/>
                    <PiCaretRightFill className="panelDetails__times__arrow"/>
                    <TimePicker title="Faktyczny start" value={actualStartTime} onChange={setActualStartTime} precision="minutes" style="gray"/>
                    <IconInRedCircle className="panelDetails__times__icon"><PiFlagFill fill="#000"/></IconInRedCircle>
                    <PiCaretRightFill className="panelDetails__times__arrow"/>
                    <TimePicker title="Czas przejazdu" value={drivingTime} onChange={setDrivingTime} precision="minutes"/>
                </> : <TimePicker title="Prowizoryczny czas" value={provisionalStartTime} onChange={setProvisionalStartTime} precision="minutes"/>}
            </div>
            <div className="panelDetails__results">
                {number > 1 && <>
                  <IconInRedCircle className="panelDetails__results__icon">start</IconInRedCircle>
                  <TimePicker subtitle="Wynik" value={resultTime} onChange={setResultTime} precision="milisecondsWithoutHours"/>
                </>}
                <TimePicker subtitle={`PKC${number}`} value={nextPKCTime} onChange={setNextPKCTime} precision="minutes" style="gray"/>
            </div>
        </div>
    );
}
