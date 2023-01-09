import bcrypt from "bcrypt";

export const genPass = async (pass) => {
  const saltRounds = 10;
  let response = "";
  await bcrypt
    .hash(pass, saltRounds)
    .then((hash) => {
      console.log(`Hash: ${hash}`);
      response = hash;
    })
    .catch((err) => console.error(err.message));
  return response;
};

export const checkPass = async (userpass, databasepass) => {
  let response = "";
  await bcrypt
    .compare(userpass, databasepass)
    .then((res) => {
      response = res;
      console.log(res);
    })
    .catch((err) => (response = err));
  return response;
};
