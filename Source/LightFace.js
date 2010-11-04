/*
	Inspired by Bert Ramaker's Facebox for jQuery and MooTools:  http://bertramakers.com/labs/
	Rewritten and optimized by David Walsh:  http://davidwalsh.name
*/
/*
---
description:     LightFace

authors:
  - David Walsh (http://davidwalsh.name)

license:
  - MIT-style license

requires:
  core/1.2.1:   '*'

provides:
  - LightFace
...
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
		fadeDuration: 400,
		keys: { 
			esc: function() { this.close(); } 
		},
		content: '<p>Message not specified.</p>',
		zIndex: 9001,
		pad: 100,
		overlayTitle: false,
		constrain: false,
		resetOnScroll: true,
		errorMessage: '<p>The requested file could not be found.</p>'/*,
		onOpen: $empty,
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
				'z-index': this.options.zIndex
			},
			events: {
				//blur: function() { this.close(); }.bind(this)
			},
			tween: {
				duration: this.options.fadeDuration,
				onComplete: function() {
					if(this.box.getStyle('opacity') == 0) this.box.setStyles({ top: -9000, left: -9000 });
				}.bind(this)
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
						'class': 'lightfaceContent',
						styles: {
							width: this.options.width
						}
					});
					cell.appendChild(this.contentBox);
				}
				else {
					document.id(cell).setStyle('opacity',0.4);
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
				duration: this.options.fadeDuration,
				onComplete: function() {
					if(this.overlay.getStyle('opacity') == 0) this.box.focus();
				}.bind(this)
			}
		}).inject(this.contentBox);
		if(!this.options.overlayTitle && this.title) this.overlay.setStyle('top',this.title.getSize().y);
		
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
		
		//focus node
		this.focusNode = this.box;
		
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
		if(this.buttons[title]) this.buttons[title].removeClass('hiddenButton');
		return this.buttons[title];
	},
	hideButton: function(title) {
		if(this.buttons[title]) this.buttons[title].addClass('hiddenButton');
		return this.buttons[title];
	},
	
	/*
		SHOWING, HIDING, FADING
	*/
	close: function(fast) {
		if(this.isOpen) {
			this.box[fast ? 'setStyles' : 'tween']('opacity',0);
			this.fireEvent('close');
			this._detachEvents();
			this.isOpen = false;
		}
		return this;
	},
	
	open: function(fast) {
		if(!this.isOpen) {
			this.box[fast ? 'setStyles' : 'tween']('opacity',1);
			if(this.resizeOnOpen) this._resize();
			this.fireEvent('open');
			this._attachEvents();
			(function() {
				this.focusNode.setAttribute('tabIndex',0);
				this.focusNode.focus();
			}).bind(this).delay(this.options.fadeDuration + 10);
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
		if(content) this.messageBox.set('html',content);
		if(title && this.title) this.title.set('html',title);
		this.fireEvent('complete');
		return this;
	},
	
	/*
		Keyboard and Window events
	*/
	_attachEvents: function() {
		this.keyEvent = function(e){
			if(this.options.keys[e.key]) this.options.keys[e.key].call(this);
		}.bind(this);
		this.focusNode.addEvent('keyup',this.keyEvent);
		
		this.resizeEvent = this.options.constrain ? function(e) { this._resize(); }.bind(this) : function() { this._position(); }.bind(this);
		window.addEvent('resize',this.resizeEvent);
		
		if(this.options.resetOnScroll) {
			this.scrollEvent = function() {
				this._position();
			}.bind(this);
			window.addEvent('scroll',this.scrollEvent);
		}
		
		return this;
	},
	
	_detachEvents: function() {
		this.focusNode.removeEvent('keyup',this.keyEvent);
		window.removeEvent('resize',this.resizeEvent);
		if(this.scrollEvent) window.removeEvent('scroll',this.scrollEvent);
		return this;
	},
	
	/*
		Resizing, poisitioning
	*/
	_position: function() {
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
			var max = window.getSize().y - this.options.pad;
			if(this.contentBox.getSize().y > max) height = max;
		}
		this.messageBox.setStyle('height',height);
		this._position();
	},
	
	/*
		Expose entire element
	*/
	toElement: function () {
		return this.messageBox;
	},
	
	/*
		Returns entire box
	*/
	getBox: function() {
		return this.box;
	},
	
	/*
		Cleanup
	*/
	destroy: function() {
		this._detachEvents();
		this.box.dispose();
	}
});