function Clear()
{//clears data from the file, both to ease for next year and to protect privacy.
 //Some extra verification might be necessary.
  // might only work if ran by owner.
  if(conf==undefined) //faster if a parameter, but ok if not
    var conf=openByName(CONFIG_FILE_NAME,SHEET).getActiveSheet()

    var default_note="שם הסדנה:\n\
שם סדנה באנגלית (רשות): \n\
שם מנחה: \n\
תיאור סדנה במשפט:\n\
תיאור ארוך (רשות):\n\
תחום:\n\
רמה:\n\
מידע ליצירת קשר (בעדיפות אימייל):\n\
\n"

    var masterSchedule=openByName(getMasterFilename(conf),SHEET)
    for(k=0;k<masterSchedule.getSheets().length;k++)
    { //in an unusual manner, clearing goes through all sheets, as all of them contains some info which is better not leaked
      var sheet = masterSchedule.getSheets()[k];
      var range = sheet.getDataRange();
      var notes = range.getNotes();
      var squares = range.getValues();
      var Back= range.getBackgrounds()



      var SignOfLife=true

      for(var i = 0;i < squares.length;i++){
      // Only print toasts every once in a while. This is both to ease on running time, and because too quick toast overrun eachother
          if(i%15==0) 
            SignOfLife=false
          for (var j = 2; j < squares[0].length; j++){
              if(Back[i][j]==LGREEN || Back[i][j]==GREEN|| Back[i][j]==DGREEN ||Back[i][j]==LPINK)
              {
                squares[i][j]=""
                notes[i][j]=default_note
                Back[i][j]=Back[i][1] //reverting DGREEN or LPINK to natuaral colors
                if(!SignOfLife)
                  {
                SpreadsheetApp.getActiveSpreadsheet().toast(squares[i][j],'Now Processing');
                    SignOfLife=true

                  }
              }
              else
              {//protect privacy: remove any emails or phones
                squares[i][j]=squares[i][j].replace(/054......./i,"[Phone Number]");
                squares[i][j]=squares[i][j].replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi,"[Workshops Email]");
                squares[i][j]=squares[i][j].replace("this form","[Google Form link]");

              }
          }
      }
    console.log(k)
    range.setNotes(notes)
    range.setValues(squares)
    range.setBackgrounds(Back)
    }


    SpreadsheetApp.flush()

}
