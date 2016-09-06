# Toolbox for Codecademy Advisors #

## Information for New Developers ##
### **Setting up your development environment ** ###

* Install Git, if you have Windows preferably use Git Bash instead of Windows cmd
* Clone this project, use dev branch for development, master for releases
* Download Google Closure Compiler from this link and unpackage it: https://dl.google.com/closure-compiler/compiler-latest.zip
* In deploy.bash, change the value of the variable GOOGLE_COMPILER, use the location where you downloaded the google closure compiler's jar file in your machine.

### Building and loading the extension in Chrome ###

The code for this extension is distributed into separate modules, separated in **core** and **tool** modules (in the folders with the same name.

Each module has its own folder, for example **reports-automator** is a tool and has its own folder inside tools/

The **deploy.bash** script uses google closure compiler to "compile" and minify all the modules inside core/ and tools/, creating the minified versions in a new folder called **deploy/**. This is what gets loaded into Chrome (Check the manifest to see how it's defined)

So do this: from the project's root directory, run **deploy.bash**, after it completes then go into Chrome (make sure you have enabled Developer mode previously), click in **Load unpacked extension** and select the folder you have cloned from here.

After you have loaded the extension once in this way, you only need to click **Reload** when you want to load any new changes you made in the source code (remember to run deploy.bash again, else the contents inside deploy/ won't change).

### About the version in the Chrome Store (the live one) ###

The extension is still under my Chrome developer account, but as soon as someone agrees to take over this i can pass it to him/her. To update into a new version in Chrome store, you must create a ZIP file that includes: **deploy, img, libs, ui, manifest.json**. Make sure to also increase the version in **manifest.json** or Chrome store won't think it has been updated

### How the code works? ###

Read this document: https://docs.google.com/document/d/1S-x4XXNGUyvGn_newJ3gX0X7jdGgyiTe4HRXxp8EKwU/edit?usp=sharing

### Who do I talk to? ###
Roberto Arias-Yacupoma originally created the extension. Elise and Adam N are currently maintaining/extending it (in the slack channel we're **roberto**, **elise9876**, and **adam**)