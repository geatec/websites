// Transcrypt'ed from Python, 2019-08-27 18:12:47
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import * as rd from './random.js';
var __name__ = '__main__';
export var charNames = tuple (['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega']);
export var lowerChars = (function () {
	var __accu0__ = [];
	for (var charName of charNames) {
		__accu0__.append ([charName, ('&' + charName) + ';']);
	}
	return dict (__accu0__);
}) ();
export var upperChars = (function () {
	var __accu0__ = [];
	for (var charName of charNames) {
		__accu0__.append ([charName.capitalize (), ('&' + charName.capitalize ()) + ';']);
	}
	return dict (__accu0__);
}) ();
export var questionsByAnswer = dict ();
export var nrOfDice = 6;
export var correctAnswerIndexIndex = 0;
export var questionIndexIndex = nrOfDice - 1;
export var safari = __in__ ('safari', navigator.userAgent.lower ()) && __in__ ('apple', navigator.vendor.lower ());
export var Dice =  __class__ ('Dice', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		document.body.addEventListener ('touchstart', (function __lambda__ (event) {
			return event.preventDefault ();
		}));
		document.body.addEventListener ('mousedown', (function __lambda__ (event) {
			return event.preventDefault ();
		}));
		document.body.style.margin = 0;
		document.body.style.overflow = 'hidden';
		self.all = document.createElement ('div');
		self.all.style.color = 'white';
		self.all.style.backgroundColor = 'black';
		self.all.style.height = '100%';
		self.all.style.width = '100%';
		self.all.style.padding = 0;
		self.all.style.margin = 0;
		document.body.appendChild (self.all);
		self.dices = [];
		for (var diceIndex = 0; diceIndex < nrOfDice; diceIndex++) {
			var dice = document.createElement ('div');
			dice.style.position = 'absolute';
			dice.addEventListener ('touchstart', (function __lambda__ (aDice) {
				return (function __lambda__ () {
					return self.attempt (aDice);
				});
			}) (dice));
			dice.addEventListener ('mousedown', (function __lambda__ (aDice) {
				return (function __lambda__ () {
					return self.attempt (aDice);
				});
			}) (dice));
			self.dices.append (dice);
			self.all.appendChild (dice);
			dice.inner = document.createElement ('div');
			dice.inner.setAttribute ('unselectable', 'on');
			dice.inner.style.fontWeight = 'bold';
			dice.inner.style.textAlign = 'center';
			dice.inner.style.position = 'absolute';
			dice.appendChild (dice.inner);
		}
		self.diceIndices = list (range (nrOfDice));
		rd.shuffle (self.diceIndices);
		self.banner = document.createElement ('div');
		self.banner.style.position = 'absolute';
		self.banner.style.cursor = 'pointer';
		self.banner.addEventListener ('touchstart', self.gotoTranscryptSite);
		self.banner.addEventListener ('mousedown', self.gotoTranscryptSite);
		self.banner.style.fontFamily = 'arial';
		self.banner.innerHTML = ((('<span id="bannerLarge"><font color="777777">www.<b><i>' + '<font color="ff4422">T<font color="ffb000">r<font color="228822">a<font color="3366ff">n') + '<font color="ff4422">s<font color="ffb000">c<font color="228822">r<font color="3366ff">y<font color="ffb000">p<font color="228822">t') + '</i></b><font color="777777">.org<font size={}><font color="cccccc"></span>') + '<span id="bannerSmall"><i> Write your apps in Python for free!</i></span>';
		self.all.appendChild (self.banner);
		self.bannerLarge = document.getElementById ('bannerLarge');
		self.bannerSmall = document.getElementById ('bannerSmall');
		self.rollAudio = new Audio ('roll.mp3');
		self.failAudio = new Audio ('fail.mp3');
		window.onresize = self.rightSize;
		self.attempt (self.dices [self.diceIndices [correctAnswerIndexIndex]], true);
	});},
	get gotoTranscryptSite () {return __get__ (this, function (self) {
		document.location.href = 'http://www.transcrypt.org';
	});},
	get attempt () {return __get__ (this, function (self, dice, initialize) {
		if (typeof initialize == 'undefined' || (initialize != null && initialize.hasOwnProperty ("__kwargtrans__"))) {;
			var initialize = false;
		};
		if (self.dices.index (dice) == self.diceIndices [0]) {
			if (!(initialize)) {
				if (safari) {
					self.rollAudio.load ();
				}
				self.rollAudio.play ();
			}
			var answerQuestionPairs = questionsByAnswer.py_items ();
			rd.shuffle (answerQuestionPairs);
			var __left0__ = tuple ([self.diceIndices [correctAnswerIndexIndex], self.diceIndices [questionIndexIndex]]);
			self.diceIndices [questionIndexIndex] = __left0__ [0];
			self.diceIndices [correctAnswerIndexIndex] = __left0__ [1];
			var temp = self.diceIndices.__getslice__ (0, questionIndexIndex, 1);
			rd.shuffle (temp);
			self.diceIndices.__setslice__ (0, questionIndexIndex, null, temp);
			self.rightSize ();
			self.dices [self.diceIndices [questionIndexIndex]].style.backgroundColor = 'green';
			self.dices [self.diceIndices [questionIndexIndex]].inner.innerHTML = answerQuestionPairs [correctAnswerIndexIndex] [1];
			for (var [diceIndexIndex, diceIndex] of enumerate (self.diceIndices.__getslice__ (0, questionIndexIndex, 1))) {
				self.roll (self.dices [diceIndex], answerQuestionPairs [diceIndexIndex] [0]);
			}
		}
		else if (self.dices.index (dice) != self.diceIndices [questionIndexIndex]) {
			if (safari) {
				self.failAudio.load ();
			}
			self.failAudio.play ();
			var restoreColor = function () {
				dice.style.backgroundColor = 'blue';
			};
			dice.style.backgroundColor = 'red';
			setTimeout (restoreColor, 500);
		}
	});},
	get roll () {return __get__ (this, function (self, dice, targetLabel) {
		var frameIndex = 10;
		var frame = function () {
			frameIndex--;
			if (frameIndex) {
				dice.style.color = rd.choice (tuple (['red', 'green', 'blue', 'yellow']));
				dice.inner.innerHTML = questionsByAnswer.py_keys () [rd.randint (0, len (questionsByAnswer) - 1)];
				setTimeout (frame, 100);
			}
			else {
				dice.style.color = 'white';
				dice.inner.innerHTML = targetLabel;
			}
		};
		dice.style.backgroundColor = 'blue';
		frame ();
	});},
	get rightSize () {return __get__ (this, function (self) {
		self.pageWidth = window.innerWidth;
		self.pageHeight = window.innerHeight;
		var portrait = self.pageHeight > self.pageWidth;
		for (var [diceIndex, dice] of enumerate (self.dices)) {
			var wordLength = (diceIndex == self.diceIndices [questionIndexIndex] ? 1 : 5);
			if (self.pageHeight > self.pageWidth) {
				dice.style.height = 0.3 * self.pageHeight;
				dice.style.width = 0.4 * self.pageWidth;
				dice.style.top = (0.03 + (diceIndex < 3 ? diceIndex : diceIndex - 3) * 0.32) * self.pageHeight;
				dice.style.left = (diceIndex < 3 ? 0.06 : 0.54) * self.pageWidth;
				self.charBoxSide = (0.2 * self.pageHeight) / wordLength;
				dice.inner.style.top = 0.15 * self.pageHeight - 0.6 * self.charBoxSide;
				dice.inner.style.left = 0.2 * self.pageWidth - (0.5 * wordLength) * self.charBoxSide;
				self.banner.style.top = 0.975 * self.pageHeight;
				self.banner.style.left = 0.06 * self.pageWidth;
				self.bannerLarge.style.fontSize = 0.017 * self.pageHeight;
				self.bannerSmall.style.fontSize = 0.014 * self.pageHeight;
			}
			else {
				dice.style.height = 0.4 * self.pageHeight;
				dice.style.width = 0.3 * self.pageWidth;
				dice.style.top = (diceIndex < 3 ? 0.06 : 0.54) * self.pageHeight;
				dice.style.left = (0.03 + (diceIndex < 3 ? diceIndex : diceIndex - 3) * 0.32) * self.pageWidth;
				self.charBoxSide = (0.25 * self.pageHeight) / wordLength;
				dice.inner.style.top = 0.2 * self.pageHeight - 0.6 * self.charBoxSide;
				dice.inner.style.left = 0.15 * self.pageWidth - (0.5 * wordLength) * self.charBoxSide;
				self.banner.style.top = 0.95 * self.pageHeight;
				self.banner.style.left = 0.03 * self.pageWidth;
				self.bannerLarge.style.fontSize = 0.015 * self.pageWidth;
				self.bannerSmall.style.fontSize = 0.012 * self.pageWidth;
			}
			dice.inner.style.height = self.charBoxSide;
			dice.inner.style.width = self.charBoxSide;
			dice.inner.style.fontSize = self.charBoxSide;
		}
	});}
});
export var setMode = function (mode) {
	if (mode == 'lower') {
		questionsByAnswer.py_update (lowerChars);
	}
	else if (mode == 'upper') {
		questionsByAnswer.py_update (upperChars);
	}
	else {
		questionsByAnswer.py_update (lowerChars);
		questionsByAnswer.py_update (upperChars);
	}
	var dice = Dice ();
};

//# sourceMappingURL=dice.map