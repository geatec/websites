from josmith import *

class IndexPage (Page):
	def get (self):
		super () .get ()
		self.encodeAs = 'utf-8-sig'
		
		pf = self.app.portfolio
		
		thumbNails = '\n'.join ([
			'''
				<div style="display:inline-block; margin-left:10px; margin-right:10px;">
					<div style = "display:block; float:top">
						<a href="/single_picture/{dirName}/{fileName}">
							<img src="/thumbnails/{dirName}/{fileName}.jpg">
						</a>
					</div>
					<div style="display:block; float:top">
						{text}
					</div>
				</div>
			'''.format (
				dirName = photoElement [pf.plPhotographerId],
				fileName = '{photographerId}_{photoNr}'.format (
					photographerId = photoElement [pf.plPhotographerId],
					photoNr = photoElement [pf.plPhotoNr]
				),
				text = '<br>'.join ('{}\n\n\n\n\n\n\n'.format (pf.textDict [pf.getTextKey (photoElement)]) .split ('\n') [0:6]),
				darkBackgroundColor = self.app.darkBackgroundColor
			)
			for photoElement in pf.photoList
		])
		
		if len (self.args) and self.args [0] == 'about':
			mainSection = '''
				<div style = "position:absolute; top: 30%; left: 30%; max-width: 300px; text-align:left">
					{about}
				</div>
			'''.format (about = pf.getAbout (self) .replace ('\n',' <br>'))
		elif len (self.args) and self.args [0] == 'info':
			mainSection = '''
				<div style = "position:absolute; top: 30%; left: 30%; text-align:left">
					{info}
				</div>
			'''.format (info = pf.getInfo (self))
		elif len (self.args) and self.args [0] == 'contact':
			mainSection = '''
				<div style = "position:absolute; top: 40%; left: 40%; text-align:left">
					{contact}
				</div>
			'''.format (contact = pf.getContact (self) .replace ('\n', '<br>'))
		else:
			mainSection = '''
				<div style="display:block; position:absolute; float:left; white-space:nowrap; z-index:3000; top:120px; padding-top:30px; padding-bottom: 20px; padding-left:10px; padding-right:10px; font-size:12px; background-color = {darkBackgroundColor}">
					{thumbNails}
				</div>			
			'''.format (thumbNails = thumbNails, darkBackgroundColor = self.app.darkBackgroundColor)
			
		authorizeClause = (
				'<a href="/{logoutResponseUrl}" style="margin-left:20px; text-decoration:none; color: {lightForegroundColor}">log out</a>'.format (logoutResponseUrl = self.app.logoutResponseUrl, lightForegroundColor = self.app.lightForegroundColor)
			if self.user else
				'<a href="/{loginUrl}" style="margin-left:20px; text-decoration:none; color: {lightForegroundColor}">log in</a>'.format (loginUrl = self.app.loginUrl, lightForegroundColor = self.app.lightForegroundColor)
		)
		
		self.content = ['''
			<html>
				<head>
					<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
					<style>* {{margin:0px; padding:0px; border:0px}}</style>		
					<link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Josefin+Sans:400normal">
					<link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Open+Sans:300normal">
					
					{googleAnalyticsClause}
					
					<meta name="robots" content="index, follow">					
					<title>Anna de Hooge, model, catwalk, fashion & commercial photography</title>
					
					<meta name="keywords" lang="nl" xml:lang="nl" content="foto model fotomodel anna de hooge mode show catwalk portret fotografie video film portfolio internationaal freelance">
					<meta name="description" lang="nl" xml:lang="nl" content="Anna de Hooge, model voor modeshows/catwalk, mode- en portret-fotografie, videoproducties">
					
					<meta name="keywords" lang="en" xml:lang="en" content="photo model photomodel anna de hooge fashion show catwalk portrait photography video movie portfolio international freelance">
					<meta name="description" lang="en" xml:lang="en" content=" Anna de Hooge, model for shows/catwalk, fashion and portrait photography, video productions">
					
					<meta name="author" content="GEATEC engineering; www.geatec.nl">
					
				</head>
				<body style="background-color:{darkBackgroundColor}; color:{lightForegroundColor}; font-family:'open sans'; font-weight:300">
					{mainSection}				
					<div style="position:fixed; z-index:2000; top:0px; height:120px; width:100%; background-color:{lightBackgroundColor}">
						<div style="position:absolute; left:40px; top:25px; text-align:left; font-family:Josefin Sans; font-size:60px; font-weight:400; text-shadow:0px 0px 15px #{glowBackgroundColor}">
							Anna&nbspde&nbspHooge
						</div>
						<div style="position:absolute; top: 25px; right: 60px; text-align:left; font-size:14px; text-shadow:0px 0px 7px #{glowBackgroundColor}; background-color:{lightBackgroundColor}">
							<a href="/index" style="margin-left:20px; text-decoration:none; color: {lightForegroundColor}">portfolio</a>
							<a href="/index/about" style="margin-left:20px; text-decoration:none; color: {lightForegroundColor}">about</a>
							<a href="/index/info" style="margin-left:20px; text-decoration:none; color: {lightForegroundColor}">info</a>
							<a href="/index/contact" style="margin-left:20px; text-decoration:none; color: {lightForegroundColor}">contact</a>
							{authorizeClause}
						</div>
					</div>
					<div style="position:fixed; z-index:1000; bottom:0px; height:60px; padding:10px; width:100%; background-color:{lightBackgroundColor}">
						<div style="position:absolute; left:30px; top:15px; text-align:left; font-size:10px; font-weight:400">
							<a href="http://www.geatec.nl" style="text-decoration:none; color: {darkForegroundColor}">Website: GEATEC engineering</a>
						</div>
					</div>
				</body>
			</html>
		'''.format (
			mainSection = mainSection,
			darkBackgroundColor = self.app.darkBackgroundColor,
			lightBackgroundColor = self.app.lightBackgroundColor,
			glowBackgroundColor = self.app.glowBackgroundColor,
			lightForegroundColor = self.app.lightForegroundColor,
			darkForegroundColor = self.app.darkForegroundColor,
			googleAnalyticsClause = self.app.googleAnalyticsClause,
			authorizeClause = authorizeClause,
		)]
		