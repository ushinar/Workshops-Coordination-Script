class Workshop{
  // this class gets a "square" raw data and parses all necessary details, details is the note parsed into an array. It also supports many functions required for poster and schedules
  constructor(row,column,details,squartext)
  {
    if(arguments.length!=4)
      return this.empty_cons()
    this.row = row;
    this.column = column;
    this.details =new Details(details);
    this.info= new data(String(squartext))//conversion is probably to avoid data being converted to a date format
  }

 empty_cons()
  {
    this.row=0
    this.column=0
    this.details=[]
    this.info=""
    return
  }
    createHebrewNote()
  {
    // when invoked, this function returns a well formatted hebrew note for the viewer to easily read.
    var det=this.details
    var squartext=this.info.Heb // notice it is not here that this is written to the square hence  no need for purification
    if(det.alert) // for any reason whatsoever, the usual parsed fields are not relevant here. Most likely it is not a workshop but an event, but may also be a misfilled workshop. in the future it might be a good idea to write these into some logs
      return det.content.src
    var str=""
    // If the workshop details provide a hebrew name for the instructor, and the name cannot be inferred easily from the square content (usually either before or after - or ,) add this name to the note. make exception for multilingual workshop names. I cannot remember why exactly, probably in some of this cases the name contained the instructor name without the code understanding
    if(det.Workshop_Name.lang!=MULTILINGUAL && squartext.indexOf(',')==-1 && squartext.indexOf('-')==-1 && det.Instructor_Name.Heb!="")
      str+="מנחה:"+PurifyHebrew( det.Instructor_Name.Heb)+"\n\n"	
    str+=det.Workshop_description_long.src+"\n\n"; //in hebrew notes it is better to have the description in original languages, as Israelis often know english.
        if(det.prop.Heb!="")
      str+=PurifyHebrew(det.prop.Heb)
    else
      str+="כללי"// this default logic is questionable
    if(det.level.Heb!="")
      str+=", "+PurifyHebrew(det.level.Heb) // add level in the same line separated by a comma
    str=str.trim()//remove trailing newlines, to be safe 
    str=RemoveBlank(str) // edge cases where level is empty and hence comma needs be removed
    if(this.extra!=null)
        str+="\n\n"+this.extra.Heb //if there is anything else add it too. not clear how much this is actually supported
    return str;
  }
  createEnglishNote()
  {
      // when invoked, this function returns a well formatted english note for the viewer to easily read.
    var det=this.details
    var squartext=this.info.Eng // notice it is not here that this is written to the square hence  no need for purification

    if(det.alert)
    {
      // for any reason whatsoever, the usual parsed fields are not relevant here. Most likely it is not a workshop but an event, but may also be a misfilled workshop. in the future it might be a good idea to write these into some logs
      var ret=det.content.Eng
      if(det.content.lang==HEBREW)//english speakers don't speak hebrew, so google translate is better than nothing, however w warning is issued.
        ret="Translated by google translate:\n"+ret
      return ret
    }
    var str=""
    // If the workshop details provide a english name for the instructor, and the name cannot be inferred easily from the square content (usually either before or after - or ,) add this name to the note. make exception for multilingual workshop names. I cannot remember why exactly, probably in some of this cases the name contained the instructor name without the code understanding
    if( det.Workshop_Name.lang!=MULTILINGUAL && squartext.indexOf(',')==-1 && squartext.indexOf('-')==-1 && det.Instructor_Name.Eng!="")
      str+="Instructor:"+PurifyEnglish(det.Instructor_Name.Eng)+"\n\n"	
    if(det.Workshop_description_long.lang==HEBREW || det.Workshop_description_long.lang==MULTILINGUAL)
      str+="Translated by google translate:\n"//english speakers don't speak hebrew, so google translate is better than nothing, however w warning is issued.
    str+=det.Workshop_description_long.Eng+"\n\n";
    if(det.prop.Eng!="")
      str+=PurifyEnglish(det.prop.Eng)
    else
      str+="General"// this default logic is questionable
    if(det.level.Eng!="")
      str+=", "+PurifyEnglish(det.level.Eng)

    str=str.trim()//remove trailing newlines, to be safe 
    str=RemoveBlank(str)// edge cases where level is empty and hence comma needs be removed
    if(this.extra!=null)
        str+="\n\n"+this.extra.Eng //if there is anything else add it too. not clear how much this is actually supported
    return str

  }

  createArabicNote()
  {
    // when invoked, this function returns a well formatted Arabic note for the viewer to easily read.
    // more straightforward than other ones: everything gets translated
    var det=this.details
    var squartext=this.info.Eng

    if(det.alert)
    {
      var ret=det.content.Arb
      if(ret!="")
        ret="مترجم على جوجل ترانزليت:\n"+ret
      return ret
    }
    var str=""
    if(squartext.indexOf(',')==-1 && squartext.indexOf('-')==-1 && det.Instructor_Name.Arb!="")
      str+="محاضر:"+det.Instructor_Name.Arb+"\n\n"	
      str+="مترجم على جوجل ترانزليت:\n"
    str+=det.Workshop_description_long.Arb+"\n\n";
    if(det.prop.Arb!="")
      str+=det.prop.Arb
    else
      str+="عام"
    if(det.level.Arb!="")
      str+=", "+det.level.Arb

    str=str.trim()//remove trailing newlines, to be safe 
    str=RemoveBlank(str)
    if(this.extra!=null)
        str+="\n\n"+this.extra.Arb
    return str

  }
  createContact()//not sure if function is in use really
  {
    var str=""
    if(this.details.Instructor_Name==null)
      return str
    str+=this.details.Instructor_Name.Eng+": "+this.details.email+"\n"
    return str
  }

  createPrinting(file) //obsolete
  {
    var EnglishLetters = /[a-zA-Z]/g;
    var insertedText
    var det=this.details
    var flag=false
    if(det.alert)
      return file //TODO: rethink this
    if(this.details==null) //for those who only filled the square
    {
      if(this.info!=null)
      {
        file=addStyleText(this.info.src,30,REG,file)
        flag=true
      }
    }
    else
    {
      flag=true
      if(det.Workshop_Name.src!="")
      {
        if(det.Workshop_Name.lang==MULTILINGUAL || (EnglishLetters.test(this.info.src)&& det.Workshop_Name.lang==HEBREW))
        {
          file=addStyleText(det.Workshop_Name.Heb,30,REG,file)
          file=addStyleText(det.Workshop_Name.Eng,25,REG,file)
        }
        else
          file=addStyleText(det.Workshop_Name.src,40,REG,file)

      }
      else
      {
        file=addStyleText(this.info.src,30,REG,file)
      }
        file=addStyleText(det.Instructor_Name.src,20,REG,file)
        file=addStyleText(det.Workshop_description_short.src,10,REG,file)
        var str=this.LevelAndPropString()
        file=addStyleText(str,18,REG,file)
    }
    if(flag)
      file.getBody().appendPageBreak()
    return file;
}

  createPosterNote(defo_font_size,Lang)
  {
    var boldness=false
    if(defo_font_size==null || defo_font_size==undefined)
      defo_font_size=17
    var EnglishLetters = /[a-zA-Z]/g;
    var insertedText
    var det=this.details
    var flag=false
    if(det.alert)
    {
      var text=this.info.src
      if(Lang==ENGLISH) //arguably now redundant logic, was made for very specific thing. Update: still in use. The point is to actively add english tranlation to "gray" squares
      {//note: I am not sure if this should be this.info.src
          text+="   "+PurifyEnglish(this.info.Eng)
          boldness=true
      }
      // Not sure whether to justify for the following reasons: A) it fucks up some of the events, and the solution is convoluted
      //B) I believe this is exactly the case where the correct size is "as big as can enter and this should remain manual
      if(defo_font_size<23) //for the moment I only justify for samll text
        text=justify(text,12)

      return   createRichText([text.length+1],[defo_font_size],text,boldness)
    }

     if(det.Workshop_Name.src!="")
      {
        if(det.Workshop_Name.lang==MULTILINGUAL || (EnglishLetters.test(this.info.src)&& det.Workshop_Name.lang==HEBREW))
        {// if title available in both english and hebrew
          var justdesc=justify(det.Workshop_description_short.src,44)
          var justnameHeb=justify(det.Workshop_Name.Heb,22)
          var justnameEng=justify(det.Workshop_Name.Eng,25)

          var text=justnameHeb+"\n"+justnameEng+"\n"+det.Instructor_Name.src+"\n"+justdesc+"\n" //CHANGED
          var str=this.LevelAndPropString()
          var pos1=justnameHeb.length+1
          var pos2=pos1+justnameEng.length+1
          var pos3=pos2+det.Instructor_Name.src.length+1
          var pos4=pos3+justdesc.length+1
          // if(str=="")
          //   var richtext=createRichText([pos1,pos2,pos3],[15,12,8],text
          var pos5=pos4+str.length+1
          text=text+str
          var richtext=createRichText([pos1,pos2,pos3,pos4,pos5],[12,8,10,6,6],text,boldness)
         return richtext
        }
        else
        {// title is either in hebrew or in english

          var justdesc=justify(det.Workshop_description_short.src,44)

          var justname=justify(det.Workshop_Name.src,15)

          var text=justname+"\n"+det.Instructor_Name.src+"\n"+justdesc+"\n" //CHANGED
          var str=this.LevelAndPropString()
          var pos1=justname.length+1
          var pos3=pos1+det.Instructor_Name.src.length+1
          var pos4=pos3+justdesc.length+1
          var pos5=pos4+str.length+1
          text=text+str
          var richtext=createRichText([pos1,pos3,pos4,pos5],[14,12,6,6],text,boldness)
         return richtext
        }
      }
      else
      {// only square data available, basically copy the square
          var justname=justify(this.info.src,15)

          var text=justname+"\n"

          var str=this.LevelAndPropString()
          if(!this.alert)
          var pos1=justname.length+1
          // if(str=="")
          //   var richtext=createRichText([pos1,pos2,pos3],[15,12,8],text
          var pos5=pos1+str.length+1
          text=text+str
          var richtext=createRichText([pos1,pos5],[15,8],text,boldness)
         return richtext
      }
  }

 LevelAndPropString()
 {
 var str=""
 var det=this.details
  if(det.prop.lang==ENGLISH)
  {
    if(det.prop.src!="")
      str+=PurifyEnglish(det.prop.src)
  }
  else
      if(det.prop.src!="")
        str+=PurifyHebrew(det.prop.src)

  if(det.level.lang==ENGLISH&& det.level.src!="")
      str+=", "+PurifyEnglish(det.level.src)
  if(det.level.lang!=ENGLISH&& det.level.src!="")
      str+=", "+PurifyHebrew(det.level.src)
  if(str.charAt(0)==',')
    str=str.substring(1)
  return str
 }
}

class Details{
  constructor(details) 
  //gets a parsed "note" of a square, and creates an according data structure, including keeping data for translations.
  {
    //details=[content, workshop_name_hebrew,workshop_name_english,instructor_name,Workshop_description_short,Workshop_description_long
    //prop,level,email,extra?]
    this.alert=false  //flag alerting danger of approaching undefined elements
    this.flag=false //flag  notifying that there is a different number of arguments than usual
    var Argnum=9 
    if(details.length<Argnum) //there should be at least ArgNum arguments, if there is less, this is unusual and we alert it back up to avoid errors or wasted resources
    {
      this.alert=true
      this.flag=true
      this.content=new data(details[0])
      return this.alert
    }
    this.Workshop_Name = new data(details[1],details[2]);
    this.Instructor_Name = new data(details[3]);
    this.Workshop_description_short = new data(details[4]);
    if(details[5].trim()=="")
      this.Workshop_description_long=this.Workshop_description_short
    else
      this.Workshop_description_long = new data(details[5]);
    this.prop = new data(details[6]); 
    this.level = new data(details[7]); 
    this.email=details[8].trim() 

    this.extra=new data("")
    if(details.length>=Argnum+1){ //if there are more arguments than usual, they are stored in this.extra, if not this.extra is empty
      this.extra = new data(details[Argnum]);
      this.flag=true
    }
    return this.alert;
  }
}
