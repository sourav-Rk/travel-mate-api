import { inject, injectable } from "tsyringe";

import { IEvaluateBadgesUsecase } from "../../application/usecase/interfaces/badge/evaluate-badges.interface";
import { EVENT_EMMITER_TYPE, StatsUpdatePayload } from "../../shared/constants";
import { eventBus } from "../../shared/eventBus";
import { logger } from "../config/logger/winston.logger.config";

@injectable()
export class BadgeEvaluationHandlerService {
  constructor(
    @inject("IEvaluateBadgesUsecase")
    private readonly _evaluateBadgesUsecase: IEvaluateBadgesUsecase
  ) {
    this._registerEventListener();
  }

  private _registerEventListener(): void {
    eventBus.on(
      EVENT_EMMITER_TYPE.LOCAL_GUIDE_STATS_UPDATED,
      this.handleStatsUpdate.bind(this)
    );
  }

  private async handleStatsUpdate(payload: StatsUpdatePayload): Promise<void> {
    try {
      logger.info("Badge evaluation triggered", {
        guideProfileId: payload.guideProfileId,
        trigger: payload.trigger,
      });

      const result = await this._evaluateBadgesUsecase.execute(
        payload.guideProfileId
      );

      if (result.newlyAwardedBadges.length > 0) {
        logger.info("New badges awarded", {
          guideProfileId: payload.guideProfileId,
          badges: result.newlyAwardedBadges,
          totalBadges: result.totalBadges,
        });
      } else {
        logger.debug("No new badges awarded", {
          guideProfileId: payload.guideProfileId,
          totalBadges: result.totalBadges,
        });
      }
    } catch (error) {
      logger.error("Error evaluating badges", {
        guideProfileId: payload.guideProfileId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  }
}
