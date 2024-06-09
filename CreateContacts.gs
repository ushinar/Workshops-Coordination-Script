function CreateContactsFile(conf) {
  SpreadsheetApp.getActiveSpreadsheet().toast('Task started','Creating Contacts List');


  if(conf==undefined) //faster if a parameter, but ok if not
    var conf=openByName(CONFIG_FILE_NAME,SHEET).getActiveSheet()
  //read JSON
  var doc=openByName(getDatabaseFilename(conf),DOC)
  var text= doc.getBody().getText() 
  var Workshop_arr=JSON.parse(text)
  var table=[]
  var Contacts = openByName(getContactsFilename(conf),DOC)
  Contacts.getBody().clear() //remove previous entries and start fresh
  var SignOfLife=true
  for(var i = 0;i < Workshop_arr.length;i++){
      // Only print toasts every once in a while. This is both to ease on running time, and because too quick toast overrun eachother
        if(i%15==0) 
          SignOfLife=false
        for (var j = 0; j < Workshop_arr[i].length; j++)
        {
            curr=Workshop_arr[i][j]
            if(curr!=null && curr.details!=null )
            {
              var det=curr.details
              var name=""
              var mail=""
              if(det.Instructor_Name!=null)
                name=det.Instructor_Name.src
              if(det.email!=null)
                mail=det.email
              if(mail!="" || name!="") //skip if curr holds no relevant data
              {
                 table.push([name, mail]) //add to table
                // Prints to console if debug is on, and a toast every once in a while 
                if(DEBUG)
                    console.log(mail)
                  if(!SignOfLife)
                {
                  SpreadsheetApp.getActiveSpreadsheet().toast(mail,'Now Processing');
                  SignOfLife=true
                }
              }
              // back to program logic
              }
            }
      }
      
      Contacts.getBody().appendTable(table);// update table into file
      //save and close so file would update
      Contacts.saveAndClose()
      SpreadsheetApp.getActiveSpreadsheet().toast("Contacts list Should now be stored in "+getContactsFilename());

 }
