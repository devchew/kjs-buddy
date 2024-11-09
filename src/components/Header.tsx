import { FunctionComponent } from 'react';
import "./Header.css";
import { useCardContext } from '../contexts/CardContext.tsx';

const formatDate = (date: string): string => {
    const dateObj = new Date(date);
    return `${dateObj.getDate()}.${dateObj.getMonth() + 1}.${dateObj.getFullYear()}`;
}

export const Header: FunctionComponent = () => {
    const { cardInfo } = useCardContext();
    return (
        <div className="header">
            <img src={cardInfo.logo} className="header__eventLogo"/>
            <div className="header__carNumber">
                <div className="header__carNumber__title">Numer auta</div>
                <div className="header__carNumber__number">{cardInfo.carNumber}</div>
            </div>
            <div className="header__eventName">
                <span className="header__eventName__title">Karta drogowa {cardInfo.cardNumber}<br/></span>
                <span className="header__eventName__name">{cardInfo.name}<br/>{formatDate(cardInfo.date)}</span>
            </div>
            <img src={cardInfo.sponsorLogo} className="header__eventSponsorLogo"/>
        </div>
    )
}
