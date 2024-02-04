/** 隣接リストの型 */
export type AdjList = { to: number; time: number }[][];

/**
 * ダイクストラ法
 */
export default function dijkstra(
  adjList: AdjList,
  start: number,
  goal: number,
) {
  const size = adjList.length; // 駅数

  // 初期化
  const nodes = Array(size)
    .fill(undefined)
    .map(() => ({
      prev: -1,
      minTime: Infinity,
      visited: false,
    }));

  // スタート地点を0分にする
  nodes[start].minTime = 0;
  for (;;) {
    let minTime = Infinity;
    let target = Infinity;
    // 未訪問の駅の中で、最短時間で行けるtarget駅を探す
    for (let i = 0; i < size; i++) {
      if (!nodes[i].visited && nodes[i].minTime < minTime) {
        target = i;
        minTime = nodes[i].minTime;
      }
    }
    // 見つからなければグラフが連結していない
    if (minTime === Infinity) break;

    // ゴールに到達したら終了
    if (target === goal) break;

    // targetの駅を訪問済みにする
    nodes[target].visited = true;
    // targetの駅に隣接する駅の最短時間を更新する
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
  // ゴールからスタートまでの経路を復元する
  for (
    let routeNode = goal;
    routeNode !== start;
    routeNode = nodes[routeNode].prev
  ) {
    route.push(routeNode);
  }
  route.push(start);
  // ルートを逆順にする
  route.reverse();

  // 最短時間と経路を返す
  return { cost: nodes[goal].minTime, route };
}
