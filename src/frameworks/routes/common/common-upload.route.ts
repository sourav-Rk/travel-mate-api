import { NextFunction, Request, Response, Router } from "express";

import { upload } from "../../cloudinary/cloudinary";
import { commonController } from "../../di/resolve";

interface MulterRequest extends Request {
  files: Express.Multer.File[];
}

export class CommonUploadRoutes {
  public router = Router();

  constructor(private role: "vendor" | "client") {
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router.post(
      `/images/upload`,
      upload.array("image", 5),
      (req: Request, res: Response, next: NextFunction) => {
        void commonController.uploadImages(req as MulterRequest, res, next);
      }
    );
  }
}
