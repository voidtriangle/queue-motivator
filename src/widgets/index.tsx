import { AppEvents,useRunAsync, declareIndexPlugin, QueueEvent, QueueInteractionScore, ReactRNPlugin, WidgetLocation, Card, Rem, RichTextInterface } from '@remnote/plugin-sdk';
import '../style.css';
import '../App.css';



async function onActivate(plugin: ReactRNPlugin) {
  // Register settings
 

  await plugin.app.registerWidget(
    "popup",
    WidgetLocation.FloatingWidget,{
      dimensions :{
        width:950,
        height:"auto",
      },
    }    
  );

  



  plugin.event.addListener(AppEvents.QueueEnter, undefined, () => {
    var startTime =0;
    var totalCardsCompleted=0;
    var totalTimeSpent=0;
    plugin.storage.setSession("cardPerMinute", 0);
    plugin.storage.setSession("remainingTime", 0);
    plugin.storage.setSession("totalCardsCompleted", 0);
	plugin.storage.setSession("totalTimeSpent", 0);
    startTime = Date.now();


    async  function updateDisplay( totalTimeSpent: number,totalCardsCompleted:number, totalCardsInDeckReamin:number)
    {
      
      const cardPerMinute = parseFloat((totalCardsCompleted / (totalTimeSpent / 60)).toFixed(2));

		
  // Calculate remaining time (in minutes) to complete the totalCardsInDeckRemain with cardPerMinute
      const remainingMinutes = totalCardsInDeckReamin / cardPerMinute;

  // Convert remaining minutes to hours, minutes, and seconds
      const hours = Math.floor(remainingMinutes / 60);
      const minutes = Math.floor(remainingMinutes % 60);
      const seconds = Math.floor((remainingMinutes * 60) % 60);
      const remainingTime = `${hours} Hour ${minutes} Min ${seconds} Sec`;
	  
	  

      plugin.storage.setSession("cardPerMinute", cardPerMinute);
      plugin.storage.setSession("remainingTime", remainingTime);
      plugin.storage.setSession("totalCardsCompleted", totalCardsCompleted);
	  plugin.storage.setSession("totalTimeSpent", (totalTimeSpent/60).toFixed(2));

      setTimeout(async()=>{
        
        plugin.window.closeAllFloatingWidgets();
        await plugin.window.openFloatingWidget(
          "popup",
          {top: -630, 
          left :35},
          "rn-queue__show-answer-btn",
          false
      );
        },25);
      
      
    }
   
    plugin.event.addListener(AppEvents.RevealAnswer,undefined, async(data) => {

      if (startTime) {
        var endTime = Date.now();

        var TimeDiff=(endTime - startTime) / 1000;
        totalTimeSpent=totalTimeSpent+TimeDiff;
		startTime=endTime;
        
      } 

      
   });

   plugin.event.addListener(AppEvents.QueueCompleteCard,undefined, async(data) => {
    console.log("Enter Again");
    if ((data.score as QueueInteractionScore)=== QueueInteractionScore.AGAIN){
      var totalCardsInDeckReamin = await plugin.queue.getNumRemainingCards(); 
      
      if (totalCardsInDeckReamin!==undefined)
      updateDisplay(totalTimeSpent,totalCardsCompleted,totalCardsInDeckReamin);
    }
    else{
      totalCardsCompleted++;
      var totalCardsInDeckReamin = await plugin.queue.getNumRemainingCards(); 
      
      if (totalCardsInDeckReamin!==undefined)
      updateDisplay(totalTimeSpent,totalCardsCompleted,totalCardsInDeckReamin);
    }


  });

  plugin.event.addListener(AppEvents.QueueExit,undefined, async(data) => {

     plugin.window.closeAllFloatingWidgets();
  });

  
  });

 


}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
