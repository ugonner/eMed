import { APIBaseURL } from "../../shared/api/base";
import { IAttachment } from "../../shared/interfaces/typings";

export const uploadMultipleFiles = async (payload: FormData): Promise<IAttachment[]> => {
    
    const res = await fetch(`${APIBaseURL}/file-upload/multiple`, {
        method: "post",
        body: payload
    });
    const resBody = await res.json();
    if(!res.ok) throw resBody;
    return resBody.data;
}