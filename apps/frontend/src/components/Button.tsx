import './Button.css';
import { FunctionComponent, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    onClick?: () => void;
    disabled?: boolean;
    primary?: boolean;
}

export const Button: FunctionComponent<PropsWithChildren<ButtonProps>> = ({children, onClick, disabled, primary, ...rest}) => {

    return (
        <button className="button" onClick={onClick} disabled={disabled} data-primary={primary ? 'true' : undefined} {...rest}>
            {children}
        </button>
    )
}


export const LinkButton: FunctionComponent<PropsWithChildren<ButtonProps & { to: string }>> = ({children, onClick, to, primary, ...rest}) => {
    return (
        <Link className="button" to={to} onClick={onClick} data-primary={primary ? 'true' : undefined} {...rest}>
            {children}
        </Link>
    )
}
