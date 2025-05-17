import { useAuth } from '../contexts/AuthContext.tsx';
import style from './MainHeader.module.css';
import { Link } from 'react-router-dom';
import { LinkButton } from './Button.tsx';

const User = () => {
    const { user } = useAuth();    if (!user) {
        return (
            <div className={style.user}>
                <LinkButton to="/login">
                    Logowanie
                </LinkButton>
            </div>
        );
    }    return (
        <div className={style.user}>
            <LinkButton to="/profile">
                {user.email}
            </LinkButton>
        </div>
    )
}

export const MainHeader = () => {    return (
        <header className={style.header}>
            <Link className={style.brand} to="/">
                KJS Buddy Admin panel
            </Link>
            <div className={style.userContainer}>
                <User />
            </div>
        </header>
    )
}
