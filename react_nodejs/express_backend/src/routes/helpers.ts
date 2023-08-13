// import { Router, Response } from "express";
// import { HTTPMethodEnum } from "./definitions";

// // TODO: no any, proper typing
// const processHTTPReq = async (
//   router: Router, callback: any, path: string,
//   method: HTTPMethodEnum, res: Response,
//   search?: string, params?: any) => {
//   switch (method) {
//     case HTTPMethodEnum.get:
//       return await callback(search)
//         .then((success: boolean) => {
//           if (success) {
//             res.status(201);
//             res.json(true);
//           } else {
//             res.status(400);
//             res.json(false);
//           }
//         })
//         .catch((e: any) => {
//           // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
//           res.status(500);
//           res.json(e);
//         });
//     default:
//       return await callback(params)
//         .then((success: boolean) => {
//           if (success) {
//             res.status(201);
//             res.json(true);
//           } else {
//             res.status(400);
//             res.json(false);
//           }
//         })
//         .catch((e: any) => {
//           // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
//           res.status(500);
//           res.json(e);
//         }
// }