/*
	Inspired by Bert Ramaker's Facebox for jQuery and MooTools:  http://bertramakers.com/labs/
	Rewritten and optimized by David Walsh:  http://davidwalsh.name
*/
/*
---
description:     LightFace.Request

authors:
  - David Walsh (http://davidwalsh.name)

license:
  - MIT-style license

requires:
  core/1.2.1:   '*'

provides:
  - LightFace.Request
...
*/
/* LightFace.Request */
LightFace.Request = new Class({
	options: {
		url: '',
		request: {
			url: false
		}
	},
	Extends: LightFace,
	initialize: function(options) {
		this.parent(options);
		if(this.options.url) this.load();
	},
	load: function(url,title) {
		var props = $extend({
			onRequest: function() {
				this.fade();
				this.fireEvent('request');
			}.bind(this),
			onSuccess: function(response) {
				this.messageBox.set('html',response);
				this.fireEvent('success');
			}.bind(this),
			onFailure: function() {
				this.messageBox.set('html',this.options.errorMessage);
				this.fireEvent('failure');
			}.bind(this),
			onComplete: function() {
				this._resize();
				this.unfade();
				this.fireEvent('complete');
			}.bind(this)
		},this.options.request);
		
		if(title) this.title.set('html',title);
		if(!props.url) props.url = url || this.options.url;
		
		new Request(props).send();
		return this;
	}
});