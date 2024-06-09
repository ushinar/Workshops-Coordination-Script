SHEET=1 //file type is sheet
DOC=0  //file type is doc
DYELLOW='#f1c232'
LGREEN='#b6d7a8'
LORANGE='#fce5cd'
LRED='#ea9999'
CONFIG_FILE_NAME="Config" //Filename of the config file. It should be in the same folder as the master file



START=1
function Form_To_Sheet() {

  var SheetName=getWorkshopWarehouseName(CONFIG_FILE_NAME)
  ss=openByName(SheetName,SHEET)
  var sheet = ss.getActiveSheet();
  var range = sheet.getDataRange();
  var notes = range.getNotes();
  var squares = range.getValues();
  var Back = range.getBackgrounds();
  // console.log(Back)
  for(var k=0;k<13;k++)
  {
    console.log(k)

    Back[k][0]=DYELLOW
  }
  squares[1][0]="Days"
  squares[2][0]="Times"
  squares[3][0]="Repetitions"
  squares[4][0]="Location"
  squares[5][0]="Constraints"
  squares[6][0]="Gala"
  squares[7][0]="Volleyclub"
  squares[8][0]="FIGHT NIGHT"
  squares[9][0]="Special requests"
  squares[10][0]="Duration"

  squares[11][0]="Email"
  squares[12][0]="Attendees cap"

  var form = FormApp.getActiveForm();
  var formResponses = form.getResponses();
  console.log(formResponses.length);
  for (var i = 0; i < formResponses.length; i++) {
    var formResponse = formResponses[i];
    var itemResponses = formResponse.getItemResponses();
    var email= formResponse.getRespondentEmail()
    console.log(email)
    var Workshop_name=Capitalize(itemResponses[0].getResponse())
    var shortdesc=itemResponses[1].getResponse()
    var longdesc=itemResponses[2].getResponse()
    var prop=itemResponses[3].getResponse()
    var level=itemResponses[4].getResponse()
    if(level=="All levels are welcome")
      level="All levels";
    try {     var Instructor_Name=Capitalize(itemResponses[5].getResponse()) } catch (error){   console.log(error);   console.log(Workshop_name);Instructor_Name="unknown" }    

    var duration=itemResponses[6].getResponse()
    var repetitions=itemResponses[7].getResponse()
    var Attendees_cap=itemResponses[8].getResponse()
    var Location=itemResponses[9].getResponse()
    var Days=itemResponses[10].getResponse()
    var Times=itemResponses[11].getResponse()
    var Gala=itemResponses[12].getResponse()
    var Volleyclub=itemResponses[13].getResponse()
    var FightNight=itemResponses[14].getResponse()
    var Constraints=itemResponses[15].getResponse()
    try {var Final_Notes=itemResponses[16].getResponse()} catch (error){   console.log(error);   console.log(Workshop_name); Final_Notes="unknown" }
    var squaretext=Workshop_name+" - \n"+Instructor_Name
    var LocationString=""
    for(var k=0;k<Location.length;k++)
      LocationString+= Location[k]+",";
    LocationString=LocationString.slice(0, -1)
    var note="שם הסדנה: "+Workshop_name +"\n"+ //
      "שם סדנה באנגלית (רשות): "+"\n"+ //
      "שם מנחה: " +Instructor_Name+"\n"+ //
      "תיאור סדנה במשפט: "+shortdesc+"\n"+ //
      "תיאור ארוך (רשות): "+longdesc+"\n" + //
      "תחום: "+ prop.toString()+"\n"+ //
      "רמה: "+ level+"\n"+ //
      "מידע ליצירת קשר (בעדיפות אימייל): "
      if(duration!=60)
        note+="\n"+ "הערות: "+duration+ "minutes."
      console.log(note)
      squares[0][i+START]=squaretext
      notes[0][i+START]=note
      Back[0][i+START]=LRED

      squares[1][i+START]=Days.toString()
      squares[2][i+START]=Times.toString()
 
      squares[3][i+START]=repetitions
      squares[4][i+START]=LocationString

      squares[5][i+START]=Constraints
      squares[6][i+START]=Gala
      squares[7][i+START]=Volleyclub
      squares[8][i+START]=FightNight
      squares[9][i+START]=Final_Notes
      squares[10][i+START]=duration
      squares[11][i+START]=email
      squares[12][i+START]=Attendees_cap

      for(var k=1;k<13;k++)
         Back[k][i+START]=LORANGE
      console.log(Days)
    }





    range.setNotes(notes)
    range.setValues(squares)
    range.setBackgrounds(Back)
    SpreadsheetApp.flush()
  
}
function openByName(filename,type,subFolder) {

  //open specific folder and get the files
  var FormId =  FormApp.getActiveForm().getId();
  var FormFile =  DriveApp.getFileById(FormId);
  var folderId = FormFile.getParents().next().getId();
  
  if(subFolder!=undefined)
  {
    var parentFolder = DriveApp.getFolderById(folderId);
    var newFolderPath = parentFolder.getFoldersByName(subFolder);
    var newFolder = newFolderPath.hasNext() ? 
    newFolderPath.next() : parentFolder.createFolder(subFolder);
    folderId=newFolder.getId()
  }

  var files = DriveApp.getFolderById(folderId).getFiles();
  //The code below will search for Announcement 1 file and open it if found.
  while (files.hasNext()) {
    var file = files.next();
    var fileType = file.getMimeType();
    //Check if the filename matches
    if(file.getName() == filename){
      //Open document
      if(type==DOC)
        var  doc=DocumentApp.openById(file.getId());
      else
        var  doc=SpreadsheetApp.openById(file.getId());
      return doc
    }
  }
  if(type==DOC)
    var doc = DocumentApp.create(filename);
  else
    var doc = SpreadsheetApp.create(filename);
  docFile = DriveApp.getFileById( doc.getId() );
  DriveApp.getFolderById(folderId).addFile( docFile );
  DriveApp.getRootFolder().removeFile(docFile);
  return doc
  }
function getWorkshopWarehouseName(conf)
{
  if(conf==undefined) //faster if a parameter, but ok if not
    var conf=openByName(CONFIG_FILE_NAME,SHEET,"TimeTables").getActiveSheet()
  return    conf.getRange('B11').getValue()
}

function Capitalize(text)
{
// Convert each word to Uppercase, google translate seems bad at this, so this is the lesser evil
  const words = text.split(" ");
  for (let i = 0; i < words.length; i++) {
    if(words[i])
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    else
        words[i]=""
  }
    text=words.join(" ");
  return text

  }