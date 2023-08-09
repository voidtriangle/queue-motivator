import React from 'react';
import { AppEvents, Queue, renderWidget, useSessionStorageState } from "@remnote/plugin-sdk";

function Statistic({ label, value, id }) {
  return (
    <div id={id} style={{ margin: '0 20px' }}>
      {label}: <span style={{ fontWeight: 'bold', color: 'lightgreen' }}>{value}</span>
    </div>
  );
}

function popup() {
  const [cardPerMinute] = useSessionStorageState("cardPerMinute", 0);
  const [remainingTime] = useSessionStorageState("remainingTime", 0);
  const [totalCardsCompleted] = useSessionStorageState("totalCardsCompleted", 0);
  const [totalTimeSpent] = useSessionStorageState("totalTimeSpent", 0);

  return (
    <div id="card-stats" style={{ display: 'flex', justifyContent: 'space-between', whiteSpace: 'nowrap', overflowX: 'auto', fontFamily: 'Bookerly, "Segoe UI", sans-serif' }}>
      <Statistic label="Cards per minute" value={cardPerMinute} id="cards-per-minute" />
      <Statistic label="Time to Finish" value={remainingTime} id="time-to-finish" />
      <Statistic label="Cards Reviewed" value={totalCardsCompleted} id="cards-reviewed" />
      <Statistic label="Time Spent" value={`${totalTimeSpent} Minute`} id="time-spent" />
    </div>
  );
}

renderWidget(popup);
