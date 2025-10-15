import { Dispatch, SetStateAction } from "react";
import { IFileAndObjectUrl } from "./MultipleFiles";

export interface IDisplayMultipleFilesProp {
  deleteFile: (fileObj: IFileAndObjectUrl, setSelectedFiles: Dispatch<SetStateAction<IFileAndObjectUrl[]>>) => void;
  selectedFiles: IFileAndObjectUrl[];
  setSelectedFiles: Dispatch<SetStateAction<IFileAndObjectUrl[]>>;
}

export const DisplayMultipleFiles = (prop: IDisplayMultipleFilesProp) => {
  return (
    <div>
      {prop.selectedFiles.length > 0 && (
        <div className="row">
          {prop.selectedFiles.map((fileObj, i) => {
            if (/image/i.test(fileObj.file.type)) {
              return (
                <div key={i} className="col-sm-6">
                  <div className="text-right">
                    <i
                      className="btn btn-transparent close"
                      onClick={() => prop.deleteFile(fileObj, prop.setSelectedFiles)}
                    ></i>
                  </div>
                  <div>
                    <img
                      className="w-100 img-fluid img-responsive"
                      src={fileObj.objectUrl}
                      key={`image${i}`}
                    />
                  </div>
                </div>
              );
            } else if (/video/i.test(fileObj.file.type)) {
              return (
                <div className="col-sm-6">
                  <div className="text-right">
                    <i
                      className="btn btn-transparent close"
                      onClick={() => prop.deleteFile(fileObj, prop.setSelectedFiles)}
                    ></i>
                  </div>
                  <div>
                    <video
                      className="w-100 img-fluid img-responsive"
                      src={fileObj.objectUrl}
                      key={`image${i}`}
                      controls={true}
                    ></video>
                  </div>
                </div>
              );
            } else if (/audio/i.test(fileObj.file.type)) {
              return (
                <div className="col-sm-6">
                  <div className="text-right">
                    <i
                      className="btn btn-transparent close"
                      onClick={() => prop.deleteFile(fileObj, prop.setSelectedFiles)}
                    ></i>
                  </div>
                  <div>
                    <audio
                      className="w-100 img-fluid img-responsive"
                      src={fileObj.objectUrl}
                      key={`image${i}`}
                      controls={true}
                    ></audio>
                  </div>
                </div>
              );
            } else {
              return (
                <div className="col-sm-6">
                  <div className="text-right">
                    <i
                      className="btn btn-transparent close"
                      onClick={() => prop.deleteFile(fileObj, prop.setSelectedFiles)}
                    ></i>
                  </div>
                  <div>
                    <embed
                      className="w-100 img-fluid img-responsive"
                      src={fileObj.objectUrl}
                      key={`image${i}`}
                    ></embed>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};
