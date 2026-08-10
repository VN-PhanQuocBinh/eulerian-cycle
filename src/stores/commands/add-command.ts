import { Command } from "@/types/command";
import { graphService as graphServiceInstance } from "@/services/graph-service";

class AddCommand implements Command {

  constructor(
    private graphService: typeof graphServiceInstance,
  ) {}

  execute() {
    this.graphService.addNodeToCy({
      id: crypto.randomUUID(),
      label: "New Node",
      x: 0,
      y: 0,
    });
  }

  undo() {

  }
}

export default AddCommand;