import { CFormText } from "@coreui/react";
import React from "react";
import Dropzone from "react-dropzone";
import meColors from "./meColors";

function MEDropzone(props) {
  const { onDrop, file, rejectionMessage, error, inputProps, label } = props;

  return (
    <Dropzone onDrop={onDrop} {...inputProps}>
      {dz => (
        <div
          style={{
            width: "100%"
          }}
        >
          {label && <label>{label}</label>}
          <div
            style={{
              width: "100%",
              textAlign: "center",
              borderRadius: "16px",
              transition: "150ms",
              border: error && `1px solid ${meColors.primary.main}`,
              background: dz.isDragReject
                ? meColors.primary[4]
                : !dz.isDragActive && !dz.isFileDialogActive
                ? meColors.white1
                : meColors.secondary[4]
            }}
          >
            <div
              style={{
                width: "100%",
                padding: "48px",
                cursor: "pointer"
              }}
              {...dz.getRootProps()}
            >
              <input {...dz.getInputProps()} />
              {file && (
                <p>
                  {file.name} - {file.type} - {file.size}B
                </p>
              )}
              <p>
                {dz.isDragReject
                  ? rejectionMessage || "Please input valid file type"
                  : dz.isDragActive
                  ? `Drop your ${
                      dz.getInputProps().multiple ? "files" : "file"
                    } here`
                  : `Drag and drop your ${
                      dz.getInputProps().multiple ? "files" : "file"
                    } here, or click to select ${
                      dz.getInputProps().multiple ? "files" : "a file"
                    }`}
              </p>
            </div>
          </div>
          <CFormText className="help-block">{error?.message}</CFormText>
        </div>
      )}
    </Dropzone>
  );
}

export default MEDropzone;
