import { useGraphStore } from "@/contexts/graph-context";
import { useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
      {children}
    </h4>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between text-sm py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-slate-600">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  );
}

export function GraphReport() {
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const currentAlgorithm = useGraphStore((state) => state.currentAlgorithm);
  const findConnectedComponents = useGraphStore((state) => state.findConnectedComponents);
  const findEulerianCycle = useGraphStore((state) => state.findEulerianCycle);
  const getAdjacencyList = useGraphStore((state) => state.getAdjacencyList);

  const isMultiGraph = useMemo(() => {
    const seen = new Set<string>();
    for (const e of edges) {
      const key = [e.source, e.target].sort().join("|");
      if (seen.has(key)) return true;
      seen.add(key);
    }
    return false;
  }, [edges]);

  const components = useMemo(() => {
    if (nodes.length === 0) return [];

    const { components } = findConnectedComponents(nodes[0].id);

    return components;
  }, [nodes, edges, currentAlgorithm]);

  const circuit = useMemo(() => {
    if (currentAlgorithm !== "eulerian-cycle") return null;
    const { cycle } = findEulerianCycle(nodes[0].id);
    return cycle;
  }, [currentAlgorithm, nodes, edges]);

  const adjacencyList = useMemo(() => getAdjacencyList(), [nodes, edges]);

  const oddDegreeNodes = useMemo(
    () =>
      nodes.filter((node) => {
        const adjacentNodes = adjacencyList.get(node.id) ?? [];
        const nodeDegree = adjacentNodes.length;
        return nodeDegree % 2 !== 0;
      }),
    [nodes, adjacencyList],
  );

  if (nodes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm italic">
        No graph data available. Add nodes and edges to view reports.
      </div>
    );
  }

  const isConnected = components.length <= 1;

  return (
    <div className="p-3 space-y-4 text-sm overflow-y-auto h-full">
      {/* General */}
      <section>
        <SectionTitle>General</SectionTitle>
        <div className="bg-slate-50 rounded-md px-3 py-1">
          <InfoRow label="Total Nodes" value={nodes.length} />
          <InfoRow label="Total Edges" value={edges.length} />
          <InfoRow label="Graph Type" value={isMultiGraph ? "Multi-Graph" : "Simple Graph"} />
        </div>
      </section>

      {/* Node Analysis */}
      <section>
        <SectionTitle>Node Analysis</SectionTitle>
        <div className="bg-slate-50 rounded-md overflow-hidden">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="border-b border-slate-200">
                <TableHead>Node</TableHead>
                <TableHead>Degree</TableHead>
                <TableHead>Adjacent List</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nodes.map((node) => {
                const neighbors = adjacencyList.get(node.id) ?? [];
                const degree = adjacencyList.get(node.id)?.length ?? 0;
                return (
                  <TableRow key={node.id}>
                    <TableCell>{node.label}</TableCell>
                    <TableCell>
                      <span className="px-1.5 py-0.5 rounded text-xs font-medium">{degree}</span>
                    </TableCell>
                    <TableCell>
                      {neighbors.length > 0 ? (
                        neighbors.map((n, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded text-xs text-gray-700 bg-gray-100"
                          >
                            {n.label}
                          </span>
                        ))
                      ) : (
                        <span className="italic text-slate-400">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Algorithm-specific */}
      {currentAlgorithm === "connected-components" && (
        <section>
          <SectionTitle>Connected Components</SectionTitle>
          <div className="bg-slate-50 rounded-md px-3 py-1 mb-2">
            <InfoRow label="Number of Connected Components" value={components.length} />
          </div>
          <div className="space-y-1.5">
            {components.map((comp, i) => {
              const labels = comp.map((id) => nodes.find((n) => n.id === id)?.label ?? id);
              return (
                <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-md px-3 py-1.5">
                  <span className="text-xs font-semibold text-slate-500 shrink-0">
                    Component {i + 1} ({comp.length} nodes):
                  </span>
                  <span className="text-slate-700">{labels.join(", ")}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {currentAlgorithm === "eulerian-cycle" && (
        <section>
          <SectionTitle>Eulerian Cycle</SectionTitle>
          <div className="bg-slate-50 rounded-md px-3 py-1">
            <InfoRow
              label="Is Graph Connected?"
              value={
                <span className={isConnected ? "text-green-600" : "text-red-500"}>
                  {isConnected ? "Yes" : "No"}
                </span>
              }
            />
            <InfoRow
              label="Odd-Degree Nodes"
              value={
                oddDegreeNodes.length === 0 ? (
                  <span className="text-green-600">None</span>
                ) : (
                  <span className="text-orange-600">
                    {oddDegreeNodes.map((n) => n.label).join(", ")}
                  </span>
                )
              }
            />
            {circuit && <InfoRow label="Circuit length" value={`${circuit.length} edges`} />}
            {circuit && <InfoRow label="Circuit" value={circuit.map((n) => n.label).join(" → ")} />}
          </div>
        </section>
      )}

      {!currentAlgorithm && (
        <p className="text-xs text-slate-400 italic text-center">
          Select an algorithm to see specific reports. General graph information is always
          displayed.
        </p>
      )}
    </div>
  );
}
