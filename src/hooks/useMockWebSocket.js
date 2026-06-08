// src/hooks/useMockWebSocket.js
import { useState, useEffect } from 'react';

const INITIAL_DATA = [
  { platform: 'P1', active: 13500000, inactive: 2025000, noGps: 675000 },
  { platform: 'P2', active: 12000000, inactive: 1800000, noGps: 600000 },
  { platform: 'P3', active: 12350000, inactive: 1852500, noGps: 617500 },
  { platform: 'P4', active: 9000000, inactive: 1350000, noGps: 450000 },
  { platform: 'P5', active: 7000000, inactive: 1050000, noGps: 350000 },
  { platform: 'P6', active: 55000, inactive: 8250, noGps: 2750 },
  { platform: 'P7', active: 7000, inactive: 1050, noGps: 350 },
  { platform: 'P8', active: 5000, inactive: 750, noGps: 250 },
  { platform: 'P9', active: 6, inactive: 1, noGps: 0 },
  { platform: 'P10', active: 3, inactive: 0, noGps: 0 }
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
    const timer = setInterval(() => {
      setData((currentData) =>
        currentData.map((row) => ({
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