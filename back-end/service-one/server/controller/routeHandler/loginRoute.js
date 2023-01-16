import jwt from "jsonwebtoken";
import { checkPass, genPass } from "../../new/back-end/helpFun/passValid";
import { modalName } from "../../new/back-end/models";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await modalName.findOne({
      where: { email },
    });

    if (!user) {
      return res.json({ err: "Invalid credential" });
    }

    if (user.throt > 2) {
      return res.json({ err: "Account subspended" });
    }
    const peper = process.env.PEPPER_STRING;
    const pass = await genPass(password + user.salt);
    let isValid = await checkPass(user.salt + password + peper, user.password);

    if (!!user && !!isValid) {
      const userInfo = {
        // firstname: user.firstname,
        // lastname: user.lastname,
        // phonenumber: user.phonenumber,
        // email,
        // isorginal: user.isorginal,
        // gender: user.gender,
        // state: user.state,
        // address: user.address,
        // photopath: user.photopath,
      };
      jwt.sign(
        {
          email,
          pass: pass,
          userInfo,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },

        (err, token) => {
          if (err) {
            return res.json({ err: "token cant be generated" });
          }

          return res.status(200).json({ token });
        }
      );
      return;
    }

    return res.send({ err: "Invalid credential." });
  } catch (error) {
    return res.send({ err: "something went wrong..." });
  }
};
