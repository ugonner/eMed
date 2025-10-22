import { IonCard, IonCardContent, IonCardHeader, IonIcon, IonImg } from "@ionic/react";
import { IPost } from "../interfaces/post";
import { timeSharp } from "ionicons/icons";
import { PostCard } from "./PostCard";

export interface IPostDetailProps {
    post?: IPost;
}

export const PostDetail = ({post}: IPostDetailProps) => {
    return (
        <div>
            <PostCard post={post} />
            <p dangerouslySetInnerHTML={{__html: post?.detail || ""}} />
        </div>
    )
}