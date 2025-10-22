import { RefObject, useRef, useState } from "react";
import { AidServiceDTO } from "../dtos/aid-service.dto";
import {
  IonAvatar,
  IonButton,
  IonInput,
  IonItem,
  IonTextarea,
} from "@ionic/react";
import { formatCamelCaseToSentence } from "../../shared/helpers";
import { AidServiceCard } from "./AidServiceCard";
import { TagManager } from "./TagManager";
import { TagDTO } from "../dtos/tag.dto";
import { IAidService } from "../interfaces/aid-service.interface";

import "../../shared/components/form/MultiSelector.css";
import { IFileAndObjectUrl } from "../../file/components/MultipleFiles";
import { SingleFile } from "../../file/components/SingleFile";
import { uploadFiles } from "../../file/utils/filehooks";
import { APIBaseURL, postData } from "../../shared/api/base";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { ICluster } from "../../user/interfaces/cluster";
import { ClusterSelector } from "../../user/components/cluster/ClusterSelector";
import { useIInitContextStore } from "../../shared/contexts/InitContextProvider";

export interface IAidServiceManagerProps {
  aidService?: IAidService;
  onCompletion?: () => void;
}

export const AidServiceManager = ({
  aidService,
  onCompletion,
}: IAidServiceManagerProps) => {
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();
  const {setReLoadEntities} = useIInitContextStore();

  const [aidServiceDto, setAidServiceDto] = useState<IAidService>(
    aidService || ({} as IAidService)
  );
  const [aidServiceTags, setAidserviceTags] = useState<TagDTO[]>(
    aidService?.aidServiceTags?.map((aTag) => aTag.tag) || []
  );
  const [aidServiceClusters, setAidServiceClusters] = useState<ICluster[]>(
    aidService?.aidServiceClusters?.map((aCluster) => aCluster.cluster) || []
  );

  const fileInputRef = useRef<HTMLInputElement>();
  const [selectedSingleFile, setSelectedSingleFile] =
    useState<IFileAndObjectUrl | null>(null);

  const saveAidService = async () => {
    try {
      setLoading({ isLoading: true, loadingMessage: "Saving aid service" });

      if (!aidServiceDto.name?.trim()) throw new Error("Name is required");
       
      const dto: Partial<AidServiceDTO> = {};
      if(aidServiceDto.serviceRate) aidServiceDto.serviceRate = Number(aidServiceDto.serviceRate);
      if(aidServiceTags.length > 0) dto.tags = aidServiceTags;
      if(aidServiceClusters.length > 0) dto.clusterIds = aidServiceClusters.map((cluster) => cluster.id as number)

      if (selectedSingleFile) {
        const res = await uploadFiles([selectedSingleFile]);
        if (res && res[0]) aidServiceDto.avatar = res[0].attachmentUrl;
      }
      await postData(`${APIBaseURL}/aid-service`, {
        method: aidService?.id ? "put" : "post",
        ...aidServiceDto,
        ...dto
      });
      setLoading({ isLoading: false, loadingMessage: "" });
      setReLoadEntities((prev) => (!prev))
      if (onCompletion) onCompletion();
    } catch (error) {
      handleAsyncError(error, "Error saving aid service");
    }
  };

  const inputFields: (
    | "name"
    | "description"
    | "serviceRate"
  )[] = ["name", "description", "serviceRate"];

  return (
    <div>
      {aidService && (
        <AidServiceCard aidService={aidServiceDto as unknown as IAidService} />
      )}
      {inputFields.map((field) => (
        <IonItem>
          {field === "description" ? (
            <IonTextarea
              label={formatCamelCaseToSentence(field)}
              labelPlacement="floating"
              value={aidServiceDto.description}
              onIonInput={(evt) => {
                setAidServiceDto({
                  ...aidServiceDto,
                  description: evt.detail.value as string,
                });
              }}
            />
          ) : (
            <IonInput
              type={field === "name" ? "text" : "number"}
              label={formatCamelCaseToSentence(field)}
              labelPlacement="floating"
              value={aidServiceDto[field]}
              onIonInput={(evt) => {
                setAidServiceDto({
                  ...aidServiceDto,
                  [field]: evt.detail.value as string,
                });
              }}
            />
          )}
        </IonItem>
      ))}
      <div>
        <div>
          <ClusterSelector
          label="Associate this service with clusters, optional"
          initClusters={aidServiceClusters}
          onSelection={(clusters: ICluster[]) => {
            setAidServiceClusters(clusters);
          }}
          />
        </div>
        <div style={{ display: "flex" }}>
          {(aidServiceTags || []).map((tag, index) => (
            <div className="embossed-tile" key={index}>
              {tag.name}
            </div>
          ))}
        </div>

        <TagManager
          initTags={aidServiceTags}
          onCompletion={(tags: TagDTO[]) => {
            setAidserviceTags(tags);
          }}
          label="Aid Service Tags"
        />
      </div>
      <div>
        <SingleFile
          fileInputRef={fileInputRef as RefObject<HTMLInputElement>}
          selectedSingleFile={selectedSingleFile}
          setSelectedSingleFile={setSelectedSingleFile}
        />
      </div>
      <div>
        <IonButton
          expand="full"
          shape="round"
          onClick={() => {
            saveAidService();
          }}
        >
          Save
        </IonButton>
      </div>
    </div>
  );
};
