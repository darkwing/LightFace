/*
	Inspired by Bert Ramaker's Facebox for jQuery and MooTools:  http://bertramakers.com/labs/
	Rewritten and optimized by David Walsh:  http://davidwalsh.name
*/

/*
	
	To Do
	-----------------------------
		More explicit load system:  loadImage
									loadRequest
									loadIFrame
									loadContent
		
		
		
		Better Sizing system
		More clear show/open/close/hide
		
		
		
	Possible Enhancements
	-----------------------------
		IE6 - Overlay Size
		
*/



var LightFace = new Class({
	
	Implements: [Options,Events],
	
	options: {
		
		width: 'auto',
		height: 'auto',
		draggable: false, 			//wtf?
		title: '',
		buttons: [],
		fadeDelay: 250,
		fadeDuration: 500,
		request: {
			url: false
		},
		keys: { 
			esc: function() { this.close(); } 
		},
		content: '<p>Message not specified.</p>',
		method: 'get',
		zIndex: 9001,
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
		this.buttons = {};
		this.draw();
		if(this.options.request.url) this.load(this.options.request.url);
		this.attachEvents();
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
				cell.setStyle('opacity',0.4);
				if (cssClass == 'centerCenter') {
					this.contentBox = new Element('div',{
						'class': 'lightfaceContent',
						styles: {
							width: this.options.width
						}
					});
					cell.setStyle('opacity',1).appendChild(this.contentBox);
				}
			}
		}
		
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
		
		//draw title
		if(this.options.title) {
			this.title = new Element('h2',{
				html: this.options.title,
				'class': 'lightfaceTitle'
			}).inject(this.contentBox);
			if(this.options.draggable && $defined(window['Drag']) && $defined(window['Drag.Move'])) {
				new Drag.Move(this.box,{ handle: this.title });
				this.title.addClass('lightfaceDraggable');
			}
		}
		
		//draw message box
		if(!isNaN(this.options.height)) { this.options.height = this.options.height + 'px'; }
		this.messageBox = new Element('div',{
			'class': 'lightfaceMessageBox',
			html: this.options.content,
			styles: {
				height: this.options.height
			}
		}).inject(this.contentBox);
		
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
				click: clickEvent || this.close.bind(this)
			}
		}).inject(this.footer));
		
	},
	showButton: function(title) {
		if(this.buttons[title]) this.buttons[title].setStyle('display','');
	},
	hideButton: function(title) {
		if(this.buttons[title]) this.buttons[title].setStyle('display','none');
	},
	
	show: function() {
		this._resize();
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
		this.detachEvents();
		return this;
	},
	
	open: function() {
		this._resize();
		thix.box.setStyle('opacity',1);
		this.fireEvent('open');
		this.box.setAttribute('tabIndex',0).focus();
		return this;
	},
	
	/* shows and hides overlay */
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
	
	load: function(url) {
		
		if(typeof url != 'string') url = url.url;
		
		if(url && ['png','jpg','jpeg','gif'].contains(url.substr(url.lastIndexOf('.') + 1,url.length))) {
			this.handleImage(url);
		}
		else {
			this.handleRequest(url);
		}
		return this;
	},
	
	setContent: function(content,title) {
		this.messageBox.set('html',content);
		if(title) this.title.set('html',title);
		this._resize();
		this.fireEvent('complete');
		return this;
	},
	
	handleImage: function(url) {
		if(!this.image) {
			this.messageBox.set('html','');
			this.image = new Element('img',{
				events: {
					click: function() {
						this.hide();
					}.bind(this),
					error: function() {
						this.unfade();
						this.messageBox.set('html',this.options.errorMessage);
						this.image.dispose();
						this.fireEvent('complete');
					}.bind(this),
					load: function() {
						this._resize.bind(this,[true]).delay(10);
						this.image.setStyle('display','');
						this.unfade();
						this.fireEvent('complete');
					}.bind(this)
				},
				styles: {
					display: 'none'
				}
			});
		}
		this.fade();
		this.image.set('src',url).inject(this.messageBox); //for ie
		return this;
	},
	
	handleRequest: function(url) {
		this.options.request.url = url;
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
		
		console.log(props);
		
		new Request(props).send();
		return this;
	},
	
	/*
		Keyboard and Window events
	*/
	attachEvents: function() {
		
		this.keyEvent = function(e){
			if(this.options.keys[e.key]) {
				this.options.keys[e.key].call(this);
			}
		}.bind(this);
		document.addEvent('keyup',this.keyEvent);
		
		this.resizeEvents = function() {
			this._resize();
		}.bind(this);
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
	
	_calculateHeight: function(suggested) {
		var height = suggested, threshhold = 110;
		if(suggested == 'auto') {
			//get the height of the content box
			var maxHeight = window.getSize().y - threshhold;
			if(this.contentBox.getSize().y > maxHeight) {
				return maxHeight;
			}
		}
		return height;
	},
	
	_resize: function(constrainImage) {
		this.messageBox.setStyle('height',this._calculateHeight(this.options.height));
		if(constrainImage) {
			//get image dimensions
			var boxSize = this.messageBox.getSize().y;
			if(this.image.getSize().y > boxSize) {
				this.image.setStyle('height',boxSize - 30);
			}
		}
		this.position();
	},
	
	toElement: function () {
		return this.box;
	}
	
});