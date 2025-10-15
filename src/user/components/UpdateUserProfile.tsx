import { useRef, useState } from "react";
import { IProfile } from "../interfaces/user";
import { IFileAndObjectUrl } from "../../file/components/MultipleFiles";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { uploadFiles } from "../../file/utils/filehooks";
import { APIBaseURL, postData } from "../../shared/api/base";
import { IonAvatar, IonButton, IonInput, IonItem, IonList } from "@ionic/react";
import { UserCard } from "./UserCard";
import { SingleFile } from "../../file/components/SingleFile";
import { formatCamelCaseToSentence } from "../../shared/helpers";

export interface IUpdateUserProfileProps {
  user: IProfile;
  onCompletion?: () => void;
}

export const UpdateUserProfile = ({
  user,
  onCompletion,
}: IUpdateUserProfileProps) => {
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();

  const [selectedFile, setSelectedFile] = useState<IFileAndObjectUrl | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [userDto, setUserDto] = useState<IProfile>(user || ({} as IProfile));

  const updateUser = async (option?: { changeAvatar?: boolean }) => {
    try {
      setLoading({ isLoading: true, loadingMessage: "updating user profile" });

      if (option?.changeAvatar) {
        if (!selectedFile?.file) throw new Error("No image file selected");
        const res = await uploadFiles([selectedFile]);
        if (res) userDto.avatar = res[0].attachmentUrl;
      }
      await postData(`${APIBaseURL}/user`, {
        method: "put",
        ...(userDto || {}),
      });
      setLoading({ isLoading: false, loadingMessage: "" });
      if(onCompletion) onCompletion();
    } catch (error) {
      handleAsyncError(error, "Error updating user");
    }
  };
  return (
    <>
      <div>
        <UserCard user={user} />

        <SingleFile
          fileInputRef={fileInputRef}
          selectedSingleFile={selectedFile}
          setSelectedSingleFile={setSelectedFile}
        />
        {selectedFile?.file && (
          <IonButton
            expand="full"
            fill="clear"
            onClick={() => updateUser({ changeAvatar: true })}
          >
            Update Profile Image
          </IonButton>
        )}

        <IonList>
          {["firstName", "lastName", "phoneNumber"].map((item) => (
            <IonItem key={item}>
              <IonInput
                label={formatCamelCaseToSentence(item)}
                labelPlacement="floating"
                value={(userDto as any)[item]}
                onIonInput={(evt) => {
                  setUserDto({ ...userDto, [item]: evt.detail.value });
                }}
              />
            </IonItem>
          ))}
          <IonButton fill="clear" expand="full" onClick={() => updateUser()}>
            <span style={{ color: "white" }}>Save</span>
          </IonButton>
        </IonList>
      </div>
    </>
  );
};
