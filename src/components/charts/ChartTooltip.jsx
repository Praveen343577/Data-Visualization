// src/components/charts/ChartTooltip.jsx
import { TooltipWithBounds, defaultStyles } from '@visx/tooltip';

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(2).replace(/\.00$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(2).replace(/\.00$/, '') + 'K';
  return num.toString();
};

const tooltipStyles = {
  ...defaultStyles,
  background: 'transparent',
  border: 'none',
  boxShadow: 'none',
  padding: 0,
  margin: 0,
};

export const ChartTooltip = ({ tooltipOpen, tooltipLeft, tooltipTop, tooltipData }) => {
  if (!tooltipOpen || !tooltipData) return null;

  return (
    <TooltipWithBounds
      top={tooltipTop}
      left={tooltipLeft}
      style={tooltipStyles}
    >
      <div className="glass-tooltip">
        <div className="tooltip-header">
          {tooltipData.platform}
        </div>
        
        <div className="tooltip-metric-row">
          <div className="tooltip-label">
            <span className="tooltip-indicator indicator-active" />
            Active
          </div>
          <div className="tooltip-value">{formatNumber(tooltipData.active)}</div>
        </div>

        <div className="tooltip-metric-row">
          <div className="tooltip-label">
            <span className="tooltip-indicator indicator-inactive" />
            Inactive
          </div>
          <div className="tooltip-value">{formatNumber(tooltipData.inactive)}</div>
        </div>

        <div className="tooltip-metric-row">
          <div className="tooltip-label">
            <span className="tooltip-indicator indicator-nogps" />
            No GPS
          </div>
          <div className="tooltip-value">{formatNumber(tooltipData.noGps)}</div>
        </div>
      </div>
    </TooltipWithBounds>
  );
};