/*
	Inspired by Bert Ramaker's Facebox for jQuery and MooTools:  http://bertramakers.com/labs/
	Rewritten and optimized by David Walsh:  http://davidwalsh.name
*/

/*
	
	To Do
	-----------------------------
		Move style to stylesheet
		Size easing (?)
		Redraw()
		IE6 - Overlay Size
		Height, Width, Positioning + "px" stuff
*/



var Facebox = new Class({
	
	Implements: [Options,Events],
	
	options: {
		
		width: 370,
		height: 'auto',
		draggable: true,
		submitValue: false,
		submitFunction: false,
		submitFocus: false,
		title: '',
		cancelValue: 'Cancel',
		cancelFunction: false,
		fadeOpacity: 1,
		fadeDuration: 500,
		overlayBackgroundColor: '#fff',
		message: 'Message not specified.',
		handler: '', //image, request, html
		url: false,
		method: 'get',
		data: {},
		fadeDelay: 250,
		errorMessage: '<p>The requested file could not be found.</p>'/*,
		onDrawStart: $empty,
		onDrawComplete: $empty,
		onShow: $empty,
		onHide: $empty,
		onClose: $empty,
		onFade: $empty,
		onUnfade: $empty,
		onComplete: $empty,
		onRequest: $empty,
		onSuccess: $empty,
		onFailure: $empty
		*/
	},
	
	
	initialize: function(options) {
		this.setOptions(options);
		this.draw();
		this.position();
		this['handle' + (this.options.handler ? this.options.handler.capitalize() : 'Detect')]();
	},
	
	draw: function() {
		
		this.fireEvent('drawStart');
		
		//create main box
		this.box = new Element('table',{
			'class': 'facebox',
			styles: {
				 position: 'absolute',
				'z-index': 9001
			},
			morph: {
				duration: this.options.fadeDuration
			}
		}).inject(document.body,'bottom');

		//draw rows and cells;  use native JS to avoid IE7 and I6 offsetWidth and offsetHeight issues
		var verts = ['top','center','bottom'], hors = ['Left','Center','Right'], len = verts.length;
		for(var x = 0; x < len; x++) {
			var row = this.box.insertRow(x);
			for(var y = 0; y < len; y++) {
				var cssClass = verts[x] + hors[y], cell = row.insertCell(y);
				cell.className = cssClass;
				if (cssClass == 'centerCenter') {
					this.contentBox = new Element('div',{
						'class': 'faceboxContent',
						styles: {
							position: 'relative',
							width: this.options.width,
							height: this.options.height
						}
					});
					cell.appendChild(this.contentBox);
				}
			}
		}
		
		//draw overlay
		this.overlay = new Element('div',{
			html: '&nbsp;',
			styles: {
				position: 'absolute', /* move to ss */
				left: 0, /* move to ss */
				top: 0, /* move to ss */
				bottom: 0, /* move to ss */
				left: 0, /* move to ss */
				right: 0, /* move to ss */
				'background-color': this.options.overlayBackgroundColor, /* move to ss */
				'background-image': 'url(fbloader.gif)', /* move to ss */
				'background-position': 'center center', /* move to ss */
				'background-repeat': 'no-repeat', /* move to ss */
				opacity: 0
			},
			'class': 'faceboxOverlay',
			tween: {
				link: 'chain',
				duration: this.options.fadeDuration
			}
		}).inject(this.contentBox);
		
		//draw title
		if(this.options.title) {
			this.title = new Element('h2',{
				html: this.options.title,
				'class': 'faceboxTitle'
			}).inject(this.contentBox);
			if(this.options.draggable && Drag && Drag.Move) {
				new Drag.Move(this.box,{ handle: this.title });
				this.title.addClass('faceboxDraggable');
			}
		}
		
		//draw message box
		if(!isNaN(this.options.height)) { this.options.height = this.options.height + 'px'; }
		this.messageBox = new Element('div',{
			'class': 'messageBox',
			styles: {
				height: this.options.height,
				overflow: 'auto', /* move to ss */
				padding: '5px 10px', /* move to ss */
				'min-height': '50px'
			}
		}).inject(this.contentBox);
		
		//draw footer and buttons
		if(this.options.submitValue || this.options.cancelValue) {
			this.footer = new Element('div',{
				'class': 'faceboxFooter',
				styles: {
					display: (this.options.submitValue || this.options.cancelValue ? 'block' : 'none')
				}
			}).inject(this.contentBox);
		
			//submit
			if(this.options.submitValue) {
				this.submitButton = new Element('input',{
					type: 'button',
					'class': 'faceboxSubmit',
					value: this.options.submitValue,
					events: {
						click:this.options.submitFunction || this.close.bind(this)
					}
				}).inject(this.footer);
				if(this.options.submitFocus) { this.submitButton.focus(); }
			}
		
			//cancel button
			if(this.options.cancelValue) {
				this.cancelButton = new Element('input',{
					type: 'button',
					value: this.options.cancelValue,
					events: {
						click: this.options.cancelFunction || this.close.bind(this)
					}
				}).inject(this.footer);
			}
		}
		this.fireEvent('drawComplete');
		
		return this;
	},
	
	/* put the box in the right spot */
	position: function() {
		var pos = window.getSize(), scroll = window.getScroll(), size = this.box.getSize();
		this.box.setStyles({
			left: (pos.x / 2 + scroll.x) + 'px',
			top: (pos.y / 2 + scroll.y) + 'px',
			'margin-left': (size.x / 2 * -1) + 'px',
			'margin-top': (size.y / 2 * -1) + 'px'
		});
		return this;
	},
	
	show: function() {
		this.box.morph({ opacity: 1 });
		this.fireEvent('show');
		return this;
	},
	
	hide: function() {
		this.box.morph({ opacity: 0 });
		this.fireEvent('hide');
		return this;
	},
	
	close: function() {
		this.box.setStyle('opacity',0);
		this.fireEvent('close');
		return this;
	},
	
	/* shows and hides overlay */
	fade: function(fade) {
		//this.overlay.fade(this.options.fadeOpacity);
		this.overlay.setStyle('opacity',fade || this.options.fadeOpacity);
		this.fireEvent('fade');
		return this;
	},
	
	unfade: function() {
		(function() {
			this.overlay.fade(0);
		}.bind(this)).delay(this.options.fadeDelay);
		this.fireEvent('unfade');
		return this;
	},
	
	/* handlers */
	handleImage: function() {
		this.fade();
		var img = new Element('img',{
			alt: this.title ? this.title.get('html') : this.options.url,
			events: {
				error: function() {
					this.messageBox.set('html',this.options.errorMessage);
					img.dispose();
				}.bind(this),
				load: function() {
					img.setStyle('display','');
					this.unfade();
					if(!this.footer) {
						img.setStyle('cursor','pointer').addEvent('click',this.close.bind(this));
					}
				}.bind(this)
			},
			styles: {
				display: 'none'
			}
		});
		img.set('src',this.options.url).inject(this.messageBox); //for ie
		this.fireEvent('complete');
		return this;
	},
	
	handleRequest: function() {
		var self = this;
		new Request({
			url: self.options.url,
			method: self.options.method,
			data: self.options.data,
			onRequest: function() {
				self.fade();
				self.fireEvent('request');
			},
			onSuccess: function(response) {
				self.messageBox.set('html',response);
				self.fireEvent('success');
			},
			onFailure: function() {
				self.messageBox.set('html',self.options.errorMessage);
				self.fireEvent('failure');
			},
			onComplete: function() {
				self.unfade();
				self.fireEvent('complete');
			}
		}).send();
		return this;
	},
	
	handleHTML: function() {
		this.messageBox.set('html',this.options.message);
		this.fireEvent('complete');
		return this;
	},
	
	handleDetect: function() {
		//fire handler
		if(this.options.url && ['png','jpg','gif'].contains(this.options.url.substr(this.options.url.lastIndexOf('.') + 1,this.options.url.length))) {
			this.handleImage();
		}
		else if(this.options.url && !this.options.url.contains(' ')) { //AJAX - lame space checker...
			this.handleRequest();
		}
		else { // string content
			this.handleHTML();
		}
		return this;
	}
	
});	
Facebox.alias('handleHTML','handleHtml');