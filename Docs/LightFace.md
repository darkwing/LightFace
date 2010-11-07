Class: LightFace {#LightFace}
=====================================

LightFace is a clone of FaceBook's modal dialog.

### Implements:

Options, Events

LightFace Method: constructor {#LightFace:constructor}
---------------------------------------------------------------

### Syntax:

	var modal = new LightFace(options);

### Arguments:

1. options - (*object*)  An object containing the LightFace instance's options.

### Options:

* width - (*integer|string*, defaults to 'auto')  The desired width of the of the modal box.
* height - (*string|string*, defaults to 'auto')  The desired height of the of the modal box.
* draggable - (*boolean*, defaults to false)  Should the modal box be draggable by its title? *the Drag class is not included with this package, but is available with MooTools More*
* title - (*string*, defaults to '')  The modal's initial title.
* content - (*string*, defaults to '<p>Message not specified.</p>')  The modal's initial content.
* buttons - (*array*, defaults to [])  An array of objects containing button information: { title:'', event:fn, color:'' }.
* fadeDelay - (*integer*, defaults to 150)  The delay before instructing the overlay to fade in/out.
* fadeDuration - (*integer*, defaults to 150)  The duration of overlay fade while content is loading.
* keys - (*object*, defaults to object w/ 'esc' key handler)  Key handlers to add events to while the modal box is open.
* zIndex - (*integer*, defaults to 9001)  The desired zIndex of the modal.
* overlayAll - (*boolean*, defaults to true)  Should the overlay cover the entire modal dialog?
* constrain - (*boolean*, defaults to false)  Should the modal box constrain content when the window is resized?
* errorMessage - (*string*, defaults to '<p>The requested file could not be found.</p>')  The error message displayed if a resource is not found.
* resetOnScroll - (*boolean*, defaults to true)  Keeps the modal box in the same place on the screen if the user scrolls.
* baseClass - (*string*, defaults to 'lightface')  The base class of the modal box.

### Returns:

A LightFace instance.

### Events:

### open

* (*function*) Function to execute when the modal is opened.

### Signature

	onOpen()


### close

* (*function*) Function to execute when the modal is closed.

### Signature

	onClose()
	
### fade

* (*function*) Function to execute when the overlay is faded in of view.

### Signature

	onFade()
	
### unfade

* (*function*) Function to execute when the overlay is faded out of view.

### Signature

	onUnfade()
	
### complete

* (*function*) Function to execute when the content has successfully loaded.

### Signature

	onComplete()

### request

* (*function*) Function to execute when the content has been requested.

### Signature

	onRequest()

### success

* (*function*) Function to execute when the content request is successful.

### Signature

	onSuccess()

### failure

* (*function*) Function to execute when the content request fails.

### Signature

	onFailure()
	
	
LightFace Method: addButton {#LightFace:addButton}
---------------------------------------------------------------

Adds a button to the footer of the modal dialog.

### Syntax:

	modal.addButton('Close',function(){ this.close(); },true);

### Arguments:

1. title - (*string*)  The button text.
2. event - (*function*)  The function to execute when the button is clicked.
3. submit - (*boolean*)  If true, styles the button Facebook-blue


LightFace Method: showButton {#LightFace:showButton}
---------------------------------------------------------------

Shows a button by its text.

### Syntax:

	modal.showButton('Close');

### Arguments:

1. title - (*string*)  The text on the button which should be shown.

### Returns:

The button element.


LightFace Method: hideButton {#LightFace:hideButton}
---------------------------------------------------------------

Hides a button by its text.

### Syntax:

	modal.hideButton('Close');

### Arguments:

1. title - (*string*)  The text on the button which should be hidden.

### Returns:

The button element.


LightFace Method: open {#LightFace:open}
---------------------------------------------------------------

Open the modal dialog.

### Syntax:

	modal.open(fast);
	
### Arguments:

1. fast - (*boolean*)  If true, skips fading and quickly sets opacity to 100%.

LightFace Method: close {#LightFace:close}
---------------------------------------------------------------

Closes the modal dialog.

### Syntax:

	modal.close(fast);
	
### Arguments:

1. fast - (*boolean*)  If true, skips fading and quickly sets opacity to 0%.
	
LightFace Method: fade {#LightFace:fade}
---------------------------------------------------------------

Fades the overlay into view.

### Syntax:

	modal.fade();
	
### Arguments:

1. opacity - (*integer*, defaults to 1)  The opacity level with which to fade the overlay to.

LightFace Method: unfade {#LightFace:unfade}
---------------------------------------------------------------

Fades the overlay out of view.

### Syntax:

	modal.unfade();
	
	
LightFace Method: load {#LightFace:load}
---------------------------------------------------------------

Loads static content into the modal dialog.

### Syntax:

	modal.load('<p>This is the content!</p>','This is the title!');

### Arguments:

1. content - (*string*)  The content to place within the modal dialog.
2. title - (*string*)  The title of the modal dialog. (not required) 
	

LightFace Method: destroy {#LightFace:destroy}
---------------------------------------------------------------

Removes all event bindings and removes the modal element from the DOM.

### Syntax:

	modal.destroy();
	
	

Class: LightFace.IFrame {#LightFace.IFrame}
=====================================

LightFace extension specially built to handle IFrames.


LightFace.IFrame Method: constructor {#LightFace.IFrame:constructor}
---------------------------------------------------------------

### Syntax:

	var modal = new LightFace.IFrame(options);

### Arguments:

1. options - (*object*)  An object containing the LightFace instance's options.

### Options:

LightFace.IFrame uses all of the base LightFace options.  In addition to those:

* url - (*string*, defaults to '')  The URL that should be loaded initially.


LightFace.IFrame Method: load {#LightFace.IFrame:load}
---------------------------------------------------------------

Loads a URL into the modal box's IFrame.

### Syntax:

	modal.load('http://davidwalsh.name','The David Walsh Blog');

### Arguments:

1. URL - (*string*)  The URL to load within the IFrame.
2. title - (*string*)  The title of the modal dialog. (not required)



Class: LightFace.Image {#LightFace.Image}
=====================================

LightFace extension specially built to handle images.


LightFace.Image Method: constructor {#LightFace.Image:constructor}
---------------------------------------------------------------

### Syntax:

	var modal = new LightFace.Image(options);

### Arguments:

1. options - (*object*)  An object containing the LightFace instance's options.

### Options:

LightFace.Image uses all of the base LightFace options.  In addition to those:

* url - (*string*, defaults to '')  The URL of the image that should be loaded initially.
* constrain (*boolean*, defaults to true)  If true, constrains image height/width if the image is larger than the window area and the window is resized.


LightFace.Image Method: load {#LightFace.Image:load}
---------------------------------------------------------------

Loads an image into the modal box's content area.

### Syntax:

	modal.load('http://davidwalsh.name/mylogo.png','The David Walsh Blog Logo');

### Arguments:

1. URL - (*string*)  The URL of the image to load within the modal dialog.
2. title - (*string*)  The title of the modal dialog. (not required)


Class: LightFace.Static {#LightFace.Static}
=====================================

LightFace extension specially built to stay in a static position.  You must provide X and Y coordinates for where the modal should display.


LightFace.Static Method: constructor {#LightFace.Static:constructor}
---------------------------------------------------------------

### Syntax:

	var modal = new LightFace.Static(options);

### Arguments:

1. options - (*object*)  An object containing the LightFace instance's options.

### Options:

LightFace.Static uses all of the base LightFace options.  In addition to those:

* offsets - (*object*, defaults to { x:16, y:16 })  Offsets from the position passed in.


LightFace.Static Method: open {#LightFace.Static:open}
---------------------------------------------------------------

Opens the modal at give x and y coordinates

### Syntax:

	modal.open(200,100);

### Arguments:

1. x - (*integer*)  The x coordinate to place the modal at.
2. y - (*integer*)  The y coordinate to place the modal at.
