import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { TbLogout } from "react-icons/tb";
import styles from "./Profile.module.css";
import { Panel } from "../components/Panel";
import { Button } from "../components/Button";

export const ProfilePage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <p>Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <Panel>
      <div className={styles.container}>
        <h3>Konto</h3>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <Button onClick={handleLogout} primary>
          <TbLogout size={20} />
          Wyloguj się
        </Button>
      </div>
    </Panel>
  );
};
