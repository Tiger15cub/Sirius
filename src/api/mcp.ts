import { Router } from "express";
import { createDefaultResponse, getSeason, sendErrorResponse } from "../utils";
import Users from "../models/Users";
import Accounts from "../models/Accounts";
import ProfileAthena from "../common/mcp/ProfileAthena";
import ProfileCommonCore from "../common/mcp/ProfileCommonCore";
import { CommonCoreData, CommonCoreProfile } from "../interface";

export default function initRoute(router: Router): void {
  router.post(
    [
      "/fortnite/api/game/v2/profile/:accountId/:wildcat/QueryProfile",
      "/fortnite/api/game/v2/profile/:accountId/:wildcat/SetHardcoreModifier",
    ],
    async (req, res) => {
      const { accountId, wildcat } = req.params;
      const { rvn, profileId } = req.query;

      const userAgent = req.headers["user-agent"];
      let season = getSeason(userAgent);

      if (wildcat === "dedicated_server") {
        return res.json(204).json({});
      }

      switch (profileId) {
        case "athena":
        case "profile0":
          const athenaProfile = await ProfileAthena(
            Users,
            Accounts,
            accountId,
            profileId,
            false,
            season,
            rvn
          );
          return res.json(athenaProfile);

        case "common_core":
        case "common_public":
          const commonCoreProfile = await ProfileCommonCore(
            Accounts,
            accountId,
            profileId
          );
          return res.json(commonCoreProfile);

        default:
          return res.json(
            createDefaultResponse([], profileId, (rvn as any) + 1)
          );
      }
    }
  );

  router.post(
    "/fortnite/api/game/v2/profile/:accountId/:wildcat/ClaimMfaEnabled",
    async (req, res) => {
      const { accountId, wildcat } = req.params;
      const { profileId } = req.query;

      if (wildcat === "dedicated_server") {
        return res.json(204).json({});
      }

      const CommonCore = await ProfileCommonCore(
        Accounts,
        accountId,
        profileId as string
      ).then((data) => {
        const commonCoreData = data as CommonCoreData;
        return commonCoreData.profileChanges.find(
          (profileChangesData) => profileChangesData.profile.stats.attributes
        );
      });

      if (!CommonCore) {
        return res
          .status(404)
          .json({ error: "CommonCore Profile does not exist." });
      }

      if (CommonCore.profile.stats.attributes.mfa_enabled) {
        return sendErrorResponse(
          res,
          "OperationForbidden",
          "MFA is already enabled on your account."
        );
      }
    }
  );
}
