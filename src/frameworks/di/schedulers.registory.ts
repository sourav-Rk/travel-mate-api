import { container } from "tsyringe";
import { ICron } from "../../entities/cronInterfaces/cron.interface";
import { PackageStatusCron } from "../cron/packageStatusCron";

export class SchedulerRegistory {
  static registerSchedulers(): void {
    container.register<ICron>("ICron",{
        useClass : PackageStatusCron
    });
  }
}
