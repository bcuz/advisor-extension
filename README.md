STATUS 12/15: READY TO RUMBLE !!

All pages are filled automatic, but clicking the last "Submit" button is still manual. Need to write validation of data filling to completely automate it. Aside of that, it's ready to be tested by everyone.

NEXT UPDATE: Will include validation of filling, notification if report failed, and retry button.

## HOW TO USE (this is being updated as development goes) ##

1.- Install the extension using instructions below

IMPORTANT:

---------------------------------------------------------------------------

Right after you install it, click the panda and select "Options". In the options page you have to put 2 values:

  - **Your name**,  make sure it is exactly the same as it is listed in the report google form (with spaces, capital letters and all of that, must be EXACTLY the same).

  - **Time between screens**, this is the # of seconds the extension will delay the filling of each page of the report. You must give enough time to the page to load, or the extension will fail. To be safe, set it initially to 4.


Then save it and continue with next steps. This is a one time only thing.

---------------------------------------------------------------------------

2.- Make sure you are in your intercom inbox. Once you're there, reload the page (it's kind of long to explain why, it's the way intercom and chrome work, for now just do it).

3.- Click the panda, then "Start/Stop"

4.- You'll get an alert saying ("Reports Enabled"). While reports are enabled, any time you click a chat thread, the reports panel on the right side with the user information. URL is already loaded, so don't worry about it.

TIP ->  If you put a note in the chat that starts with  "Summary: " (including the colon and space), and this note is last note in the chat thread, the panel will automatically take the text from the note and load it in the "Summary" field.

5.- To disable reports (stop showing panel on every click), click "start/stop" again, you'll get another alert saying "Reports disabled". Reloading or closing the intercom tab will also disable it.

##########  DESCRIPTION  ##########

The idea of this extension is to automate the filling/submit of post-interaction reports
(and make our lives easier, happier, healthier, longer and save our fingers from calluses)


## How to load it ##

Pull this repo, open chrome, go to Extensions, enable Developer Mode, click "Load unpacked extension", select directory you pulled from here, be happy.


## Ideal scenario ##

Ideally, we'll be able to only click 1 button, and the reports for all the threads we had on shift will be submitted automatically. For this, still need to improve:
   
- Collecting data from chat (and validate it)
   
- Collecting summary of interaction and additional notes (so that we make the least amount
     of changes to the collected data)
   
- Track that all reports are submitted without issues
   
- Track any changes intercom might do to its interface that might affect the behavior of
     this extension (and make the code fix itself >:D)


### Who do I talk to? ###

Roberto (tag me in the slack channel)