import express from "express";
import mws from "../middleWare/mws";

// router.get("/api/userreg", RouterHandlers.userReg);
const router = express.Router();

// module.exports = () => {

//   // middle on admin route

// router.use("/api/admin", mws.isAdmin);

//   return router;
// };

// router.get("/test", (req, res) => {
//   throw new Error("is deaing");
// });
// router.get("/message", (req, res) => {
//   res.ses = "am here";

//   res.send({ mess: res.ses });
// });

router.get("/alldata", (req, res) => {
  res.send({ data: "hello world" });
});

module.exports = router;
