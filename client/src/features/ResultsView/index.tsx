import { IJSTestResult, ITestResult } from '@/shared/types';
import './index.scss';
import styles from './index.module.scss';
import { Accordion, Group, Text, Title } from '@mantine/core';
import Suite from './Suites';

interface ResultViewProps {
  result: IJSTestResult | ITestResult | null;
  isPassed: boolean;
  isError: string;
}

const isJSResult = (result: IJSTestResult | ITestResult): result is IJSTestResult => {
  const res_ = (result as IJSTestResult).suites !== undefined;
  return res_;
};

export default function ResultView({ result, isError, isPassed }: ResultViewProps) {
  let resultElem = <span>...</span>;
  if (result) {
    if (isJSResult(result)) {
      resultElem = (
        <Accordion>
          {result.suites.map((suite) => (
            <Suite key={suite.uuid} suite={suite}></Suite>
          ))}
        </Accordion>
      );
    } else {
      console.log(result);
      resultElem = <h2>Блен</h2>;
      resultElem = (
        <Accordion>
          {result.testCases.map((testCase) => (
            <Accordion.Item
              key={testCase.name + testCase.classname + testCase.time}
              value={testCase.name}
              className={`${
                testCase.result === 'Passed' ? styles.totalpassed : styles.totalfailed
              }`}
            >
              {testCase.result === 'Passed' ? (
                `${testCase.name} - ${testCase.time}`
              ) : (
                <>
                  <Accordion.Control>{`${testCase.name} - ${testCase.time}`}</Accordion.Control>
                  <Accordion.Panel>{testCase.failure}</Accordion.Panel>
                </>
              )}
            </Accordion.Item>
          ))}
        </Accordion>
      );
    }
  }

  const error = isError ? <Text className={styles.error}>{isError}</Text> : null;

  return (
    <div
      className={`${styles.result} ${
        result ? (isPassed ? styles.totalpassed : styles.totalfailed) : ''
      }`}
    >
      <div className={styles.header}>
        {result && (
          <Group>
            <Group>
              <Title order={6}>Пройдено:</Title>
              <Text>{result.totalPassed || 'Неизвестно'}</Text>
            </Group>
            <Group>
              <Title order={6}>Провалено:</Title>
              <Text>{result.totalFailed === undefined ? 'Неизвестно' : result.totalFailed}</Text>
            </Group>
            <Group>
              <Title order={6}>Время выполнения:</Title>
              <Text>{result.totalDuration || 'Неизвестно'}</Text>
            </Group>
          </Group>
        )}
      </div>
      <div className={styles.body}>{isError ? error : resultElem}</div>
    </div>
  );
}
