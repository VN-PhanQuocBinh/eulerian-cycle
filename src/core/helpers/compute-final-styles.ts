import { StoredStep } from "@/types/graph";

export function computeFinalStyles(
  steps: StoredStep[],
  targetStepIndex: number,
): Map<string, Set<string>> {
  console.log("Computing final styles up to step index:", targetStepIndex);
  const finalStyles: Map<string, Set<string>> = new Map();

  for (let i = 0; i <= targetStepIndex && i < steps.length; i++) {
    const stepElements = steps[i].current.elements;

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
