export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const generateEdgeSelector = (sourceId: string, targetId: string) => {
  return `edge[source = "${sourceId}"][target = "${targetId}"], edge[source = "${targetId}"][target = "${sourceId}"]`;
};
