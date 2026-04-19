import { Step } from "@/types/algorithm-store";

export interface finalStyleResult {
  finalStyles: Map<string, Set<string>>;
  finalLabels: Map<string, string>;
}

export function computeFinalStyles(steps: Step[], targetStepIndex: number): finalStyleResult {
  const finalStyles: Map<string, Set<string>> = new Map();
  const finalLabels: Map<string, string> = new Map();

  for (let i = 0; i <= targetStepIndex && i < steps.length; i++) {
    const stepElements = steps[i].elements;

    stepElements.forEach((element) => {
      if (!finalStyles.has(element.id)) {
        finalStyles.set(element.id, new Set());
      }

      const currentClasses = finalStyles.get(element.id)!;
      element.classes.forEach((cls) => currentClasses.add(cls));

      if (element.type === "edge" && element.label) {
        finalLabels.set(element.id, element.label);
      }
    });
  }

  return { finalStyles, finalLabels };
}
