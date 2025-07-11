import { Router, Request, Response } from "express";
import logger from "../utils/logger";
import { getUserById } from "../services/user";
import { ServiceResponseWithPayload, APIRegistrationResponse } from "../services/types";

const router = Router();

router.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  getUserById(id)
    .then((data: ServiceResponseWithPayload<APIRegistrationResponse | null>) => {
      res.json(data);
    })
    .catch((e: unknown) => {
      logger.error('error', e);
      res.status(500);
      res.json('failed');
    });
});

// router.get('/:id/families', (req: Request, res: Response) => {
//   userService.getRelatedFamilies(parseInt(req.params.id))
//     .then((fams: any) => {
//       console.log('DONE');
//       res.json({ "relatedFamilies": fams });
//     })
//     .catch((e: unknown) => {
//       winston.log('error', e); //TODO: logging and error handling
//       console.log('ERRORRRR: ', e);

//       res.status(500);
//       res.json('failed');
//     });
// });

// router.get('/:id/extended-families', (req: Request, res: Response) => {
//   userService.getExtendedFamiliesDetails(parseInt(req.params.id))
//     .then((fams: any) => {
//       console.log('DONE');
//       res.json({ "relatedFamilies": fams });
//     })
//     .catch((e: unknown) => {
//       winston.log('error', e); //TODO: logging and error handling
//       console.log('ERRORRRR: ', e);

//       res.status(500);
//       res.json('failed');
//     });
// });

export default router;