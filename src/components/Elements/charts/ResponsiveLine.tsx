import React from 'react';
// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/line
import { ResponsiveLine, Serie } from '@nivo/line';

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
type Data = {
  x: number;
  y: number;
};

function generateData(datapoints = 10) {
  const data: Data[] = [];
  for (let index = 0; index < datapoints; index++) {
    data.push({ x: index, y: Math.random() });
  }
  return data;
}

const exampleData: Serie[] = [
  {
    id: 'japan',
    color: 'hsl(56, 70%, 50%)',
    data: generateData(),
  },
  {
    id: 'us',
    color: 'hsl(28, 70%, 50%)',
    data: generateData(),
  },
  {
    id: 'germany',
    color: 'hsl(112, 70%, 50%)',
    data: generateData(),
  },
  {
    id: 'norway',
    color: 'hsl(271, 70%, 50%)',
    data: generateData(),
  },
];

interface IResponsiveLine {
  data: Serie | Serie[];
}

const ResponsiveLineChart = ({ data /* see data tab */ }: IResponsiveLine) => (
  <ResponsiveLine
    data={Array.isArray(data) ? data : [data]}
    margin={{ top: 50, right: 110, bottom: 100, left: 60 }}
    xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
    yScale={{
      type: 'linear',
      min: 'auto',
      max: 'auto',
      stacked: true,
      reverse: false,
    }}
    xFormat=" >-.2f"
    yFormat=" >-.2f"
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'transportation',
      legendOffset: 36,
      legendPosition: 'middle',
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'count',
      legendOffset: -40,
      legendPosition: 'middle',
    }}
    pointSize={10}
    pointColor={{ theme: 'background' }}
    pointBorderWidth={2}
    pointBorderColor={{ from: 'serieColor' }}
    pointLabelYOffset={-12}
    useMesh={true}
    legends={[
      {
        toggleSerie: true,
        anchor: 'bottom-right',
        direction: 'column',
        justify: false,
        translateX: 100,
        translateY: 0,
        itemsSpacing: 0,
        itemDirection: 'left-to-right',
        itemWidth: 80,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: 'circle',
        symbolBorderColor: 'rgba(0, 0, 0, .5)',
        effects: [
          {
            on: 'hover',
            style: {
              itemBackground: 'rgba(0, 0, 0, .03)',
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
  />
);

export { ResponsiveLineChart, exampleData };
