import { genToken } from "../../helpfun/genToken";
import { User } from "../../new/back-end/models";

export const sendCode = async (req, res) => {
  try {
    const { email } = req.body;
    const existuser = await User.findOne({
      where: { email },
    });

    if (!!existuser) {
      let code = genToken();
      existuser.vcode = code;
      existuser.save();
      return res.json({ message: "Code sent", code });
    }
  } catch (error) {
    return res.json({ err: "something went wrong, please check your network" });
  }
};
