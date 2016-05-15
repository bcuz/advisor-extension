STATUS 5/11/16: Released since a while ago, adding Saad's code for invoice generation


IMPORTANT:

Right after you install it, click the panda and select "Options". In the options page you have to put 2 values:

  - **Your name**,  make sure it is exactly the same as it is listed in the report google form (with spaces, capital letters and all of that, must be EXACTLY the same).

  - **Time between screens**, this is the # of seconds the extension will delay the filling of each page of the report. You must give enough time to the page to load, or the extension will fail. To be safe, set it initially to 4.


Then save it and continue with next steps. This is a one time only thing.


## Description ##

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