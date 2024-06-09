A script written in Google Appscript to facilitate me in organinizing the bilingual workshops schedule of a juggling convention. 
The script is bounded to a google sheet file depicting a table detailing loacation and time of every workshop.
Users (workshop instructors) fill in the table with their workshops alongside pre filled notes describing the nature and details of their workshops (name, prop, level, description, etc.)
After a set amnount of time the table is locked. The  scripts then parse these notes and convert them to:
1) A pretty preview of the schedule in Hebrew published on the website.
2) A pretty preview of the schedule in English published on the website, auto translated.
3) The Poster file, which represents 8 high quality partly bilingual posters to be printed and hanged on the convention site on large boards.
   Empty spaces are destined to be filled real time by convention goers, using markers attached with a wire to each board.
5) A contacts list file to ease contact with workshop instructors.

The above files are created via Macro Commands (CTRL+ SHIFT+ Alt+[Number]) ran from the google sheets file itself.
In particular CTRL+ SHIFT+ Alt+1 parses and translates the google sheet table and keeps the data in a JSON file to be used for creating other files. 
An aditional config file is used to detail parameters such as file name and a few other flags.
The script currently assumes all  these files lie in the same google drive folder.

Examples of the Sheets themselves can be found [here][https://drive.google.com/drive/u/0/folders/1dd8PJXFeNu2587gfBzQcEfzKGLmV-jix] (Access to this version is viewer only)

The script is in google Appscript due to legacy reasons: I used google sheets before the process was improved and automated. In the future it might be worthwhile to create a web app instead.
The main drawbacks of the current implementation are:
1) Google appscript is at times unversatile, and many things are currently done in a quite inelegant manner, such as a need to bypass the google appscript's 6 minutes limit and many others.
2) Lack of security:  The skeleton of the schedule is protected,  but vandalizers can in theory cause quite a degree of havoc by erasing others workshop, or filling in fake workshops.
   it has not proven to be a problem yet as the convention does not have many enemies.
3) The google sheet table is mostly in Hebrew, and in particular the prefilled notes are.
4) A minority of convention goers are English speakers, among them invited guests, and the current table is unfit for that.
  To accomodate for them we have a separate google form file available for English speakers where they fill up workshop details and these are converted to ready
 "workshop cells" on a separate file which I then assign a time and place myself based on their stated preferences. However with a web app hopefully this remaining manual work will begone.
