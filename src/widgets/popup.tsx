import { renderWidget, useSessionStorageState } from "@remnote/plugin-sdk";
import React, { useEffect, useState } from 'react';

function Popup() {
  const [cardPerMinute, setCardPerMinute] = useSessionStorageState("cardPerMinute", 0);
  const [remainingTime, setRemainingTime] = useSessionStorageState("remainingTime", "∞");
  const [totalCardsCompleted, setTotalCardsCompleted] = useSessionStorageState("totalCardsCompleted", 0);
  const [totalTimeSpent, setTotalTimeSpent] = useSessionStorageState("totalTimeSpent", 0);
  const [totalAgainCount, setTotalAgainCount] = useSessionStorageState("totalAgainCount", 0);
  const [expectedCompletionTime, setExpectedCompletionTime] = useSessionStorageState("expectedCompletionTime", "");
  const [loaded, setLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setLoaded(true);
    console.log("Popup component mounted.");
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
      console.log("Popup component unmounted.");
    };
  }, []);

  const cardPerMinuteColor = cardPerMinute < 5 ? 'red' : 'lightgreen';
  const renderArrow = () => {
    return cardPerMinute < 5 ? <span style={{ color: 'red' }}>↓</span> : cardPerMinute > 5 ? <span style={{ color: 'green' }}>↑</span> : null;
  };

  // Calculate session time
  const sessionStartTime = new Date();
  sessionStartTime.setSeconds(sessionStartTime.getSeconds() - totalTimeSpent * 60);
  const sessionDuration = new Date(currentTime - sessionStartTime);

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
        overflow: 'hidden',
        border: '0.2px solid gray',
        position: 'relative',
        paddingLeft: '10px', 
      }}
    >
      <div style={{ margin: '0 5px', color: 'rgb(29, 155, 222)' }}>
        Clock: <span style={{ fontWeight: 'bold', color: 'lightgreen' }}>{currentTime.toLocaleTimeString()}</span>
      </div>
      <div style={{ margin: '0 5px', color: 'rgb(29, 155, 222)' }}>
        Session: <span style={{ fontWeight: 'bold', color: 'lightgreen' }}>{sessionDuration.toISOString().substr(11, 8)}</span>
      </div>
      <div style={{ margin: '0 5px', color: 'rgb(29, 155, 222)' }}>
        Speed: <span style={{ fontWeight: 'bold', color: cardPerMinuteColor }}>{cardPerMinute} Card/Min</span> {renderArrow()}
      </div>
      <div style={{ margin: '0 5px', color: 'rgb(29, 155, 222)' }}>
        Status: [<span style={{ fontWeight: 'bold', color: 'lightgreen' }}>{totalCardsCompleted}</span>] 
        [<span style={{ fontWeight: 'bold', color: 'green' }}>{totalCardsCompleted - totalAgainCount}</span>/
        <span style={{ fontWeight: 'bold', color: 'red' }}>{totalAgainCount}</span>]
      </div>
      <div style={{ margin: '0 5px', color: 'rgb(29, 155, 222)' }}>
        Expected: <span style={{ fontWeight: 'bold', color: 'lightgreen' }}>{remainingTime}</span>|
        <span style={{ fontWeight: 'bold', color: 'lightgreen' }}>{expectedCompletionTime}</span>
      </div>
    </div>
  );
}

renderWidget(Popup);
