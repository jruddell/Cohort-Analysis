Welcome to my cohort analysis!

To get this up and running use the following

    You'll need to create a virtual environment with virtualenv, and also install all the python dependencies within
    this environment 

    Clone this repository, cd to it in your terminal and run the following commands:
        "virtualenv venv" -- new python executable environment
        "source venv/bin/activate" --source that environment
        "cd Cohort-Analysis"
        "pip install -r requirements.txt" (may need sudo) --install app requirements
        "npm install" --front end build (may need sudo)
        "npm run build" --npm build to run duo (es6/jsx compiling and output to build folder)
        "python main.py" --run the web server

    All React views are in /views (which can be reused). All global / generic components (such as a modal) should go in the elements folder
    /templates contains the main entry html file.


Folder structure

    app - contains all views styles and everything related to your app.
        actions - flux form actions to dispatch events
        assets - sass files for styling
        constants - flux form constants for telling the store what event was dispatched
        dispatcher - the actual dispatcher to dispatch an event
        elements - generic react components to be used on multiple views
        helpers - any helper functions you want
        lib - downloaded React to make imports faster
        stores - flux form stores that register a dispatched event, handle the data, and emit a change for react to update its view
        views - all of the base views for your app
    build - compiled when running duo. import these two files in your template
    components - duo compiles the github repos here
    node_modules - node dependencies (only used for the initial build to get duo installed and running)
    templates - your html template to load the page