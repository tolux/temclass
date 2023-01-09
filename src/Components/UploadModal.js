import React, { useState, useRef, useReducer } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { RiCloseCircleFill } from "react-icons/ri";
import { FaCloudUploadAlt } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import * as XLSX from "xlsx";
import { SpinnerLoader } from "../Spinner/SpinnerLoader";
import Table from "react-bootstrap/Table";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./css.css";

export const UploadModal = (props) => {
  const [fileName, setFileName] = useState(null);
  const [shetts, setShetts] = useState([]);
  const [sheetFileName, setSheetFileName] = useState(null);
  const [sheetData, setSheetData] = useState(null);
  const [isUploading, setIsUploading] = useReducer((stx) => !stx, false);

  const acceptFileName = ["xlsx", "xls"];

  const fileRef = useRef();

  const removeFile = () => {
    setFileName(null);
    fileRef.current.value = "";
    setSheetData(null);
    setSheetFileName(null);
  };

  const readDataFromExcel = (data) => {
    const wb = XLSX.readFile(data);
    setShetts(wb.SheetNames);

    let mySheetData = {};
    // loop to get the data
    for (let idx = 0; idx < wb.SheetNames.length; idx++) {
      let sheetNames = wb.SheetNames[idx];
      const workSheet = wb.Sheets[sheetNames];
      const jsonData = XLSX.utils.sheet_to_json(workSheet, {
        blankrows: "",
        header: 1,
      });
      mySheetData[sheetNames] = jsonData;
    }
    setSheetData(mySheetData);
    setSheetFileName(Object.keys(mySheetData)[0]);
    setIsUploading(false);
  };

  const checkfileName = (name) => {
    return acceptFileName.includes(name.split(".").pop().toLowerCase());
  };

  // covert excel file to obj model for database
  const sendUplaod = async () => {
    setSuccMxg("");
    seterrMxg("");
    if (sheetData === null) return;
    setIsUploading();
    sheetData[sheetFileName].splice(0, 1);
    const uploadFiles = sheetData[sheetFileName];

    let converUploadFile = uploadFiles.map((file, idx) =>
      Object.assign({}, file)
    );
    let mainUploadFiles = converUploadFile.map((file) =>
      renameKeys(file, obbj)
    );
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];

    if (!file) return;
    if (!checkfileName(file.name)) {
      alert("invalid filr type");
      return;
    }
    setIsUploading(true);
    const data = await file.arrayBuffer();

    readDataFromExcel(data);
    setFileName(file);
  };

  return (
    <>
      <Modal
        show={props.showUploadModal}
        fullscreen={true}
        onHide={props.setShowUploadModal}
        className="upload_modal"
      >
        <Modal.Header className="align-items-center" closeButton>
          <Modal.Title>
            <Form.Group
              controlId="formFile"
              className="mb-3 d-flex align-items-center"
            >
              <Form.Control
                accept="xlsx, xls"
                multiple={false}
                onChange={handleFile}
                ref={fileRef}
                type="file"
                className="me-3 "
              />

              {!!fileName && (
                <Button
                  variant="success"
                  className="text-success  touch  text-white d-flex align-items-center"
                >
                  <span className="me-3">Upload</span>
                  <FaCloudUploadAlt className=" " />
                </Button>
              )}
              {!!fileName && (
                <Button
                  variant="danger"
                  onClick={removeFile}
                  className="text-success  touch ms-3 text-white d-flex align-items-center"
                >
                  <span className="me-3">Remove</span>
                  <RiCloseCircleFill />
                </Button>
              )}
              <span></span>
            </Form.Group>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isUploading ? (
            <SpinnerLoader size="lg" />
          ) : (
            <>
              {!!sheetFileName && (
                <h6>
                  File Name : <span className="fw-bold">{sheetFileName}</span>
                </h6>
              )}

              {!!sheetData && (
                <div>
                  <Table
                    className="bg-white users_table"
                    bordered
                    striped
                    size="lg"
                    responsive="lg"
                  >
                    <thead>
                      <tr>
                        <th>Name</th>

                        <th>country</th>
                        <th> Full/partial</th>
                        <th> Document</th>
                        <th> links</th>
                        <th> End Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sheetData[sheetFileName].slice(1).map((row) => (
                        <tr>
                          {row.map((c) => (
                            <>
                              <td>{c}</td>
                            </>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
