import { useAlgorithmStore } from "@/stores";
import { graphService } from "@/services/graph-service";
import { computeFinalStyles } from "@/core/helpers/compute-final-styles";
import { useCallback } from "react";

export const useStepControl = () => {
  const steps = useAlgorithmStore((state) => state.steps);
  const nextStep = useAlgorithmStore((state) => state.nextStep);
  const prevStep = useAlgorithmStore((state) => state.prevStep);
  const jumpToStep = useAlgorithmStore((state) => state.jumpToStep);
  const currentStepIndex = useAlgorithmStore((state) => state.currentStepIndex);

  const isLastStep = useCallback((index: number) => index >= steps.length - 1, [steps]);

  const syncUIToStep = useCallback(
    (index: number) => {
      if (index < 0 || index >= steps.length) return;
      const finalStyles = computeFinalStyles(steps, index);
      graphService.applyStylesFromMap(finalStyles);
    },
    [steps],
  );

  const next = useCallback(() => {
    const currentStepIndex = useAlgorithmStore.getState().currentStepIndex;

    if (!isLastStep(currentStepIndex)) {
      const nextIdx = currentStepIndex + 1;
      nextStep();
      syncUIToStep(nextIdx);
    }
  }, [nextStep, syncUIToStep, isLastStep, steps]);

  const previous = useCallback(() => {
    const currentStepIndex = useAlgorithmStore.getState().currentStepIndex;
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      prevStep();
      syncUIToStep(prevIdx);
    }
  }, [prevStep, syncUIToStep]);

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
    isLastStep,
    currentStepIndex,
    canForward: currentStepIndex + 1 < steps.length,
    canBackward: currentStepIndex > 0,
    totalSteps: steps.length,
  };
};
