'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  Button,
  Col,
  Form,
  ListGroup,
  Row,
  type FormGroupProps,
} from 'react-bootstrap';
import {
  Typeahead,
  type TypeaheadComponentProps,
} from 'react-bootstrap-typeahead';
import { type Option } from 'react-bootstrap-typeahead/types/types';

import dijkstra, { type AdjList } from './dijkstra';

/**
 * 入力各行の共通コンポーネント
 */
function FormRow({
  children,
  className,
  label,
  labelSpan = 3,
  ...props
}: Readonly<
  FormGroupProps & {
    label: string;
    labelSpan?: number;
  }
>) {
  return (
    <Form.Group
      as={Row}
      className={className ? `mb-2 ${className}` : 'mb-2'}
      {...props}
    >
      <Form.Label column xs={labelSpan}>
        {label}
      </Form.Label>
      <Col xs={12 - labelSpan}>{children}</Col>
    </Form.Group>
  );
}

/** 駅情報の型 */
type StationInfo = {
  id: number;
  name: string;
};

export default function Main({
  stations,
  adjList,
}: {
  stations: StationInfo[];
  adjList: AdjList;
}) {
  const [origin, setOrigin] = useState<Option[]>([]);
  const [destination, setDestination] = useState<Option[]>([]);

  const [cost, setCost] = useState<number>();
  const [route, setRoute] = useState<number[]>();

  /* 駅情報をコンソールに出力 */
  useEffect(() => {
    const allStationInfos = stations.map((station) => {
      const adj = adjList[station.id];
      return {
        id: station.id + 1, // 1-indexに戻す
        name: station.name,
        adjList: adj.map(({ to, time }) => {
          return {
            id: to + 1, // 1-indexに戻す
            name: stations[to].name,
            time: time,
          };
        }),
      };
    });
    console.log(allStationInfos);
  }, [adjList, stations]);

  /**
   * 検索ボタンを押したときの処理
   */
  const search = useCallback(() => {
    // 選択されていない場合は表示を消す
    if (origin.length === 0 || destination.length === 0) {
      setCost(undefined);
      setRoute(undefined);
      return;
    }
    const originStation = origin[0] as StationInfo;
    const destinationStation = destination[0] as StationInfo;
    // ダイクストラ法を使用
    const { cost, route } = dijkstra(
      adjList,
      originStation.id,
      destinationStation.id,
    );
    console.log(
      cost,
      route.map((id) => stations[id].name),
    );
    // 結果をセット
    setCost(cost);
    setRoute(route);
  }, [adjList, origin, destination, stations]);

  // Typeaheadの共通props
  const typeaheadProps: TypeaheadComponentProps = {
    labelKey: 'name',
    options: stations,
    emptyLabel: '該当する駅が見つかりませんでした。',
    paginationText: 'もっと見る',
    maxResults: 101,
    clearButton: true,
  };

  return (
    <Row className="my-2">
      <Col xs="12" md="6">
        <h1>109 Transfer</h1>
        <FormRow label="出発駅">
          <Typeahead
            onChange={setOrigin}
            selected={origin}
            id="origin"
            isValid={origin.length > 0}
            {...typeaheadProps}
          />
        </FormRow>
        <FormRow label="到着駅">
          <Typeahead
            onChange={setDestination}
            selected={destination}
            id="destination"
            isValid={destination.length > 0}
            {...typeaheadProps}
          />
        </FormRow>
        <Button onClick={search}>検索</Button>
      </Col>
      <Col xs="12" md="6">
        {/* costとrouteが存在するときは表示 */}
        {cost && route && (
          <>
            総所要時間: {cost}分
            <ListGroup>
              {route.map((stationId) => {
                const station = stations[stationId];
                return (
                  <ListGroup.Item key={station.id + 1}>
                    {station.name}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </>
        )}
      </Col>
    </Row>
  );
}
