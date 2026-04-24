import http from "node:http";

import { handleRequest } from "./api.js";

const PORT = Number(process.env.PORT ?? 4173);
const HOST = process.env.HOST ?? "127.0.0.1";

const server = http.createServer((req, res) => {
  handleRequest(req, res);
});

server.listen(PORT, HOST, () => {
  console.log(`MyTherapy running at http://${HOST}:${PORT}`);
});
