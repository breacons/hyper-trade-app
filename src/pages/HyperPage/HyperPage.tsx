import { CheckCircleTwoTone } from '@ant-design/icons';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { Avatar, Badge, Button, Modal, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import Reward from 'react-rewards';
import { animated, config, useTransition } from 'react-spring';

import PulsatingCircle from '../../components/PulsatingCircle';
import Chart from './components/Chart';
import { TradeSelect } from './components/TradeSelect';
// @ts-ignore
import styles from './HyperPage.module.less';
import avatar from './images/avatar.jpg';
import logo from './images/logo.svg';

export const HyperPage = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [updateState, setUpdateState] = useState('updated');
  const [showModal, setShowModal] = useState(false);
  let reward: any = null;

  useEffect(() => {
    let timeout: any;
    if (updateState === 'updated') {
      timeout = setTimeout(() => {
        setUpdateState('updating');
      }, 15000);
    }
    if (updateState === 'updating') {
      timeout = setTimeout(() => {
        setLastUpdated(new Date());
        setUpdateState('updated');
      }, 5000);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [updateState]);

  const enableTrade = () => {
    if (reward) {
      reward.rewardMe();

      setTimeout(() => {
        setShowModal(false);
      }, 4000);
    }
  };

  const closeModal = () => setShowModal(false);

  const transitions = useTransition(updateState === 'updating', {
    from: { position: 'absolute', opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    reverse: updateState === 'updated',
    delay: 0,
    config: config.default,
    // onRest: () => set(!toggle),
  });

  const fetching = (
    <div className="ant-message" style={{ zIndex: 0 }}>
      <div className="ant-message-notice">
        <div className="ant-message-notice-content">
          <div className="ant-message-custom-content ant-message-loading">
            <PulsatingCircle />
            <span style={{ marginLeft: 30 }}>Fetching trends</span>
          </div>
        </div>
      </div>
    </div>
  );

  const updated = (
    <div className="ant-message" style={{ zIndex: 0 }}>
      <div className="ant-message-notice">
        <div className="ant-message-notice-content">
          <div className="ant-message-custom-content ant-message-loading">
            <CheckCircleTwoTone twoToneColor="#52c41a" />
            <span style={{ marginLeft: 5 }}>Last updated: {lastUpdated.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <img src={logo} />
      </div>
      {transitions(({ opacity }, item) =>
        item ? (
          <animated.div
            style={{
              position: 'relative',
              opacity: opacity.to({ range: [0.0, 1.0], output: [0, 1] }),
            }}
          >
            {fetching}
          </animated.div>
        ) : (
          <animated.div
            style={{
              position: 'relative',
              opacity: opacity.to({ range: [1.0, 0.0], output: [1, 0] }),
            }}
          >
            {updated}
          </animated.div>
        ),
      )}
      <div className={styles.buttonContainer}>
        <Button size="large" ghost onClick={() => setShowModal(true)}>
          Enable&nbsp; <i>HyperTrade</i>
        </Button>
      </div>

      <Modal
        title={<i>HyperTrade</i>}
        visible={showModal}
        onCancel={closeModal}
        width={400}
        footer={null}
      >
        <Typography.Paragraph>
          HyperTrade will automatically invest your desired amount of capital into high potential
          stocks. You won&apos;t have to follow the investment opportunities on a daily basis and we
          also diversify your portfolio as much as possible.
        </Typography.Paragraph>
        <TradeSelect />
        <div className={styles.accountLabel}>Account</div>
        <Badge className={styles.badge} count="Logged in" style={{ backgroundColor: '#52c41a' }}>
          <div className={styles.account}>
            <Avatar src={avatar} size={40} />
            <div className={styles.profileInformation}>
              <span className={styles.accountName}>Kevin C. Belue</span>
              <span className={styles.email}>KevinCBelue@gmail.com</span>
            </div>
          </div>
        </Badge>
        <Reward
          ref={(ref) => {
            reward = ref;
          }}
          type="emoji"
          config={{
            emoji: ['💰', '🤑', '💎', '😎', '💸', '💵'],
            elementCount: 40,
            startVelocity: 35,
            elementSize: 30,
            spread: 120,
          }}
        >
          <Button type="primary" onClick={enableTrade} size="large" block>
            Enable&nbsp;<i>HyperTrade</i>
          </Button>
        </Reward>
      </Modal>
      <ParentSize className="graph-container" debounceTime={10}>
        {({ width: visWidth, height: visHeight }) => <Chart width={visWidth} height={visHeight} />}
      </ParentSize>
    </div>
  );
};

export default HyperPage;
