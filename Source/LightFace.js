/*
	Inspired by Bert Ramaker's Facebox for jQuery and MooTools:  http://bertramakers.com/labs/
	Rewritten and optimized by David Walsh:  http://davidwalsh.name
*/

/*
	
	To Do
	-----------------------------
		- Browser Checks
		
		
		
	Possible Enhancements
	-----------------------------
		-  IE6 - Overlay Size
		-  Event Delegation:  listen to links clicks inside lightbox;  ajax-load them
		
		
*/



var LightFace = new Class({
	
	Implements: [Options,Events],
	
	options: {
		
		width: 'auto',
		height: 'auto',
		draggable: false,
		title: '',
		buttons: [],
		fadeDelay: 150,
		fadeDuration: 150,
		keys: { 
			esc: function() { this.close(); } 
		},
		content: '<p>Message not specified.</p>',
		method: 'get',
		zIndex: 9001,
		overlayTitle: false,
		errorMessage: '<p>The requested file could not be found.</p>'/*,
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
		this.state = false;
		this.buttons = {};
		this.resizeOnOpen = true;
		this.draw();
	},
	
	draw: function() {
		
		//create main box
		this.box = new Element('table',{
			'class': 'lightface',
			styles: {
				 position: 'absolute',
				'z-index': this.options.zIndex,
				opacity: 0
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
				document.id(cell).setStyle('opacity',0.4);
				if (cssClass == 'centerCenter') {
					this.contentBox = new Element('div',{
						'class': 'lightfaceContent',
						styles: {
							width: this.options.width
						}
					});
					document.id(cell).setStyle('opacity',1).appendChild(this.contentBox);
				}
			}
		}
		
		//draw title
		if(this.options.title) {
			this.title = new Element('h2',{
				'class': 'lightfaceTitle',
				html: this.options.title
			}).inject(this.contentBox);
			if(this.options.draggable && $defined(window['Drag']) && $defined(window['Drag.Move'])) {
				new Drag.Move(this.box,{ handle: this.title });
				this.title.addClass('lightfaceDraggable');
			}
		}
		
		//draw message box
		this.messageBox = new Element('div',{
			'class': 'lightfaceMessageBox',
			html: (this.options.content || ''),
			styles: {
				height: this.options.height
			}
		}).inject(this.contentBox);
		
		//draw overlay
		this.overlay = new Element('div',{
			html: '&nbsp;',
			styles: {
				opacity: 0
			},
			'class': 'lightfaceOverlay',
			tween: {
				link: 'chain',
				duration: this.options.fadeDuration
			}
		}).inject(this.contentBox);
		if(!this.options.overlayTitle) this.overlay.setStyle('top',this.title.getSize().y);
		
		//button container
		this.footer = new Element('div',{
			'class': 'lightfaceFooter',
			styles: {
				display: 'none'
			}
		}).inject(this.contentBox);
		
		//create initial buttons
		if(this.options.buttons.length) {
			this.options.buttons.each(function(button) {
				this.addButton(button.title,button.event,button.submit);
			},this);
		}
		
		return this;
	},
	
	/* adds buttons */
	addButton: function(title,clickEvent,isSubmit) {
		this.footer.setStyle('display','block');
		this.buttons[title] = (new Element('input',{
			type: 'button',
			value: title,
			'class': isSubmit ? 'lightfaceSubmit': '',
			events: {
				click: (clickEvent || this.close).bind(this)
			}
		}).inject(this.footer));
		return this;
	},
	showButton: function(title) {
		if(this.buttons[title]) this.buttons[title].setStyle('display','');
		return this.buttons[title];
	},
	hideButton: function(title) {
		if(this.buttons[title]) this.buttons[title].setStyle('display','none');
		return this.buttons[title];
	},
	
	/*
		SHOWING, HIDING, FADING
	*/
	
	close: function(fast) {
		if(this.isOpen) {
			this.box[fast ? 'setStyle' : 'tween']('opacity',0);
			this.fireEvent('close');
			this.detachEvents();
			this.isOpen = false;
		}
		return this;
	},
	
	open: function(fast) {
		if(!this.isOpen) {
			this.box[fast ? 'setStyle' : 'tween']('opacity',1);
			if(this.resizeOnOpen) this._resize();
			this.fireEvent('open');
			this.attachEvents();
			this.box.setAttribute('tabIndex',0); //accessibility?
			(function() {
				this.box.focus();
			}).bind(this).delay(100);
			this.isOpen = true;
		}
		return this;
	},
	
	/*
		SHOWS AND HIDES THE OVERLAY
	*/
	fade: function(fade) {
		this.overlay.setStyle('opacity',fade || 1);
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
	
	/*
		LOADING AND SETTING OF CONTENT
	*/
	load: function(content,title) {
		this.messageBox.set('html',content);
		if(title) this.title.set('html',title);
		this.fireEvent('complete');
		return this;
	},
	
	/*
		Keyboard and Window events
	*/
	attachEvents: function() {
		
		this.keyEvent = function(e){
			if(this.options.keys[e.key]) this.options.keys[e.key].call(this);
		}.bind(this);
		document.addEvent('keyup',this.keyEvent);
		
		this.resizeEvents = function() { this._resize(); }.bind(this);
		window.addEvent('resize',this.resizeEvents);
		
		return this;
	},
	
	detachEvents: function() {
		document.removeEvent('keyup',this.keyEvent);
		document.removeEvent('resize',this.resizeEvents);
		return this;
	},
	
	/*
		Resizing, poisitioning
	*/
	position: function() {
		var windowSize = window.getSize(), 
			scrollSize = window.getScroll(), 
			boxSize = this.box.getSize();
		this.box.setStyles({
			left: scrollSize.x + ((windowSize.x - boxSize.x) / 2),
			top: scrollSize.y + ((windowSize.y - boxSize.y) / 2)
		});
		return this;
	},
	
	_resize: function() {
		var height = this.options.height;
		if(height == 'auto') {
			//get the height of the content box
			var max = window.getSize().y - 110;
			if(this.contentBox.getSize().y > max) height = max;
		}
		this.messageBox.setStyle('height',height);
		this.position();
	},
	
	/*
		Expose entire element
	*/
	toElement: function () {
		return this.box;
	}
	
});


/* LightFace.Image - Used to Load Images */
LightFace.Image = new Class({
	options: {
		url: ''
	},
	Extends: LightFace,
	initialize: function(options) {
		this.parent(options);
		this.url = '';
		this.resizeOnOpen = false;
		if(this.options.url) this.load();
	},
	_resize: function() {
		//get the largest possible height
		var maxHeight = window.getSize()['y'] - 110;
		
		//get the image size
		var imageDimensions = document.id(this.image).retrieve('dimensions');
		
		//if image is taller than window...
		if(imageDimensions.y > maxHeight) {
			this.image.height = maxHeight;
			this.image.width = (imageDimensions.x * (maxHeight / imageDimensions.y));
		}
		
		//get rid of styles
		this.messageBox.setStyles({ height: '', width: '' });
		
		//position the box
		this.position();
	},
	load: function(url,title) {
		//keep current height/width
		var currentDimensions = { x: '', y: '' };
		if(this.image) currentDimensions = this.image.getSize();
		///empty the content, show the indicator
		this.messageBox.set('html','').setStyles({
			padding:0,
			overflow:'hidden',
			width: currentDimensions.x,
			height: currentDimensions.y
		});
		this.position();
		this.fade();
		this.image = new Element('img',{
			events: {
				load: function() {
					(function() {
						this.image.inject(this.messageBox);
						this.image.store('dimensions',this.image.getSize());
						this._resize();
						this.unfade();
						this.fireEvent('complete');
					}).bind(this).delay(10);
				}.bind(this),
				error: function() {
					
				}
			},
			styles: {
				display: 'block'
			}
		});
		this.image.src = url || this.options.url;
		if(title) this.title.set('html',title);
		return this;
	}
});


/* LightFace.Image - Used to Load Images */
LightFace.IFrame = new Class({
	options: {
		url: ''
	},
	Extends: LightFace,
	initialize: function(options) {
		this.parent(options);
		if(this.options.url) this.load();
	},
	load: function(url,title) {
		this.fade();
		this.fireEvent('request');
		if(!this.iframe) {
			this.messageBox.set('html','');
			this.iframe = new IFrame({
				styles: {
					width: '100%',
					height: '100%'
				},
				events: {
					load: function() {
						this.unfade();
						this.fireEvent('complete');
					}.bind(this)
				},
				border: 0
			}).inject(this.messageBox);
			this.messageBox.setStyles({ padding:0, overflow:'hidden' });
		}
		if(title) this.title.set('html',title);
		this.iframe.src = url || this.options.url;
		return this;
	}
});

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
		
		if(title) this.title.set('html',title);
		if(url) this.options.url = url;
		
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
		
		if(!props.url) { props.url = url || this.options.url; } //HACK!!! For some reason, props.url was "false"
		
		new Request(props).send();
		return this;
	}
});