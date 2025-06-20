import style from "./Button.module.css";
import { FunctionComponent, PropsWithChildren } from "react";
import { Link } from "react-router-dom";

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  onClick?: () => void;
  disabled?: boolean;
  primary?: boolean;
};

export const Button: FunctionComponent<PropsWithChildren<ButtonProps>> = ({
  children,
  onClick,
  disabled,
  primary,
  ...rest
}) => {
  return (
    <button
      className={style.button}
      onClick={onClick}
      disabled={disabled}
      data-primary={primary ? "true" : undefined}
      {...rest}
    >
      {children}
    </button>
  );
};

export const LinkButton: FunctionComponent<
  PropsWithChildren<{ to: string; onClick?: () => void; primary?: boolean }>
> = ({ children, onClick, to, primary, ...rest }) => {
  return (
    <Link
      className={style.button}
      to={to}
      onClick={onClick}
      data-primary={primary ? "true" : undefined}
      {...rest}
    >
      {children}
    </Link>
  );
};
