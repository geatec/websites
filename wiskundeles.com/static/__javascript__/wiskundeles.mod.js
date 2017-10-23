	(function () {
		var Site = __class__ ('Site', [object], {
			get __init__ () {return __get__ (this, function (self) {
				self.shareScript = document.createElement ('script');
				self.shareScript.type = 'text/javascript';
				self.shareScript.innerHTML = '\nvar a2a_config = a2a_config || {};\na2a_config.linkname = "Leer nu doelgericht wiskunde!";\na2a_config.linkurl = "http://www.wiskundeles.com";\na2a_config.locale = "nl";\na2a_config.num_services = 6;\na2a_config.prioritize = ["twitter", "facebook", "google_plus", "email", "google_gmail", "linkedin"];\t\t\n\t\t';
				self.shareScript.src = 'https://static.addtoany.com/menu/page.js';
				document.head.appendChild (self.shareScript);
				self.textColor = '770000';
				self.minHeight = 600;
				document.body.style.minHeight = self.minHeight;
				self.all = document.createElement ('div');
				self.all.style.position = 'absolute';
				self.all.style.backgroundImage = 'url("images/fractal_grey.jpg")';
				self.all.style.backgroundSize = 'cover';
				self.all.style.minHeight = self.minHeight;
				document.body.appendChild (self.all);
				self.mailAddress = 'info@wiskunde.com';
				self.buttonWideTexts = function () {
					var __accu0__ = [];
					var __iterable0__ = list (['inhoud en werkwijze', 'tijden en prijzen', 'contact opnemen', 'voor scholen', 'maatwerk producten']);
					for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
						var text = __iterable0__ [__index0__];
						__accu0__.append (text.upper ());
					}
					return __accu0__;
				} ();
				self.buttonNarrowTexts = function () {
					var __accu0__ = [];
					var __iterable0__ = list (['werkwijze', 'tarief', 'contact', 'scholen', 'op maat']);
					for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
						var text = __iterable0__ [__index0__];
						__accu0__.append (text.upper ());
					}
					return __accu0__;
				} ();
				self.mainTexts = list (['\n\t\t\tWISKUNDELES.COM brengt je precies die wiskunde bij die je in jouw situatie nodig hebt.\n\t\t\tJe lesstof wordt van tevoren grondig geanalyseerd en de kernpunten op een rijtje gezet.\n\t\t\tWat nodig is leer je goed, wat overbodig is wordt weggelaten.\n\t\t\tTijdens de lessen wordt steeds een kort, helder stukje uitleg gegeven.\n\t\t\tDaarna oefen je onder intensieve begeleiding met het maken van opgaven die van belang zijn voor je toetsen op school.\n\t\t\tMeer weten? {}\n\t\t\t'.format (self.getMailLink ('Neem vrijblijvend contact met ons op.')), '\n\t\t\tDe wiskunde-begeleiding bestaat uit:\n\t\t\t<ul>\n\t\t\t<li>Wekelijkse les in een groep van ten hoogste vijf personen.</li>\n\t\t\t<li>De mogelijkheid om vragen stellen met behulp van whatsapp of mail.</li>\n\t\t\t<li>Twee één op één evaluatie sessies.</li>\n\t\t\t</ul>\n\t\t\tDe kosten bedragen € 229,- per kwartaal.<br>\n\t\t\tWij geven je graag {}\n\t\t\t'.format (self.getMailLink ('meer informatie.')), '\n\t\t\tWe staan je / u graag te woord voor meer informatie:\n\t\t\t<ul>\n\t\t\t<li>Mail: {}</li>\n\t\t\t<li>Telefoon: 06-37143272</li>\n\t\t\t</ul>\n\t\t\t'.format (self.getMailLink (self.mailAddress)), '\n\t\t\tKunnen wij iets voor uw school betekenen?\n\t\t\tWilt u meer weten over onze manier van lesgeven?\n\t\t\tOf wilt u uw leerlingen direct goede wiskunde-begeleiding kunnen bieden?\n\t\t\t{}\n\t\t\tWij komen graag langs voor een oriënterend gesprek.\n\t\t\t'.format (self.getMailLink ('Neemt u contact met ons op.')), '\n\t\t\tWij kunnen u van dienst te zijn met een scala aan les- en ondersteunings-mogenlijkheden. Maatwerk, extra opgaven voor een bepaald onderwerp, een zomercurcus om een groep leerlingen die de stap van VMBO naar HAVO maakt een goede start te geven, of misschien wel iets waar wij nog helemaal niet aan gedacht hebben? {} Wij onderzoeken graag samen met u de mogelijkheden.\n\t\t\t'.format (self.getMailLink ('Laat het ons weten.'))]);
				self.images = list (['girl_cherry.jpg', 'boy_laptop.jpg', 'compass.jpg', 'girl_blue.jpg', 'calculator.jpg']);
				self.shareContent = '\n\t\t\t<a class="a2a_dd" href="https://www.addtoany.com/share?linkurl=www.wiskundeles.com&amp;linkname=www.wiskundeles.com">\n\t\t\t\t<img src="//static.addtoany.com/buttons/share_save_171_16.png" width="171" height="16" border="0" alt="Share"/>\n\t\t\t</a>\n\t\t';
				self.logo = document.createElement ('div');
				self.logo.style.position = 'absolute';
				self.logo.style.backgroundImage = 'url("images/logo.png")';
				self.logo.style.backgroundSize = 'cover';
				self.all.appendChild (self.logo);
				self.share = document.createElement ('div');
				self.share.style.position = 'absolute';
				self.share.style.backgroundSize = 'cover';
				self.share.innerHTML = self.shareContent;
				self.all.appendChild (self.share);
				self.menuBar = document.createElement ('div');
				self.menuBar.style.position = 'absolute';
				self.all.appendChild (self.menuBar);
				self.buttons = list ([]);
				self.buttonLines = list ([]);
				self.nrOfButtons = len (self.mainTexts);
				for (var i = 0; i < self.nrOfButtons; i++) {
					self.buttons [i] = document.createElement ('div');
					self.buttons [i].style.position = 'absolute';
					self.buttons [i].style.backgroundColor = null;
					self.buttons [i].style.cursor = 'pointer';
					self.buttons [i].style.padding = 0;
					self.buttons [i].onmouseover = (function __lambda__ (menuIndex) {
						return (function __lambda__ () {
							return self.hoverButton (menuIndex, true);
						});
					}) (i);
					self.buttons [i].onmouseout = (function __lambda__ (menuIndex) {
						return (function __lambda__ () {
							return self.hoverButton (menuIndex, false);
						});
					}) (i);
					self.buttons [i].onclick = (function __lambda__ (menuIndex) {
						return (function __lambda__ () {
							return self.setSubject (menuIndex);
						});
					}) (i);
					self.menuBar.appendChild (self.buttons [i]);
					self.buttonLines [i] = document.createElement ('div');
					self.buttonLines [i].style.position = 'absolute';
					self.buttonLines [i].style.fontFamily = 'open sans, arial, sans serif';
					self.buttonLines [i].style.fontWeight = 100;
					self.buttonLines [i].style.color = self.textColor;
					self.buttonLines [i].style.textAlign = 'center';
					self.buttonLines [i].style.cursor = 'pointer';
					self.buttonLines [i].style.padding = 0;
					self.buttons [i].appendChild (self.buttonLines [i]);
				}
				self.strip = document.createElement ('div');
				self.strip.style.position = 'absolute';
				self.strip.style.backgroundSize = 'cover';
				self.strip.style.backgroundImage = 'url("images/triangles_grey.jpg")';
				self.strip.style.margin = 0;
				self.all.appendChild (self.strip);
				self.caption = document.createElement ('div');
				self.caption.style.position = 'absolute';
				self.caption.style.fontFamily = 'open sans, sans serif';
				self.caption.style.color = self.textColor;
				self.caption.style.fontWeight = 200;
				self.strip.appendChild (self.caption);
				self.portrait = document.createElement ('div');
				self.portrait.style.position = 'absolute';
				self.portrait.style.backgroundSize = 'cover';
				self.strip.appendChild (self.portrait);
				self.mainText = document.createElement ('div');
				self.mainText.margin = 0;
				self.mainText.style.position = 'absolute';
				self.mainText.style.fontFamily = 'open sans, sans serif';
				self.mainText.style.fontWeight = 300;
				self.mainText.style.color = self.textColor;
				self.all.appendChild (self.mainText);
				self.setSubject (0);
				window.onresize = self.rightSize;
				self.rightSize ();
			});},
			get rightSize () {return __get__ (this, function (self) {
				self.pageWidth = window.innerWidth;
				self.pageHeight = window.innerHeight;
				print (self.pageHeight);
				self.landscape = self.pageWidth > self.pageHeight && self.pageWidth > 400;
				self.all.style.left = 0;
				self.all.style.top = 0;
				self.all.style.width = self.pageWidth;
				self.all.style.height = self.pageHeight;
				self.logo.style.top = 0.006 * self.pageHeight;
				self.logo.style.height = 0.07 * self.pageHeight;
				self.logo.style.width = 0.07 * self.pageHeight;
				self.logo.style.left = 0.07 * self.pageWidth;
				self.share.style.top = 0.04 * self.pageHeight;
				self.share.style.right = 0.01 * self.pageWidth;
				self.menuBar.style.left = 0.005 * self.pageWidth;
				if (self.landscape) {
					self.menuBar.style.top = 0.1 * self.pageHeight;
				}
				else {
					self.menuBar.style.top = 0.11 * self.pageHeight;
				}
				self.menuBar.style.width = 0.99 * self.pageWidth;
				self.menuBar.style.height = 0.05 * self.pageHeight;
				self.menuBar.style.borderTop = '1px solid #BBBBBB';
				self.menuBar.style.borderBottom = '1px solid #BBBBBB';
				self.buttonWidth = 0.166;
				self.buttonCenters = function () {
					var __accu0__ = [];
					for (var i = 0; i < self.nrOfButtons; i++) {
						__accu0__.append ((i + 1) * self.buttonWidth);
					}
					return __accu0__;
				} ();
				for (var i = 0; i < self.nrOfButtons; i++) {
					self.buttons [i].style.left = ((self.buttonCenters [i] - self.buttonWidth / 2) * 0.99) * self.pageWidth;
					self.buttons [i].style.top = 0;
					self.buttons [i].style.width = (self.buttonWidth * 0.99) * self.pageWidth;
					self.buttons [i].style.height = 0.05 * self.pageHeight;
					self.buttonLines [i].style.left = 0;
					self.buttonLines [i].style.top = 0.025 * self.pageHeight;
					self.buttonLines [i].style.width = self.buttonWidth * self.pageWidth;
					self.buttonLines [i].style.height = 0;
					self.buttonLines [i].style.margin = 0;
					self.buttonLines [i].style.lineHeight = 0;
					if (self.landscape) {
						self.buttonLines [i].style.fontSize = Math.min (13, 0.013 * self.pageWidth);
						self.buttonLines [i].innerHTML = self.buttonWideTexts [i];
					}
					else {
						self.buttonLines [i].style.fontSize = 0.03 * self.pageWidth;
						self.buttonLines [i].innerHTML = self.buttonNarrowTexts [i];
					}
				}
				self.strip.style.left = 0.005 * self.pageWidth;
				if (self.landscape) {
					self.strip.style.top = 0.15 * self.pageHeight;
				}
				else {
					self.strip.style.top = 0.65 * self.pageHeight;
				}
				self.strip.style.width = 0.99 * self.pageWidth;
				self.strip.style.height = 0.35 * self.pageHeight;
				self.caption.style.left = 0.05 * self.pageWidth;
				self.caption.style.bottom = 0 * self.pageHeight;
				self.caption.style.width = 0.5 * self.pageWidth;
				self.caption.style.height = 0.03 * self.pageWidth;
				self.strip.style.fontSize = 0.02 * self.pageWidth;
				if (self.landscape) {
					self.caption.innerHTML = 'Leer nu doelgericht wiskunde!';
				}
				else {
					self.caption.innerHTML = '';
				}
				self.portrait.style.width = 0.35 * self.pageHeight;
				self.portrait.style.height = 0.35 * self.pageHeight;
				if (self.landscape) {
					self.portrait.style.right = 0.22 * self.pageWidth;
				}
				else {
					self.portrait.style.right = 0.5 * (self.pageWidth - 0.35 * self.pageHeight);
				}
				self.portrait.style.bottom = 0;
				if (self.landscape) {
					self.mainText.style.top = 0.57 * self.pageHeight;
					self.mainText.style.left = 0.3 * self.pageWidth;
					self.mainText.style.width = tuple ([0.4 * self.pageWidth]);
					self.mainText.style.fontSize = 0.02 * Math.sqrt (self.pageHeight * self.pageWidth);
				}
				else {
					self.mainText.style.top = 0.2 * self.pageHeight;
					self.mainText.style.left = 0.1 * self.pageWidth;
					self.mainText.style.width = tuple ([0.8 * self.pageWidth]);
					self.mainText.style.fontSize = 0.031 * Math.sqrt (self.pageHeight * self.pageWidth);
				}
				self.mainText.style.height = 0.3 * self.pageHeight;
			});},
			get hoverButton () {return __get__ (this, function (self, menuIndex, state) {
				if (state) {
					if (self.landscape) {
						self.buttons [menuIndex].style.backgroundColor = 'E7E7E7';
					}
					else {
						self.buttons [menuIndex].style.backgroundColor = 'CCCCCC';
					}
				}
				else {
					self.buttons [menuIndex].style.backgroundColor = 'transparent';
				}
			});},
			get setSubject () {return __get__ (this, function (self, menuIndex) {
				if (self.mainText) {
					self.mainText.innerHTML = self.mainTexts [menuIndex];
				}
				if (self.portrait) {
					self.portrait.style.backgroundImage = 'url("images/{}")'.format (self.images [menuIndex]);
				}
			});},
			get getMailLink () {return __get__ (this, function (self, text) {
				return '<div style="display:inline; color:#0000ff; cursor:pointer" onclick="location.href=\'mailto:{}\'">{}</div>'.format (self.mailAddress, text);
			});}
		});
		var onDocumentReady = function () {
			var site = Site ();
		};
		__pragma__ ('<all>')
			__all__.Site = Site;
			__all__.onDocumentReady = onDocumentReady;
		__pragma__ ('</all>')
	}) ();
