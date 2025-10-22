import { Dispatch, SetStateAction, useState } from "react";
import {
  linkSharp,
  logoFacebook,
  logoLinkedin,
  logoTwitter,
} from "ionicons/icons";
import {
  IonAvatar,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonRow,
} from "@ionic/react";

export interface ISocialMediaLinks {
  facebook?: string;
  x?: string;
  linkedIn?: string;
}

export interface ISocialMediaLinksProps {
  socialMediaLinks?: ISocialMediaLinks;
  setSocialMediaLinks: Dispatch<SetStateAction<ISocialMediaLinks>>;
  onCompletion?: () => void;
}
export interface ILinkInput {
  inputName: "x" | "linkedIn" | "facebook";
  label: string;
  icon: string;
}

export const SocialMediaLinksManager = ({
  socialMediaLinks,
  setSocialMediaLinks,
  onCompletion,
}: ISocialMediaLinksProps) => {
  const [socialMediaLinksData, setSocialMedidaLinksData] =
    useState<ISocialMediaLinks>(socialMediaLinks || ({} as ISocialMediaLinks));
  const [openSocialMediaLinksOverlay, setOpenSocialMediaLinksOverlay] =
    useState(false);

  const linkInputs: ILinkInput[] = [
    {
      inputName: "x",
      label: "enter x handle",
      icon: logoTwitter,
    },
    {
      inputName: "facebook",
      label: "Enter facebook page",
      icon: logoFacebook,
    },
    {
      inputName: "linkedIn",
      label: "Enter linkedIn page",
      icon: logoLinkedin,
    },
  ];
  return (
    <div>
      <IonGrid>
        <IonRow>
          <IonCol 
          size="12"
              role="button"
              aria-label="open social media link inuts"
                onClick={() =>
                  setOpenSocialMediaLinksOverlay(!openSocialMediaLinksOverlay)
                }
            
          >
            <SocialMediaLinksCard socialMediaLinks={socialMediaLinksData} />
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonModal
        isOpen={openSocialMediaLinksOverlay}
        onDidDismiss={() => setOpenSocialMediaLinksOverlay(false)}
      >
        <IonContent>
          <div>
            <IonButton
              expand="full"
              color={"danger"}
              onClick={() => setOpenSocialMediaLinksOverlay(false)}
            >
              close
            </IonButton>
          </div>
          <div style={{ overflow: "auto" }}>
            {linkInputs.map((linkInput, index) => (
              <IonItem key={index} detailIcon={linkInput.icon}>
                <IonInput
                  name={linkInput.inputName}
                  label={linkInput.label}
                  labelPlacement="floating"
                  value={(socialMediaLinksData as any)[linkInput.inputName]}
                  onInput={(evt) => {
                    const { value, name } = evt.currentTarget;
                    setSocialMedidaLinksData({
                      ...socialMediaLinksData,
                      [name]: value,
                    } as unknown as ISocialMediaLinks);
                  }}
                />
              </IonItem>
            ))}
            <div className="ion-text-center">
              <IonButton
                color={"primary"}
                expand="full"
                onClick={() => {
                  setSocialMediaLinks({ ...socialMediaLinksData });
                  setOpenSocialMediaLinksOverlay(false);
                  if (onCompletion) onCompletion();
                }}
              >
                Save
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>
    </div>
  );
};

export const SocialMediaLinksCard = ({
  socialMediaLinks,
}: {
  socialMediaLinks: ISocialMediaLinks;
}) => {
  return (
    <IonItem>
      <IonAvatar>
        <IonIcon icon={linkSharp} size="large"></IonIcon>
      </IonAvatar>
      <IonLabel>
        <h2>Social Media Links</h2>
        {Object.keys(socialMediaLinks || {}).map((item, index) => (
          <p key={index}>
            <span>{item}</span>:{" "}
            <span>{((socialMediaLinks || {}) as any)[item]} </span>
          </p>
        ))}
      </IonLabel>
    </IonItem>
  );
};
