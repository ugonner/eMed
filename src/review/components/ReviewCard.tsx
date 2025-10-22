import { IonAvatar, IonImg, IonItem, IonLabel } from "@ionic/react";
import { IReviewAndRating } from "../interfaces/review";

export interface IReviewAndRatingCardProps {
    reviewAndRating: IReviewAndRating;
}

export const ReviewAndRatingCard = ({reviewAndRating}: IReviewAndRatingCardProps) => {
    return (
        <>
            <IonItem>
                <IonAvatar>
                    <IonImg src={reviewAndRating?.profile?.avatar} alt={reviewAndRating?.profile?.firstName} />
                </IonAvatar>
                <IonLabel className="ion-margin">
                    <p>{reviewAndRating?.review}</p>
                    <p>
                        Date: {reviewAndRating?.createdAt}
                    </p>
                    <p>
                        Rating: {reviewAndRating?.rating}
                    </p>
                </IonLabel>
            </IonItem>
        </>
    )
}