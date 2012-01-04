LightFace
=========

The following changes have been made to LightFace.


1/4/2012
----------
	+ As of Mootools 1.4 fade() & setStyle('opacity') no longer set the visibility property. Changed code to set visibility where opacity is set.
	+ Added the use of Mootools Mask class to make the plugin a true modal dialog box. Added options: showMask, maskClass, closeOnMaskClick.
	+ Add destroyOnClose option; if true the class will destory it's self when the dialog box closes.
	+ Added methods: [public] attachDependent(), attachParent(); [private] _closeDependents(), _detachDependent(), _detachParent().
		These methods maintain a parent/child relationship of LightFace instances.
	+ Added mask.html page to demonstrate the above changes.
		Example: Click the "terms and conditions" link then click "I Agree" button.
					With the Confirm dialog box open click the white space outside the parent window (this is the mask).
					This action will close the Confirm dialog box then the parent dialog box.
	+ Added mootools-more-drag-mask.js for use by the mask.html page.
	+ Added lightfaceMask to LightFace.css.
	+ Tag updated from .96 to .97

11/17/2010
----------
	+ Updated destroy() method to remove reference to node so that videos stop playing when destroy() is called.
	+ Tag updated from .94 to .96