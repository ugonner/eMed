import { IonAvatar, IonCol, IonIcon, IonItem, IonLabel, IonRow, useIonRouter } from "@ionic/react";
import { IPost } from "../../post/interfaces/post";
import { PostCard } from "../../post/components/PostCard";
import { arrowForward } from "ionicons/icons";
import { PostRoutes } from "../../post/enums/route";

export interface IHealthPostsProps {
  posts?: IPost[];
}

export const HealthPosts = ({ posts }: IHealthPostsProps) => {
    const router = useIonRouter();

    return (
    <>
    <IonRow>
        <IonCol size="12">
            <IonItem>
                <IonLabel>
                    <h4>Your Health Tips</h4>
                    <p>We provide you with trusted health education. Here are recent well researched tips for your healthy living</p>
                </IonLabel>
                <IonAvatar
                 className="ion-margin-horizontal"
                 role="button"
                 onClick={() => router.push(`${PostRoutes.ALL}`)}
                 >
                    <IonIcon icon={arrowForward}></IonIcon>
                </IonAvatar>
            </IonItem>
        </IonCol>
    </IonRow>
      {posts?.map((post, index) => (
        <IonRow key={index}>
          <IonCol size="12" onClick={() => router.push(`${PostRoutes.VIEW_POST}?pi=${post.id}`)}>
            <PostCard post={post} />
          </IonCol>
        </IonRow>
      ))}
    </>
  );
};
