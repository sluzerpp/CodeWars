import { IJSSuite } from '@/shared/types';
import { Accordion } from '@mantine/core';
import styles from '../index.module.scss';

interface SuitesProps {
  suite: IJSSuite;
}

export default function Suite({ suite }: SuitesProps) {
  return (
    <Accordion.Item
      value={suite.title}
      className={`${suite.failures.length === 0 ? styles.totalpassed : styles.totalfailed}`}
    >
      <Accordion.Control>
        {suite.title} - {suite.duration / 1000}
      </Accordion.Control>
      <Accordion.Panel>
        <Accordion>
          {suite.tests.map((test) => (
            <Accordion.Item
              className={`${test.pass ? styles.totalpasssed : styles.totalfailed}`}
              key={test.title + test.duration}
              value={test.title}
            >
              {test.pass ? (
                `${test.title} - ${test.duration / 1000}`
              ) : (
                <>
                  <Accordion.Control>{`${test.title} - ${test.duration / 1000}`}</Accordion.Control>
                  <Accordion.Panel>{test.err.message}</Accordion.Panel>
                </>
              )}
            </Accordion.Item>
          ))}
          {suite.suites.map((suite) => (
            <Suite key={suite.uuid} suite={suite}></Suite>
          ))}
        </Accordion>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
