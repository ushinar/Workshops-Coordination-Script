function createRichText(arrpos=[0],arrfonts=[7],text="",boldness=false)
// routine takes text, divided into segments, whose ends are indicated by arrpost. 
//the routine returns the segmented texts each in a corresponding font size designated by 
 // arrfonts. Finaly a flag indicates whether the returned text is bolded or not
{
  if(boldness==undefined)// why do I need this? isn't default enough?
    boldness=false
  var textStyle
  var ital=false
  var richtextbuild=SpreadsheetApp.newRichTextValue().setText(text)
// var richtext=SpreadsheetApp.newRichTextValue()
//     .setText("This cell is bold")
//     .setTextStyle(textStyle)
//     .build();
  if(arrpos==null|| arrpos[0]==null)//returns empty text
    return richtextbuild.build()
  if(arrpos[0]>1)// I suppose arrpos[0]==0 causes some stupid edge case
  {
    textStyle = SpreadsheetApp.newTextStyle()
          .setFontSize(arrfonts[0])
          .setForegroundColor("black")
          .setBold(boldness)
          .setFontFamily("David")
          .setItalic(ital)
          .build();
    richtextbuild.setTextStyle(0,arrpos[0]-1,textStyle)
  }
    if(arrpos[arrpos.length-1]>text.length+1) //prevent  overflow errors
      arrpos[arrpos.length-1]=text.length+1

  for(var i=0;i<arrpos.length-1;i++)
  {
    if(i==arrpos.length-2 && i>=1)// I want the prop and level string to be in italics, if it exists
      ital=true
    if(arrpos[i]<arrpos[i+1]-1)
    {
            textStyle = SpreadsheetApp.newTextStyle()
          .setFontSize(arrfonts[i+1])
          .setForegroundColor("black")
          .setFontFamily("David")
          .setBold(boldness)
          .setItalic(ital)
          .build();
      richtextbuild.setTextStyle(arrpos[i],arrpos[i+1]-1,textStyle)
    }
  }
  return richtextbuild.build()
}
function getlang(text)
{
  var HebrewChars = /[\u0590-\u05FF]/;

  if(text === undefined)
    return 0
  text = text.trim();

  if(HebrewChars.test(text))
    return HEBREW
  else
    return ENGLISH

}
function Capitalize(text)
{
  if(getlang(text)!=ENGLISH)
    return text
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

function PurifyByLang(text, lang)
{
  if(lang==ENGLISH)
    return PurifyEnglish(text)
  else 
        return PurifyHebrew(text)

}

function PurifyEnglish(text)
{
  if(text==undefined|| text==null)
    return text

  text=Capitalize(text)

// fix common mistranslations or failed translations
  text=text.replace("Transportation","Buses");
  text=text.replace("End Show","Final Show");
  text=text.replace("Starting","Beginners");
  text=text.replace("Continue","Intermediate");
  text=text.replace("Qualifiers","Qualifications");
  text=text.replace("Shots","Throws");
    text=text.replace("Pacing","Passing");
  text=text.replace("A Show In The Wild And In The Desert","Shabazi And Desert Circus Shows");
  text=text.replace("A Day","Day");
  text=text.replace("An Apple","Apple");
  text=text.replace("Blackberry","Blueberry");
  text=text.replace("A Special Show","Special Show");
  text=text.replace("On The Stage Of The Professional ","Circus Schools Show");

  text=text.replace("Foy","Poi");
  text=text.replace("Start","Beginner");
  text=text.replace("Dafoe","Dapo");
  text=text.replace("Preparations For The Event","Prep");
  text=text.replace("Begginers And Starting","Beginners");
   text=text.replace("Wallyclub","VolleyClub");
  text=text.replace("And Beginnering"," Beginners");
  text=text.replace("They Beginner And Start","Beginners");
  text=text.replace("BegginersBegginers","Beginners");
  text=text.replace("Begginers Begginers","Beginners");
  text=text.replace("Begginers Begginers","Beginners");
  text=text.replace("Another Added\n (internal)","Other Events");
  text=text.replace("Wally Club","VolleyClub");
  text=text.replace("Bubble Gum","Bubblegum");
  text=text.replace("Jam Fire","Fire Jam");
  text=text.replace("The Determining Schedule Is The Physical Schedule In The Warehouse.","The True Schedule Is The Physical Board On Site.");



//Hebrew Names
// Purify is not called on workshop descriptions so you are relatively free Don't over do it here, if you think the word can appear naturally in a name of a person or a prop, avoid it.
  text=text.replace("A Wolf Among","Zeev Bin");
  text=text.replace("This Is Bin","Zeev Bin");
  text=text.replace("Wolf Ben","Zeev Bin");

  text=text.replace("Autumn","Stav");
  text=text.replace("Shanar","Shinar");// its my name so if anybody is actually called Shanar tough luck.
  text=text.replace("Avoid","Timna");
  text=text.replace("Tiger","Namer");
  text=text.replace("As A Sword","Kasif");
  text=text.replace("Sparrow","Dror");
  text=text.replace("Jelly","Gali");//boarderline: there may be a workshop with jelly...

  text=text.replace("Witnesses","Adi");
  text=text.replace("Juicy Generation","Dor Asis");


 //Wow this is hard for google to translate
  text=text.replace("Psing Zon","Passing Zone");
  text=text.replace("Pesing Zon","Passing Zone");
  text=text.replace("Passing Zonee","Passing Zone");

    // We are not THAT serious
  text=text.replace("Conference","Convention");


 


  return text 
}

function PurifyHebrew(text)
{// fix common mistranslations or failed translations
//Notice hebrrew makes things go crazy, newlines help with clarity
  text=text.replace("מִתקַדֵם"
  ,"מתקדמים");
    text=text.replace("מַתחִיל"
  ," מתחילות ומתחילים");
  text=text.replace("מסירות"
  ,"פאסינג");
  text=text.replace("מועדונים", 
   "קלאבים");
  text=text.replace("מועדוני", 
   "קלאבים");
  text=text.replace("מועדות", 
   "קלאבים");
   text=text.replace("מועדון", 
   "קלאב");
  text=text.replace("עוברים", 
   "פאסינג");
  text=text.replace("עובר", 
   "פאסינג");
  text=text.replace("All", "כל הרמות");
    text=text.replace("את כל", 
    "כל הרמות");
        text=text.replace("בינונים", 
    "ממשיכים");
    text=text.replace("ביניים", 
    "ממשיכים");
      text=text.replace("צוות"
  ,"סטאף");
  text=text.replace("סטאף הדרקון"
   ,"דרגון סטאף");

     text=text.replace("ליצור קשר עם הסטאף"
   ,"סטאף");
       text=text.replace("בחור אוזר", 
    "גיא עוזר");

        text=text.replace("קלאבים אנשים פאסינג"
   ,"אנשים פאסינג קלאבים");
    text=text.replace("סלרנו טבעת", 
    "טבעת סלרנו");
  text=text.replace("כדור מגע", 
    "כדור קונטקט");
 text=text.replace("גוף קרקס", 
    "גוף וקרקס");

  text=text.replace("Everyone", "כל הרמות");
    text=text.replace("כולם", 
    "כל הרמות");
    text=text.replace("כל השלבים", 
    "כל הרמות");
    

  text=text.replace("Advanced", " מתקדמים");
  text=text.replace("Advance", "מתקדמים");



  return text 
}
function RemoveBlank(str)
{
  
  if(str.slice(-1)==",")
  {
    str=str.substring(0,str.length-1);
    strtemp=str.trim()
    if(strtemp=="")
      return null
  }
  return str

}
function justify(str, len) {
//text "justification", len characters per line.
//code found online
  var re = RegExp("(?:\\s|^)(.{1," + len + "})(?=\\s|$)", "g");
  var res = [];
  var finalResult = [];

  while ((m = re.exec(str)) !== null) {
    res.push(m[1]);
  }

  for (var i = 0; i < res.length - 1; i++){   
    res[i]=res[i].trim() // I found this code online, but it is clearly flawed because it absolutely collapses if it weren't for this line and it took me  a millenia to find this bug.
    if(res[i].indexOf(' ') != -1){  
      while(res[i].length < len){      

        for(var j=0; j < res[i].length-1; j++){
          if(res[i][j] == ' '){

            res[i] = res[i].substring(0, j) + " " + res[i].substring(j);

            if(res[i].length == len){

             break;
            }
            while(res[i][j] == ' ') {j++;

            }
          }

        }
      }      
    }    

    finalResult.push(res[i]);    
  }

  finalResult.push(res[res.length - 1]);

  return finalResult.join('\n');

}

