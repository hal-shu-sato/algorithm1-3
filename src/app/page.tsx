import { readFile } from 'fs/promises';

import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Badge,
  Container,
  ListGroup,
  ListGroupItem,
  Stack,
} from 'react-bootstrap';

import Main from './main';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
import styles from './page.module.css';

async function getStations() {
  const stationsTxt = await readFile('109files/stations.txt', 'utf8');
  return stationsTxt
    .trim()
    .split(/\r\n|\n|\r/)
    .map((line) => {
      const [id, stationName] = line.trim().split(' ');
      return { id: Number(id) - 1, name: stationName };
    });
}

async function getAdjList() {
  const stationsTxt = await readFile('109files/adjList.txt', 'utf8');
  const lines = stationsTxt.trim().split(/\r\n|\n|\r/);
  const adjList = lines.map((line) => {
    const adj = line.trim().split(' ').slice(1);
    return adj.map((s) => {
      const [v, w] = s.split(',').slice(0, 2).map(Number);
      return { to: v - 1, time: w };
    });
  });
  return adjList;
}

export default async function Home() {
  const stations = await getStations();
  const adjList = await getAdjList();

  return (
    <Container as="main">
      <Main stations={stations} adjList={adjList} />
      <Accordion className="my-2">
        <AccordionItem eventKey="0">
          <AccordionHeader>全駅情報</AccordionHeader>
          <AccordionBody
            className={styles.stationInfos + ' px-2 py-0 overflow-y-auto'}
          >
            <ListGroup variant="flush">
              {stations.map((station) => {
                return (
                  <ListGroupItem key={station.id}>
                    <div className="fw-bold"> {station.name}</div>
                    <Stack direction="horizontal" gap={2}>
                      {adjList[station.id]?.map(({ to, time }) => (
                        <Badge key={`${to}-${time}`}>
                          {stations[to]?.name}: {time}分
                        </Badge>
                      ))}
                    </Stack>
                  </ListGroupItem>
                );
              })}
            </ListGroup>
          </AccordionBody>
        </AccordionItem>
      </Accordion>
    </Container>
  );
}
