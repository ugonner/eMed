import { useEffect, useState } from "react";
import { useLocation } from "react-router"
import { IPost } from "../interfaces/post";
import { Posts } from "../datasets/posts";
import { IonContent } from "@ionic/react";
import { PostDetail } from "../components/PostDetail";

export const PostDetailPage = () => {
    const queryParams = new URLSearchParams(useLocation().search);
    const postId = queryParams.get("pi");
    
    const [post, setPost] = useState<IPost>();

    useEffect(() => {
        const getPost = () => {
            const res = Posts.find((pt) => pt.id == Number(postId))
            setPost(res);
        }
        getPost();
    }, [])

    return (
        <IonContent>
            <PostDetail post={post} />
        </IonContent>
    )
}