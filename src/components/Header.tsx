import { FunctionComponent } from 'react';
import monte from "./../assets/montecalvaria.png";
import pzm from "./../assets/pzmot.png";
import "./Header.css";

export const Header: FunctionComponent = () => {
    return (
        <div className="header">
            <img  src={monte} className="header__eventLogo"/>
            <div className="header__carNumber">
                <div className="header__carNumber__title">Numer auta</div>
                <div className="header__carNumber__number">00</div>
            </div>
            <div className="header__eventName">
                <span className="header__eventName__title">Karta drogowa 1<br/></span>
                <span className="header__eventName__name">Rally monte calvaria<br/>17.02.2024</span>
            </div>
            <img src={pzm} className="header__eventSponsorLogo"/>
        </div>
    )
}
