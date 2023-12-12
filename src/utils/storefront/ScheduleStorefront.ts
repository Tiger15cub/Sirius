import { DateTime } from "luxon";
import log from "../log";
import Shop from "./generator/Shop";
import { SavedData } from "./types/ShopTypes";

export default async function Schedule(maxAttempts?: number): Promise<void> {
  let attempts = 0;
  let hasLoggedSchedulingMessage = false;

  const currentDateTime = DateTime.local().setZone("GMT");

  while (attempts < (maxAttempts || 5)) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!hasLoggedSchedulingMessage) {
      log.log("Scheduling Storefront Generation...", "Schedule", "blue");
      hasLoggedSchedulingMessage = true;
    }

    if (
      currentDateTime.hour === 17 &&
      currentDateTime.minute === 59 &&
      currentDateTime.second >= 59
    ) {
      const savedData: SavedData = {
        weekly: [],
        weeklyFields: [],
        daily: [],
        dailyFields: [],
      };

      await new Promise((resolve) => setTimeout(resolve, 10000));
      await Shop.Initialize(savedData);

      break;
    } else {
      log.error(
        "Cannot generate shop at this time. Stopping scheduling.",
        "Schedule"
      );
    }

    attempts++;
  }
}
