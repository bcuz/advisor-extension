
## BUILD SCRIPT ##

# Replace this variable with the location to google closure compiler in your local environemnt
GOOGLE_COMPILER='C:\Users\compiler-latest\compiler.jar'

# Make sure deploy directory exists
mkdir deploy 2>/dev/null

# Get all the content and background scripts to be compiled
# Checking core and tools directories
CONTENT_SCRIPTS=''
BACKGROUND_SCRIPTS=''


for component in $(ls core)
do
	for script in $(ls 'core/'$component'/content')
	do
		CONTENT_SCRIPTS='core/'$component'/content/'$script' '$CONTENT_SCRIPTS
	done

	for script in $(ls 'core/'$component'/background')
	do
		BACKGROUND_SCRIPTS='core/'$component'/background/'$script' '$BACKGROUND_SCRIPTS
	done
done

for component in $(ls tools)
do
	for script in $(ls 'tools/'$component'/content')
	do
		CONTENT_SCRIPTS='tools/'$component'/content/'$script' '$CONTENT_SCRIPTS
	done

	for script in $(ls 'tools/'$component'/background')
	do
		BACKGROUND_SCRIPTS='tools/'$component'/background/'$script' '$BACKGROUND_SCRIPTS
	done

	# Add any extra scripts added for this tool that's not content nor background scripts
	for extra in $(ls 'tools/'$component | grep -v content | grep -v background)
	do
		# Move them into deploy directory
		cp -fr 'tools/'$component'/'$extra deploy
	done
done

java -jar $GOOGLE_COMPILER --js $CONTENT_SCRIPTS --js_output_file deploy/content.js
java -jar $GOOGLE_COMPILER --js $BACKGROUND_SCRIPTS --js_output_file deploy/background.js