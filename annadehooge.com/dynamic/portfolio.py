def getAbout (page):
	return '''
		Hi and welcome. I'm Anna, an eighteen year old Dutch girl, whose modeling experience includes print, webshop, lookbook, catwalk and fashion performance. I enjoy traveling, fitness, the creative people I get to work with and the air of excitement backstage at a runway show. I am fluent in Dutch and English and can manage in French and German. Thank you for visiting my site.
	'''

def getInfo (page):
	return '''
		<table>
			<tr><th style="width:200"></th><th></th></tr>
			<tr><td>HAIR:<td>RED</td></tr>
			<tr><td>EYES:</td><td>GREEN / BROWN</td></tr>
			<tr><td>HEIGHT:</td><td>172 CM, 5’8”</td></tr>
			<tr><td>BUST:</td><td>81 CM, 32″</td></tr>
			<tr><td>CUP SIZE:</td><td>70 B</td></tr>
			<tr><td>WAIST:</td><td>58 CM, 23”</td></tr>
			<tr><td>HIPS:</td><td>86 CM, 34”</td></tr>
			<tr><td>SIZE:</td><td>34 NL, 4 US, 6 UK, XS</td></tr>
			<tr><td>SHOES:</td><td>36 NL, 4.5 US, 3 UK</td></tr>
			<tr><td>PIERCINGS:</td><td>NO</td></tr>
			<tr><td>TATTOOS:</td><td>NO</td></tr>
		</table>    
	'''

def getContact (page):
	return '''
		E-mail: <a href="mailto:info@annadehooge.com" style="text-decoration:none; color:{lightForegroundColor}">info@annadehooge.com</a><br>
	'''.format (lightForegroundColor = page.app.lightForegroundColor)

plPhotographerId, plPhotoNr, plTextKey, plCategories = range (4)

ctFashion, ctPortrait, ctVideo = range (3)

photoList = [
	('edwin_van_wier', 1, None, [ctPortrait]),
	('dirk_uebele', 1, None, [ctFashion]),
	('dirk_uebele', 2, None, [ctPortrait, ctFashion]),
	('dirk_uebele', 3, None, [ctFashion]),
	('dirk_uebele', 4, None, [ctFashion]),
	('dirk_uebele', 5, None, [ctPortrait, ctFashion]),
	('dirk_uebele', 6, None, [ctFashion]),
	('dirk_uebele', 7, None, [ctFashion]),
	('dirk_uebele', 8, None, [ctFashion]),
	('dirk_uebele', 9, None, [ctFashion]),
	('pascale_hustings', 1, None, [ctFashion]),
	('pascale_hustings', 2, None, [ctFashion]),
	('pascale_hustings', 3, None, [ctFashion]),
	('pascale_hustings', 4, None, [ctFashion]),
	('pascale_hustings', 5, None, [ctFashion]),
	('stefan_witte', 1, None, [ctPortrait]),
	('eric_kellerman', 1, None, [ctPortrait]),
	('eric_kellerman', 2, None, [ctPortrait]),
	('charlona_teerlink', 1, None, [ctPortrait]),
	('charlona_teerlink', 2, None, [ctPortrait]),
	#('charlona_teerlink', 3, None, [ctPortrait]),
	('charlona_teerlink', 4, None, [ctPortrait]),
	('peter_nientied', 1, None, [ctPortrait]),
	('peter_nientied', 2, None, [ctPortrait]),
	('raymond_van_mil', 1, None, [ctPortrait]),
	('raymond_van_mil', 2, None, [ctPortrait]),
	('raymond_van_mil', 3, None, [ctPortrait]),
	('peter_orre', 1, None, [ctPortrait, ctFashion]),
	('peter_orre', 2, None, [ctFashion]),
	('peter_orre', 3, None, [ctFashion]),
	#('eduard_de_kam', 1, None, [ctPortrait]),
	#('peter_orre', 4, None, [ctFashion]),
	#('m_van_haaster', 1, None, [ctPortrait]),
	#('marieke_de_lorijn', 1, None, [ctFashion]),
]

def getTextKey (photoElement):
	if photoElement [plTextKey]:
		return photoElement [plTextKey]
	else:
		return photoElement [plPhotographerId]

textDict = {
	'charlona_teerlink': '''
		Photography: Charlona Teerlink
	''',
	'dirk_uebele': '''
		SMC book shoot
		Photography: Dirk Uebele
		Styling and mua: Alexander David Kern
	''',
	'edwin_van_wier': '''
		Photography: Edwin van Wier
	''',
	'eduard_de_kam': '''
		Photography: Eduard de Kam
	''',
	'eric_kellerman': '''
		Photography: Eric Kellerman
	''',
	'm_van_haaster': '''
		Photography: M. van Haaster
	''',
	'marieke_de_lorijn': '''
		Photography: Marieke de Lorijn
	''',
	'pascale_hustings': '''
		Photography: Pascale Hustings
		Mua: Soraya Bermudez
		Hair: Najwah Kohistani
		Styling: Harmke Ebbers
	''',
	'peter_nientied': '''
		Photography: Peter Nientied
	''',
	'peter_orre': '''
		Photography: Peter Orré
	''',
	'raymond_van_mil': '''
		Photography: Raymond van Mil
	''',
	'stefan_witte': '''
		PF Magazine
		Photography: Stefan Witte
		Make-up and hair: La Rouge Visagie
	''',
}
