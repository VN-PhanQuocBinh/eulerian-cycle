import { createGraphUtils } from "@/core/helpers/graph-utils";
import DetailBlock from "../detail-block";
import { NodeListSlider } from "../node-list-slider";

export function NodeDetailBlock({
  label,
  nodeIds,
  graphUtils,
}: {
  label: string;
  nodeIds: string[];
  graphUtils: ReturnType<typeof createGraphUtils>;
}) {
  return (
    <DetailBlock title={label}>
      {nodeIds.length > 0 ? (
        <NodeListSlider
          nodeIds={nodeIds}
          graphUtils={graphUtils}
          initialPosition={label === "Stack" ? "end" : "start"}
        />
      ) : (
        <span className="text-xs italic text-(--gl-text-muted)">Empty</span>
      )}
    </DetailBlock>
  );
}
