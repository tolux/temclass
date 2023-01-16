import { genPass } from "../../new/back-end/helpFun/passValid";
import { modalName } from "../../new/back-end/models";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";

export const updateUserRoute = async (req, res) => {
  try {
    const { formData } = req.body;
    const existuser = await modalName.findOne({
      where: { email: formData.email },
    });

    if (!!existuser) {
      if (!!formData.password && formData.password.length < 8) {
        return res.json({
          err: "password character must aleast be 8 characters",
        });
      }
      const salt = uuid();
      const peper = process.env.PEPPER_STRING;
      const pass = await genPass(existuser.salt + formData.password + peper);

      if (!!formData.password) {
        formData.password = pass;
        console.log(formData);
      }

      const updateUser = await existuser.update(
        formData, //what going to be updated
        { where: { email: formData.email } } // where clause
      );

      const userInfo = {
        // user profile
        // firstname: updateUser.firstname,
        // lastname: updateUser.lastname,
        // phonenumber: updateUser.phonenumber,
        // email: updateUser.email,
        // isorginal: updateUser.isorginal,
        // address: updateUser.address,
        // photopath: updateUser.photopath,
        // gender: updateUser.gender,
        // state: updateUser.state,
      };
      const passtoken = await genPass(uuid() + uuid());
      jwt.sign(
        {
          email: existuser.email,
          pass: passtoken,
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
      // return res.json({ message: "account updated", data: existuser });
    } else {
      res.send({ err: "Invalid user" });
    }

    // adding salt and pepering
  } catch (error) {
    // console.log(error);
    return res.json({ err: "something went wrong, please check your network" });
  }
};
