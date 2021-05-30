import { Annotation } from '@visx/annotation';
import { CircleSubject, Connector, Label } from '@visx/annotation';
import * as allCurves from '@visx/curve';
import { LinearGradient } from '@visx/gradient';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { AreaClosed } from '@visx/shape';
import { Text } from '@visx/text';
import classnames from 'classnames';
import { extent, max } from 'd3-array';
import _ from 'lodash';
import React, { Fragment, useMemo, useState } from 'react';

import If from '../../../../components/If';
import TrendModal from '../TrendModal';
// @ts-ignore
import styles from './Chart.module.less';
import { annotations } from './data';

export const background = '#3b6978';
export const background2 = '#204051';
export const accentColor = '#edffea';
export const accentColorDark = '#75daad';

export const orange = '#ff7e67';
export const greens = ['#ecf4f3', '#68b0ab', '#006a71'];

const getX = (p: Point) => p.x;
const getY = (p: Point) => p.y;

interface Point {
  x: number;
  y: number;
}
const linePoints: Point[] = [
  { x: 0, y: 0 },
  { x: 185, y: 100 },
  { x: 300, y: 370 },
  { x: 340, y: 434 },
  { x: 380, y: 375 },
  { x: 460, y: 130 },
  { x: 630, y: 90 },
  { x: 900, y: 140 },
  { x: 1200, y: 170 },
];

const sections = [
  { ratio: 0.22, name: 'High growth potential', color: 'red' },
  { ratio: 0.125, name: 'Close to peak', color: 'blue' },
  { ratio: 0.21, name: 'Dangerous territories', color: 'green' },
  { ratio: 0.25, name: 'Rebounce in process', color: 'yellow' },
  { ratio: 0.2, name: 'Steady growth', color: 'gray' },
];

const calculateStart = (index: number) => _.sumBy(sections.slice(0, index), 'ratio');

export default function Chart({ width, height }: any) {
  const [selectedSection, setSelectedSection] = useState(1);
  const [selectedTrend, setSelectedTrend] = useState<any>(null);

  const xScale = useMemo(
    () =>
      scaleLinear({
        domain: extent(linePoints, (p: any) => getX(p)) as number[],
        range: [0, width],
      }),
    [width],
  );
  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: extent(linePoints, (d: any) => getY(d)) as number[],
        range: [height - 100, 100],
      }),
    [height],
  );

  const yValueScale = useMemo(
    () =>
      scaleLinear({
        range: [innerHeight, 0],
        domain: [0, (max(linePoints, getY) || 0) + innerHeight / 3],
        nice: true,
      }),
    [0, innerHeight],
  );

  return (
    <Fragment>
      <TrendModal trend={selectedTrend} setSelectedTrend={setSelectedTrend} />
      <svg width={width} height={height}>
        {sections.map((section, index) => (
          <>
            <rect
              className={classnames([
                styles.section,
                { [styles.sectionSelected]: index === selectedSection },
              ])}
              width={width * section.ratio}
              height={height}
              x={calculateStart(index) * width}
              // fill={section.color}
              fill="url(#area-background-gradient)"
              key={section.color}
              onClick={() => setSelectedSection(index)}
            />
            <Text
              y={height - 30}
              color="white"
              fill="white"
              fontWeight={700}
              fontSize={18}
              fontVariant="italic"
              width={width * section.ratio}
              x={calculateStart(index) * width + (sections[index].ratio * width) / 2}
              textAnchor="middle"
            >
              {section.name}
            </Text>
          </>
        ))}
        <LinearGradient id="area-gradient" from={accentColor} to={accentColor} toOpacity={0.1} />
        <LinearGradient id="area-background-gradient" from={background} to={background2} />
        <AreaClosed
          curve={(allCurves as any)['curveNatural']}
          // stroke={greens[2]}
          strokeWidth={5}
          data={linePoints}
          x={(p) => xScale(getX(p)) ?? 0}
          y={(p) => yScale(getY(p)) ?? 0}
          yScale={yValueScale}
          stroke="url(#area-gradient)"
          fill="url(#area-gradient)"
        />
        {/*<LinePath*/}
        {/*  className={styles.pulsatingLine}*/}
        {/*  curve={(allCurves as any)['curveNatural']}*/}
        {/*  stroke={greens[1]}*/}
        {/*  strokeWidth={5}*/}
        {/*  data={linePoints}*/}
        {/*  x={(p) => xScale(getX(p)) ?? 0}*/}
        {/*  y={(p) => yScale(getY(p)) ?? 0}*/}
        {/*/>*/}

        {annotations.map((annotation) => (
          <Annotation
            // width={width}
            // height={height}
            x={xScale(annotation.x)}
            y={yScale(annotation.y)}
            dx={annotation.dx}
            dy={annotation.dy}
            key={annotation.id}
          >
            <If
              condition={annotation.section === selectedSection}
              then={() => (
                <>
                  <Connector stroke={orange} type="elbow" />
                  <Group onClick={() => setSelectedTrend(annotation)} className={styles.annotation}>
                    <Label
                      backgroundFill="white"
                      showAnchorLine={true}
                      anchorLineStroke={greens[2]}
                      backgroundProps={{ stroke: greens[1] }}
                      fontColor={greens[2]}
                      horizontalAnchor="end" // TODO
                      subtitle={annotation.subTitle}
                      title={annotation.title}
                      verticalAnchor={'middle'}
                      width={230}
                    />
                  </Group>
                </>
              )}
            />

            <CircleSubject stroke={orange} strokeWidth={2} fill="white" radius={10} />
          </Annotation>
        ))}
      </svg>
    </Fragment>
  );
}
