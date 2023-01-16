import { genToken } from "../../helpfun/genToken";
import { modalName } from "../../models";

export const validToken = async (req, res) => {
  try {
    const { token, email } = req.body;

    const existuser = await modalName.findOne({
      where: { email, vcode: token },
    });

    if (existuser) {
      existuser.isorginal = true;
      existuser.vcode = genToken();
      existuser.save();
      return res.json({ message: "valid token" });
    } else {
      return res.json({ errToken: "Invalid token" });
    }
  } catch (error) {
    return res.json({ err: "something went wrong, please check your network" });
  }
};
