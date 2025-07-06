import BaseController from "../Base.controller";
import { Request } from "express";
import { APIRequestPayload } from "../controllers.definitions";
import FamilyTree from "../../models/FamilyTree";
import { APIFamilyTreeDAO, APIGetFamilyTreeResponse } from "./familyTree.definitions";
import { FamilyTreeService } from "../../services";

class FamilyTreeController extends BaseController<any> {
  constructor() {
    super('trees');
  }
  /*
  * Controller methods take the request and send the service payload to the 
  * response helper method. The response to the client is handled there
  */

  public getAll = async (req: Request<{}, {}, { userId: string }, {}>): Promise<APIRequestPayload<FamilyTree[]>> => {
    const service = new FamilyTreeService();
    return await service.getAllTrees(req.body.userId);
  }

  public create = async (req: Request<{}, APIFamilyTreeDAO, APIFamilyTreeDAO, {}>): Promise<APIRequestPayload<APIGetFamilyTreeResponse | null>> => {
    const service = new FamilyTreeService();
    return await service.createTree(req.body, req.body.userId);
  }

  public getOne = async (req: Request<{}, {}, { id: string }, {}>): Promise<APIRequestPayload<FamilyTree | null>> => {
    const service = new FamilyTreeService();
    return await service.getTreeById(req.body.id);
  }

  public delete = async (req: Request): Promise<any> => {
    return true;
  }

  public update = async (req: Request<{}, {}, {updateData: any}, {}>): Promise<APIRequestPayload<APIGetFamilyTreeResponse | null>> => {
    const service = new FamilyTreeService();
    return await service.updateTree(req.body.updateData);
  }

  public getMembers = async (req: Request): Promise<any> => {
    return true;
  }
}

export default FamilyTreeController;