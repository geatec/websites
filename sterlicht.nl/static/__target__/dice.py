import random as rd

charNames = (
    'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu',
    'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega'
)

lowerChars = {charName: '&' + charName + ';' for charName in charNames}
upperChars = {charName.capitalize (): '&' + charName.capitalize () + ';' for charName in charNames}

questionsByAnswer = lowerChars

nrOfDice = 6
correctAnswerIndexIndex = 0
questionIndexIndex = nrOfDice - 1   # At end, shuffled only first time

class Dice:
    def __init__ (self):
        document.body.addEventListener ('touchstart', lambda event: event.preventDefault ())
        document.body.addEventListener ('mousedown', lambda event: event.preventDefault ())
        document.body.style.margin = 0
        document.body.style.overflow = 'hidden';
    
        self.all = document.createElement ('div')
        self.all.style.color = 'white'
        self.all.style.backgroundColor = 'black'
        self.all.style.height = '100%'
        self.all.style.width = '100%'
        self.all.style.padding = 0
        self.all.style.margin = 0
        document.body.appendChild (self.all)
        
        self.dices = []
        for diceIndex in range (nrOfDice):
            dice = document.createElement ('div')
            
            dice.style.position = 'absolute'
            dice.addEventListener ('touchstart', (lambda aDice: lambda: self.attempt (aDice)) (dice))  # Returns parameterless inner lambda
            dice.addEventListener ('mousedown', (lambda aDice: lambda: self.attempt (aDice)) (dice))
            self.dices.append (dice)
            self.all.appendChild (dice)
            
            dice.inner = document.createElement ('div')
            dice.inner.setAttribute ('unselectable', 'on')
            dice.inner.style.fontWeight = 'bold'
            dice.inner.style.textAlign = 'center'
            dice.inner.style.position = 'absolute'
            dice.appendChild (dice.inner)
                        
        self.diceIndices = list (range (nrOfDice))
        rd.shuffle (self.diceIndices)    # First is correct answer, last is question
        
        self.banner = document.createElement ('div')
        self.banner.style.position = 'absolute'
        self.banner.style.cursor = 'pointer'
        self.banner.addEventListener ('touchstart', self.gotoTranscryptSite)
        self.banner.addEventListener ('mousedown', self.gotoTranscryptSite)
        self.banner.style.fontFamily = 'arial'
        self.banner.innerHTML = (
            '<span id="bannerLarge"><font color="777777">www.<b><i>' +
            '<font color="ff4422">T<font color="ffb000">r<font color="228822">a<font color="3366ff">n' +
            '<font color="ff4422">s<font color="ffb000">c<font color="228822">r<font color="3366ff">y<font color="ffb000">p<font color="228822">t' +
            '</i></b><font color="777777">.org<font size={}><font color="cccccc"></span>' +
            '<span id="bannerSmall"><i> Write your apps in Python for free!</i></span>'
        )
        self.all.appendChild (self.banner)

        self.bannerLarge = document.getElementById ('bannerLarge')
        self.bannerSmall = document.getElementById ('bannerSmall')
        
        self.rollAudio = __new__ (Audio ('roll.mp3'))
        self.failAudio = __new__ (Audio ('fail.mp3'))
        
        window.onresize = self.rightSize
        self.attempt (self.dices [self.diceIndices [correctAnswerIndexIndex]], True)
        
    def gotoTranscryptSite (self):
        document.location.href = 'http://www.transcrypt.org'
        
    def attempt (self, dice, initialize = False):
        # Correct answer selected by user
        if self.dices.index (dice) == self.diceIndices [0]:
            #Start audio a.s.a.p. as it determines attainable playing speed
            if not initialize:
                self.rollAudio.play ()

            # Shuffle all QA pairs
            answerQuestionPairs = questionsByAnswer.items ()
            rd.shuffle (answerQuestionPairs)
            
            # Dice index of new question gets value of dice index of old answer, swap to keep all indices
            self.diceIndices [questionIndexIndex], self.diceIndices [correctAnswerIndexIndex] = (
                self.diceIndices [correctAnswerIndexIndex], self.diceIndices [questionIndexIndex]
            )
            
            # Shuffle all indices except the index of the new question, the first one will be the index of the new answer
            temp = self.diceIndices [:questionIndexIndex]
            rd.shuffle (temp)
            self.diceIndices [:questionIndexIndex] = temp
            
            # Adapt locations of inner divs and fontsize
            self.rightSize ()
            
            # Place new question
            self.dices [self.diceIndices [questionIndexIndex]] .style.backgroundColor = 'green'        
            self.dices [self.diceIndices [questionIndexIndex]] .inner.innerHTML = answerQuestionPairs [correctAnswerIndexIndex][1]
            
            # Place new answers           
            for diceIndexIndex, diceIndex in enumerate (self.diceIndices [:questionIndexIndex]):
                self.roll (self.dices [diceIndex], answerQuestionPairs [diceIndexIndex][0])                
                    
        # Wrong answer selected by user
        elif self.dices.index (dice) != self.diceIndices [questionIndexIndex]:  # Not the question...
            self.failAudio.play ()
           
            def restoreColor ():
                dice.style.backgroundColor = 'blue'
                
            dice.style.backgroundColor = 'red'
            setTimeout (restoreColor, 500)
        
    def roll (self, dice, targetLabel):
        frameIndex = 10
        
        def frame ():
            nonlocal frameIndex
            frameIndex -= 1
            
            if frameIndex:
                dice.style.color = rd.choice (('red', 'green', 'blue', 'yellow'))
                dice.inner.innerHTML = questionsByAnswer.keys () [rd.randint (0, len (questionsByAnswer) - 1)]
                setTimeout (frame, 100)
            else:
                dice.style.color = 'white'
                dice.inner.innerHTML = targetLabel
        
        dice.style.backgroundColor = 'blue'     
        frame ()
    
    def rightSize (self):
        self.pageWidth = window.innerWidth
        self.pageHeight = window.innerHeight
        portrait = self.pageHeight > self.pageWidth
        
        for diceIndex, dice in enumerate (self.dices):
            wordLength = 1 if diceIndex == self.diceIndices [questionIndexIndex] else 4
        
            if self.pageHeight > self.pageWidth:    # Portrait
                dice.style.height = 0.3 * self.pageHeight
                dice.style.width = 0.4 * self.pageWidth
                dice.style.top = (0.03 + (diceIndex if diceIndex < 3 else diceIndex - 3) * 0.32) * self.pageHeight
                dice.style.left = (0.06 if diceIndex < 3 else 0.54) * self.pageWidth
                
                self.charBoxSide = 0.25  * self.pageHeight / wordLength
                dice.inner.style.top = 0.15 * self.pageHeight - 0.6 * self.charBoxSide
                dice.inner.style.left = 0.2 * self.pageWidth - 0.5  * wordLength * self.charBoxSide

                self.banner.style.top = 0.975 * self.pageHeight
                self.banner.style.left = 0.06 * self.pageWidth              
                self.bannerLarge.style.fontSize = 0.017 * self.pageHeight
                self.bannerSmall.style.fontSize = 0.014 * self.pageHeight
            else:                                   # Landscape
                dice.style.height = 0.4 * self.pageHeight
                dice.style.width = 0.3 * self.pageWidth
                dice.style.top = (0.06 if diceIndex < 3 else 0.54) * self.pageHeight
                dice.style.left = (0.03 + (diceIndex if diceIndex < 3 else diceIndex - 3) * 0.32) * self.pageWidth
                
                self.charBoxSide = 0.3 * self.pageHeight / wordLength
                dice.inner.style.top = 0.2 * self.pageHeight - 0.6 * self.charBoxSide
                dice.inner.style.left = 0.15 * self.pageWidth - 0.5 * wordLength * self.charBoxSide
                
                self.banner.style.top = 0.95 * self.pageHeight
                self.banner.style.left = 0.03 * self.pageWidth
                self.bannerLarge.style.fontSize = 0.015 * self.pageWidth
                self.bannerSmall.style.fontSize = 0.012 * self.pageWidth

            dice.inner.style.height = self.charBoxSide
            dice.inner.style.width = self.charBoxSide
            dice.inner.style.fontSize = self.charBoxSide
            
dice = Dice ()
