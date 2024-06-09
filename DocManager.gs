
function writefont(text,size)
{ //function related to board cards, deprecated
  var style = {};
  file.setFontSize(size)	
  var body=file.getBody()
  if(loc==REG){
    style[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
    DocumentApp.HorizontalAlignment.CENTER;
    style[DocumentApp.Attribute.FONT_FAMILY] = 'David';
    style[DocumentApp.Attribute.FONT_SIZE] = size;
    style[DocumentApp.Attribute.BOLD] = false;
    // Append a plain paragraph.
    var par = body.appendParagraph(text);
    par.setAttributes(style);
  }
//  else if(loc==UP)
//   {
//     // head=file.getHeader()
//     // if(head==undefined)
//     //   head=file.addHeader()
//     // // style[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
//     // // DocumentApp.HorizontalAlignment.CENTER;
//     // // style[DocumentApp.Attribute.FONT_FAMILY] = 'David';
//     // // style[DocumentApp.Attribute.FONT_SIZE] = size;
//     // // style[DocumentApp.Attribute.BOLD] = false;
//     // var par = head.appendParagraph(text);
//     // // par.setAttributes(style);  
// }
// else if(loc==DOWN)
//   {
//   const documentId =file.getId();
//   const requests = [
//     {
//       createFootnote: {
//         location: {
//           index: 1
//         }
//       }
//     }
//   ]
//   Docs.Documents.batchUpdate({requests:requests},documentId)

//   file.saveAndClose()
//   Utilities.sleep(500) // avoid translating too often

//   file=DocumentApp.openById(file.getId());
//     foot=file.getFootnotes()[0].getFootnoteContents()
//     // if(foot==undefined)
//     style[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
//     DocumentApp.HorizontalAlignment.LEFT;
//     style[DocumentApp.Attribute.FONT_FAMILY] = 'David';
//     style[DocumentApp.Attribute.FONT_SIZE] = size;
//     style[DocumentApp.Attribute.BOLD] = false;
//     var par = foot.appendParagraph(text);
//     par.setAttributes(style);  
//   }
  return file
}
function openByName(filename,type,subFolder) {
  //open specific folder and get the files
  var spreadsheetId =  SpreadsheetApp.getActiveSpreadsheet().getId();
  var spreadsheetFile =  DriveApp.getFileById(spreadsheetId);

  var folderId = spreadsheetFile.getParents().next().getId();//get the folder the calling spreadshit is in.
  
  if(subFolder!=undefined)// File is in an inner folder
  {
    var parentFolder = DriveApp.getFolderById(folderId);
    var newFolderPath = parentFolder.getFoldersByName(subFolder);
    var newFolder = newFolderPath.hasNext() ?  // if folder by this name exists already newfolder gets its value, else  create it.
    newFolderPath.next() : parentFolder.createFolder(subFolder);
    folderId=newFolder.getId()
  }

  var files = DriveApp.getFolderById(folderId).getFiles();
  //The code below will search for Announcement 1 file and open it if found.
  while (files.hasNext()) {// search for file
    var file = files.next();
    var fileType = file.getMimeType();
    //Check if the filename matches
    if(file.getName() == filename){
        // file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
        //usually redundant and I think actually causes trouble, I just do it to any new file.
      //Open document
      if(type==DOC)
        var  doc=DocumentApp.openById(file.getId());
    else
        var  doc=SpreadsheetApp.openById(file.getId());
       return doc
    }
  }//file not found, hence it needs be created in the corresponding folder
  if(type==DOC)
    var doc = DocumentApp.create(filename);
  else
    var doc = SpreadsheetApp.create(filename);
  docFile = DriveApp.getFileById( doc.getId() );
  docFile.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);// when creating the file, create it with viewing permissions
//extreme weirdness. If I recall, initially a file is created at source folder of google drive. hence needs be added to the correct folder and then "removed"
  DriveApp.getFolderById(folderId).addFile( docFile ); 
  DriveApp.getRootFolder().removeFile(docFile);
  return doc
  }
function deleteFile(fileName, folderId) {
  //deletes file filename from folder by this ID
  var  myFolder, allFiles, file;
  myFolder = DriveApp.getFolderById(folderId);

  allFiles = myFolder.getFilesByName(fileName);

  while (allFiles.hasNext()) {
    file = allFiles.next();
    file.getParents().next().removeFile(file);
  }
}
function copyPasteSheet(src,dst,name,extraname="", ind){
  //either one sheet, or two (the first in index 0, second in index ind of src) are put into dst. All previous Sheets in dst are erased.
    while(dst.getSheets().length>1)//delete all but one sheet, (cannot have 0 sheets)
          dst.deleteActiveSheet()
    var sheet=src.getSheets()[0].copyTo(dst);
    if(dst.getSheets().length>1)
      dst.deleteActiveSheet()// now the remaining sheet from before can be removed
    dst.getSheets()[0].setName(name)// and new one renamed

    if(extraname!="")
    {
      sheet=src.getSheets()[ind].copyTo(dst);

      dst.getSheets()[1].setName(extraname)
    }






}

function getBusy(conf)// check if currently busy flag is on in file conf
{
  return (conf.getRange('A28').getValue()=="Yes");
}

// function Trigger_Check_and_Toggle(conf) //obsolete, I think
// {
//    if(conf==undefined) //faster if a parameter, but ok if not
//        var conf=openByName(CONFIG_FILE_NAME,SHEET).getActiveSheet()
//   if(conf.getRange('A30').getValue()=="Yes")
//     {
//       conf.getRange('A30').setValue()=="No";
//       SpreadsheetApp.flush()

//       return true;
//     }
//   else
//   {
//     conf.getRange('A30').setValue()=="Yes";
//     SpreadsheetApp.flush()

//     return false;
//   }
// }

function getStartLine(conf) // get startline for load database function, from file conf
{  
  return   conf.getRange('A32').getValue();
}

function Lock(conf) //raise busy flag to prevent problems
{
  if(conf==undefined) //faster if a parameter, but ok if not 
   var conf=openByName(CONFIG_FILE_NAME,SHEET).getActiveSheet()
  conf.getRange('A28').setValue('Yes');;
  SpreadsheetApp.flush()
}

function Release(conf, ContinueTrig=false) //shut down busy flag, and potentially disable trigger
{
  if(conf==undefined) //faster if a parameter, but ok if not
   var conf=openByName(CONFIG_FILE_NAME,SHEET).getActiveSheet()
  conf.getRange('A28').setValue('No');
  if(!ContinueTrig) // if not explicitely instructed to keep the trigger on, turn it off. 
    removeTrigger();
  SpreadsheetApp.flush()
}
function setStartLine(conf,startline)
{
  if(conf==undefined) //faster if a parameter, but ok if not
   var conf=openByName(CONFIG_FILE_NAME,SHEET).getActiveSheet()
  conf.getRange('A32').setValue(startline);;
  SpreadsheetApp.flush()
}
function getMasterFilename(conf)
{
  if(conf==undefined) //faster if a parameter, but ok if not 
   var conf=openByName(CONFIG_FILE_NAME,SHEET).getActiveSheet()
  return    conf.getRange('B2').getValue()

}
function getDatabaseFilename(conf)
{
  if(conf==undefined) //faster if a parameter, but ok if not 
   var conf=openByName(CONFIG_FILE_NAME,SHEET).getActiveSheet()
  return    conf.getRange('B3').getValue()
}
function getHebrewScheduleFilename(conf)
{
  if(conf==undefined) //faster if a parameter, but ok if not
   var conf=openByName(CONFIG_FILE_NAME,SHEET).getActiveSheet()
  return    conf.getRange('B4').getValue()
}
function getEnglishScheduleFilename(conf)
{
  if(conf==undefined) //faster if a parameter, but ok if not
    var conf=openByName(CONFIG_FILE_NAME,SHEET).getActiveSheet()
  return    conf.getRange('B5').getValue()
}
function getContactsFilename(conf)
{
  if(conf==undefined) //faster if a parameter, but ok if not
    var conf=openByName(CONFIG_FILE_NAME,SHEET).getActiveSheet()
  return    conf.getRange('B6').getValue()
}
function getLogsFilename(conf)
{
  if(conf==undefined) //faster if a parameter, but ok if not 
    var conf=openByName(CONFIG_FILE_NAME,SHEET).getActiveSheet()
  return    conf.getRange('B7').getValue()
}
function getPrintFolderName(conf)
{
  if(conf==undefined) //faster if a parameter, but ok if not
    var conf=openByName(CONFIG_FILE_NAME,SHEET).getActiveSheet()
  return    conf.getRange('B8').getValue()
}
function getPosterName(conf)
{
  if(conf==undefined) //faster if a parameter, but ok if not
    var conf=openByName(CONFIG_FILE_NAME,SHEET).getActiveSheet()
  return    conf.getRange('B9').getValue()
}
function getArabicScheduleFilename(conf)
{
  if(conf==undefined) //faster if a parameter, but ok if not
    var conf=openByName(CONFIG_FILE_NAME,SHEET).getActiveSheet()
  return    conf.getRange('B10').getValue()
}

function getWorkshopWarehouseName(conf)
{
  if(conf==undefined) //faster if a parameter, but ok if not
    var conf=openByName(CONFIG_FILE_NAME,SHEET).getActiveSheet()
  return    conf.getRange('B11').getValue()
}
function getPrintFilename(conf) //probably obsolete for eternity
{
  if(conf==undefined) //faster if a parameter, but ok if not
    var conf=openByName(CONFIG_FILE_NAME,SHEET).getActiveSheet()
  var Print_arr = Array.from(Array(Num_Of_Prints), () => new Array(Num_Of_Prints));
  var loc
  for(var i=0;i<Num_Of_Prints;i++)
  {
    loc="A"+String(i+36)
    Print_arr[i]=conf.getRange(loc).getValue()

    
    conf.getDataRange().getValues()[35+i][0] //recently changed, hopefully no error, but this feature is very much deprecated and I should probably erase it
  }
  return Print_arr
}








