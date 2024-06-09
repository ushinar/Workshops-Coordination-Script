function Update(conf) {
/*currently no longer supported: this works, but the speed is a bit slower than it should be,
hence I believe it is best to just use the command functions to reload data if necessary, as they are fast enough usually, just delay the final schedules long enough.
This did work, but is not updated for new functions anymore, it should be possible to accomodate this. Known missing features: poster was never tested, Arabic never implemented. Board cards are still updated though we have switched to poster...
I do not intend to do all this until I see a need to.
*/

  //Formats, and colors might not be updated
  DEBUG=true


  //get cell data
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  var cell = sheet.getActiveCell();
  var row = cell.getRow()-1;  //dont know why this offset is necessary but it is
  var column = cell.getColumn()-1;  //dont know why this offset is necessary but it is
  var value=cell.getValue()
  var note=cell.getNote()
  SpreadsheetApp.getActiveSpreadsheet().toast('Cell Loaded');
    //lock editing while database is updated
      Lock(conf)
    //Load database
  var database=openByName(getDatabaseFilename(),DOC)
  var text= database.getBody().getText() 
  var Workshop_arr=JSON.parse(text)
  SpreadsheetApp.getActiveSpreadsheet().toast('Database Loaded');  


  if(value)
  {
    var ReWrite= parseAndCreateWorkshop(value,note,row,column,DEBUG)
    if(DEBUG)
      console.log(ReWrite)
    Workshop_arr[row][column]=ReWrite
      //update database
    database.getBody().clear()
    database.getBody().appendParagraph(JSON.stringify(Workshop_arr))
    database.saveAndClose()
    Release(conf) //allow another edit to run, henceforth overwrite is less of an issue
    SpreadsheetApp.getActiveSpreadsheet().toast('Database updated');  

    //   // update contacts file
    // I decided it is not worth it to do here
    // var Contacts = openByName(getContactsFilename(conf),DOC)
    // Contacts.getBody().appendParagraph(String(ReWrite.createContact()))
    // Contacts.saveAndClose()
    // SpreadsheetApp.getActiveSpreadsheet().toast('Contacts updated');  

  //update relevant print file
  // // We no longer really care about this function
  // if(column >= COL_START && column < COL_START+Num_Of_Prints)
  //   {
  //      var PrintNames=getPrintFilename(conf)
  //      var Print=openByName(PrintNames[column-COL_START],DOC,getPrintFolderName(conf))
  //   }
  //   Print=ReWrite.createPrinting(Print)
  //   Print.saveAndClose()
  //   SpreadsheetApp.getActiveSpreadsheet().toast('Print File Updated');

  }
  else
  {
    Workshop_arr[row][column]=null
    //update database
    database.getBody().clear()
    database.getBody().appendParagraph(JSON.stringify(Workshop_arr))
    database.saveAndClose()
    Release(conf) //allow another edit to run, henceforth overwrite is less of an issue
    SpreadsheetApp.getActiveSpreadsheet().toast('Database updated');  

  }
  
    Hebsheet=openByName(getHebrewScheduleFilename(conf),SHEET)
    Engsheet=openByName(getEnglishScheduleFilename(conf),SHEET)
    if(TRANS_ARB)
    {
      Arbsheet=openByName(getArabicScheduleFilename(conf),SHEET)
    }
    PosterSheet=openByName(getPosterName(conf),SHEET)
    var rangeHeb = Hebsheet.getActiveSheet().getDataRange();
    var notesHeb = rangeHeb.getNotes();
    var squaresHeb = rangeHeb.getValues();

    var rangeEng = Engsheet.getActiveSheet().getDataRange();
    var notesEng = rangeEng.getNotes();
    var squaresEng = rangeEng.getValues();
    var EngBack= rangeEng.getBackgrounds()

    if(TRANS_ARB)
  {
    var rangeArb = Arbsheet.getActiveSheet().getDataRange();
    var notesArb = rangeArb.getNotes();
    var squaresArb = rangeArb.getValues();
  }
    var rangePos = PosterSheet.getActiveSheet().getDataRange();
    // // var notesPos = rangeHeb.getNotes();
    var squaresPos = rangePos.getRichTextValues();
    SpreadsheetApp.getActiveSpreadsheet().toast('Schedules Loaded');
    writeToSheet(Workshop_arr[row][column],row+ENG_OFFSET,column,notesEng,squaresEng,EngBack,ENGLISH)
    writeToSheet(Workshop_arr[row][column],row+HEB_OFFSET,column,notesHeb,squaresHeb,null,HEBREW)
    if(TRANS_ARB)
    {
      writeToSheet(Workshop_arr[row][column],row+ARB_OFFSET,column,notesArb,squaresArb,null,ARABIC)
    }
    if(POSTER_UPDATE){// At a certain point we start manually fixing the poster, at that point, it might be detrimental to auto update it

      if(Workshop_arr[row][column]!=null && Workshop_arr[row][column].info.src!="")
          {
            var curr=Object.assign(new Workshop(),Workshop_arr[row][column])
            
            squaresPos[row][column]=curr.createPosterNote(squaresPos[row][column].getTextStyle().getFontSize())
          }
      else 
          squaresPos[row][column]=createRichText([],[],"",false)


    } 
    


  //update schedules
      if(POSTER_UPDATE){// At a certain point we start manually fixing the poster, at that point, it might be detrimental to auto update it

    rangePos.setRichTextValues(squaresPos)
    // insertImagesOnSpreadsheet(squaresPos) //it appears also that updating the poster removes the images, which is just stupid however trying to fix it does not lead to better results
      }

    rangeEng.setNotes(notesEng)
    rangeHeb.setNotes(notesHeb)
    rangeEng.setValues(squaresEng)
    rangeHeb.setValues(squaresHeb)
    rangeEng.setBackgrounds(EngBack)

    SpreadsheetApp.flush()

    SpreadsheetApp.getActiveSpreadsheet().toast("row "+row," column "+ column+" was updated in all files");

    //  


}
