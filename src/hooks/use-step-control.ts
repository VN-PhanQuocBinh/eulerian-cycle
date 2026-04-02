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

  const isLastStep = useCallback((index: number) => index >= steps.length - 1, [steps]);

  const syncUIToStep = useCallback(
    (index: number) => {
      if (index < 0 || index >= steps.length) return;
      const finalStyles = computeFinalStyles(steps, index);
      console.log("Final styles to apply: ", finalStyles);
      graphService.applyStylesFromMap(finalStyles);
    },
    [steps],
  );

  const next = useCallback(() => {
    const currentStepIndex = useAlgorithmStore.getState().currentStepIndex;

    if (!isLastStep(currentStepIndex)) {
      const nextIdx = currentStepIndex + 1;
      const elements = steps[nextIdx].elements;

      elements.forEach((elem) => {
        graphService.highlightElement(elem.id, elem.classes, elem.type === "node");
        if (elem.type === "edge" && elem.label) {
          graphService.applyLabelToEdge(elem.id, elem.label);
        }
      });

      nextStep();
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
