import { Command } from "@/types/command";
import { GraphData } from "@/types/graph-data-store";
import { CommandContext } from "@/services/command-context";

class ClearGraphCommand implements Command {
  private previousSnapshot: GraphData;

  constructor(private context: CommandContext) {
    this.previousSnapshot = this.context.graphService.getGraphSnapshot();
  }

  execute() {
    this.context.graphService.clearCanvas();
    this.context.graphDataStore.clearGraphData();
  }

  undo() {
    this.context.graphService.drawGraphFromData(this.previousSnapshot);
    this.context.graphDataStore.updateGraphData(this.previousSnapshot);
  }
}

export default ClearGraphCommand;
