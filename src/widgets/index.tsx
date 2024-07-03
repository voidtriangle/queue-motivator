import { AppEvents, useRunAsync, declareIndexPlugin, QueueEvent, QueueInteractionScore, ReactRNPlugin, WidgetLocation, Card, Rem, RichTextInterface } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';

async function onActivate(plugin: ReactRNPlugin) {
  // Register settings
  await plugin.app.registerWidget(
    "popup",
    WidgetLocation.FloatingWidget, {
      dimensions: {
        width: 1200,
        height: "auto",
      },
    }
  );

  plugin.event.addListener(AppEvents.QueueEnter, undefined, () => {
    var startTime = 0;
    var totalCardsCompleted = 0;
    var totalTimeSpent = 0;
    var totalAgainCount = 0;
    plugin.storage.setSession("cardPerMinute", 0);
    plugin.storage.setSession("remainingTime", 0);
    plugin.storage.setSession("totalCardsCompleted", 0);
    plugin.storage.setSession("totalTimeSpent", 0);
    plugin.storage.setSession("totalAgainCount", 0);
    plugin.storage.setSession("expectedCompletionTime", "");
    startTime = Date.now();

    async function updateDisplay(totalTimeSpent: number, totalCardsCompleted: number, totalCardsInDeckRemain: number) {
      const cardPerMinute = parseFloat((totalCardsCompleted / (totalTimeSpent / 60)).toFixed(2));

      // Calculate remaining time (in minutes) to complete the totalCardsInDeckRemain with cardPerMinute
      const remainingMinutes = totalCardsInDeckRemain / cardPerMinute;

      // Convert remaining minutes to hours, minutes, and seconds
      const INF_SYMBOL = "∞";
      var remainingTime = "∞";
      var expectedCompletionTime = "";

      // Check if remainingMinutes is Infinity or close to it.
      if (!isFinite(remainingMinutes)) {
        remainingTime = INF_SYMBOL;
      } else {
        const hours = Math.floor(remainingMinutes / 60);
        const minutes = Math.floor(remainingMinutes % 60);
        const seconds = Math.floor((remainingMinutes * 60) % 60);
        remainingTime = `${hours} Hour ${minutes} Min ${seconds} Sec`;

        // Calculate the expected completion time in HH:MM:SS AM/PM
        const now = new Date();
        now.setMinutes(now.getMinutes() + remainingMinutes);
        expectedCompletionTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }

      plugin.storage.setSession("cardPerMinute", cardPerMinute);
      plugin.storage.setSession("remainingTime", remainingTime);
      plugin.storage.setSession("totalCardsCompleted", totalCardsCompleted);
      plugin.storage.setSession("totalTimeSpent", (totalTimeSpent / 60).toFixed(2));
      plugin.storage.setSession("totalAgainCount", totalAgainCount);
      plugin.storage.setSession("expectedCompletionTime", expectedCompletionTime);

      setTimeout(async () => {
        await plugin.window.closeAllFloatingWidgets();
        await plugin.window.openFloatingWidget(
          "popup",
          { top: 55, left: 0 },
          "rn-queue__top-bar",
          false
        );
      }, 25);
    }

    plugin.event.addListener(AppEvents.RevealAnswer, undefined, async (data) => {
      if (startTime) {
        var endTime = Date.now();
        var TimeDiff = (endTime - startTime) / 1000;
        totalTimeSpent = totalTimeSpent + TimeDiff;
        startTime = endTime;
      }
    });

    plugin.event.addListener(AppEvents.QueueCompleteCard, undefined, async (data) => {
      if ((data.score as QueueInteractionScore) === QueueInteractionScore.AGAIN) {
        totalAgainCount++;
        var totalCardsInDeckRemain = await plugin.queue.getNumRemainingCards();
        if (totalCardsInDeckRemain !== undefined)
          updateDisplay(totalTimeSpent, totalCardsCompleted, totalCardsInDeckRemain);
      } else {
        totalCardsCompleted++;
        var totalCardsInDeckRemain = await plugin.queue.getNumRemainingCards();
        if (totalCardsInDeckRemain !== undefined)
          updateDisplay(totalTimeSpent, totalCardsCompleted, totalCardsInDeckRemain);
      }
    });

    plugin.event.addListener(AppEvents.QueueExit, undefined, async (data) => {
      plugin.window.closeAllFloatingWidgets();
    });
  });
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
