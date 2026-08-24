import { Command } from "@/types/command";
import { graphService } from "@/services/graph-service";
import { useGraphDataStore } from "../graph-data-store";
import { GraphData } from "@/types/graph-data-store";

class ClearGraphCommand implements Command {
  private previousSnapshot: GraphData;

  constructor() {
    this.previousSnapshot = graphService.getGraphSnapshot();
  }

  execute() {
    graphService.clearCanvas();
    useGraphDataStore.getState().clearGraphData();
  }

  undo() {
    graphService.drawGraphFromData(this.previousSnapshot);
    useGraphDataStore.getState().updateGraphData(this.previousSnapshot);
  }
}

export default ClearGraphCommand;
