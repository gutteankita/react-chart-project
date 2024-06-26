import React from 'react';

interface TimeframeSelectorProps {
  onSelect: (unit: 'day' | 'week' | 'month') => void;
}

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ onSelect }) => (
  <div className="timeframe-selector">
    <button onClick={() => onSelect('day')}>Daily</button>
    <button onClick={() => onSelect('week')}>Weekly</button>
    <button onClick={() => onSelect('month')}>Monthly</button>
  </div>
);

export default TimeframeSelector;
