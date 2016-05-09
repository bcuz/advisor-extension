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
done

java -jar 'C:\Users\roberto\workspace\java_lib\compiler.jar' --js $CONTENT_SCRIPTS --js_output_file deploy/content.js
java -jar 'C:\Users\roberto\workspace\java_lib\compiler.jar' --js $BACKGROUND_SCRIPTS --js_output_file deploy/background.js