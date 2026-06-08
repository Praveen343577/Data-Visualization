// src/components/charts/LiveBarChartContainer.jsx
import { useTooltip } from '@visx/tooltip';
import { ParentSize } from '@visx/responsive';
import { useMockWebSocket } from '../../hooks/useMockWebSocket';
import { VisxBarChart } from './VisxBarChart';
import { ChartTooltip } from './ChartTooltip';
import { Card } from '../ui/Card';
import '../../styles/chart.css';

export const LiveBarChartContainer = () => {
  const data = useMockWebSocket();
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  return (
    <Card 
      title="Live Platform Metrics" 
      subtitle="Real-time GPS tracking status across platform nodes"
    >
      <div className="chart-wrapper">
        <ParentSize>
          {({ width, height }) => (
            <VisxBarChart
              width={width}
              height={height}
              data={data}
              showTooltip={showTooltip}
              hideTooltip={hideTooltip}
            />
          )}
        </ParentSize>
        <ChartTooltip
          tooltipOpen={tooltipOpen}
          tooltipLeft={tooltipLeft}
          tooltipTop={tooltipTop}
          tooltipData={tooltipData}
        />
      </div>
    </Card>
  );
};