import * as XLSX from "xlsx";

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
};
