import { Step } from "@/types/algorithm-store";

export function computeFinalStyles(
  steps: Step[],
  targetStepIndex: number,
): Map<string, Set<string>> {
  const finalStyles: Map<string, Set<string>> = new Map();

  for (let i = 0; i <= targetStepIndex && i < steps.length; i++) {
    const stepElements = steps[i].elements;

    stepElements.forEach((element) => {
      if (!finalStyles.has(element.id)) {
        finalStyles.set(element.id, new Set());
      }

      const currentClasses = finalStyles.get(element.id)!;
      element.classes.forEach((cls) => currentClasses.add(cls));
    });
  }

  return finalStyles;
}
