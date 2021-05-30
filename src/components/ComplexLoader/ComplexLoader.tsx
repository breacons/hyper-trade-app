import { Progress, Typography } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import { animated, config, useTransition } from 'react-spring';

// @ts-ignore
import styles from './ComplexLoader.module.less';
import logo from './images/logo-black.svg';

interface ComplexLoaderProps {
  children: ReactElement | ReactElement[];
  labels?: string[];
}

const defaultLabels = [
  'Scraping social media platforms',
  'Feeding data into the NLP model',
  'Building the time series analysis',
  'Generating the HypeTrain',
];

export const ComplexLoader = ({ children, labels }: ComplexLoaderProps) => {
  const [progress, setProgress] = useState([0, 0, 0, 0]);

  useEffect(() => {
    setProgress([0, 0, 0, 0]);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newValues = [...oldProgress];

        const step = 8;

        newValues[0] = Math.min(newValues[0] + Math.random() * step, 100);

        if (newValues[0] > 70) {
          newValues[1] = Math.min(newValues[1] + Math.random() * step, 100);
        }

        if (newValues[1] > 95) {
          newValues[2] = Math.min(newValues[2] + Math.random() * step, 100);
        }

        if (newValues[2] > 95) {
          newValues[3] = Math.min(newValues[3] + Math.random() * step, 100);
        }

        return newValues;
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const transitions = useTransition(true || Math.min(...progress) === 100, {
    from: { position: 'absolute', opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    reverse: false,
    delay: 200,
    config: config.molasses,
    // onRest: () => set(!toggle),
  });

  return transitions(({ opacity }, item) =>
    item ? (
      <animated.div
        style={{
          opacity: opacity.to({ range: [0.0, 1.0], output: [0, 1] }),
        }}
      >
        {children}
      </animated.div>
    ) : (
      <animated.div
        style={{
          width: '100%',
          position: 'absolute',
          opacity: opacity.to({ range: [1.0, 0.0], output: [1, 0] }),
        }}
      >
        <div className={styles.root}>
          <div className={styles.loaders}>
            <div className={styles.logoContainer}>
              <img src={logo} className={styles.logo} />
            </div>

            {progress.map((value, index) => (
              <div className={styles.row} key={index}>
                <Typography.Paragraph
                  className={styles.loaderLabel}
                  style={{ opacity: value === 0 ? 0.5 : 1 }}
                >
                  {(labels || defaultLabels)[index]}
                </Typography.Paragraph>
                <Progress percent={Math.floor(value)} key={index} className={styles.loader} />
              </div>
            ))}
          </div>
        </div>
      </animated.div>
    ),
  );
};

export default ComplexLoader;
