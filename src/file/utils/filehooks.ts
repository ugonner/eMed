import { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react";
import { IFileAndObjectUrl } from "../components/MultipleFiles";
import { uploadMultipleFiles } from "../contexts/file";
import { IFile } from "../typings/file";
import { IAttachment } from "../../shared/interfaces/typings";

export const selectMultipleFiles = (evt: ChangeEvent<HTMLInputElement>, setSelectedFiles: Dispatch<SetStateAction<IFileAndObjectUrl[]>>) => {
        const files = evt.target.files;
        if(!files) return;
        const fileObjs: IFileAndObjectUrl[] = [];
        for(const file of files){
            fileObjs.push({
                file,
                objectUrl: URL.createObjectURL(file)
            });
        }
        setSelectedFiles((prev) => [...prev, ...fileObjs]);
    }

export const uploadFiles = async (
  selectedFiles: IFileAndObjectUrl[]
): Promise<IAttachment[] | null> => {
  try {
    if (selectedFiles.length === 0) return null;
    const payload = new FormData();
    selectedFiles.forEach((fileAndUrl, i) => {
      payload.append("files", fileAndUrl.file);
    });

    const res = await uploadMultipleFiles(payload);
    return res;
  } catch (error) {
    console.log("Error uploading files", (error as Error).message);
    return null;
  }
};

export const deleteFile = (
  fileObj: IFileAndObjectUrl,
  setSelectedFiles: Dispatch<SetStateAction<IFileAndObjectUrl[]>>
) => {
  setSelectedFiles((prev) =>
    prev.filter((f) => f.objectUrl !== fileObj.objectUrl)
  );
  URL.revokeObjectURL(fileObj.objectUrl);
};
