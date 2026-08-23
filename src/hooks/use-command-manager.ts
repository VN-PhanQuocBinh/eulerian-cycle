import commandManager from "@/stores/command-manager";
import { useToast } from "@/components/ui/toast";
import { Command } from "@/types/command";

export const useCommandManager = () => {
  const { showToast } = useToast();

  const execute = (command: Command) => {
    try {
      commandManager.executeCommand(command);
    } catch (error) {
      console.error("Error executing command:", error);
      showToast({
        message: "An error occurred while executing the command.",
        type: "error",
      });
    }
  };

  const undo = () => {
    try {
      commandManager.undo();
    } catch (error) {
      console.error("Error undoing command:", error);
      showToast({
        message: "An error occurred while undoing the command.",
        type: "error",
      });
    }
  };

  const redo = () => {
    try {
      commandManager.redo();
    } catch (error) {
      showToast({
        message: "An error occurred while redoing the command.",
        type: "error",
      });
    }
  };

  return {
    execute,
    undo,
    redo,
  };
};
