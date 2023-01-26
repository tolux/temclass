import { LogRequestError } from "@/utilities";
import { Fetch, Method } from "./fetch";

export enum EStatusCode {
  "notAllowed" = "405",
  "notFound" = "404",
  "success" = "200",
  "faild" = "500",
  "accessDenied" = "401",
}
// in catch(error) for access to error response just read from error.response
interface IResponse {
  data: object;
  status: number;
  statusText: string;
}
interface IError {
  response: IResponse;
}

interface RequestInterface {
  method?: Method;
  url: string;
  params?: object;
  body?: any;
}

const Request = async ({
  method = "GET",
  url,
  params,
  body,
}: RequestInterface) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const { data } = await Fetch({
        method,
        url,
        params,
        data: body,
      });

      resolve(data);
    } catch (error: any) {
      LogRequestError(error);
      reject(error);
      throw error;
    }
  });
};

export { Request };
