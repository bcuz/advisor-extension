STATUS 12/15: Information is now editable in panel. All information is correctly passed to form (need to test extreme cases yet). Form fills itself until the last screen, submit is still disabled until approved by Daniella. Resources are not supported yet, if resources are marked as "Yes", then form stops filling itself in the "List resources" screen.

## HOW TO USE (this is being updated as development goes) ##
1.- Install the extension using instructions below
2.- Make sure you are in your intercom inbox
3.- Click the panda, then "Start/Stop"
4.- You'll get an alert saying ("Reports Enabled"). While reports are enabled, any time you click a chat thread it will show the reports panel on the right side with the user information.
5.- To disable reports (stop showing panel on every click), click the panda again, you'll get another alert saying "Reports disabled". Reloading or closing the tab will also disable the reports.


--- NOTE: This is just a prototype made to confirm that it's actually possible to simplify this. It is, so i'm making the actual thing now. So don't use it to submit reports yet. ---

The idea of this extension is to automate the filling/submit of post-interaction reports
(and make our lives easier, happier, healthier, longer and save our fingers from calluses)

### How it's supposed to work (send me feedback or suggestions if you have it) ###

-> As we are in shift, we have multiple chat threads in intercom.

-> When you want to submit a report, turn on the extension

-> Click any of the chat threads in the left panel of all open threads intercom has

-> After a couple of seconds, a panel should appear in the right side of the screen

-> Here you will see all the information relevant for the report collected from the chat, you can make changes to the info in this panel before submitting

-> When you're ready, click "Submit". Automatically a new tab will open, load the data, go through the entire form, and close itself. You'll get a message if the submit succeeded or not


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