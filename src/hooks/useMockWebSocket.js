// src/hooks/useMockWebSocket.js
import { useState, useEffect } from 'react';

const INITIAL_DATA = [
  { platform: 'P1', active: 1350, inactive: 405, noGps: 265 },
  { platform: 'P2', active: 1220, inactive: 300, noGps: 140 },
  { platform: 'P3', active: 1100, inactive: 212, noGps: 117 },
  { platform: 'P4', active: 1090, inactive: 350, noGps: 150 },
  { platform: 'P5', active: 900, inactive: 200, noGps: 150 },
  { platform: 'P6', active: 850, inactive: 285, noGps: 175 },
  { platform: 'P7', active: 770, inactive: 150, noGps: 150 },
  { platform: 'P8', active: 650, inactive: 170, noGps: 125 },
  { platform: 'P9', active: 506, inactive: 101, noGps: 90 },
  { platform: 'P10', active: 403, inactive: 80, noGps: 60 }
];

const applyFluctuation = (value) => {
  if (value === 0) return 0;
  const variance = 0.05; 
  const multiplier = 1 + (Math.random() * variance * 2 - variance);
  return Math.max(0, Math.round(value * multiplier));
};

export const useMockWebSocket = () => {
  const [data, setData] = useState(INITIAL_DATA);

  useEffect(() => {
    // We use INITIAL_DATA as the base so values don't drift to 0 over time
    const timer = setInterval(() => {
      setData(
        INITIAL_DATA.map((row) => ({
          ...row,
          active: applyFluctuation(row.active),
          inactive: applyFluctuation(row.inactive),
          noGps: applyFluctuation(row.noGps)
        }))
      );
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  return data;
};