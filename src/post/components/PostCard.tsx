import { IonCard, IonCardContent, IonCardHeader, IonIcon, IonImg } from "@ionic/react";
import { IPost } from "../interfaces/post";
import { timeSharp } from "ionicons/icons";

export interface IPostCardProps {
    post?: IPost;
}

export const PostCard = ({post}: IPostCardProps) => {
    return (
        <IonCard>
            <IonCardHeader>
                <IonImg src={post?.avatar} about={post?.title} />
            </IonCardHeader>
            <div>
                <h2>{post?.title}</h2>
                <p>
                    <IonIcon icon={timeSharp}></IonIcon>
                    <small className="ion-margin-horizontal">
                        {post?.createdAt}
                    </small>
                </p>
            </div>
        </IonCard>
    )
}