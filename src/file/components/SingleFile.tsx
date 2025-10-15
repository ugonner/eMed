import {
  IonAvatar,
  IonButton,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonPopover,
  IonText,
} from "@ionic/react";
import { IFileAndObjectUrl } from "./MultipleFiles";
import {
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useState,
} from "react";
import {
  closeCircle,
  cloudUploadOutline,
  imageOutline,
  musicalNoteOutline,
  videocamOutline,
} from "ionicons/icons";
export interface ISingleFileProps {
  selectedSingleFile: IFileAndObjectUrl | null;
  setSelectedSingleFile: Dispatch<SetStateAction<IFileAndObjectUrl | null>>;
  fileInputRef: RefObject<HTMLInputElement>;
  acceptedFileType?: "image" | "video" | "audio";
  altText?: string;
}

export const SingleFile = ({
  selectedSingleFile,
  setSelectedSingleFile,
  fileInputRef,
  acceptedFileType,
  altText,
}: ISingleFileProps) => {
  const [openPreviewOverlay, setOpenPreviewOverlay] = useState(false);

  let uploadIcon: string = cloudUploadOutline;
  if (acceptedFileType === "audio") uploadIcon = musicalNoteOutline;
  else if (acceptedFileType === "image") uploadIcon = imageOutline;
  else if (acceptedFileType === "video") uploadIcon = videocamOutline;

  let fileElement: ReactNode;

  if (/image/i.test(selectedSingleFile?.file.type || ""))
    fileElement = (
      <IonImg
        src={selectedSingleFile?.objectUrl}
        alt={altText ? altText : "IMAGE"}
      />
    );
  else if (/audio/i.test(selectedSingleFile?.file.type || ""))
    fileElement = <audio src={selectedSingleFile?.objectUrl}></audio>;
  else if (/video/i.test(selectedSingleFile?.file.type || ""))
    fileElement = <video src={selectedSingleFile?.objectUrl}></video>;
  else fileElement = <embed src={selectedSingleFile?.objectUrl} />;
  return (
    <>
      <div>
        <div>
          <IonItem>
            <IonLabel>
              <h3>Select Image</h3>
              <p>
                Select nice file by clicking the{" "}
                <IonIcon icon={uploadIcon}></IonIcon>{" "}
              </p>
            </IonLabel>
          </IonItem>
          {selectedSingleFile && (
            <IonItem>
              <IonAvatar
                onClick={() => setOpenPreviewOverlay(!openPreviewOverlay)}
              >
                {fileElement}
              </IonAvatar>
              <sup
                className="ion-margin"
                onClick={() => fileInputRef.current?.click()}
              >
                <IonIcon icon={uploadIcon} />
              </sup>
            </IonItem>
          )}
          {!selectedSingleFile && (
            <IonItem>
              <IonButton
                slot="start"
                className="icon-only"
                fill="clear"
                expand="full"
                onClick={() => fileInputRef.current?.click()}
              >
                <IonIcon icon={uploadIcon} />
              </IonButton>
            </IonItem>
          )}
          <input
            ref={fileInputRef}
            hidden
            multiple={false}
            type="file"
            accept={acceptedFileType ? `${acceptedFileType}/*` : "*"}
            onChange={(evt) => {
              const files = evt.target.files;
              if (!files || files.length === 0) return;
              let fileObjUrl: IFileAndObjectUrl =
                {} as unknown as IFileAndObjectUrl;

              for (const file of files) {
                const objUrl = URL.createObjectURL(file);
                fileObjUrl = {
                  file,
                  objectUrl: objUrl,
                };
              }
              setSelectedSingleFile(fileObjUrl);
            }}
          ></input>
        </div>
      </div>

      <IonPopover
        isOpen={openPreviewOverlay}
        onDidDismiss={() => setOpenPreviewOverlay(false)}
      >
        <IonItem>
          <IonText>Preview</IonText>
          <IonButton
            fill="clear"
            onClick={() => setOpenPreviewOverlay(false)}
            className="icon-only"
            slot="end"
          >
            <IonIcon icon={closeCircle}></IonIcon>
          </IonButton>
        </IonItem>
        <div
          style={{
            flex: "flexbox",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {fileElement}
        </div>
      </IonPopover>
    </>
  );
};
