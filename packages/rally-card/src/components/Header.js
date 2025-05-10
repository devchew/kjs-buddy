import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./Header.css";
import { useCardContext } from '../contexts/CardContext.tsx';
import monte from "./../assets/montecalvaria.png";
import pzm from "./../assets/pzmot.png";
const formatDate = (date) => {
    const dateObj = new Date(date);
    return `${dateObj.getDate()}.${dateObj.getMonth() + 1}.${dateObj.getFullYear()}`;
};
export const Header = () => {
    const { cardInfo } = useCardContext();
    return (_jsxs("div", { className: "header", children: [_jsx("img", { src: monte, className: "header__eventLogo", alt: 'event logo' }), _jsxs("div", { className: "header__carNumber", children: [_jsx("div", { className: "header__carNumber__title", children: "Numer auta" }), _jsx("div", { className: "header__carNumber__number", children: cardInfo.carNumber })] }), _jsxs("div", { className: "header__eventName", children: [_jsxs("span", { className: "header__eventName__title", children: ["Karta drogowa ", cardInfo.cardNumber, _jsx("br", {})] }), _jsxs("span", { className: "header__eventName__name", children: [cardInfo.name, _jsx("br", {}), formatDate(cardInfo.date)] })] }), _jsx("img", { src: pzm, className: "header__eventSponsorLogo", alt: 'sponsor logo' })] }));
};
