import { Radio, Typography } from 'antd';
import classnames from 'classnames';
import React, { useState } from 'react';

// @ts-ignore
import styles from './TradeSelect.module.less';

export const TradeSelect = () => {
  const options = [5, 25, 100];
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className={styles.container}>
      <Radio.Group value={selected} onChange={(e) => setSelected(e.target.value)} size="large">
        {options.map((option) => (
          <Radio.Button value={option} key={option}>
            ${option}
          </Radio.Button>
        ))}
      </Radio.Group>
      <Typography.Paragraph>
        <small>monthly investment</small>
      </Typography.Paragraph>
    </div>
  );

  return (
    <div className={styles.container}>
      {options.map((option) => (
        <div
          key={option}
          onClick={() => setSelected(option)}
          className={classnames([styles.option, { [styles.selected]: option === selected }])}
        >
          ${option}
        </div>
      ))}
    </div>
  );
};

export default TradeSelect;
