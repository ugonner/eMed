import { Dispatch, SetStateAction, useState } from "react";
import { IFileAndObjectUrl } from "./MultipleFiles";
import { IMedia } from "../typings/media";

export interface IDisplayMediaFilesProp {
  deleteFile: (mediaUrls: string[]) => void;
  selectedFiles: IMedia[];
  mediaOwnerId?: string;
}

export const DisplayMediaFiles = (prop: IDisplayMediaFilesProp) => {
  const  isAnAdmin = true;
  const userString = localStorage.getItem("user");
  const userId = userString ? JSON.parse(userString).id : null;
  const [markedForDelete, setMarkedForDelete] = useState([] as string[]);
  return (
    <div>
      {prop.selectedFiles.length && (
        <div className="row">
          {
            (isAnAdmin || userId == prop.mediaOwnerId) && (
                <div className="col-12">
            <div className="text-right">
                <i className="fa fa-close btn"
                onClick={() => prop.deleteFile(markedForDelete)}
                ></i>
            </div>
          </div>
            ) 
          }
          {prop.selectedFiles.map((media) => (
            <div className="col-sm-4">
              {(isAnAdmin || userId == prop.mediaOwnerId) && (
                <div>
                  {markedForDelete.includes(media.mediaUrl) ? (
                    <i
                      className="btn btn-transparent close"
                      onClick={() =>
                        setMarkedForDelete(
                          markedForDelete.filter((mD) => mD != media.mediaUrl)
                        )
                      }
                    ></i>
                  ) : (
                    <i
                      className="btn btn-transparent fa fa-check"
                      onClick={() =>
                        setMarkedForDelete([...markedForDelete, media.mediaUrl])
                      }
                    ></i>
                  )}
                </div>
              )}

              {/* render media */}
              {/image/i.test(media.mediaType) && (
                <img
                  src={media.mediaSecureUrl}
                  className="w-100 img-fluid img-responsive"
                />
              )}

              {/video/i.test(media.mediaType) && (
                <video
                  src={media.mediaSecureUrl}
                  className="w-100 img-fluid img-responsive"
                ></video>
              )}

              {/audio/i.test(media.mediaType) && (
                <audio
                  src={media.mediaSecureUrl}
                  className="w-100 img-fluid img-responsive"
                  controls={true}
                ></audio>
              )}
              {!/image/i.test(media.mediaType) &&
                !/video/i.test(media.mediaType) &&
                !/audio/i.test(media.mediaType) && (
                  <embed
                    src={media.mediaSecureUrl}
                    className="w-100 img-fluid img-responsive"
                  ></embed>
                )}
              {/* end render media */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
