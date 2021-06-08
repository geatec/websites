from base import *

class All:
    def __init__ (self, subjectName):   
        self.subjectName = subjectName
        self.subjectNames = ['home', 'documentation', 'examples', 'download', 'contribute', 'gallery']
        
        # The logo has menu index -1, the regular menu buttons start at 0
        self.menuIndex = self.subjectNames.index (self.subjectName) - 1
        
        self.landscapeButtonTexts = ['DOCUMENTATION', 'SAMPLE CODE', 'DOWNLOAD', 'PARTICIPATE', 'GALLERY']
        self.portraitButtonTexts = ['DOCS', 'SAMPLES', 'GET IT', 'JOIN', 'GALLERY']
        
        __pragma__ ('js', '{}', '''
            self.retina = navigator.userAgent.match (/iPhone|iPad|iPod|Android/i) != null;
            self.safari = /^((?!Chrome|Android|CriOS).)*Safari/i.test(navigator.userAgent);
        ''')
        
        if self.retina and not self.safari:
            self.initialDevicePixelRatio = window.devicePixelRatio  # Needed to determine zoom factor on iPhone in non-safari browser
            
        self.accessibilityZoomThreshold = 1.3
    
        # Find general
        
        self.all = document.querySelector ('*')
        self.body = document.querySelector ('body')
        self.html = document.querySelector ('html')     
        self.lanes = list (document.querySelectorAll ('.lane'))
    
        # Find fixed
        
        self.fixed = document.querySelector ('.fixed')
        
        self.logoBar = document.querySelector ('.fixed .logo-bar')
        self.logo = document.querySelector ('.fixed .logo')
        self.logoImage = document.querySelector ('.fixed .logo img')
        self.logoTitle = document.querySelector ('.fixed .logo .title')
        self.logoTitleSpans = list (document.querySelectorAll ('.fixed .logo .title span'))
        self.logoSubtitle = document.querySelector ('.fixed .logo .subtitle')
        self.forkMe = document.querySelector ('.fixed .fork-me')
        
        self.menuBar = document.querySelector ('.fixed .menu-bar')
        self.buttons = list (document.querySelectorAll ('.fixed .menu-bar .button'))
        self.buttonTexts = list (document.querySelectorAll ('.fixed .menu-bar .button .text'))
        
        # Find moving
        
        self.moving = document.querySelector ('.moving')
        self.movingTargets = list (document.querySelectorAll ('.moving .target'))
        
        if self.subjectName == 'home':
            self.splash = document.querySelector ('.moving .splash')
            self.announcementBar = document.querySelector ('.moving .announcement-bar')
            self.panorama = document.querySelector ('.moving .panorama')
            self.slogan = document.querySelector ('.moving .panorama .slogan')
            self.summaryDivs = list (document.querySelectorAll ('.moving .summary div'))
        
        self.prompt = document.querySelector ('.moving .footer .prompt')
        self.share =  document.querySelector ('.moving .footer .share')
        
        # End fouc prevention
        
        self.html.style.visibility = 'visible'

        # Connect and set size
        
        self.onResize (self, True)
        window.onresize = lambda event: (self.onResize ())
        window.onscroll = lambda event: (self.onResize ())  # Needed for iPhone, since size changes silently when scolling
        
        # Connect logo
        
        self.logo.onclick = lambda: self.onPressButton (-1)
        
        # Connect and color buttons
        
        for index, button in enumerate (self.buttons):
            button.onmouseover = (lambda i: lambda: self.onHoverButton (i, True)) (index)
            button.onmouseout = (lambda i: lambda: self.onHoverButton (i, False)) (index)
            button.onclick = (lambda i: lambda: self.onPressButton (i)) (index)
            button.style.backgroundColor = middleGray if index == self.menuIndex else 'transparent'
            
        # Load listings
        
        for editMode in ['htmlmixed', 'python', 'javascript']:
            for code in list (document.querySelectorAll ('.code' '.{}'.format (editMode))):
                editor = CodeMirror.fromTextArea (code, {
                    'mode': {
                        'name': editMode,
                        'version': 3,
                        'singleLineStringErrors': False
                    },
                    'lineWrapping': True,
                    'readOnly': True
                })
                
                charWidth = editor.defaultCharWidth()
                
                def renderLine (cm, line, elt):
                    nonlocal charWidth;
                    off = CodeMirror.countColumn (line.text, null, cm.getOption ('tabSize')) * charWidth
                    elt.style.textIndent = '-' + off + 'px'
                    elt.style.paddingLeft = (4 + off) + 'px'                
                    
                editor.on ('renderLine', renderLine)
                
                editor.setValue (indent (decodeTags (code.innerHTML)))
                # editor.refresh () # Not needed with read-only content
                  
    def getZoomFactor (self):
        if self.retina:
            if self.safari: # Smaller window should not lead to smaller text, since it means zooming
                            # When zooming in, clientWidth stays same, innerWidth gets smaller
                result = document.body.clientWidth / window.innerWidth
            else:           # Normal browser behavior, no changing innerWindow
                            # But there's an initialDevicePixelRatio to reckon with
                result = window.devicePixelRatio / self.initialDevicePixelRatio    
        else:               # Smaller window should lead to smaller text
                            # Don't use initialDevicePixelRatio, because an initial zoom should not be seen as 100%
            result = window.devicePixelRatio
            
        return min (result, 3)
                            
    def onResize (self, initial):    
        self.windowWidth = window.innerWidth
        self.windowHeight = window.innerHeight
        self.windowArea = Math.sqrt (self.windowHeight * self.windowWidth)
        
        if initial:
            self.initialWindowArea = self.windowArea
        
        try:
            self.oldLandscape = self.landscape
        except:
            pass
        self.landscape = self.windowWidth > self.windowHeight
                
        try:
            self.oldZoomFactor = self.zoomFactor
        except:
            pass
        self.zoomFactor = self.getZoomFactor ()
        
        try:
            self.oldWideLaneInLandscape = self.wideLaneInLandscape
        except:
            pass
        self.wideLaneInLandscape = self.zoomFactor > self.accessibilityZoomThreshold or self.retina
       
        if (
            initial or
            self.landscape != self.oldLandcape or
            self.zoomFactor != self.oldZoomFactor or
            self.wideLaneInLandscape != self.oldWideLaneInLandscape
        ):
            self.reorient ()
            
            self.oldLandscape = self.landscape
            self.oldZoomFactor = self.zoomFactor
            self.oldWideLaneInLandscape = self.wideLaneInLandscape
    
        # All
        
        if self.retina:
            if self.safari:
                self.allFontSize = 1.3 * self.zoomFactor * (0.014 if self.landscape else 0.025) * self.windowArea    
            else:
                self.allFontSize = 1.3 * self.zoomFactor * (0.025 if self.landscape else 0.025) * self.initialWindowArea
        else:
            self.allFontSize = self.zoomFactor * (0.014 if self.landscape else 0.025) * self.windowArea
            
        self.all.style.fontSize = self.allFontSize
        
        # Fixed
    
        logoBarHeightFraction = 0.1
        menuBarHeightFraction = 0.025 + self.zoomFactor * 0.025
        fixedHeightFraction = logoBarHeightFraction + menuBarHeightFraction
        
        self.fixed.style.height = fixedHeightFraction * self.windowHeight
        # self.fixed.innerHTML = '{} - {} - {}'.format (self.initialWindowArea, self.zoomFactor, self.allFontSize)
        
        self.logoBar.style.height = logoBarHeightFraction * self.windowHeight
        
        self.logo.style.top = 0.01 * self.windowHeight
        
        self.logoImage.style.width = 0.08 * self.windowHeight
        self.logoImage.style.height = 0.08 * self.windowHeight
                
        self.logoTitle.style.left = 0.08 * self.windowHeight 
        self.logoTitle.style.top = -0.01 * self.windowHeight
        self.logoTitle.style.fontSize = 0.06 * self.windowHeight
        
        for logoTitleSpan in self.logoTitleSpans:
            logoTitleSpan.style.marginRight = -0.02 * self.windowHeight

        self.logoSubtitle.style.left = 0.09 * self.windowHeight 
        self.logoSubtitle.style.top = 0.055 * self.windowHeight 
        self.logoSubtitle.style.fontSize = 0.021 * self.windowHeight
        
        self.menuBar.style.height = menuBarHeightFraction * self.windowHeight
        menuBarFontSize = min (self.allFontSize, (0.1 if self.retina and self.safari else 0.05) * self.windowWidth, 0.04 * self.windowHeight)
        self.menuBar.style.fontSize = menuBarFontSize

        # Moving
        
        self.moving.style.top = fixedHeightFraction * self.windowHeight
        
        for movingTarget in self.movingTargets:
            movingTarget.style.top = -fixedHeightFraction * self.windowHeight
        
        if self.subjectName == 'home':
            self.splash.style.minHeight = 0.85 * self.windowHeight
            # self.announcementBar.style.height = (0.04 + (self.zoomFactor - 1) * 0.12) * self.windowHeight
            self.panorama.style.height = 0.35 * self.windowHeight
            self.slogan.style.fontSize = min (2 * self.allFontSize, 0.09 * self.windowHeight)
            
            for summaryDiv in self.summaryDivs:
                summaryDiv.style.float = 'left' if self.landscape else 'top'
                summaryDiv.style.width =  '29%' if self.landscape else '95%'
            
    def reorient (self):
        # All
        
        if self.landscape and not self.wideLaneInLandscape:
            for lane in self.lanes:
                lane.style.width = '60%'
                lane.style.paddingLeft = '20%'
                lane.style.paddingRight = '20%'
                
            self.forkMe.style.visibility = 'visible' if self.windowHeight > 700 else 'hidden'

            for index, buttonText in enumerate (self.buttonTexts):
                buttonText.innerHTML = self.landscapeButtonTexts [index] 
        
            self.prompt.style.left = 0
            self.prompt.style.top = 20

            self.share.style.left = None
            self.share.style.right = 0
            self.share.style.top = 20
        else:
            for lane in self.lanes:
                lane.style.width = '94%'
                lane.style.paddingLeft = '3%'
                lane.style.paddingRight = '3%'
                
            self.forkMe.style.visibility = 'hidden'

            for index, buttonText in enumerate (self.buttonTexts):
                buttonText.innerHTML = self.portraitButtonTexts [index]
                
            self.prompt.style.left = 0
            self.prompt.style.top = 20
            
            self.share.style.left = 0
            self.share.style.right = None
            self.share.style.top = 50
        
    def onHoverButton (self, menuIndex, state):
        if menuIndex != self.menuIndex:
            self.buttons [menuIndex] .style.backgroundColor = lightGray if state else 'transparent'
            
    def onPressButton (self, menuIndex):
        self.menuIndex = menuIndex
        window.location.href = self.subjectNames [self.menuIndex + 1]   # Negative index means home page
        