// front end
const handleFile = (event) => {
  setisLoading(true);
  // setFile(URL.createObjectURL(event.target.files[0]));
  var file = event.target.files[0];
  var reader = new FileReader();

  const callback = async (imgConx) => {
    let data = {
      imgdata: imgConx,
    };
    //   uploading img to server
    await axios
      .post(url, data)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  reader.onloadend = function () {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
};

const { imgdata, email, name } = req.body;
if (!name) {
  res.json({
    error: "Name is required",
  });
}
if (!email) {
  res.json({
    error: "Email is required",
  });
}
const userCredentials = await User.findOne({ where: { email: email } });
if (!userCredentials) {
  return res.json({
    error: "Email not found",
  });
}
try {
  let thePicName = name.replace(/\s/g, "") + Date.now();
  // to declare some path to store your converted image
  const path = "./resources/images/" + thePicName + ".png";
  // to convert base64 format into random filename
  const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, "");
  fs.writeFileSync(path, base64Data, { encoding: "base64" });
  let url =
    req.protocol + "://" + req.get("host") + "/images/" + thePicName + ".png";
  // update user image column
  await User.update({ img_url: url }, { where: { email: email } });
  return res.json({
    message: url,
  });
} catch (error) {
  console.log("An error occurred => ", error);
  return res.status(400).send("Error, please try again.");
}
New;
