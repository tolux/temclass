import { AppConfig } from "@/constant/settings";
import axios, { Method } from "axios";

const Fetch = axios.create({
  baseURL: AppConfig.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export { Fetch };
export type { Method };
