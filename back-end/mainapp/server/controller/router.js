import express from "express";
// import mws from "../middleWare/mws";
import ServiceOne from "../../services/serviceone";

const serviceone = new ServiceOne();

// router.get("/api/userreg", RouterHandlers.userReg);
const router = express.Router();

module.exports = (params) => {
  const { serviceone } = params;

  // console.log(serviceone)

  router.get("/alldata", async (req, res) => {
    let data = await serviceone.getData();

    res.send({ data });
  });

  return router;
};
