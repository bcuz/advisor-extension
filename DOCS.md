# HOW THE PANDA THING WORKS 

## Code Structure
Each module must have 2 folders, **content** and **background**. If you have read how Chrome extensions work (the basics), you'll know where to put your content and background scripts.
You can name them however you want, they will all get compiled.

```
      Core 
-----------------
|    Intercom   |
|   TrackSmart  | --------------------
| Notifications |                    |
|     Utils     |                    |
-----------------                    |
        |                            |
        |                            |    All modules get
        |                            |     compiled and       -----------------
Core modules are used by the tools.  |     minified into      |   Content.js  |
Separating them makes it easier to   |----   the files   -----| Background.js |
both fix and create new tools.       |     content.js and     | Extra scripts |
        |                            |    background.js,      -----------------
        |                            |    + extra scripts
        |                            |    
---------------------                |    
| Reports Automator |                |    
| Invoice Generator |----------------|
|       Utils       |
---------------------
        Tools
```

## Core modules

**Intercom**: Contains functions to extract and inject data from/into intercom. For example, to get the user’s name, the active chat selected, to insert message in chatbox, etc. This will break if intercom changes its html / layout.

**Tracksmart**: Same as intercom module, but for tracksmart-timeclock. For example, select your shifts taken, the hours, etc.

**Notifications**: Uses notify.js (inside libs folder) to show the little popup notifications. Here i define the notifications type used, like for success, failure, info, etc.

**Utils**: Any other stuff that is too small to be its own module, but isn’t part of another module either (don’t just mix these with other modules’ code like spagetti, you’ll regret it lol). Right now it has functions to executeWhenSomethingIsReady, create a keyboard shortcut easily, and show an important announcement for each version.

## Tools

### Reports Automator: 
* When intercom is opened (at the very beginning) an object called `side_panel` is created (check `side-panel.js`). It contains the HTML / CSS and a function to generate the Javascript that needs to get inserted into Intercom to have the reports panel.

* Side panel has a function called `render()`, this injects the HTML, CSS and JS stored in same side_panel object. Note that some of the javascript is generated dynamically (that’s why it looks all funky, because the `side_panel.JS()` function is a javascript function that runs in the `Content` context in Chrome that generates Javascript to be injected into the main context, the one that is in screen, where intercom is running).

* `toggleReport` is called to open or close the report panel (from `main.js`)

* This one calls `collectDataAndOpenReport`, which does exactly that, gets the data it needs from intercom (like user name, conversation url, course, etc.) and calls `side_panel.render()`

* The variable `NEW_FORM` is created in `new_form.js`. This is the “Report Declaration”, intended to be parsed by `side_panel.renderField()`, which prints all of its fields and creates their HTML and Javascript to insert in the panel. `NEW_FORM` and `renderField()` support input fields of type hidden, text, longText, select, radio buttons and checkboxes. For example, `conversationURL` is a hidden field, won’t be seen by user but will be passed to the report (‘cause it’s needed to submit), while `convo_type` is a radio button input which has all the available options the report has for conversation types.

* If the report changes and becomes multiple pages (like the old one), `renderField()` is recursive, it supports multiple optional pages, they just need to be added as Extra inside another field (there should be a commit with the original `form.js` that has examples of this).

* Every field in the side panel has an associated javascript object that updates its value as the user clicks in the panel (`dataFields` object in `side_panel.js`, `render` function), this is the data that is passed to the report form and that gets loaded. This is also dynamically-generated javascript, when `renderField()` goes through `NEW_FORM` it also generates javascript that populates this `dataFields` object later (when the report is submitted).

* About how the report gets filled with data, when the “Submit report” button is clicked, the panel sends a message to the background page with the data, background page opens the report in a new tab and injects the `form_filler_new.js`. This sends another message to background, asking for the data, background responds sending the data the user passed, `form_filler_new` receives it and populates the fields (i manually went into the HTML and checked the ID of each input field in the report). Data is filled, `form_filler_new` sends a new message to background announcing it’s about to click Submit, and clicks it right after. Background receives this message and waits a couple of seconds to inject `form_filler_confirmation` into the reports tab. This checks that the confirmation element exists. If it does, it sends an success message to background, else it sends a failure one. `Background` redirects this message to `Content`, which shows the appropriate notification to the user.

### Invoice Generator:  

**General Overview**: There are two main parts to the invoice generator: 

1. The invoice data gatherer (the content script) 
2. The spreadsheet creator (the background script)

When the <kbd>Create Invoice</kbd> button is pressed from the extension, the data gathering will begin in the content script. Once it has gathered the data, it will send it to the background script. Inside the background script, an HTML table is dynamically generated from the data and then converted into a spreadsheet which is then automatically downloaded as an `.xls` file.

1. **Data Gatherer**: 
    * There are three files inside `content` folder: 
        1. `index.js`
        2. `get-invoice-data.js`
        3. `nodes.js`

    * The `index.js` file is the main file which adds a `click` listener to the button and sends the invoice data when the button is pressed. It does this by using the `getInvoiceData()` function which is inside the `get-invoice-data.js` file. 

    * The function takes the required information from the page and then returns all of it as an object. The `nodes.js` file is a helper file that has most of the necessary DOM elements stored as variables to make things more organized. *Note*: Some of the DOM elements were declared inside the `get-invoice-data.js` file instead because they are created dynamically and can't be accessed until that point.

    * Once this function has been called, `index.js` sends the information to the background script.

2. **Spreadsheet Creator**:
    * There are four files inside the `background` folder:
        1. `index.js`
        2. `create-spreadsheet.js`    
        3. `util.js`
        4. `styles.js`

    * The `index.js` is the main file. This is where the `invoice_filler.js` file is run which is a helper script to start the invoice generator once the background script knows that the <kbd>Create Invoice</kbd> button has been pressed. The script calculates the start and end date so that the right information will be taken from TrackSmart. 

    * When the invoice data has been sent from the content script to this background script, it runs the `createSpreadsheet()` function and passes it the data. The function can be found inside the `create-spreadsheet.js` file. This file is where the majority of the work is done. 

    * The `createSpreadsheet()` function first creates an HTML `table` template using the `createTable` function with the data. Afterwards, it passes that returned table to the `tableToExcel()` function which converts an HTML table to a downloadable Excel URL. This URL is returned which will be downloaded from the `chrome.downloads.download()` function call in the `index.js` file.

    * The `util.js` file is a helper file that provides some convenient functions like creating a number of empty rows or columns, as well as generating the rows for the shift information.

    * The `styles.js` is another helper file which has all the styling for the table stored inside it.
    
