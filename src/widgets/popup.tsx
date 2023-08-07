import { AppEvents, Queue, renderWidget,useSessionStorageState } from "@remnote/plugin-sdk";

function popup() {
  const [cardPerMinute] = useSessionStorageState("cardPerMinute", 0);
  const [remainingTime] = useSessionStorageState("remainingTime", 0);
  const [totalCardsCompleted] = useSessionStorageState("totalCardsCompleted", 0);

  

  return (
    <div id="card-stats" style={{ display: 'flex', justifyContent: 'space-between', whiteSpace: 'nowrap', overflowX: 'auto', fontFamily: 'Bookerly, "Segoe UI", sans-serif' }}>
  <div id="cards-per-minute" style={{ margin: '0 20px' }}>
    Cards per minute: <span style={{ fontWeight: 'bold', color: 'lightgreen' }}>{cardPerMinute}</span>
  </div>
  <div id="time-to-finish" style={{ margin: '0 20px' }}>
    Time to Finish: <span style={{ fontWeight: 'bold', color: 'lightgreen' }}>{remainingTime}</span>
  </div>
  <div id="cards-reviewed" style={{ margin: '0 20px' }}>
    Cards Reviewed: <span style={{ fontWeight: 'bold', color: 'lightgreen' }}>{totalCardsCompleted}</span>
  </div>
</div>

  );
}

renderWidget(popup);