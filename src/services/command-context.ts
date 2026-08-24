import { graphService } from "./graph-service";
import { useGraphDataStore } from "@/stores";

export interface CommandContext {
  graphService: typeof graphService;
  graphDataStore: ReturnType<typeof useGraphDataStore.getState>;
}

export const commandContext: CommandContext = {
  graphService,
  graphDataStore: useGraphDataStore.getState(),
};
