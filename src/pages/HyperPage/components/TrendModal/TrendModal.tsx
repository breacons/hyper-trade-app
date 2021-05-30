import { Button, List, Modal, Typography } from 'antd';
import React from 'react';

import If from '../../../../components/If';
import TickerChart from '../TickerChart';
// @ts-ignore
import styles from './TrendModal.module.less';

export const TrendModal = ({ trend, setSelectedTrend }: any) => {
  const closeModal = () => setSelectedTrend(null);

  if (!trend) {
    return null;
  }

  return (
    <Modal
      title={
        <span>
          {trend.title}
          <br />
          <small>{trend.subTitle}</small>
        </span>
      }
      visible={!!trend}
      onOk={closeModal}
      onCancel={closeModal}
      width={400}
    >
      <Typography.Paragraph>
        {trend.description ||
          'Hyper is currently collecting information about this trend. Check back later! 😉'}
      </Typography.Paragraph>

      <Typography.Title level={5}>Related news</Typography.Title>
      <div className={styles.newsCard}>
        <div className={styles.imageContainer}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            className="_1O4jTk-dZ-VIxsCuYB6OR8"
          >
            <g>
              <circle fill="#FF4500" cx="10" cy="10" r="10"></circle>
              <path
                fill="#FFF"
                d="M16.67,10A1.46,1.46,0,0,0,14.2,9a7.12,7.12,0,0,0-3.85-1.23L11,4.65,13.14,5.1a1,1,0,1,0,.13-0.61L10.82,4a0.31,0.31,0,0,0-.37.24L9.71,7.71a7.14,7.14,0,0,0-3.9,1.23A1.46,1.46,0,1,0,4.2,11.33a2.87,2.87,0,0,0,0,.44c0,2.24,2.61,4.06,5.83,4.06s5.83-1.82,5.83-4.06a2.87,2.87,0,0,0,0-.44A1.46,1.46,0,0,0,16.67,10Zm-10,1a1,1,0,1,1,1,1A1,1,0,0,1,6.67,11Zm5.81,2.75a3.84,3.84,0,0,1-2.47.77,3.84,3.84,0,0,1-2.47-.77,0.27,0.27,0,0,1,.38-0.38A3.27,3.27,0,0,0,10,14a3.28,3.28,0,0,0,2.09-.61A0.27,0.27,0,1,1,12.48,13.79Zm-0.18-1.71a1,1,0,1,1,1-1A1,1,0,0,1,12.29,12.08Z"
              ></path>
            </g>
          </svg>
        </div>
        <div className={styles.information}>
          <div className={styles.title}>
            <Typography.Link href="https://www.reddit.com/">
              <strong>{trend.title}</strong>
            </Typography.Link>
          </div>
          <div className={styles.subTitle}>reddit: the front page of the internet</div>
        </div>
      </div>
      <div className={styles.newsCard}>
        <div className={styles.imageContainer}>
          <img src="https://help.twitter.com/content/dam/help-twitter/brand/logo.png" width={60} />
        </div>
        <div className={styles.information}>
          <div className={styles.title}>
            <Typography.Link href="https://www.twitter.com/">
              <strong>{trend.title}</strong>
            </Typography.Link>
          </div>
          <div className={styles.subTitle}>Twitter. It&apos;s what&apos;s happening.</div>
        </div>
      </div>

      <If
        condition={trend.tickers && trend.tickers.length > 0}
        then={() => (
          <>
            <Typography.Title level={5} style={{marginTop: 28}}>Related stocks</Typography.Title>
            <List
              itemLayout="horizontal"
              dataSource={trend.tickers}
              renderItem={(ticker: string) => (
                <List.Item actions={[<TickerChart ticker={ticker} key="chart" />]}>
                  <List.Item.Meta
                    title={<a href="https://ant.design">{ticker}</a>}
                    description={
                      <Button
                        key="link"
                        onClick={() => alert('You are currently using the demo version of Hyper.')}
                        type="primary"
                        size="small"
                      >
                        Buy {ticker}
                      </Button>
                    }
                  />
                </List.Item>
              )}
            />
          </>
        )}
      />
    </Modal>
  );
};

export default TrendModal;
