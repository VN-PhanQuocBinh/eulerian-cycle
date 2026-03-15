import { useAlgorithmStore } from "@/stores";
import { graphService } from "@/services/graph-service";
import { computeFinalStyles } from "@/core/helpers/compute-final-styles";
import { useCallback } from "react";

export const useStepControl = () => {
  const steps = useAlgorithmStore((state) => state.steps);
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);
  const nextStep = useAlgorithmStore((state) => state.nextStep);
  const prevStep = useAlgorithmStore((state) => state.prevStep);
  const jumpToStep = useAlgorithmStore((state) => state.jumpToStep);

  // Hàm lõi để cập nhật UI dựa trên index
  const syncUIToStep = (index: number) => {
    if (index < 0 || index >= steps.length) return;
    const finalStyles = computeFinalStyles(steps, index);
    graphService.applyStylesFromMap(finalStyles);
  };

  const next = useCallback(() => {
    if (currentStepIndex + 1 < steps.length) {
      const nextIdx = currentStepIndex + 1;
      nextStep(); // Cập nhật index trong store
      syncUIToStep(nextIdx); // Cập nhật canvas
    }
  }, [currentStepIndex, steps]);

  const previous = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      prevStep();
      syncUIToStep(prevIdx);
    }
  }, [currentStepIndex, steps]);

  const jumpTo = useCallback(
    (index: number) => {
      jumpToStep(index);
      syncUIToStep(index);
    },
    [jumpToStep, syncUIToStep],
  );

  return {
    next,
    previous,
    jumpTo,
    currentStepIndex,
    canForward: currentStepIndex + 1 < steps.length,
    canBackward: currentStepIndex > 0,
    totalSteps: steps.length,
  };
};
