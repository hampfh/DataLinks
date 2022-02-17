import { Request, Response, NextFunction } from "express"
import { ParamsDictionary } from "express-serve-static-core"
import FileModel from "models/file.model"
import { ParsedQs } from "qs"
import { CrudController } from "./CrudController"
import { getFilesSchema } from "./schemas"

class FilesController extends CrudController{
	public create(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) {
		throw new Error("Method not implemented.")
	}
	public read(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) {
		const error = getFilesSchema.validate(req.query)
		if (error) {
			return res.status(400).json({
				message: error.error?.message
			})
		}
		
		
	}
	public update(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) {
		throw new Error("Method not implemented.")
	}
	public delete(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) {
		throw new Error("Method not implemented.")
	}

}

export const Files = new FilesController()