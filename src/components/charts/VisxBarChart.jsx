// src/components/charts/VisxBarChart.jsx
import { useMemo, useState } from 'react';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { localPoint } from '@visx/event';

const margin = { top: 40, right: 30, bottom: 50, left: 70 };
const keys = ['active', 'inactive', 'noGps'];

const COLORS = {
  active: '#4ade80',
  inactive: '#f87171',
  noGps: '#fde047',
};

export const VisxBarChart = ({ width, height, data, showTooltip, hideTooltip }) => {
  const [hoveredNode, setHoveredNode] = useState(null);

  const { x0Scale, x1Scale, yScale, innerWidth, innerHeight } = useMemo(() => {
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    const maxVal = Math.max(
      ...data.flatMap((d) => [d.active, d.inactive, d.noGps])
    );

    const x0 = scaleBand({
      domain: data.map((d) => d.platform),
      range: [0, xMax],
      padding: 0.2,
    });

    const x1 = scaleBand({
      domain: keys,
      range: [0, x0.bandwidth()],
      padding: 0.08,
    });

    const y = scaleLinear({
      domain: [0, maxVal * 1.15],
      range: [yMax, 0],
      nice: true,
    });

    return { x0Scale: x0, x1Scale: x1, yScale: y, innerWidth: xMax, innerHeight: yMax };
  }, [width, height, data]);

  if (width < 10) return null;

  const handlePointerMove = (event, d) => {
    const coords = localPoint(event.target.ownerSVGElement, event);
    if (!coords) return;
    showTooltip({
      tooltipData: d,
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
    });
  };

  return (
    <svg width={width} height={height} className="visx-canvas">
      <defs>
        <linearGradient id="grad-active" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id="grad-inactive" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
        <linearGradient id="grad-nogps" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <filter id="depth-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.35" />
        </filter>
        <pattern id="stripes" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="3" height="6" fill="rgba(255,255,255,0.12)" />
        </pattern>
      </defs>

      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <GridRows scale={yScale} width={innerWidth} height={innerHeight} />
        
        <AxisBottom
          top={innerHeight}
          scale={x0Scale}
          stroke="var(--border-glass)"
          tickStroke="var(--border-glass)"
          hideAxisLine={false}
          tickLabelProps={{
            fill: 'var(--text-muted)',
            fontSize: 11,
            textAnchor: 'middle',
            dy: '0.5em',
          }}
        />
        
        <AxisLeft
          scale={yScale}
          stroke="var(--border-glass)"
          tickStroke="var(--border-glass)"
          numTicks={6}
          tickFormat={(v) => (v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v)}
          tickLabelProps={{
            fill: 'var(--text-muted)',
            fontSize: 11,
            textAnchor: 'end',
            dx: '-0.25em',
            dy: '0.25em',
          }}
        />

        {data.map((d) => {
          const groupX = x0Scale(d.platform);
          if (groupX === undefined) return null;
          const isGroupHovered = hoveredNode?.platform === d.platform;
          
          return (
            <g key={d.platform} transform={`translate(${groupX}, 0)`}>
              {isGroupHovered && (
                <rect
                  x={-2}
                  y={0}
                  width={x0Scale.bandwidth() + 4}
                  height={innerHeight}
                  fill="rgba(255, 255, 255, 0.04)"
                  rx={6}
                  pointerEvents="none"
                />
              )}
              {keys.map((key) => {
                const val = d[key];
                if (val === undefined || val === null) return null;
                
                const barX = x1Scale(key);
                if (barX === undefined) return null;
                
                const barWidth = x1Scale.bandwidth();
                const barY = yScale(val);
                const barHeight = innerHeight - barY;
                const radius = Math.min(barWidth / 2, 8);
                
                const isHovered = isGroupHovered && hoveredNode?.key === key;
                const isDimmed = hoveredNode && !isHovered;

                return (
                  <g 
                    key={`${d.platform}-${key}`}
                    style={{
                      opacity: isDimmed ? 0.35 : 1,
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    {/* Main colored bar - use clipPath trick for flat bottom + rounded top */}
                    <clipPath id={`clip-${d.platform}-${key}`}>
                      <rect
                        x={barX}
                        y={barY}
                        width={barWidth}
                        height={barHeight}
                      />
                    </clipPath>
                    <rect
                      x={barX}
                      y={barY}
                      width={barWidth}
                      height={barHeight + radius}
                      rx={radius}
                      ry={radius}
                      fill={COLORS[key]}
                      filter="url(#depth-shadow)"
                      clipPath={`url(#clip-${d.platform}-${key})`}
                      className="visx-bar-element"
                      onMouseMove={(e) => {
                        setHoveredNode({ platform: d.platform, key });
                        handlePointerMove(e, d);
                      }}
                      onMouseLeave={() => {
                        setHoveredNode(null);
                        hideTooltip();
                      }}
                    />
                    {/* Stripe pattern overlay */}
                    <rect
                      x={barX}
                      y={barY}
                      width={barWidth}
                      height={barHeight + radius}
                      rx={radius}
                      ry={radius}
                      fill="url(#stripes)"
                      clipPath={`url(#clip-${d.platform}-${key})`}
                      pointerEvents="none"
                    />
                    {/* Hover glow highlight */}
                    {isHovered && (
                      <rect
                        x={barX}
                        y={barY}
                        width={barWidth}
                        height={barHeight + radius}
                        rx={radius}
                        ry={radius}
                        fill="rgba(255,255,255,0.15)"
                        clipPath={`url(#clip-${d.platform}-${key})`}
                        pointerEvents="none"
                      />
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </g>
    </svg>
  );
};