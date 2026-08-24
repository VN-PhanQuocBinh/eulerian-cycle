import { Command } from "@/types/command";
import { GraphData } from "@/types/graph-data-store";
import { GraphAlgorithm } from "@/types/algorithm-store";
import { CommandContext } from "@/services/command-context";

class AutoLayoutCommand implements Command {
  private previousSnapshot: GraphData;

  constructor(
    private algorithm: GraphAlgorithm,
    private context: CommandContext,
  ) {
    this.previousSnapshot = this.context.graphService.getGraphSnapshot();
  }

  execute() {
    this.context.graphService.autoLayout(this.algorithm);
  }

  undo() {
    this.context.graphService.drawGraphFromData(this.previousSnapshot);
  }
}

export default AutoLayoutCommand;
