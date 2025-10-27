import { container } from "tsyringe";

import { PackageStatusCron } from "../cron/packageStatusCron";
import { ICron } from "../interface/cron.interface";

export class SchedulerRegistory {
  static registerSchedulers(): void {
    container.register<ICron>("ICron", {
      useClass: PackageStatusCron,
    });
  }
}
