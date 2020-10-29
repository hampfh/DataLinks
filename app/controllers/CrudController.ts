import express, { Request, Response, NextFunction } from "express"

export interface ErrorPackage {
	message: string,
	code: number
}

export abstract class CrudController {
	public abstract create(req: Request, res: Response, next: NextFunction): void;
	public abstract read(req: Request, res: Response, next: NextFunction): void;
	public abstract update(req: Request, res: Response, next: NextFunction): void;
	public abstract delete(req: Request, res: Response, next: NextFunction): void;
	public fail(res: Response, error: ErrorPackage, status: number, next: express.NextFunction): void
	public fail(res: Response, errorMsg: string, status: number, next: express.NextFunction): void
	public fail(res: Response, error: string | ErrorPackage, status: number, next: express.NextFunction): void {
		res.status(status).json({
			message: typeof error === "string" ? error : error.message,
			code: error === "string" ? undefined : (error as ErrorPackage).code
		})
		next()
	}
}