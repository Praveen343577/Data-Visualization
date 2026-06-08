// src/components/charts/VisxBarChart.jsx
import { useMemo, useState } from 'react';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { LinearGradient } from '@visx/gradient';
import { localPoint } from '@visx/event';
import { motion, AnimatePresence } from 'framer-motion';

const margin = { top: 40, right: 30, bottom: 50, left: 70 };
const keys = ['active', 'inactive', 'noGps'];

const colorMap = {
  active: 'url(#grad-active)',
  inactive: 'url(#grad-inactive)',
  noGps: 'url(#grad-nogps)',
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
      padding: 0.25,
    });

    const x1 = scaleBand({
      domain: keys,
      range: [0, x0.bandwidth()],
      padding: 0.1,
    });

    const y = scaleLinear({
      domain: [0, maxVal * 1.1],
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
        <LinearGradient id="grad-active" from="#8b5cf6" to="#22d3ee" vertical={false} />
        <LinearGradient id="grad-inactive" from="#f59e0b" to="#f43f5e" vertical={false} />
        <LinearGradient id="grad-nogps" from="#94a3b8" to="#e2e8f0" vertical={false} />
        <filter id="depth-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.4" />
        </filter>
      </defs>

      <Group left={margin.left} top={margin.top}>
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
          tickFormat={(v) => (v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v)}
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
          return (
            <g key={`group-${d.platform}`} transform={`translate(${groupX}, 0)`}>
              <AnimatePresence>
                {keys.map((key) => {
                  const val = d[key];
                  const barWidth = x1Scale.bandwidth();
                  const barHeight = innerHeight - yScale(val);
                  const barX = x1Scale(key);
                  const barY = yScale(val);
                  
                  const isHovered = hoveredNode?.platform === d.platform && hoveredNode?.key === key;
                  const isDimmed = hoveredNode && !isHovered;

                  return (
                    <g key={`bar-${d.platform}-${key}`}>
                      <motion.rect
                        x={barX}
                        y={barY}
                        width={barWidth}
                        height={barHeight}
                        fill={colorMap[key]}
                        rx={4}
                        ry={4}
                        filter="url(#depth-shadow)"
                        className="visx-bar-element"
                        initial={{ y: innerHeight, height: 0 }}
                        animate={{
                          y: barY,
                          height: barHeight,
                          scale: isHovered ? 1.03 : 1,
                          opacity: isDimmed ? 0.3 : 1,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 100,
                          damping: 15,
                        }}
                        onMouseMove={(e) => {
                          setHoveredNode({ platform: d.platform, key });
                          handlePointerMove(e, d);
                        }}
                        onMouseLeave={() => {
                          setHoveredNode(null);
                          hideTooltip();
                        }}
                      />
                      {/* Sub-pixel geometric top facet for 3D illusion */}
                      <motion.rect
                        x={barX}
                        y={barY}
                        width={barWidth}
                        height={4}
                        fill="#ffffff"
                        rx={4}
                        ry={4}
                        initial={{ opacity: 0 }}
                        animate={{ 
                          y: barY,
                          opacity: isDimmed ? 0.05 : 0.25 
                        }}
                        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                        style={{ pointerEvents: 'none' }}
                      />
                    </g>
                  );
                })}
              </AnimatePresence>
            </g>
          );
        })}
      </Group>
    </svg>
  );
};

// Extracted internal Group component to avoid additional imports
const Group = ({ top = 0, left = 0, children, ...rest }) => (
  <g transform={`translate(${left}, ${top})`} {...rest}>
    {children}
  </g>
);