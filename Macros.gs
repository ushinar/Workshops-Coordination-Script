TRANS_ARB=1
ERROR=-1 //Unexpeted value flag
MULTILINGUAL=0 //both English and Hebrew
ENGLISH=1 //language is English
HEBREW=2 //language is Hebrew
ARABIC=3// Arabic- rarely used
SHEET=1 //file type is sheet
DOC=0  //file type is doc
UP=1 // For board cards, write at the top of card (in the header)  currently not supported
REG=0 // For board cards, write at the body of card
DOWN=-1 // For board cards, write at the bottom of card (in the footer)  currently not supported
Num_Of_Prints=12 //number of columns corresponding to distinct colors
DEBUG=true //enable or disable printing
CONFIG_FILE_NAME="Config" //Filename of the config file. It should be in the same folder as the master file
ENG_OFFSET=0
HEB_OFFSET=0
ARB_OFFSET=0
COL_START=2
POSTER_UPDATE=1

function activateTrigger(func="StoreDatabaseTriggered"){ //manually activating the trigger causes problems with the image url so this one must  be activated like this. go figure.
  func=func||"triggerFetchTest";
    ScriptApp.newTrigger(func).timeBased().everyMinutes(5).create(); 
}

function removeTrigger(func="StoreDatabaseTriggered"){ 
    var triggers = ScriptApp.getProjectTriggers();
    if(triggers.length!=0)
      ScriptApp.deleteTrigger(triggers[0]);
}


/* please do not remove these functions or change their names. Macros are not very versatile*/
function CommandMenu() {
  var conf=openByName(CONFIG_FILE_NAME,SHEET).getActiveSheet()

  var ui = SpreadsheetApp.getUi();

  // if(getAutoEditPermission(conf) &&  getCommandsPermission(conf))
  //   ui.alert("To prevent errors, \"Allow  Database Store\" and  \"Allow Auto Edit\" cannot both be  enabled.\n To run CommandMenu, first disable \"Allow Auto Edit\" in  the file "+CONFIG_FILE_NAME+"." );
  // else
  //   if(!getCommandsPermission(conf))
  //      ui.alert(" \"Allow  Database Store\" is currently disabled.\n To run CommandMenu, first enable \"Allow  Database Store\" in  the file "+CONFIG_FILE_NAME+"." );
  //   else
      GetCommand(conf)
};

function UpdateCell() {
  //not supported currently
  var conf=openByName(CONFIG_FILE_NAME,SHEET).getActiveSheet()

  var ui = SpreadsheetApp.getUi();
  // ui.alert("Currently Update function is not supported");
  // return
  if(getBusy(conf))
  {
    ui.alert("Another script runnning right now, aborting. Wait, or manually change busy in the config file" );    return;
  }
  else
    {
      SpreadsheetApp.getActiveSpreadsheet().toast('Updating');
      Update(conf)
    }
};