import { injectable, injectAll } from "tsyringe";

import { ICron } from "../interface/cron.interface";
import { ICronScheduler } from "../interface/cronScheduler.interface";

@injectable()
export class CronScheduler implements ICronScheduler {
  constructor(
    @injectAll("ICron")
    private _cronJob: ICron[]
  ) {}

  startAll(): void {
    this._cronJob.forEach((job) => job.start());
  }
}
