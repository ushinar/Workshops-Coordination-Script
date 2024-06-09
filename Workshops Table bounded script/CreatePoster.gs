//Color 


SKY='#00ffff'
PLUM='#9900ff'
ORANGE='#ffd601'
BANANA='#ffff00'
OCEAN='#0000ff'
MINT='#00ff00'
CHOCKOLATE='#cc4125'
GUM='#ff00ff'
STRAWBERRY='#ff0000'


PASSING_ZONE='#ffffff'
GRASS="#6aa84f"
OTHER_1='#f1c232'

OTHER_2='#45818e'
APPLE='#6aa84f'
BLUEBERRY='#6d9eeb'


SKY_L='#c4ffff'
PLUM_L='#c48ec4'
ORANGE_L='#f7bd79'
BANANA_L='#ffffb5'
OCEAN_L='#5ca6db'
MINT_L='#c4ffc4'
CHOCKOLATE_L='#b5a574'
GUM_L='#eac7ff'
STRAWBERRY_L='#ff8b8b'
PASSING_ZONE_L=PASSING_ZONE
GRASS_L=GRASS
OTHER_1_L=OTHER_1

OTHER_2_L='#a2c4c9'
APPLE_L='#a8ff81'
BLUEBERRY_L=OTHER_2_L

VOID='#000000'

//guarded colors
GRAY_D='#666666'
GRAY_L='#b7b7b7'

function poster_create(conf) {


  SpreadsheetApp.getActiveSpreadsheet().toast('Task started','Creating Poster File ');



  //legacy measures 110*164
    var Numbers = /[0-9]/g;

  //NOTE: RUNNING THIS WILL ERASE OLD VERSIONS IF THEY STILL HAVE THE SAME NAME AND ARE IN THE SAME FOLDER

  if(conf==undefined) //faster if a parameter, but ok if not
    var conf=openByName(CONFIG_FILE_NAME,SHEET).getActiveSheet()

  var masterSchedule=openByName(getMasterFilename(conf),SHEET)

  //read JSON
  var database=openByName(getDatabaseFilename(conf),DOC)
  var text= database.getBody().getText() 
  var Workshop_arr=JSON.parse(text)
  SpreadsheetApp.getActiveSpreadsheet().toast('Database Loaded');

  PosterSheet=openByName(getPosterName(conf),SHEET)
  copyPasteSheet(masterSchedule,PosterSheet, "Poster")

  var rangePos = PosterSheet.getActiveSheet().getDataRange();
  //changing default style to help future changes
  PosterSheet.getSpreadsheetTheme().setFontFamily("David")//not sure if overrides all file or not
  rangePos.setFontColor('black'); //this will also effect text already there, however I see no reason you would want text other than black
  //need to find out how to do the same for font size, and maybe boldness

  // // var notesPos = rangeHeb.getNotes();
  var squaresPos = rangePos.getRichTextValues();


  var notesPos = rangePos.getNotes();

    var PosBack= rangePos.getBackgrounds()



  // var rangeEng = Engsheet.getActiveSheet().getDataRange();
  // var squaresEng = rangeEng.getValues();
  // // Backgrounds for english speaking workshops will be marked purple
  // var EngBack= rangeEng.getBackgrounds()

  var SignOfLife=true

   SpreadsheetApp.getActiveSpreadsheet().toast('Finding where data starts');
  if(DEBUG)
    console.log("Finding where data starts")
//find where actual data starts,
 var Poster_frame_start=FindMarker(squaresPos,"שעה")
 var Origin_frame_start =FindMarker(squaresPos,"יום",0)
  

// Create posters for the rest
   for(var i = Poster_frame_start+3;i < squaresPos.length;i++){
     // Only print toasts every once in a while. This is both to ease on running time, and because too quick toast overrun eachother
        if(i%15==0) 
          SignOfLife=false
        for (var j = 0; j < squaresPos[0].length; j++){
            if(Workshop_arr[i][j]!=null)
            {
              if(!SignOfLife)
                {
              SpreadsheetApp.getActiveSpreadsheet().toast(Workshop_arr[i][j].info.src,'Now Processing');
                  SignOfLife=true

                }
                var curr=Object.assign(new Workshop(),Workshop_arr[i][j])
                if(PosBack[i][j]==GRAY_D||PosBack[i][j]==GRAY_L)
                  squaresPos[i][j]=curr.createPosterNote(squaresPos[i][j].getTextStyle().getFontSize(),ENGLISH) //add english for gray squares
                else
                  squaresPos[i][j]=curr.createPosterNote(squaresPos[i][j].getTextStyle().getFontSize())
            }
            notesPos[i][j]=null
            }
    }

   for(var i = Origin_frame_start+1;i < squaresPos.length;i++){
        var txt=squaresPos[i][COL_START-1].getText();
        squaresPos[i][COL_START-1]=createRichText([txt.length+1],[21],txt,true);
        console.log(squaresPos[i][COL_START-1].getText())
   }
    rangePos.setRichTextValues(squaresPos)
    rangePos.setNotes(notesPos)
  SpreadsheetApp.getActiveSpreadsheet().toast('Formatting rows');
  if(DEBUG)
    console.log("Formatting Rows")
// quite slow, but I cannot get all rows at once
  for(var i = 1;i < squaresPos.length+1;i++){
   height=PosterSheet.getActiveSheet().getRowHeight(i)
   if(height==80)
      PosterSheet.setRowHeight(i,110)
    else if(height==40)
      PosterSheet.setRowHeight(i,55)
 }



   SpreadsheetApp.getActiveSpreadsheet().toast('Formatting and colorizing columns');
  if(DEBUG)
    console.log("Formatting and colorizing columns")
 for(var i = 0;i < PosBack.length;i++){
    for(var j = 0;j< PosBack[i].length;j++){
      if(PosBack[i][j]==LGREEN || PosBack[i][j]==GREEN || PosBack[i][j]==DGREEN  ||PosBack[i][j]==LPINK)
        switch (j){
          case 2: PosBack[i][j]=ORANGE_L; break
          case 3:PosBack[i][j]=PLUM_L; break
          case 4:PosBack[i][j]=SKY_L; break
          case 5:PosBack[i][j]=CHOCKOLATE_L; break

          case 6:PosBack[i][j]=MINT_L; break
          case 7:PosBack[i][j]=GUM_L; break

          case 8:PosBack[i][j]=BANANA_L; break
          case 9:PosBack[i][j]=OCEAN_L; break

          case 10:PosBack[i][j]=STRAWBERRY_L; break
          case 11:PosBack[i][j]=PASSING_ZONE_L; break
          case 12:PosBack[i][j]=APPLE_L; break
          case 13:PosBack[i][j]=BLUEBERRY_L; break
          case 14:PosBack[i][j]=OTHER_1_L; break
          case 15:PosBack[i][j]=OTHER_2_L; break
          default: break
        }
    } 
 }



  // PosBack[Poster_frame_start][2]=LGREEN; //should find out what this is.
  rangePos.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);


 //Hide Useless Rows

    PosterSheet.getActiveSheet().setColumnWidths(COL_START+1, squaresPos[0].length, 154);
    PosterSheet.getActiveSheet().setColumnWidths(COL_START, 1, 60);

    PosterSheet.getActiveSheet().hideRows(1, Origin_frame_start+1);
    PosterSheet.getActiveSheet().showRows(Poster_frame_start+1, 3);

    //reveal phone number at the end of file
    PosterSheet.getActiveSheet().hideRows(squaresPos.length-1, 2);
    PosterSheet.getActiveSheet().showRows(squaresPos.length-5, 4);
    PosBack[squaresPos.length-3][2]=LGREEN; 

    PosterSheet.getActiveSheet().hideRows(squaresPos.length-9, 4);
    PosterSheet.getActiveSheet().hideColumns(1);
    // PosterSheet.getActiveSheet().hideColumns(15,squaresPos[0].length-13);
    SpreadsheetApp.flush()


  insertImagesOnSpreadsheet(squaresPos,PosBack)
  rangePos.setBackgrounds(PosBack)//was there a reason this is after images? might ruin something.
  //set default font


    SpreadsheetApp.flush()
    SpreadsheetApp.getActiveSpreadsheet().toast("Poster should now be stored in"+ getPosterName());


}


function insertImagesOnSpreadsheet(squaresPos,PosBack=null) {
// Currently I use  the site imgbb.com to store the images, Idealy I'd store them within google drive but this brings about
// complications due to the URL being "private". Might be solvable with some extra effort.


var olympics_url="https://i.ibb.co/WcGTPJx/image.png"
var olympics_url_2="https://i.ibb.co/K20wCpG/2.png"
var olympics_url_3="https://i.ibb.co/WHQ3W8h/2-3.png" //resized version of 2
var Final_show_url="https://i.ibb.co/jG5b4p4/image.png"
var Final_show_url_2="https://i.ibb.co/rsyjQwL/2.png"

var Final_show_url_3="https://i.ibb.co/jhrHzz9/3.png"

var fight_night_url="https://i.ibb.co/41drrcr/image.png"
var fight_night_url_2= "https://i.ibb.co/V3nz2ZJ/fight-night-2.png"

var Gala_Noon_url="https://i.ibb.co/QKZJpRn/2.png"
var Gala_Eve_url="https://i.ibb.co/HPbYjZx/1.png"
var Gala_Eve_url_2="https://i.ibb.co/hY5DdGy/3-1.png"
var Gala_Eve_url_3="https://i.ibb.co/jz50r9L/4-2.png"

var Avi_Comp_url="https://i.ibb.co/N9sbZv8/image.png"
var Avi_Comp_url_2="https://i.ibb.co/yfvk0Dz/2.png"
var Avi_Comp_url_3="https://i.ibb.co/hZx7v1t/3-1.png"

var Special_Show_url="https://i.ibb.co/xHHXZ2w/image.png" //2023 Kira and Yahel
var Circus_schools_url="https://i.ibb.co/XFykRcd/image.png" //this one is full line
var Circus_schools_url_2="https://i.ibb.co/PrsGY5H/1.png" // this one is three columns

var Other_Frame="https://i.ibb.co/Jzpr2vj/2.png"

var VolleyClub_url="https://i.ibb.co/h25BM7S/image.png"
var VolleyClub_url_2="https://i.ibb.co/By6yf9G/2.png" //new design and resize

function insertCellImage(range, imageUrl, altTitle = "", altDescription = "") {
//maybe I should set altTitle and altDescription, currently don't see the need to
 let image = SpreadsheetApp
                 .newCellImage()
                 .setSourceUrl(imageUrl)
                 .setAltTextTitle(altTitle)
                 .setAltTextDescription(altDescription)
                 .build();
  range.setValue(image);

}

 var Ind=FindMarker(squaresPos,"שעה" )
 //
insertCellImage(PosterSheet.getActiveSheet().getRange(Ind+2+1, 14),Other_Frame)//balcony and other frame

 var Ind=FindMarker(squaresPos,"אירוע פתיחת הכנס ותחרות אבי" //
  , COL_START)
  Utilities.sleep(2000)//I believe this helps prevent errors
insertCellImage(PosterSheet.getActiveSheet().getRange(Ind+1, COL_START+1),Avi_Comp_url_3)
if(PosBack!=null)
  PosBack[Ind][COL_START]=LGREEN; 


  var Ind=FindMarker(squaresPos,"אולימפיאדת הלהטוטים" //
  , 2)
Utilities.sleep(2000)//I believe this helps prevent errors
insertCellImage(PosterSheet.getActiveSheet().getRange(Ind+1, COL_START+1),olympics_url_3)
if(PosBack!=null)
  PosBack[Ind][2]=LGREEN; 

 var Ind=FindMarker(squaresPos,"קרקס שבזי" //
  , COL_START+3)
console.log(Ind)
Utilities.sleep(2000)//I believe this helps prevent errors
insertCellImage(PosterSheet.getActiveSheet().getRange(Ind+1, COL_START+3+1),Circus_schools_url_2)
if(PosBack!=null)
  PosBack[Ind][COL_START+3]=LGREEN; 

 var Ind=FindMarker(squaresPos,"גמר וולי קלאב באולם" //
  , COL_START)
Utilities.sleep(2000)//I believe this helps prevent errors
insertCellImage(PosterSheet.getActiveSheet().getRange(Ind+1, COL_START+1),VolleyClub_url_2)
if(PosBack!=null)
  PosBack[Ind][COL_START]=LGREEN; 


 var Ind=FindMarker(squaresPos,"FIGHT NIGHT" //
  , COL_START+6)
Utilities.sleep(2000)//I believe this helps prevent errors
insertCellImage(PosterSheet.getActiveSheet().getRange(Ind+1, COL_START+6+1),fight_night_url_2)
if(PosBack!=null)
  PosBack[Ind][COL_START+6]=LGREEN; 


//  var Ind=FindMarker(squaresPos,"מופע מיוחד \"Yes You, No Me\"" //
//   , COL_START)

// insertCellImage(Special_Show_url,PosterSheet.getActiveSheet().getRange(Ind+1, COL_START+1))
// PosBack[Ind][COL_START]=LGREEN; 

//  var Ind=FindMarker(squaresPos,"מופע גאלה - הצגה ראשונה" //
//   , COL_START)
// Utilities.sleep(2000)//I believe this helps prevent errors
// insertCellImage(PosterSheet.getActiveSheet().getRange(Ind+1, COL_START+1),Gala_Noon_url)
// if(PosBack!=null)
//   PosBack[Ind][COL_START]=LGREEN; 

 var Ind=FindMarker(squaresPos,"מופע גאלה" //
  , COL_START)
Utilities.sleep(2000)//I believe this helps prevent errors
insertCellImage(PosterSheet.getActiveSheet().getRange(Ind+1, COL_START+1),Gala_Eve_url)
if(PosBack!=null)
  PosBack[Ind][COL_START]=LGREEN; 

 var Ind=FindMarker(squaresPos,"מופע סיום" //
  , COL_START)
Utilities.sleep(2000)//I believe this helps prevent errors
insertCellImage(PosterSheet.getActiveSheet().getRange(Ind+1, COL_START+1),Final_show_url)
if(PosBack!=null)
  PosBack[Ind][COL_START]=LGREEN; 

}




