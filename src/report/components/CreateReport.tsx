import { useState } from "react";
import { useAsyncHelpersContext } from "../../shared/contexts/async-helpers";
import { getLocalUser } from "../../utils";
import { IAidServiceProfile } from "../../aid-service/interfaces/aid-service-profile";
import { getNumberRange } from "../../shared/components/form/DateSelector";

import { APIBaseURL, postData } from "../../shared/api/base";
import { IonCol, IonContent, IonGrid, IonIcon, IonItem, IonModal, IonRow, IonTextarea } from "@ionic/react";
import { starOutline, starSharp } from "ionicons/icons";
import { ServiceType } from "../../review/enums/service";
import { ReviewAndRatingDTO } from "../../review/dtos/review-and-rating";


export interface ICreateReportProps {
  serviceType: ServiceType;
  serviceTypeEntityId: number;
  onCompletion?: () => void;
}

export const CreateReport = ({
  serviceType,
  serviceTypeEntityId,
  onCompletion
}: ICreateReportProps) => {
  const { setLoading, handleAsyncError } = useAsyncHelpersContext();
  
  const [reviewDto, setReviewDto] = useState<ReviewAndRatingDTO>({
    rating: 1,
    review: "",
    serviceType,
    serviceTypeEntityId
  } as ReviewAndRatingDTO);

  const rateService = async () => {
    try {
      setLoading({ isLoading: true, loadingMessage: "reviewing service" });
      await postData(`${APIBaseURL}/report`, {
        method: "post",
        ...reviewDto,
        serviceType,
        serviceTypeEntityId
      });
      setLoading({ isLoading: false, loadingMessage: "" });
      if(onCompletion) onCompletion();
    } catch (error) {
      handleAsyncError(error, "Error updating review");
    }
  };

  return (
    <>
    
    <IonGrid>
      <IonRow>
        <IonCol size="12">
          <h3>Report</h3>
          <p>Report with a comment</p>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="12">
            
            <IonItem>
                <IonTextarea
                label="Review Comment"
                labelPlacement="floating"
                value={reviewDto.review}
                onIonInput={(evt) => setReviewDto({...reviewDto, review: evt.detail.value as string})}
                />
            </IonItem>
            <IonItem>
                {
                    ["save", "cancel"].map((item) => (
                        <span key={item} className="ion-margin" role="button" onClick={() => {
                            if(item === "save") rateService();
                            else if(onCompletion) onCompletion();
                        }}>
                            {item}
                        </span>
                    ))
                }
            </IonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
    </>
  );
};
