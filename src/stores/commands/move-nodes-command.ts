import { Command } from "@/types/command";
import { NodePositionChange } from "@/types/command";
import { graphService } from "@/services/graph-service";
import { UpdateNodePayload } from "@/types/service";

class MoveNodesCommand implements Command {
  constructor(private changes: NodePositionChange[]) {}

  execute() {
    const updatedNodes = this.getUpdateNodePayloads("new");
    graphService.updateNodesInCy(updatedNodes);
  }

  undo() {
    const revertedNodes: UpdateNodePayload[] = this.getUpdateNodePayloads("old");
    console.log("Reverting nodes to previous positions:", revertedNodes);
    graphService.updateNodesInCy(revertedNodes);
  }

  private getUpdateNodePayloads(type: keyof NodePositionChange["position"]): UpdateNodePayload[] {
    return this.changes.map(
      (change): UpdateNodePayload => ({
        id: change.id,
        x: change.position[type].x,
        y: change.position[type].y,
      }),
    );
  }
}

export default MoveNodesCommand;
