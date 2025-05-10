import { useAuth } from '../contexts/AuthContext.tsx';
import './MainHeader.css';
import { Link } from 'react-router-dom';
import { LinkButton } from './Button.tsx';

const User = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="header-user">
                <LinkButton to="/login">
                    Logowanie
                </LinkButton>
            </div>
        );
    }

    return (
        <div className="header-user">
            <LinkButton to="/profile">
                {user.email}
            </LinkButton>
        </div>
    )
}

export const MainHeader = () => {

    return (
        <header className="main-header">
            <Link className="main-header__brand" to="/">
                KJS Buddy
            </Link>
            <div className="main-header__user">
                <User />
            </div>
        </header>
    )
}
