function ParseFields(note)
{
  /*This function gets a note in a square and parses it to an array*/

  var genericEnd=".*?:" // take all strings until ":" is reached, or not - in which case end of note was reached

  var re1="שם הסדנה"+genericEnd
  var  re2="שם סדנה באנגלית"+genericEnd
  var re5="שם מנחה"+genericEnd
  var re6="רמה"+genericEnd
  var re7="תחום"+genericEnd
  re8="מידע ליצירת קשר"+genericEnd
  re9="הערות"+genericEnd
  var releg="תיאור סדנה"+genericEnd; //obsolete

  var re3= "תיאור ארוך"+genericEnd;
  var re4="תיאור סדנה במשפט"+genericEnd;
  var full=re1+"|"+re2+"|"+re5+"|"+re6+"|"+re7+"|"+re3+"|"+re4+"|"+re8+"|" +re9+"/s" 
  // "/s" is something about whitespaces, if I recall correctly it is necessary so the last ENTER doesn't mess things up
  re=new RegExp(full)

    var note=String(note); //Conversion
    myArray = note.split(re);  //splits to all different matches of the regular expression, de facto parsing.
    return myArray;
}

