import { AppEvents, Queue, renderWidget, useSessionStorageState } from "@remnote/plugin-sdk";
import React, { useEffect, useState } from 'react';

function popup() {
  const [cardPerMinute] = useSessionStorageState("cardPerMinute", 0);
  const [remainingTime] = useSessionStorageState("remainingTime", 0);
  const [totalCardsCompleted] = useSessionStorageState("totalCardsCompleted", 0);
  const [totalTimeSpent] = useSessionStorageState("totalTimeSpent", 0);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const cardPerMinuteColor = cardPerMinute < 5 ? 'red' : 'lightgreen';

  const renderArrow = () => {
    if (cardPerMinute < 5) {
      return <span style={{ color: 'red' }}>↓</span>;
    } else if (cardPerMinute > 5) {
      return <span style={{ color: 'green' }}>↑</span>;
    }
    return null;
  };

  return (
   <div 
    id="card-stats" 
    style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        whiteSpace: 'nowrap', 
        overflowX: 'auto', 
        fontFamily: 'Bookerly, "Segoe UI", sans-serif',
        opacity: loaded ? 1 : 0, 
        transition: 'opacity 2s',
        borderRadius: '10px',
        overflow: 'hidden',       // This will ensure the rounding effect is visible
        border: '0.2px solid gray',  // Just for visual check, remove if not needed
		position: 'relative',
		paddingLeft: '10px', 
    }}
>
      <div id="cards-per-minute" style={{ margin: '0 5px' }}>
        Cards per minute: <span style={{ fontWeight: 'bold', color: cardPerMinuteColor }}>{cardPerMinute}</span> {renderArrow()}
      </div>
      <div id="time-to-finish" style={{ margin: '0 5px' }}>
        Time to Finish: <span style={{ fontWeight: 'bold', color: 'lightgreen' }}>{remainingTime}</span>
      </div>
      <div id="cards-reviewed" style={{ margin: '0 5px' }}>
        Cards Reviewed: <span style={{ fontWeight: 'bold', color: 'lightgreen' }}>{totalCardsCompleted}</span>
      </div>
      <div id="time-spent" style={{ margin: '0 10px' }}>
        Time Spent: <span style={{ fontWeight: 'bold', color: 'lightgreen' }}>{totalTimeSpent} Minute</span>
      </div>
    </div>
  );
}

renderWidget(popup);
