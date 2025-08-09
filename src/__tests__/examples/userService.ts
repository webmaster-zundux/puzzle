import * as axios from "./axios";

const API_ENDPOINT = "https://jsonplaceholder.typicode.com";

export function findOne(id: number) {
  return axios.get(`${API_ENDPOINT}/users/${id}`).then((response) => response.data);
}
