// import { Router, Response } from "express";
// import { HTTPMethodEnum } from "./definitions";

// // TODO: no any, proper typing
// const processHTTPReq = async (
//   p_router: Router, p_callback: any, p_path: string,
//   p_method: HTTPMethodEnum, p_res: Response,
//   p_search?: string, p_params?: any) => {
//   switch (p_method) {
//     case HTTPMethodEnum.get:
//       return await p_callback(p_search)
//         .then((success: boolean) => {
//           if (success) {
//             p_res.status(201);
//             p_res.json(true);
//           } else {
//             p_res.status(400);
//             p_res.json(false);
//           }
//         })
//         .catch((e: any) => {
//           // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
//           p_res.status(500);
//           p_res.json(e);
//         });
//     default:
//       return await p_callback(p_params)
//         .then((success: boolean) => {
//           if (success) {
//             p_res.status(201);
//             p_res.json(true);
//           } else {
//             p_res.status(400);
//             p_res.json(false);
//           }
//         })
//         .catch((e: any) => {
//           // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
//           p_res.status(500);
//           p_res.json(e);
//         }
// }