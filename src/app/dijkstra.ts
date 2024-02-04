export type AdjList = { to: number; time: number }[][];

export default function dijkstra(
  adjList: AdjList,
  start: number,
  goal: number,
) {
  const size = adjList.length;

  const nodes = Array(size)
    .fill(undefined)
    .map(() => ({
      prev: -1,
      minTime: Infinity,
      visited: false,
    }));

  nodes[start].minTime = 0;
  for (;;) {
    let minTime = Infinity;
    let target = Infinity;
    for (let i = 0; i < size; i++) {
      if (!nodes[i].visited && nodes[i].minTime < minTime) {
        target = i;
        minTime = nodes[i].minTime;
      }
    }
    if (minTime === Infinity) break;

    if (target === goal) break;

    nodes[target].visited = true;
    for (const { to, time } of adjList[target]) {
      if (nodes[to].visited) continue;
      const totalTime = nodes[target].minTime + time;
      if (totalTime < nodes[to].minTime) {
        nodes[to].minTime = totalTime;
        nodes[to].prev = target;
      }
    }
  }

  const route = [];
  for (
    let routeNode = goal;
    routeNode !== start;
    routeNode = nodes[routeNode].prev
  ) {
    route.push(routeNode);
  }
  route.push(start);
  route.reverse();

  return { cost: nodes[goal].minTime, route };
}
