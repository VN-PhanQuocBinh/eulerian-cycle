import { commandContext } from "@/services/command-context";
import commandManager from "@/stores/command-manager";
import { useToast } from "@/components/ui/toast";
import { Command } from "@/types/command";
import {
  AddNodeCommand,
  RemoveNodeCommand,
  MoveNodesCommand,
  AddEdgeCommand,
  RemoveEdgeCommand,
  BatchRemoveCommand,
  SyncEdgeListCommand,
  UpdateLabelCommand,
  ClearGraphCommand,
  AutoLayoutCommand,
} from "@/stores/commands";
import { CommandPayload } from "@/utils/command-utils";

export const useCommandManager = () => {
  const { showToast } = useToast();

  const runSafely = (fn: () => void, errorMessage: string) => {
    try {
      fn();
    } catch (error) {
      console.error("Error executing command:", error);
      showToast({
        message: errorMessage,
        type: "error",
      });
    }
  };

  const execute = (command: Command) => {
    runSafely(() => {
      commandManager.executeCommand(command);
    }, "An error occurred while executing the command.");
  };

  const undo = () => {
    runSafely(() => {
      commandManager.undo();
    }, "An error occurred while undoing the command.");
  };

  const redo = () => {
    runSafely(() => {
      commandManager.redo();
    }, "An error occurred while redoing the command.");
  };

  const executeAddNodeCommand = (...params: CommandPayload<typeof AddNodeCommand>) => {
    const command = new AddNodeCommand(...params, commandContext);
    commandManager.executeCommand(command);
  };

  const executeRemoveNodeCommand = (...params: CommandPayload<typeof RemoveNodeCommand>) => {
    const command = new RemoveNodeCommand(...params, commandContext);
    commandManager.executeCommand(command);
  };

  const executeMoveNodesCommand = (...params: CommandPayload<typeof MoveNodesCommand>) => {
    const command = new MoveNodesCommand(...params, commandContext);
    commandManager.executeCommand(command);
  };

  const executeAddEdgeCommand = (...params: CommandPayload<typeof AddEdgeCommand>) => {
    const command = new AddEdgeCommand(...params, commandContext);
    commandManager.executeCommand(command);
  };

  const executeRemoveEdgeCommand = (...params: CommandPayload<typeof RemoveEdgeCommand>) => {
    const command = new RemoveEdgeCommand(...params, commandContext);
    commandManager.executeCommand(command);
  };

  const executeBatchRemoveCommand = (...params: CommandPayload<typeof BatchRemoveCommand>) => {
    const command = new BatchRemoveCommand(...params, commandContext);
    commandManager.executeCommand(command);
  };

  const executeSyncEdgeListCommand = (...params: CommandPayload<typeof SyncEdgeListCommand>) => {
    const command = new SyncEdgeListCommand(...params, commandContext);
    commandManager.executeCommand(command);
  };

  const executeUpdateLabelCommand = (...params: CommandPayload<typeof UpdateLabelCommand>) => {
    const command = new UpdateLabelCommand(...params, commandContext);
    commandManager.executeCommand(command);
  };

  const executeClearGraphCommand = (...params: CommandPayload<typeof ClearGraphCommand>) => {
    const command = new ClearGraphCommand(...params, commandContext);
    commandManager.executeCommand(command);
  };

  const executeAutoLayoutCommand = (...params: CommandPayload<typeof AutoLayoutCommand>) => {
    const command = new AutoLayoutCommand(...params, commandContext);
    commandManager.executeCommand(command);
  };

  return {
    execute,
    undo,
    redo,
    commands: {
      executeAddNodeCommand,
      executeRemoveNodeCommand,
      executeMoveNodesCommand,
      executeAddEdgeCommand,
      executeRemoveEdgeCommand,
      executeBatchRemoveCommand,
      executeSyncEdgeListCommand,
      executeUpdateLabelCommand,
      executeClearGraphCommand,
      executeAutoLayoutCommand,
    },
  };
};
