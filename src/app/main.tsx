'use client';

import { useCallback, useState } from 'react';

import { Col, Form, Row, type FormGroupProps, Button } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
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

  const search = useCallback(() => {
    if (origin.length === 0 || destination.length === 0) return;
    const originStation = origin[0] as StationInfo;
    const destinationStation = destination[0] as StationInfo;
    const { cost, route } = dijkstra(
      adjList,
      originStation.id,
      destinationStation.id,
    );
    setCost(cost);
    setRoute(route);
  }, [adjList, origin, destination]);

  return (
    <Row>
      <Col xs="12" md="6">
        <h1>109 Transfer</h1>
        <FormRow label="出発駅">
          <Typeahead
            labelKey="name"
            onChange={setOrigin}
            options={stations}
            selected={origin}
            id="origin"
          />
        </FormRow>
        <FormRow label="到着駅">
          <Typeahead
            labelKey="name"
            onChange={setDestination}
            options={stations}
            selected={destination}
            id="destination"
          />
        </FormRow>
        <Button onClick={search}>検索</Button>
      </Col>
      <Col xs="12" md="6">
        所要時間：{cost}分
        {route?.map((stationId) => {
          const station = stations[stationId];
          return <div key={station.id + 1}>{station.name}</div>;
        })}
      </Col>
    </Row>
  );
}
