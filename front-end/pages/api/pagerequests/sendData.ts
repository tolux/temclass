import { Request } from "../request";

const sendData = {
  testdata: () => Request({ url: "/somethin" }),
};

export { sendData };
