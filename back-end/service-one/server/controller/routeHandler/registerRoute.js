import { genPass } from "../../new/back-end/helpFun/passValid";
import { modalName } from "../../new/back-end/models";
import { v4 as uuid } from "uuid";

export const register = async (req, res) => {
  try {
    // credential details for sign up
    const { email, password } = req.body;
    const existuser = await modalName.findOne({
      where: { email },
    });

    if (password.length < 8) {
      return res.json({
        err: "password character must aleast be 8 characters",
      });
    }
    if (!!existuser) {
      return res.json({ err: "Email already taken" });
    }
    // adding salt and pepering
    const salt = uuid();
    const peper = process.env.PEPPER_STRING;
    const pass = await genPass(salt + password + peper);

    await User.create({
      email,
      password: pass,
      salt,
    });
    return res.json({ message: "account created" });
  } catch (error) {
    console.log(error);
    return res.json({ err: "something went wrong, please check your network" });
  }
};
