LightFace
=========

LightFace is a clone of FaceBook's modal dialog.  LightFace offers numerous options to customize each modal instance.  LightFace also provides utility classes specially designed to work with AJAX requests, IFrames, and images.

![Screenshot](http://davidwalsh.name/dw-content/lightface.png)


How to Use
----------

LightFace instances can be created at any time.  There are no arguments other than the instance options.

	#JS
	/* create LightFace instance */
	var modal = new LightFace({
		width: 'auto',
		height: 400,
		draggable: true,
		title: 'Hello from LightFace!',
		content: '<p>This is the LightFace content!</p>',
		buttons: [
			{ title: 'Close', event: function() { this.close(); }, submit: false }
		],
		resetOnScroll: true
	});
	/* open when link is clicked */
	document.id('launchModal').addEvent('click',function(e){
		e.stop();
		modal.open();
	});
	

For specific usage and options, please read the documentation or visit [http://davidwalsh.name/js/lazyload](http://davidwalsh.name/js/lazyLoad)