import { IonIcon } from "@ionic/react";
import { squareSharp } from "ionicons/icons";
import { MouseEventHandler, PropsWithChildren } from "react";

export interface IRoundButtonProps {
  label?: string;
  icon?: string;
  onClick: Function;
  ariaLabel?: string;
  backgroundColor?: string
}

export const RoundButton = ({ label, icon, onClick, ariaLabel, backgroundColor }: IRoundButtonProps) => {
  return (
    <>
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          backgroundColor: backgroundColor || "#3880ff",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          cursor: "pointer",
          lineHeight: "0.5em"
        }}
        role="button"
        onClick={() => onClick()}
        aria-label={ariaLabel}
      >
        <IonIcon icon={icon ? icon : squareSharp}></IonIcon>
        {label && <small> <br/> {label}</small>}
      </div>
    </>
  );
};
