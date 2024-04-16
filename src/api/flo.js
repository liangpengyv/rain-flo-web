import http from "./index";

export const getFlo = async () => {
  const response = await http.get("/flo");
  if (response) {
    return response.data;
  }
};

export const putFlo = async (data) => {
  const response = await http.put("/flo", data);
  if (response) {
    return response.data;
  }
};
