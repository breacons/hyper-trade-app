import { LoadingOutlined } from '@ant-design/icons';
import * as allCurves from '@visx/curve';
import { scaleLinear, scaleTime } from '@visx/scale';
import { LinePath } from '@visx/shape';
import { Spin } from 'antd';
import { extent } from 'd3-array';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

import If from '../../../../components/If';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const apiKey = 'CDWRA25JJ42YS6DY';

export const orange = '#ff7e67';
export const greens = ['#ecf4f3', '#68b0ab', '#006a71'];

const TickerChart = ({ ticker }: any) => {
  const [stockData, setStockData] = useState<any>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${ticker}&apikey=${apiKey}`,
    )
      .then((response) => response.json())
      .then((data) => {
        if (data['Error Message'] || data['Note']) {
          setError(true);
          return;
        }

        setStockData(
          _.map(data['Monthly Time Series'], (value, date) => ({
            date,
            close: parseFloat(value['4. close']),
          })),
        );
      });
  }, []);

  const getDate = (d: any) => new Date(d.date).valueOf();
  const getStockValue = (d: any) => d.close;

  const width = 120;
  const height = 40;

  if (!stockData) {
    return null;
  }

  const xScale = useMemo(
    () =>
      scaleTime({
        domain: extent(stockData, (d) => getDate(d)) as number[],
        range: [0, width],
      }),
    [width, stockData],
  );
  const yScale = useMemo(
    () =>
      scaleLinear({
        // @ts-ignore
        domain: extent(stockData, (d: any) => getStockValue(d)) as number[],
        range: [height - 10, 10],
      }),
    [height, stockData],
  );

  if (error) return null;

  return (
    <If
      condition={!stockData || stockData.length === 0}
      then={() => (
        <Spin indicator={antIcon}>
          <div style={{ width, height }} />
        </Spin>
      )}
      else={() => (
        <div>
          <svg width={width} height={height}>
            {/*<rect width={width} height={height} fill={greens[0]} />*/}
            <LinePath
              curve={(allCurves as any)['curveNatural']}
              stroke="#1890ff"
              strokeWidth={2}
              data={stockData}
              x={(d) => xScale(getDate(d)) ?? 0}
              y={(d) => yScale(getStockValue(d)) ?? 0}
            />
          </svg>
        </div>
      )}
    />
  );
};

export default TickerChart;
