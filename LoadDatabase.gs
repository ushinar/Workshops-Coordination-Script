
function StoreDatabase(starttime= new Date())
{
  StoreDatabaseTriggered(starttime,false);
}

function StoreDatabaseTriggered(starttime= new Date(),trigged=true,conf)
{
    SpreadsheetApp.getActiveSpreadsheet().toast('Task started\r\n Expect this to take a while','Stroing Database');


    if(conf==undefined) //faster if a parameter, but ok if not
      var conf=openByName(CONFIG_FILE_NAME,SHEET).getActiveSheet()

  if(getBusy(conf))
  {
    SpreadsheetApp.getActiveSpreadsheet().toast("Another script runnning right now, aborting. Wait, or manually change busy in the config file"  );
    return;
  }
  Lock(conf);//seems not to actually work
    //*************************************************************************/\
    var StartValue;
    if(!trigged)
    {
      activateTrigger();
      StartValue=0
    }
    else
    {
      StartValue=getStartLine(conf);
      if(StartValue==0) //if trigged on a completed run, return
        return;
    } //only continue trigger if in middle of data collection

    var masterSchedule=openByName(getMasterFilename(conf),SHEET)
    var sheet = masterSchedule.getActiveSheet();
    var range = sheet.getDataRange();
    var notes = range.getNotes();
    var squares = range.getValues();
    var Workshop_arr = Array.from(Array(notes.length), () => new Array(notes[0].length));


    var database = openByName(getDatabaseFilename(conf),DOC)
    if(StartValue!=0)
    {
      console.log("Loading previous data")
      var text= database.getBody().getText() 
      var temp=JSON.parse(text)
      SpreadsheetApp.getActiveSpreadsheet().toast("Loading Previous data");
      for(var i = 0;i < StartValue;i++){
        for (var j = 0; j < notes[0].length; j++){
          Workshop_arr[i][j]=temp[i][j]
          console.log("here")
    }
      }}
    var SignOfLife=true
    for(var i = StartValue;i < notes.length;i++){
      // Only print toasts every once in a while. This is both to ease on running time, and because too quick toast overrun eachother
      if(i%15==0)
        SignOfLife=false
      for (var j = 0; j < notes[0].length; j++){
            if(squares[i][j])
            {
              // Prints to console if debug is on, and a toast every once in a while 

              if(!SignOfLife)
                {
                  var now = new Date();
                  var runtime=Math.floor((now-starttime)/1000);
                  if(runtime>280)// risking running overtime
                  {
                    console.log("6 minutes limitation approached: Aborting")
                    SpreadsheetApp.getActiveSpreadsheet().toast("6 minutes limitation approached",'Aborting');
                    database.getBody().clear()

                    database.getBody().appendParagraph(JSON.stringify(Workshop_arr))

                    database.saveAndClose()

                                          console.log("Abort successful\n Current Runtime is: "+runtime+"\n Current Row is: "+i+"\n please run again with that number as starting value");
                                          setStartLine(conf,i);
                                          Release(conf,true); // keep trigger on

                     return [false,i];
                  }

                  SpreadsheetApp.getActiveSpreadsheet().toast(squares[i][j]+"\r\n"+i+", "+j+"\r\n running time: "+runtime,'Now Processing');
                  SignOfLife=true
                }

              Workshop_arr[i][j]=parseAndCreateWorkshop(squares[i][j],notes[i][j],i,j)
            }
        }
    }
  database.getBody().clear()
  database.getBody().appendParagraph(JSON.stringify(Workshop_arr))
  database.saveAndClose()
  setStartLine(conf,0);
  Release(conf,false); //no further need for trigger, this automatically releases the trigger as well
      SpreadsheetApp.getActiveSpreadsheet().toast("Database should now be stored in "+getDatabaseFilename());
  return [true,0]
}

function parseAndCreateWorkshop(square,note,i,j)
{
  if(DEBUG)
      console.log(square)
  arr=[]
  if(note)
      arr=ParseFields(note);

  var curr= new Workshop(i,j,arr,square)
  return curr
}
