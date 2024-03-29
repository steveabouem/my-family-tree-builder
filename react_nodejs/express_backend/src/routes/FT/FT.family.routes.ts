import { Router, Request, Response, NextFunction } from "express";
import FTFam from "../../models/FT.family";
import FTAuthMiddleware from "../../middleware-classes/FT/auth/FT.auth.middleware";
import { DFTFamDTO } from "../../middleware-classes/FT/family/FT.family.definitions";
import { FTFamilyMiddleware } from "../../middleware-classes/FT/family/FT.family.middleware";
import { DFamilyTreeDTO } from "../../middleware-classes/FT/tree/FT.tree.definitions";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ftAuthMiddleware = new FTAuthMiddleware();

  ftAuthMiddleware.verifyIp(ip)
    .then((valid: boolean) => {
      if (!valid) {
        res.status(400);
        res.json('IP is not approved');
      }
    })
    .catch(e => {
      // TODO: catch return false doesnt actually catch falty logic, 
      // just wrong syntax and maybe wrong typing. FIX
      res.status(500);
      res.json('Error: ' + e);
    });

  next();
})

// TODO: override Request type with something more precise 
// Ideally make a base route handlers class that will accept generics in request 
// and return appropriate types...maybe generics as well ?
router.get('/index', (req: Request, res: Response) => {
  const ftFamMiddleware = new FTFamilyMiddleware();
  const idList = `${req.query.ids}`;

  ftFamMiddleware.getBulkData(idList)
    .then((data) => {
      res.status(200);
      res.json(data)
    })
    .catch(e => {
      console.log('Error getting tree', e); // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
      res.status(500);
      res.json(undefined);
    });
});

router.post('/create', (req: Request, res: Response) /**TODO: return type */ => {
  const ftFamMiddleware = new FTFamilyMiddleware;

  ftFamMiddleware.create(req.body)
    .then((success: boolean) => {
      if (success) {
        res.status(201);
        res.json(true);
      } else {
        res.status(400);
        res.json(false);
      }
    })
    .catch(e => {
      // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
      res.status(500);
      res.json(e);
    });
});

router.get('/:id', (req: Request, res: Response) => {
  const ftFamMiddleware = new FTFamilyMiddleware;
  ftFamMiddleware.getFamily(parseInt(req.params.id))
    .then((r: FTFam | null) => {
      res.status(200);
      res.json(r);
    })
    .catch(e => {
      res.status(500);
      res.json(e);
    });
});

router.put('/:id', (req: Request, res: Response) => {
  const ftFamMiddleware = new FTFamilyMiddleware;
  console.log('RUNNING');

  ftFamMiddleware.update(req.body, parseInt(req.params.id))
    .then((success: boolean) => {
      if (success) {
        res.status(201);
        res.json(true);
      } else {
        res.status(400);
        res.json(false);
      }
    })
    .catch(e => {
      console.log(e); //TODO: LOGGING
      res.status(500);
      res.json(e)
    });

});

router.post('/:id/tree', (req: Request, res: Response) => {
  const ftFamMiddleware = new FTFamilyMiddleware;
  ftFamMiddleware.linkToTree(parseInt(req.params.id), req.body.id)
    .then((success: boolean) => {
      if (success) {
        res.status(201);
        res.json(true);
      } else {
        res.status(400);
        res.json(false);
      }
    })
    .catch(e => {
      console.log('Error linking tree', e); // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
      res.status(500);
      res.json(false);

    });
});

router.get('/:id/tree', (req: Request, res: Response) => {
  const ftFamMiddleware = new FTFamilyMiddleware;
  ftFamMiddleware.getTree(parseInt(req.params.id))
    .then((tree?: number) => {
      if (tree) {
        res.status(200);
        res.json(tree);
      } else {
        res.status(400);
        res.json(null);
      }
    })
    .catch(e => {
      console.log('Error getting tree', e); // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
      res.status(500);
      res.json(undefined);
    });
});


export default router;