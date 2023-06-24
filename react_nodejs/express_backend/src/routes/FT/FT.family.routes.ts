import { Router, Request, Response, NextFunction } from "express";
import FTFam from "../../models/FT.family";
import FTAuthService from "../../services/FT/auth/FT.auth.service";
import { DFTFamDTO } from "../../services/FT/family/FT.family.definitions";
import { FTFamilyService } from "../../services/FT/family/FT.family.service";
import { DFamilyTreeDTO } from "../../services/FT/tree/FT.tree.definitions";

const router = Router();

router.use((p_req: Request, p_res: Response, p_next: NextFunction) => {
  const ip = p_req.headers['x-forwarded-for'] || p_req.socket.remoteAddress;
  const ftAuthService = new FTAuthService();

  ftAuthService.verifyIp(ip)
    .then((valid: boolean) => {
      if (!valid) {
        p_res.status(400);
        p_res.json('IP is not approved');
      }
    })
    .catch(e => {
      // TODO: catch return false doesnt actually catch falty logic, 
      // just wrong syntax and maybe wrong typing. FIX
      p_res.status(500);
      p_res.json('Error: ' + e);
    });

  p_next();
})

// TODO: override Request type with something more precise 
// Ideally make a base route handlers class that will accept generics in request 
// and return appropriate types...maybe generics as well ?
router.get('/index', (p_req: Request, p_res: Response) => {
  const ftFamService = new FTFamilyService();
  const idList = `${p_req.query.ids}`;

  ftFamService.getBulkData(idList)
    .then((data) => {
      p_res.status(200);
      p_res.json(data)
    })
    .catch(e => {
      console.log('Error getting tree', e); // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
      p_res.status(500);
      p_res.json(undefined);
    });
});

router.post('/create', (p_req: Request, p_res: Response) /**TODO: return type */ => {
  const ftFamService = new FTFamilyService;

  ftFamService.create(p_req.body)
    .then((success: boolean) => {
      if (success) {
        p_res.status(201);
        p_res.json(true);
      } else {
        p_res.status(400);
        p_res.json(false);
      }
    })
    .catch(e => {
      // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
      p_res.status(500);
      p_res.json(e);
    });
});

router.get('/:id', (p_req: Request, p_res: Response) => {
  const ftFamService = new FTFamilyService;
  ftFamService.getFamily(parseInt(p_req.params.id))
    .then((r: FTFam | null) => {
      p_res.status(200);
      p_res.json(r);
    })
    .catch(e => {
      p_res.status(500);
      p_res.json(e);
    });
});

router.put('/:id', (p_req: Request, p_res: Response) => {
  const ftFamService = new FTFamilyService;
  console.log('RUNNING');

  ftFamService.update(p_req.body, parseInt(p_req.params.id))
    .then((success: boolean) => {
      if (success) {
        p_res.status(201);
        p_res.json(true);
      } else {
        p_res.status(400);
        p_res.json(false);
      }
    })
    .catch(e => {
      console.log(e); //TODO: LOGGING
      p_res.status(500);
      p_res.json(e)
    });

});

router.post('/:id/tree', (p_req: Request, p_res: Response) => {
  const ftFamService = new FTFamilyService;
  ftFamService.linkToTree(parseInt(p_req.params.id), p_req.body.id)
    .then((success: boolean) => {
      if (success) {
        p_res.status(201);
        p_res.json(true);
      } else {
        p_res.status(400);
        p_res.json(false);
      }
    })
    .catch(e => {
      console.log('Error linking tree', e); // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
      p_res.status(500);
      p_res.json(false);

    });
});

router.get('/:id/tree', (p_req: Request, p_res: Response) => {
  const ftFamService = new FTFamilyService;
  ftFamService.getTree(parseInt(p_req.params.id))
    .then((tree?: number) => {
      if (tree) {
        p_res.status(200);
        p_res.json(tree);
      } else {
        p_res.status(400);
        p_res.json(null);
      }
    })
    .catch(e => {
      console.log('Error getting tree', e); // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
      p_res.status(500);
      p_res.json(undefined);
    });
});


export default router;