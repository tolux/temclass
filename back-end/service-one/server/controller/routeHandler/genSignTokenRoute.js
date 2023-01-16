import jwt from "jsonwebtoken";
import { genPass } from "../../new/back-end/helpFun/passValid";

export const genSignTokenRoute = async (req, res) => {
  // pass user for the backend end though within the rout
  const { user } = req.body;

  const peper = process.env.PEPPER_STRING;
  const password = await genPass(user.salt + peper);
  const pass = await genPass(password + user.salt);

  // send user professoe

  const userInfo = {
    // example
    // firstname: user.firstname,
    // lastname: user.lastname,
    // phonenumber: user.phonenumber,
  };
  jwt.sign(
    {
      email: user.email,
      pass: pass,
      userInfo,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },

    (err, token) => {
      if (err) {
        return res.json({ err: "token cant be generated" });
      }
      return res.json({ token });
    }
  );
};
