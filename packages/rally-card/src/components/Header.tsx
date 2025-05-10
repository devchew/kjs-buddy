import type { FunctionComponent } from 'react';
import "./Header.css";
import { useCardContext } from '../contexts/CardContext.tsx';
import monte from "./../assets/montecalvaria.png";
import pzm from "./../assets/pzmot.png";

const formatDate = (date: string): string => {
    const dateObj = new Date(date);
    return `${dateObj.getDate()}.${dateObj.getMonth() + 1}.${dateObj.getFullYear()}`;
}

export const Header: FunctionComponent = () => {
    const { cardInfo } = useCardContext();
    return (
        <div className="rally-card-header">
            <img src={"data:image/png;base64, "+monte} className="rally-card-header__eventLogo" alt='event logo'/>
            <div className="rally-card-header__carNumber">
                <div className="rally-card-header__carNumber__title">Numer auta</div>
                <div className="rally-card-header__carNumber__number">{cardInfo.carNumber}</div>
            </div>
            <div className="rally-card-header__eventName">
                <span className="rally-card-header__eventName__title">Karta drogowa {cardInfo.cardNumber}<br/></span>
                <span className="rally-card-header__eventName__name">{cardInfo.name}<br/>{formatDate(cardInfo.date)}</span>
            </div>
            <img src={"data:image/png;base64, "+pzm} className="rally-card-header__eventSponsorLogo" alt='sponsor logo'/>
        </div>
    )
}
