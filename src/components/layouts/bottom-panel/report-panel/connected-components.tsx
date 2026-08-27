import { useAlgorithmStore, useGraphDataStore } from "@/stores";

import { SectionTitle } from "./components/section-title";
import { InfoRow } from "./components/info-row";
import { ConnectedComponentsResult } from "@/core/types/algorithm";

function ConnectedComponentReport() {
  const currentAlgorithm = useAlgorithmStore((state) => state.currentAlgorithm);
  const executionResult = useAlgorithmStore((state) => state.executionResult);
  const getNodeDataById = useGraphDataStore((state) => state.getNodeDataById);

  let components: string[][] = [];

  if (executionResult && currentAlgorithm === "connected-components") {
    const connectedComponentsResult = executionResult as ConnectedComponentsResult;
    components = connectedComponentsResult.result?.components || [];
  }

  return (
    <section>
      <SectionTitle>Connected Components</SectionTitle>
      <div className="mb-2 rounded-md border border-(--od-border) bg-(--od-bg-1) px-3 py-1">
        <InfoRow label="Number of Connected Components" value={components.length} />
      </div>
      <div className="space-y-1.5">
        {components.map((comp, i) => {
          const labels = new Set<string>();
          for (const id of comp) {
            const node = getNodeDataById(id);
            if (node) {
              labels.add(node.label);
            }
          }
          return (
            <div
              key={i}
              className="flex items-center gap-2 rounded-md border border-(--od-border) bg-(--od-bg-1) px-3 py-1.5"
            >
              <span className="shrink-0 text-xs font-bold text-(--od-fg-0)">
                Component {i + 1} ({comp.length} nodes):
              </span>
              <span className="text-(--od-fg-1)">{Array.from(labels).join(", ")}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ConnectedComponentReport;
