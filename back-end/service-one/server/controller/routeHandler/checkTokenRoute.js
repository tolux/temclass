import axios from "axios";
import { genToken } from "../../helpfun/genToken";
import { modalName } from "../../new/back-end/models";

export const checkTokenRoute = async (req, res) => {
  try {
    const { token, email } = req.body;

    console.log(token, email);

    const existuser = await modalName.findOne({
      where: { email, vcode: token },
    });

    if (existuser) {
      existuser.isorginal = true;
      existuser.vcode = genToken();
      existuser.save();
      let token = await axios.post("url", {
        user: existuser,
      });
      return res.json({ message: "valid token", data: token.data.token });
    } else {
      return res.json({ errToken: "Invalid token" });
    }
  } catch (error) {
    return res.json({ err: "something went wrong, please check your network" });
  }
};
