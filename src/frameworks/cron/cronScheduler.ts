import { injectable, injectAll } from "tsyringe";
import { ICron } from "../../entities/cronInterfaces/cron.interface";
import { ICronScheduler } from "../../entities/cronInterfaces/cronScheduler.interface";

@injectable()
export class CronScheduler implements ICronScheduler{
  constructor(
    @injectAll("ICron")
    private _cronJob: ICron[]
  ) {}

  startAll(): void {
    this._cronJob.forEach((job) => job.start());
  }
}
