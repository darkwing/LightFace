/*
	Inspired by Bert Ramaker's Facebox for jQuery and MooTools:  http://bertramakers.com/labs/
	Rewritten and optimized by David Walsh:  http://davidwalsh.name
*/
/*
---
description:     LightFace.Static

authors:
  - David Walsh (http://davidwalsh.name)

license:
  - MIT-style license

requires:
  core/1.2.1:   '*'

provides:
  - LightFace.Static
...
*/
/* LightFace.Static - Use to work well with IFrames */
LightFace.Static = new Class({
	Extends: LightFace,
	options: {
		offsets: {
			x: 20,
			y: 20
		}
	},
	open: function(fast,x,y) {
		this.parent(fast);
		this._position(x,y);
	},
	_position: function(x,y) {
		if(!$defined(x)) return;
		this.box.setStyles({
			top: y - this.options.offsets.y,
			left: x - this.options.offsets.x
		});
	}
});