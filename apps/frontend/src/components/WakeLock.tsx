import { useWakeLock } from "../hooks/useWakeLock.ts";
import { TbScreenShare } from "react-icons/tb";
import style from "./WakeLock.module.css";

export const WakeLock = () => {
  const { wakeLockError, wakeLockActive, toggleWakeLock } = useWakeLock();
  return (
    <div className={style.container}>
      {" "}
      {wakeLockError && (
        <div className={style.error}>
          <strong>Błąd blokady ekranu: </strong>
          {wakeLockError}
        </div>
      )}
      <label className={style.label}>
        <div className={style.switch}>
          <input
            type="checkbox"
            checked={wakeLockActive}
            onChange={() => toggleWakeLock()}
            className={style.input}
          />
          <span
            className={`${style.slider} ${wakeLockActive ? style.sliderActive : ""}`}
          >
            <span
              className={`${style.thumb} ${wakeLockActive ? style.thumbActive : ""}`}
            >
              <TbScreenShare
                size={14}
                color={wakeLockActive ? "#339af0" : "gray"}
                className={style.icon}
              />
            </span>
          </span>
        </div>
        <span>Pozostaw ekran aktywny</span>
      </label>
    </div>
  );
};
