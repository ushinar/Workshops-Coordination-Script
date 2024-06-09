//Color Values
BLUE='#0000ff'
GREEN='#d9ead3'
LGREEN='#b6d7a8',
DGREEN='#274e13'
PURPLE='#351c75'
MAGENTA='#741b47'
LPINK='#ea9999'

function Schedule_create(conf) {
  SpreadsheetApp.getActiveSpreadsheet().toast('Task started','Creating Pretty Schedules');


  //NOTE: RUNNING THIS WILL ERASE OLD VERSIONS IF THEY STILL HAVE THE SAME NAME AND ARE IN THE SAME FOLDER

  if(conf==undefined) //faster if a parameter, but ok if not
    var conf=openByName(CONFIG_FILE_NAME,SHEET).getActiveSheet()

  var masterSchedule=openByName(getMasterFilename(conf),SHEET)

  //read JSON
  var database=openByName(getDatabaseFilename(conf),DOC)
  var text= database.getBody().getText() 
  var Workshop_arr=JSON.parse(text)
  SpreadsheetApp.getActiveSpreadsheet().toast('Database Loaded');

  Hebsheet=openByName(getHebrewScheduleFilename(conf),SHEET)
  Engsheet=openByName(getEnglishScheduleFilename(conf),SHEET)
  copyPasteSheet(masterSchedule,Hebsheet, "לוח סדנאות","מפת הכנס והסדנאות",2)
  copyPasteSheet(masterSchedule,Engsheet,"Workshops schedule","Site and Workshops Map",2)
  if(TRANS_ARB)
  {
    Arbsheet=openByName(getArabicScheduleFilename(conf),SHEET)
     copyPasteSheet(masterSchedule,Arbsheet,"لوحة الورش","خريطة المؤتمر والورش",2)
  }


  var rangeHeb = Hebsheet.getActiveSheet().getDataRange();
  var notesHeb = rangeHeb.getNotes();
  var squaresHeb = rangeHeb.getValues();

  var rangeEng = Engsheet.getActiveSheet().getDataRange();
  var notesEng = rangeEng.getNotes();
  var squaresEng = rangeEng.getValues();
  // Backgrounds for english speaking workshops will be marked purple
  var EngBack= rangeEng.getBackgrounds()
  if(TRANS_ARB)
  {
    var rangeArb = Arbsheet.getActiveSheet().getDataRange();
    var notesArb = rangeArb.getNotes();
    var squaresArb = rangeArb.getValues();
  }
  
  var marker=FindMarker(squaresHeb,"יום",0) //I assume all behave the same in this regard

  var SignOfLife=true

   for(var i = 0;i < notesHeb.length;i++){
     // Only print toasts every once in a while. This is both to ease on running time, and because too quick toast overrun eachother
        if(i%15==0) 
          SignOfLife=false
        for (var j = 0; j < notesHeb[0].length; j++){
            if(Workshop_arr[i][j]!=null)
            {
              if(!SignOfLife)
                {
              SpreadsheetApp.getActiveSpreadsheet().toast(Workshop_arr[i][j].info.src,'Now Processing');
                  SignOfLife=true

                }
            }
            writeToSheet(Workshop_arr[i][j],i,j,notesEng,squaresEng,EngBack,ENGLISH)
            writeToSheet(Workshop_arr[i][j],i,j,notesHeb,squaresHeb,null,HEBREW)
            if(TRANS_ARB)
               writeToSheet(Workshop_arr[i][j],i,j,notesArb,squaresArb,null,ARABIC)


        }
    }
    rangeHeb.setNotes(notesHeb)
    rangeHeb.setValues(squaresHeb)
    Hebsheet.setRowHeight(marker-1,40)
    Hebsheet.setRowHeight(marker,40)
    Hebsheet.getActiveSheet().hideRows(1, marker-1);

    rangeEng.setNotes(notesEng)
    rangeEng.setValues(squaresEng)
    rangeEng.setBackgrounds(EngBack)
    Engsheet.setRowHeight(marker-1,40) 
    Engsheet.setRowHeight(marker,40) 
    Engsheet.getActiveSheet().hideRows(1, marker-1);


    if(TRANS_ARB){
      rangeArb.setValues(squaresArb)
      rangeArb.setNotes(notesArb)
      Arbsheet.setRowHeight(marker-1,40)
      Arbsheet.setRowHeight(marker,40)

      Arbsheet.getActiveSheet().hideRows(1, marker-1);
    }

    // maybe later I will reveal this row in a smarter way, supposed to show the following message:
    //You Can Also Fill A Workshop At The Convention Itself, Depending On Available Space
    Engsheet.getActiveSheet().showRows(6,2);  

    //
    Hebsheet.getActiveSheet().showRows(6,2);
    if(TRANS_ARB)
      Arbsheet.getActiveSheet().showRows(6,2);

    Engsheet.getActiveSheet().setRightToLeft(false);

//  // sharing options
//    Engsheet.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
//    Hebsheet.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
//    if(TRANS_ARB)
//       Arbsheet.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);

    SpreadsheetApp.flush()
    SpreadsheetApp.getActiveSpreadsheet().toast("schedules should now be stored in "+getEnglishScheduleFilename()+" and "+ getHebrewScheduleFilename());


}

function purplizeEnglish(color,text)
{// code to classify workshops that are english compatibles and those that are not, by coloring them differently.
  var EnglishLetters = /[a-zA-Z]/g;

  if(color==GREEN || color==LGREEN || color==DGREEN)//else the classification is not necessary, as english speakers workshops will have a color of their own
  //If english letters are in original workshop name, workshop is presumed suitable for english speakers             
      if(EnglishLetters.test(text)){
        return PURPLE
      } 
      else
        return  MAGENTA
  else   
    return color

}


function writeToSheet(element,i,j,notes,squares,Back,Lang) 
{ //Possibly I should just make two functions
  /* 
  Lang - english schedule or hebrew schedule
  element represents a workshop
  i,j indices of cell  - not sure why those are necessary? Probably I can just return a pair instead 
  notes - notes array
  Back - backgrounds, currently only relevant for english
  squares squares array
  */
    if(element!=null)
            {
              var curr=Object.assign(new Workshop(),element)
              var info=curr.info
              // Prints to console if debug is on
              if(DEBUG)
                console.log(info.src)
              // back to program logic
              if(curr.details!=null)
              {
                if(Lang==ARABIC)
                  notes[i][j]=curr.createArabicNote()
                else
                  if(Lang==HEBREW)
                    notes[i][j]=curr.createHebrewNote()
                  else// Lang==English
                    notes[i][j]=curr.createEnglishNote()
              }
              else 
              { // if no details, notes are null
                notes[i][j]=null
              }
            if(Lang==ARABIC)
              {
                squares[i][j]=curr.info.Arb
              }
            else

              if(!curr.details.alert  && curr.details.Workshop_Name.lang==MULTILINGUAL) 
              //if the workshop is Assumed multilingual, and no alert (meaning this is a workshop))
              //special treatment for workshops that gave names in both languages
              {
                if(Lang==HEBREW)
                squares[i][j]=curr.details.Workshop_Name.Heb+" - "+PurifyHebrew(curr.details.Instructor_Name.Heb)
                else{ // Lang==English
                  squares[i][j]=curr.details.Workshop_Name.Eng+" - "+PurifyEnglish(curr.details.Instructor_Name.Eng)
                  //purple background for multilingual
                  Back[i][j]= PURPLE
                }
              }
              
              else
              { 
                if(Lang==ENGLISH)
                {
                  //routine to check if we are multilingual for some other reason, and colorize accordingly
                  Back[i][j]=purplizeEnglish(Back[i][j],info.src)
                  if(info.lang==HEBREW )
                  {
                    // write  in english to english board, with corrections
                    squares[i][j]=PurifyEnglish(info.Eng)
                  }
                  else
                  {
                    // original is in english, don't touch it

                    squares[i][j]=info.src  
                  }
                
              }
                else //Lang==HEBREW, just write to hebrew board as is
                  squares[i][j]=info.src
              }
           
    }
      else 
        { //if the element is null, set notes to none (erase unwanted)
          squares[i][j]=null
          notes[i][j]=null
          if(Lang==ENGLISH && (Back[i][j]==PURPLE || Back[i][j]==MAGENTA))
            if(j%2==0) //might defer...
              Back[i][j]=LGREEN
            else
              Back[i][j]=GREEN


        }
}

function FindMarker(squares,Key, col=1) 
{// checks if string at column col of squares contains key, and returns the row, or -1  if not found
 var marker=-1
 for(var i = 0;i < squares.length;i++){
   curr=squares[i][col]
   if(typeof curr.getText === 'function') // separating strings from richtextvalue in a quite obnixous manner
      curr=curr.getText()
    else
      curr=String(curr)
    // curr = curr.replace("/n", " "); //tried to fix justification issues
   if(curr.includes(Key))
   {
    marker=i
    return marker
   }
 }
 return marker
}


