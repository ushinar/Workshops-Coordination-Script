
class data{
  /* this class is meant to receive 1 or 2 arguments as input, in any order. If there are two, they are assumed to be translations of each other in different languages, and the constructor classifies which is which. In case there is only one argument, the constructor classifies its language, and translates it via google translate to the other language. Translating takes many resources, so some precautions are taken not to waste resources on it*/
  empty_cons()
  {
    this.Heb=""
    this.Eng=""
    this.Arb=""
    this.src=""
    this.lang=ERROR
    return
  }
  constructor(cont1,cont2){
    this.Arb=""
    if(cont1==undefined) //avoid errors 
    {
      if(cont2==undefined)
        return this.empty_cons()
      else 
        {
          cont1=cont2
          cont2=undefined
        }
    }
    cont1=cont1.trim() //get rid of trailing newline characters before checking if empty
    if(arguments.length==1) //if only one argument, replace 2nd with empty string
      cont2=""
    else
      cont2=cont2.trim() //get rid of trailing newline characters before checking if empty

    if(cont1=="") // if empty do not waste translation resources on it
    {
      return this.empty_cons()
      
    }
    if(getlang(cont1)==ENGLISH){ //Main language is english

      this.Eng = cont1;

      if( cont2==""){ 
        // if only one argument, or second argument exists  but is empty: translate 1st argument  to Hebrew
        this.Heb = LanguageApp.translate(cont1,'en', 'he');
        Utilities.sleep(500) // avoid translating too often
        this.lang=ENGLISH
      
      }
      else
      {
        //otherwise 2nd argument is Hebrew
        this.Heb=cont2
        this.lang=MULTILINGUAL
      }
    }
    else{
      //Main language is hebrew
      this.Heb = cont1;
      if(cont2=="")
      {
      // if only one argument, or second argument exists appears but is empty: translate 1st argument  to English

        this.Eng = LanguageApp.translate(cont1,'he', 'en');
        Utilities.sleep(500) // avoid translating too often
              this.lang=HEBREW
      }
      else
      {
        //otherwise 2nd argument is English
        this.Eng=cont2
        this.lang=MULTILINGUAL
      }
       
    } 
    // it is useful to also have as fields source language, and non source language 
        if(this.lang==HEBREW || this.lang==MULTILINGUAL){
          this.src=this.Heb
          this.nsrc=this.Eng
        }
        else
        {
          this.src= this.Eng
          this.nsrc=this.Heb
        }
   if(TRANS_ARB)
        {
          if(this.lang==HEBREW)
            this.Arb=LanguageApp.translate(cont1,'he', 'ar');
          else
            this.Arb=LanguageApp.translate(cont1,'en', 'ar');
  }

  // I might use this later?
  // Add_trans(lang,trans)
  // {
  //   if(this.lang==Error|| this.lang==MULTILINGUAL)
  //     return
  //   this.nsrc=trans
  //   if(lang==ENGLISH){
  //     this.src= this.Eng
  //     this.nsrc=this.Heb
  //   }
  //   else
  //   {
  //     this.src=this.Heb
  //     this.nsrc=this.Eng
  //   }
  // }
  }
}