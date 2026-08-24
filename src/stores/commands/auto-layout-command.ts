import { Command } from "@/types/command";
import { graphService } from "@/services/graph-service";
import { GraphData } from "@/types/graph-data-store";
import { GraphAlgorithm } from "@/types/algorithm-store";

class AutoLayoutCommand implements Command {
  private previousSnapshot: GraphData;

  constructor(private algorithm: GraphAlgorithm) {
    this.previousSnapshot = graphService.getGraphSnapshot();
  }

  execute() {
    graphService.autoLayout(this.algorithm);
  }

  undo() {
    graphService.drawGraphFromData(this.previousSnapshot);
  }
}

export default AutoLayoutCommand;
