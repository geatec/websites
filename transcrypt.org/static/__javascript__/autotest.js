"use strict";
// Transcrypt'ed from Python, 2017-07-07 17:17:29
function autotest () {
   var __symbols__ = ['__complex__', '__py3.6__', '__esv6__'];
    var __all__ = {};
    var __world__ = __all__;
    
    // Nested object creator, part of the nesting may already exist and have attributes
    var __nest__ = function (headObject, tailNames, value) {
        // In some cases this will be a global object, e.g. 'window'
        var current = headObject;
        
        if (tailNames != '') {  // Split on empty string doesn't give empty list
            // Find the last already created object in tailNames
            var tailChain = tailNames.split ('.');
            var firstNewIndex = tailChain.length;
            for (var index = 0; index < tailChain.length; index++) {
                if (!current.hasOwnProperty (tailChain [index])) {
                    firstNewIndex = index;
                    break;
                }
                current = current [tailChain [index]];
            }
            
            // Create the rest of the objects, if any
            for (var index = firstNewIndex; index < tailChain.length; index++) {
                current [tailChain [index]] = {};
                current = current [tailChain [index]];
            }
        }
        
        // Insert it new attributes, it may have been created earlier and have other attributes
        for (var attrib in value) {
            current [attrib] = value [attrib];          
        }       
    };
    __all__.__nest__ = __nest__;
    
    // Initialize module if not yet done and return its globals
    var __init__ = function (module) {
        if (!module.__inited__) {
            module.__all__.__init__ (module.__all__);
            module.__inited__ = true;
        }
        return module.__all__;
    };
    __all__.__init__ = __init__;
    
    
    // Proxy switch, controlled by __pragma__ ('proxy') and __pragma ('noproxy')
    var __proxy__ = false;  // No use assigning it to __all__, only its transient state is important
    
    
    // Since we want to assign functions, a = b.f should make b.f produce a bound function
    // So __get__ should be called by a property rather then a function
    // Factory __get__ creates one of three curried functions for func
    // Which one is produced depends on what's to the left of the dot of the corresponding JavaScript property
    var __get__ = function (self, func, quotedFuncName) {
        if (self) {
            if (self.hasOwnProperty ('__class__') || typeof self == 'string' || self instanceof String) {           // Object before the dot
                if (quotedFuncName) {                                   // Memoize call since fcall is on, by installing bound function in instance
                    Object.defineProperty (self, quotedFuncName, {      // Will override the non-own property, next time it will be called directly
                        value: function () {                            // So next time just call curry function that calls function
                            var args = [] .slice.apply (arguments);
                            return func.apply (null, [self] .concat (args));
                        },              
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                }
                return function () {                                    // Return bound function, code dupplication for efficiency if no memoizing
                    var args = [] .slice.apply (arguments);             // So multilayer search prototype, apply __get__, call curry func that calls func
                    return func.apply (null, [self] .concat (args));
                };
            }
            else {                                                      // Class before the dot
                return func;                                            // Return static method
            }
        }
        else {                                                          // Nothing before the dot
            return func;                                                // Return free function
        }
    }
    __all__.__get__ = __get__;
        
    // Mother of all metaclasses        
    var py_metatype = {
        __name__: 'type',
        __bases__: [],
        
        // Overridable class creation worker
        __new__: function (meta, name, bases, attribs) {
            // Create the class cls, a functor, which the class creator function will return
            var cls = function () {                     // If cls is called with arg0, arg1, etc, it calls its __new__ method with [arg0, arg1, etc]
                var args = [] .slice.apply (arguments); // It has a __new__ method, not yet but at call time, since it is copied from the parent in the loop below
                return cls.__new__ (args);              // Each Python class directly or indirectly derives from object, which has the __new__ method
            };                                          // If there are no bases in the Python source, the compiler generates [object] for this parameter
            
            // Copy all methods, including __new__, properties and static attributes from base classes to new cls object
            // The new class object will simply be the prototype of its instances
            // JavaScript prototypical single inheritance will do here, since any object has only one class
            // This has nothing to do with Python multiple inheritance, that is implemented explictly in the copy loop below
            for (var index = bases.length - 1; index >= 0; index--) {   // Reversed order, since class vars of first base should win
                var base = bases [index];
                for (var attrib in base) {
                    var descrip = Object.getOwnPropertyDescriptor (base, attrib);
                    Object.defineProperty (cls, attrib, descrip);
                }           

                for (var symbol of Object.getOwnPropertySymbols (base)) {
                    var descrip = Object.getOwnPropertyDescriptor (base, symbol);
                    Object.defineProperty (cls, symbol, descrip);
                }
                
            }
            
            // Add class specific attributes to the created cls object
            cls.__metaclass__ = meta;
            cls.__name__ = name;
            cls.__bases__ = bases;
            
            // Add own methods, properties and own static attributes to the created cls object
            for (var attrib in attribs) {
                var descrip = Object.getOwnPropertyDescriptor (attribs, attrib);
                Object.defineProperty (cls, attrib, descrip);
            }

            for (var symbol of Object.getOwnPropertySymbols (attribs)) {
                var descrip = Object.getOwnPropertyDescriptor (attribs, symbol);
                Object.defineProperty (cls, symbol, descrip);
            }
            
            // Return created cls object
            return cls;
        }
    };
    py_metatype.__metaclass__ = py_metatype;
    __all__.py_metatype = py_metatype;
    
    // Mother of all classes
    var object = {
        __init__: function (self) {},
        
        __metaclass__: py_metatype, // By default, all classes have metaclass type, since they derive from object
        __name__: 'object',
        __bases__: [],
            
        // Object creator function, is inherited by all classes (so could be global)
        __new__: function (args) {  // Args are just the constructor args       
            // In JavaScript the Python class is the prototype of the Python object
            // In this way methods and static attributes will be available both with a class and an object before the dot
            // The descriptor produced by __get__ will return the right method flavor
            var instance = Object.create (this, {__class__: {value: this, enumerable: true}});
            
            if ('__getattr__' in this || '__setattr__' in this) {
                instance = new Proxy (instance, {
                    get: function (target, name) {
                        var result = target [name];
                        if (result == undefined) {  // Target doesn't have attribute named name
                            return target.__getattr__ (name);
                        }
                        else {
                            return result;
                        }
                    },
                    set: function (target, name, value) {
                        try {
                            target.__setattr__ (name, value);
                        }
                        catch (exception) {         // Target doesn't have a __setattr__ method
                            target [name] = value;
                        }
                        return true;
                    }
                })
            }

            // Call constructor
            this.__init__.apply (null, [instance] .concat (args));

            // Return constructed instance
            return instance;
        }   
    };
    __all__.object = object;
    
    // Class creator facade function, calls class creation worker
    var __class__ = function (name, bases, attribs, meta) {         // Parameter meta is optional
        if (meta == undefined) {
            meta = bases [0] .__metaclass__;
        }
                
        return meta.__new__ (meta, name, bases, attribs);
    }
    __all__.__class__ = __class__;
    
    // Define __pragma__ to preserve '<all>' and '</all>', since it's never generated as a function, must be done early, so here
    var __pragma__ = function () {};
    __all__.__pragma__ = __pragma__;
    
    	__nest__ (
		__all__,
		'org.transcrypt.__base__', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var __Envir__ = __class__ ('__Envir__', [object], {
						get __init__ () {return __get__ (this, function (self) {
							self.interpreter_name = 'python';
							self.transpiler_name = 'transcrypt';
							self.transpiler_version = '3.6.33';
							self.target_subdir = '__javascript__';
						});}
					});
					var __envir__ = __Envir__ ();
					__pragma__ ('<all>')
						__all__.__Envir__ = __Envir__;
						__all__.__envir__ = __envir__;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'org.transcrypt.__standard__', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var Exception = __class__ ('Exception', [object], {
						get __init__ () {return __get__ (this, function (self) {
							var kwargs = dict ();
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											case 'self': var self = __allkwargs0__ [__attrib0__]; break;
											default: kwargs [__attrib0__] = __allkwargs0__ [__attrib0__];
										}
									}
									delete kwargs.__kwargtrans__;
								}
								var args = tuple ([].slice.apply (arguments).slice (1, __ilastarg0__ + 1));
							}
							else {
								var args = tuple ();
							}
							self.__args__ = args;
							try {
								self.stack = kwargs.error.stack;
							}
							catch (__except0__) {
								self.stack = 'No stack trace available';
							}
						});},
						get __repr__ () {return __get__ (this, function (self) {
							if (len (self.__args__)) {
								return '{}{}'.format (self.__class__.__name__, repr (tuple (self.__args__)));
							}
							else {
								return '{}()'.format (self.__class__.__name__);
							}
						});},
						get __str__ () {return __get__ (this, function (self) {
							if (len (self.__args__) > 1) {
								return str (tuple (self.__args__));
							}
							else if (len (self.__args__)) {
								return str (self.__args__ [0]);
							}
							else {
								return '';
							}
						});}
					});
					var IterableError = __class__ ('IterableError', [Exception], {
						get __init__ () {return __get__ (this, function (self, error) {
							Exception.__init__ (self, "Can't iterate over non-iterable", __kwargtrans__ ({error: error}));
						});}
					});
					var StopIteration = __class__ ('StopIteration', [Exception], {
						get __init__ () {return __get__ (this, function (self, error) {
							Exception.__init__ (self, 'Iterator exhausted', __kwargtrans__ ({error: error}));
						});}
					});
					var ValueError = __class__ ('ValueError', [Exception], {
						get __init__ () {return __get__ (this, function (self, error) {
							Exception.__init__ (self, 'Erroneous value', __kwargtrans__ ({error: error}));
						});}
					});
					var KeyError = __class__ ('KeyError', [Exception], {
						get __init__ () {return __get__ (this, function (self, error) {
							Exception.__init__ (self, 'Invalid key', __kwargtrans__ ({error: error}));
						});}
					});
					var AssertionError = __class__ ('AssertionError', [Exception], {
						get __init__ () {return __get__ (this, function (self, message, error) {
							if (message) {
								Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
							}
							else {
								Exception.__init__ (self, __kwargtrans__ ({error: error}));
							}
						});}
					});
					var NotImplementedError = __class__ ('NotImplementedError', [Exception], {
						get __init__ () {return __get__ (this, function (self, message, error) {
							Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
						});}
					});
					var IndexError = __class__ ('IndexError', [Exception], {
						get __init__ () {return __get__ (this, function (self, message, error) {
							Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
						});}
					});
					var AttributeError = __class__ ('AttributeError', [Exception], {
						get __init__ () {return __get__ (this, function (self, message, error) {
							Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
						});}
					});
					var Warning = __class__ ('Warning', [Exception], {
					});
					var UserWarning = __class__ ('UserWarning', [Warning], {
					});
					var DeprecationWarning = __class__ ('DeprecationWarning', [Warning], {
					});
					var RuntimeWarning = __class__ ('RuntimeWarning', [Warning], {
					});
					var __sort__ = function (iterable, key, reverse) {
						if (typeof key == 'undefined' || (key != null && key .hasOwnProperty ("__kwargtrans__"))) {;
							var key = null;
						};
						if (typeof reverse == 'undefined' || (reverse != null && reverse .hasOwnProperty ("__kwargtrans__"))) {;
							var reverse = false;
						};
						if (arguments.length) {
							var __ilastarg0__ = arguments.length - 1;
							if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
								var __allkwargs0__ = arguments [__ilastarg0__--];
								for (var __attrib0__ in __allkwargs0__) {
									switch (__attrib0__) {
										case 'iterable': var iterable = __allkwargs0__ [__attrib0__]; break;
										case 'key': var key = __allkwargs0__ [__attrib0__]; break;
										case 'reverse': var reverse = __allkwargs0__ [__attrib0__]; break;
									}
								}
							}
						}
						else {
						}
						if (key) {
							iterable.sort ((function __lambda__ (a, b) {
								if (arguments.length) {
									var __ilastarg0__ = arguments.length - 1;
									if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
										var __allkwargs0__ = arguments [__ilastarg0__--];
										for (var __attrib0__ in __allkwargs0__) {
											switch (__attrib0__) {
												case 'a': var a = __allkwargs0__ [__attrib0__]; break;
												case 'b': var b = __allkwargs0__ [__attrib0__]; break;
											}
										}
									}
								}
								else {
								}
								return (key (a) > key (b) ? 1 : -(1));
							}));
						}
						else {
							iterable.sort ();
						}
						if (reverse) {
							iterable.reverse ();
						}
					};
					var sorted = function (iterable, key, reverse) {
						if (typeof key == 'undefined' || (key != null && key .hasOwnProperty ("__kwargtrans__"))) {;
							var key = null;
						};
						if (typeof reverse == 'undefined' || (reverse != null && reverse .hasOwnProperty ("__kwargtrans__"))) {;
							var reverse = false;
						};
						if (arguments.length) {
							var __ilastarg0__ = arguments.length - 1;
							if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
								var __allkwargs0__ = arguments [__ilastarg0__--];
								for (var __attrib0__ in __allkwargs0__) {
									switch (__attrib0__) {
										case 'iterable': var iterable = __allkwargs0__ [__attrib0__]; break;
										case 'key': var key = __allkwargs0__ [__attrib0__]; break;
										case 'reverse': var reverse = __allkwargs0__ [__attrib0__]; break;
									}
								}
							}
						}
						else {
						}
						if (py_typeof (iterable) == dict) {
							var result = copy (iterable.py_keys ());
						}
						else {
							var result = copy (iterable);
						}
						__sort__ (result, key, reverse);
						return result;
					};
					var map = function (func, iterable) {
						return function () {
							var __accu0__ = [];
							for (var item of iterable) {
								__accu0__.append (func (item));
							}
							return __accu0__;
						} ();
					};
					var filter = function (func, iterable) {
						if (func == null) {
							var func = bool;
						}
						return function () {
							var __accu0__ = [];
							for (var item of iterable) {
								if (func (item)) {
									__accu0__.append (item);
								}
							}
							return __accu0__;
						} ();
					};
					var complex = __class__ ('complex', [object], {
						get __init__ () {return __get__ (this, function (self, real, imag) {
							if (typeof imag == 'undefined' || (imag != null && imag .hasOwnProperty ("__kwargtrans__"))) {;
								var imag = null;
							};
							if (imag == null) {
								if (py_typeof (real) == complex) {
									self.real = real.real;
									self.imag = real.imag;
								}
								else {
									self.real = real;
									self.imag = 0;
								}
							}
							else {
								self.real = real;
								self.imag = imag;
							}
						});},
						get __neg__ () {return __get__ (this, function (self) {
							return complex (-(self.real), -(self.imag));
						});},
						get __exp__ () {return __get__ (this, function (self) {
							var modulus = Math.exp (self.real);
							return complex (modulus * Math.cos (self.imag), modulus * Math.sin (self.imag));
						});},
						get __log__ () {return __get__ (this, function (self) {
							return complex (Math.log (Math.sqrt (self.real * self.real + self.imag * self.imag)), Math.atan2 (self.imag, self.real));
						});},
						get __pow__ () {return __get__ (this, function (self, other) {
							return self.__log__ ().__mul__ (other).__exp__ ();
						});},
						get __rpow__ () {return __get__ (this, function (self, real) {
							return self.__mul__ (Math.log (real)).__exp__ ();
						});},
						get __mul__ () {return __get__ (this, function (self, other) {
							if (typeof other === 'number') {
								return complex (self.real * other, self.imag * other);
							}
							else {
								return complex (self.real * other.real - self.imag * other.imag, self.real * other.imag + self.imag * other.real);
							}
						});},
						get __rmul__ () {return __get__ (this, function (self, real) {
							return complex (self.real * real, self.imag * real);
						});},
						get __div__ () {return __get__ (this, function (self, other) {
							if (typeof other === 'number') {
								return complex (self.real / other, self.imag / other);
							}
							else {
								var denom = other.real * other.real + other.imag * other.imag;
								return complex ((self.real * other.real + self.imag * other.imag) / denom, (self.imag * other.real - self.real * other.imag) / denom);
							}
						});},
						get __rdiv__ () {return __get__ (this, function (self, real) {
							var denom = self.real * self.real;
							return complex ((real * self.real) / denom, (real * self.imag) / denom);
						});},
						get __add__ () {return __get__ (this, function (self, other) {
							if (typeof other === 'number') {
								return complex (self.real + other, self.imag);
							}
							else {
								return complex (self.real + other.real, self.imag + other.imag);
							}
						});},
						get __radd__ () {return __get__ (this, function (self, real) {
							return complex (self.real + real, self.imag);
						});},
						get __sub__ () {return __get__ (this, function (self, other) {
							if (typeof other === 'number') {
								return complex (self.real - other, self.imag);
							}
							else {
								return complex (self.real - other.real, self.imag - other.imag);
							}
						});},
						get __rsub__ () {return __get__ (this, function (self, real) {
							return complex (real - self.real, -(self.imag));
						});},
						get __repr__ () {return __get__ (this, function (self) {
							return '({}{}{}j)'.format (self.real, (self.imag >= 0 ? '+' : ''), self.imag);
						});},
						get __str__ () {return __get__ (this, function (self) {
							return __repr__ (self).__getslice__ (1, -(1), 1);
						});}
					});
					var __Terminal__ = __class__ ('__Terminal__', [object], {
						get __init__ () {return __get__ (this, function (self) {
							self.buffer = '';
							try {
								self.element = document.getElementById ('__terminal__');
							}
							catch (__except0__) {
								self.element = null;
							}
							if (self.element) {
								self.element.style.overflowX = 'auto';
								self.element.style.boxSizing = 'border-box';
								self.element.style.padding = '5px';
								self.element.innerHTML = '_';
							}
						});},
						get print () {return __get__ (this, function (self) {
							var sep = ' ';
							var end = '\n';
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											case 'self': var self = __allkwargs0__ [__attrib0__]; break;
											case 'sep': var sep = __allkwargs0__ [__attrib0__]; break;
											case 'end': var end = __allkwargs0__ [__attrib0__]; break;
										}
									}
								}
								var args = tuple ([].slice.apply (arguments).slice (1, __ilastarg0__ + 1));
							}
							else {
								var args = tuple ();
							}
							self.buffer = '{}{}{}'.format (self.buffer, sep.join (function () {
								var __accu0__ = [];
								for (var arg of args) {
									__accu0__.append (str (arg));
								}
								return __accu0__;
							} ()), end).__getslice__ (-(4096), null, 1);
							if (self.element) {
								self.element.innerHTML = self.buffer.py_replace ('\n', '<br>');
								self.element.scrollTop = self.element.scrollHeight;
							}
							else {
								console.log (sep.join (function () {
									var __accu0__ = [];
									for (var arg of args) {
										__accu0__.append (str (arg));
									}
									return __accu0__;
								} ()));
							}
						});},
						get input () {return __get__ (this, function (self, question) {
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											case 'self': var self = __allkwargs0__ [__attrib0__]; break;
											case 'question': var question = __allkwargs0__ [__attrib0__]; break;
										}
									}
								}
							}
							else {
							}
							self.print ('{}'.format (question), __kwargtrans__ ({end: ''}));
							var answer = window.prompt ('\n'.join (self.buffer.py_split ('\n').__getslice__ (-(16), null, 1)));
							self.print (answer);
							return answer;
						});}
					});
					var __terminal__ = __Terminal__ ();
					__pragma__ ('<all>')
						__all__.AssertionError = AssertionError;
						__all__.AttributeError = AttributeError;
						__all__.DeprecationWarning = DeprecationWarning;
						__all__.Exception = Exception;
						__all__.IndexError = IndexError;
						__all__.IterableError = IterableError;
						__all__.KeyError = KeyError;
						__all__.NotImplementedError = NotImplementedError;
						__all__.RuntimeWarning = RuntimeWarning;
						__all__.StopIteration = StopIteration;
						__all__.UserWarning = UserWarning;
						__all__.ValueError = ValueError;
						__all__.Warning = Warning;
						__all__.__Terminal__ = __Terminal__;
						__all__.__sort__ = __sort__;
						__all__.__terminal__ = __terminal__;
						__all__.complex = complex;
						__all__.filter = filter;
						__all__.map = map;
						__all__.sorted = sorted;
					__pragma__ ('</all>')
				}
			}
		}
	);
    var __call__ = function (/* <callee>, <this>, <params>* */) {   // Needed for __base__ and __standard__ if global 'opov' switch is on
        var args = [] .slice.apply (arguments);
        if (typeof args [0] == 'object' && '__call__' in args [0]) {        // Overloaded
            return args [0] .__call__ .apply (args [1], args.slice (2));
        }
        else {                                                              // Native
            return args [0] .apply (args [1], args.slice (2));
        }
    };
    __all__.__call__ = __call__;

    // Initialize non-nested modules __base__ and __standard__ and make its names available directly and via __all__
    // They can't do that itself, because they're regular Python modules
    // The compiler recognizes their names and generates them inline rather than nesting them
    // In this way it isn't needed to import them everywhere

    // __base__

    __nest__ (__all__, '', __init__ (__all__.org.transcrypt.__base__));
    var __envir__ = __all__.__envir__;

    // __standard__

    __nest__ (__all__, '', __init__ (__all__.org.transcrypt.__standard__));

    var Exception = __all__.Exception;
    var IterableError = __all__.IterableError;
    var StopIteration = __all__.StopIteration;
    var ValueError = __all__.ValueError;
    var KeyError = __all__.KeyError;
    var AssertionError = __all__.AssertionError;
    var NotImplementedError = __all__.NotImplementedError;
    var IndexError = __all__.IndexError;
    var AttributeError = __all__.AttributeError;

    // Warnings Exceptions
    var Warning = __all__.Warning;
    var UserWarning = __all__.UserWarning;
    var DeprecationWarning = __all__.DeprecationWarning;
    var RuntimeWarning = __all__.RuntimeWarning;

    var __sort__ = __all__.__sort__;
    var sorted = __all__.sorted;

    var map = __all__.map;
    var filter = __all__.filter;

    var complex = __all__.complex;
    __all__.print = __all__.__terminal__.print;
    __all__.input = __all__.__terminal__.input;

    var __terminal__ = __all__.__terminal__;
    var print = __all__.print;
    var input = __all__.input;

    // Complete __envir__, that was created in __base__, for non-stub mode
    __envir__.executor_name = __envir__.transpiler_name;

    // Make make __main__ available in browser
    var __main__ = {__file__: ''};
    __all__.main = __main__;

    // Define current exception, there's at most one exception in the air at any time
    var __except__ = null;
    __all__.__except__ = __except__;
    
     // Creator of a marked dictionary, used to pass **kwargs parameter
    var __kwargtrans__ = function (anObject) {
        anObject.__kwargtrans__ = null; // Removable marker
        anObject.constructor = Object;
        return anObject;
    }
    __all__.__kwargtrans__ = __kwargtrans__;

    // 'Oneshot' dict promotor, used to enrich __all__ and help globals () return a true dict
    var __globals__ = function (anObject) {
        if (isinstance (anObject, dict)) {  // Don't attempt to promote (enrich) again, since it will make a copy
            return anObject;
        }
        else {
            return dict (anObject)
        }
    }
    __all__.__globals__ = __globals__
    
    // Partial implementation of super () .<methodName> (<params>)
    var __super__ = function (aClass, methodName) {        
        // Lean and fast, no C3 linearization, only call first implementation encountered
        // Will allow __super__ ('<methodName>') (self, <params>) rather than only <className>.<methodName> (self, <params>)
        
        for (let base of aClass.__bases__) {
            if (methodName in base) {
               return base [methodName];
            }
        }

        throw new Exception ('Superclass method not found');    // !!! Improve!
    }
    __all__.__super__ = __super__
        
    // Python property installer function, no member since that would bloat classes
    var property = function (getter, setter) {  // Returns a property descriptor rather than a property
        if (!setter) {  // ??? Make setter optional instead of dummy?
            setter = function () {};
        }
        return {get: function () {return getter (this)}, set: function (value) {setter (this, value)}, enumerable: true};
    }
    __all__.property = property;
    
    // Conditional JavaScript property installer function, prevents redefinition of properties if multiple Transcrypt apps are on one page
    var __setProperty__ = function (anObject, name, descriptor) {
        if (!anObject.hasOwnProperty (name)) {
            Object.defineProperty (anObject, name, descriptor);
        }
    }
    __all__.__setProperty__ = __setProperty__
    
    // Assert function, call to it only generated when compiling with --dassert option
    function assert (condition, message) {  // Message may be undefined
        if (!condition) {
            throw AssertionError (message, new Error ());
        }
    }

    __all__.assert = assert;

    var __merge__ = function (object0, object1) {
        var result = {};
        for (var attrib in object0) {
            result [attrib] = object0 [attrib];
        }
        for (var attrib in object1) {
            result [attrib] = object1 [attrib];
        }
        return result;
    };
    __all__.__merge__ = __merge__;

    // Manipulating attributes by name
    
    var dir = function (obj) {
        var aList = [];
        for (var aKey in obj) {
            aList.push (aKey);
        }
        aList.sort ();
        return aList;
    };
    __all__.dir = dir;

    var setattr = function (obj, name, value) {
        obj [name] = value;
    };
    __all__.setattr = setattr;

    var getattr = function (obj, name) {
        return obj [name];
    };
    __all__.getattr= getattr;

    var hasattr = function (obj, name) {
        try {
            return name in obj;
        }
        catch (exception) {
            return false;
        }
    };
    __all__.hasattr = hasattr;

    var delattr = function (obj, name) {
        delete obj [name];
    };
    __all__.delattr = (delattr);

    // The __in__ function, used to mimic Python's 'in' operator
    // In addition to CPython's semantics, the 'in' operator is also allowed to work on objects, avoiding a counterintuitive separation between Python dicts and JavaScript objects
    // In general many Transcrypt compound types feature a deliberate blend of Python and JavaScript facilities, facilitating efficient integration with JavaScript libraries
    // If only Python objects and Python dicts are dealt with in a certain context, the more pythonic 'hasattr' is preferred for the objects as opposed to 'in' for the dicts
    var __in__ = function (element, container) {
        if (py_typeof (container) == dict) {        // Currently only implemented as an augmented JavaScript object
            return container.hasOwnProperty (element);
        }
        else {                                      // Parameter 'element' itself is an array, string or a plain, non-dict JavaScript object
            return (
                container.indexOf ?                 // If it has an indexOf
                container.indexOf (element) > -1 :  // it's an array or a string,
                container.hasOwnProperty (element)  // else it's a plain, non-dict JavaScript object
            );
        }
    };
    __all__.__in__ = __in__;

    // Find out if an attribute is special
    var __specialattrib__ = function (attrib) {
        return (attrib.startswith ('__') && attrib.endswith ('__')) || attrib == 'constructor' || attrib.startswith ('py_');
    };
    __all__.__specialattrib__ = __specialattrib__;

    // Len function for any object
    var len = function (anObject) {
        if (anObject) {
            var l = anObject.length;
            if (l == undefined) {
                var result = 0;
                for (var attrib in anObject) {
                    if (!__specialattrib__ (attrib)) {
                        result++;
                    }
                }
                return result;
            }
            else {
                return l;
            }
        }
        else {
            return 0;
        }
    };
    __all__.len = len;

    // General conversions

    function __i__ (any) {  //  Conversion to iterable
        return py_typeof (any) == dict ? any.py_keys () : any;
    }

    function __t__ (any) {  // Conversion to truthyness, __ ([1, 2, 3]) returns [1, 2, 3], needed for nonempty selection: l = list1 or list2]
        return (['boolean', 'number'] .indexOf (typeof any) >= 0 || any instanceof Function || len (any)) ? any : false;
        // JavaScript functions have a length attribute, denoting the number of parameters
        // Python objects are JavaScript functions, but their length doesn't matter, only their existence
        // By the term 'any instanceof Function' we make sure that Python objects aren't rejected when their length equals zero
    }
    __all__.__t__ = __t__;

    var bool = function (any) {     // Always truly returns a bool, rather than something truthy or falsy
        return !!__t__ (any);
    };
    bool.__name__ = 'bool';         // So it can be used as a type with a name
    __all__.bool = bool;

    var float = function (any) {
        if (any == 'inf') {
            return Infinity;
        }
        else if (any == '-inf') {
            return -Infinity;
        }
        else if (isNaN (parseFloat (any))) {    // Call to parseFloat needed to exclude '', ' ' etc.
            throw ValueError (new Error ());
        }
        else {
            return +any;
        }
    };
    float.__name__ = 'float';
    __all__.float = float;

    var int = function (any) {
        return float (any) | 0
    };
    int.__name__ = 'int';
    __all__.int = int;

    var py_typeof = function (anObject) {
        var aType = typeof anObject;
        if (aType == 'object') {    // Directly trying '__class__ in anObject' turns out to wreck anObject in Chrome if its a primitive
            try {
                return anObject.__class__;
            }
            catch (exception) {
                return aType;
            }
        }
        else {
            return (    // Odly, the braces are required here
                aType == 'boolean' ? bool :
                aType == 'string' ? str :
                aType == 'number' ? (anObject % 1 == 0 ? int : float) :
                null
            );
        }
    };
    __all__.py_typeof = py_typeof;

    var isinstance = function (anObject, classinfo) {
        function isA (queryClass) {
            if (queryClass == classinfo) {
                return true;
            }
            for (var index = 0; index < queryClass.__bases__.length; index++) {
                if (isA (queryClass.__bases__ [index], classinfo)) {
                    return true;
                }
            }
            return false;
        }

        if (classinfo instanceof Array) {   // Assume in most cases it isn't, then making it recursive rather than two functions saves a call
            for (let aClass of classinfo) {
                if (isinstance (anObject, aClass)) {
                    return true;
                }
            }
            return false;
        }

        try {                   // Most frequent use case first
            return '__class__' in anObject ? isA (anObject.__class__) : anObject instanceof classinfo;
        }
        catch (exception) {     // Using isinstance on primitives assumed rare
            var aType = py_typeof (anObject);
            return aType == classinfo || (aType == bool && classinfo == int);
        }
    };
    __all__.isinstance = isinstance;

    var callable = function (anObject) {
        if ( typeof anObject == 'object' && '__call__' in anObject ) {
            return true;
        }
        else {
            return typeof anObject === 'function';
        }
    };
    __all__.callable = callable;

    // Repr function uses __repr__ method, then __str__, then toString
    var repr = function (anObject) {
        try {
            return anObject.__repr__ ();
        }
        catch (exception) {
            try {
                return anObject.__str__ ();
            }
            catch (exception) { // anObject has no __repr__ and no __str__
                try {
                    if (anObject == null) {
                        return 'None';
                    }
                    else if (anObject.constructor == Object) {
                        var result = '{';
                        var comma = false;
                        for (var attrib in anObject) {
                            if (!__specialattrib__ (attrib)) {
                                if (attrib.isnumeric ()) {
                                    var attribRepr = attrib;                // If key can be interpreted as numerical, we make it numerical
                                }                                           // So we accept that '1' is misrepresented as 1
                                else {
                                    var attribRepr = '\'' + attrib + '\'';  // Alpha key in dict
                                }

                                if (comma) {
                                    result += ', ';
                                }
                                else {
                                    comma = true;
                                }
                                result += attribRepr + ': ' + repr (anObject [attrib]);
                            }
                        }
                        result += '}';
                        return result;
                    }
                    else {
                        return typeof anObject == 'boolean' ? anObject.toString () .capitalize () : anObject.toString ();
                    }
                }
                catch (exception) {
                    console.log ('ERROR: Could not evaluate repr (<object of type ' + typeof anObject + '>)');
                    console.log (exception);
                    return '???';
                }
            }
        }
    };
    __all__.repr = repr;

    // Char from Unicode or ASCII
    var chr = function (charCode) {
        return String.fromCharCode (charCode);
    };
    __all__.chr = chr;

    // Unicode or ASCII from char
    var ord = function (aChar) {
        return aChar.charCodeAt (0);
    };
    __all__.ord = ord;

    // Maximum of n numbers
    var max = Math.max;
    __all__.max = max;

    // Minimum of n numbers
    var min = Math.min;
    __all__.min = min;

    // Absolute value
    var abs = function (x) {
        try {
            return Math.abs (x);
        }
        catch (exception) {
            return Math.sqrt (x.real * x.real + x.imag * x.imag);
        }
    };

    // Bankers rounding
    var round = function (number, ndigits) {
        if (ndigits) {
            var scale = Math.pow (10, ndigits);
            number *= scale;
        }

        var rounded = Math.round (number);
        if (rounded - number == 0.5 && rounded % 2) {   // Has rounded up to odd, should have rounded down to even
            rounded -= 1;
        }

        if (ndigits) {
            rounded /= scale;
        }

        return rounded;
    };
    __all__.round = round;

    // BEGIN unified iterator model

    function __jsUsePyNext__ () {       // Add as 'next' method to make Python iterator JavaScript compatible
        try {
            var result = this.__next__ ();
            return {value: result, done: false};
        }
        catch (exception) {
            return {value: undefined, done: true};
        }
    }

    function __pyUseJsNext__ () {       // Add as '__next__' method to make JavaScript iterator Python compatible
        var result = this.next ();
        if (result.done) {
            throw StopIteration (new Error ());
        }
        else {
            return result.value;
        }
    }

    function py_iter (iterable) {                   // Alias for Python's iter function, produces a universal iterator / iterable, usable in Python and JavaScript
        if (typeof iterable == 'string' || '__iter__' in iterable) {    // JavaScript Array or string or Python iterable (string has no 'in')
            var result = iterable.__iter__ ();                          // Iterator has a __next__
            result.next = __jsUsePyNext__;                              // Give it a next
        }
        else if ('selector' in iterable) {                              // Assume it's a JQuery iterator
            var result = list (iterable) .__iter__ ();                  // Has a __next__
            result.next = __jsUsePyNext__;                              // Give it a next
        }
        else if ('next' in iterable) {                                  // It's a JavaScript iterator already,  maybe a generator, has a next and may have a __next__
            var result = iterable
            if (! ('__next__' in result)) {                             // If there's no danger of recursion
                result.__next__ = __pyUseJsNext__;                      // Give it a __next__
            }
        }
        else if (Symbol.iterator in iterable) {                         // It's a JavaScript iterable such as a typed array, but not an iterator
            var result = iterable [Symbol.iterator] ();                 // Has a next
            result.__next__ = __pyUseJsNext__;                          // Give it a __next__
        }
        else {
            throw IterableError (new Error ()); // No iterator at all
        }
        result [Symbol.iterator] = function () {return result;};
        return result;
    }

    function py_next (iterator) {               // Called only in a Python context, could receive Python or JavaScript iterator
        try {                                   // Primarily assume Python iterator, for max speed
            var result = iterator.__next__ ();
        }
        catch (exception) {                     // JavaScript iterators are the exception here
            var result = iterator.next ();
            if (result.done) {
                throw StopIteration (new Error ());
            }
            else {
                return result.value;
            }
        }
        if (result == undefined) {
            throw StopIteration (new Error ());
        }
        else {
            return result;
        }
    }

    function __PyIterator__ (iterable) {
        this.iterable = iterable;
        this.index = 0;
    }

    __PyIterator__.prototype.__next__ = function () {
        if (this.index < this.iterable.length) {
            return this.iterable [this.index++];
        }
        else {
            throw StopIteration (new Error ());
        }
    };

    function __JsIterator__ (iterable) {
        this.iterable = iterable;
        this.index = 0;
    }

    __JsIterator__.prototype.next = function () {
        if (this.index < this.iterable.py_keys.length) {
            return {value: this.index++, done: false};
        }
        else {
            return {value: undefined, done: true};
        }
    };

    // END unified iterator model

    // Reversed function for arrays
    var py_reversed = function (iterable) {
        iterable = iterable.slice ();
        iterable.reverse ();
        return iterable;
    };
    __all__.py_reversed = py_reversed;

    // Zip method for arrays and strings
    var zip = function () {
        var args = [] .slice.call (arguments);
        for (var i = 0; i < args.length; i++) {
            if (typeof args [i] == 'string') {
                args [i] = args [i] .split ('');
            }
        }
        var shortest = args.length == 0 ? [] : args.reduce (    // Find shortest array in arguments
            function (array0, array1) {
                return array0.length < array1.length ? array0 : array1;
            }
        );
        return shortest.map (                   // Map each element of shortest array
            function (current, index) {         // To the result of this function
                return args.map (               // Map each array in arguments
                    function (current) {        // To the result of this function
                        return current [index]; // Namely it's index't entry
                    }
                );
            }
        );
    };
    __all__.zip = zip;

    // Range method, returning an array
    function range (start, stop, step) {
        if (stop == undefined) {
            // one param defined
            stop = start;
            start = 0;
        }
        if (step == undefined) {
            step = 1;
        }
        if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
            return [];
        }
        var result = [];
        for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
            result.push(i);
        }
        return result;
    };
    __all__.range = range;

    // Any, all and sum

    function any (iterable) {
        for (let item of iterable) {
            if (bool (item)) {
                return true;
            }
        }
        return false;
    }
    function all (iterable) {
        for (let item of iterable) {
            if (! bool (item)) {
                return false;
            }
        }
        return true;
    }
    function sum (iterable) {
        let result = 0;
        for (let item of iterable) {
            result += item;
        }
        return result;
    }

    __all__.any = any;
    __all__.all = all;
    __all__.sum = sum;

    // Enumerate method, returning a zipped list
    function enumerate (iterable) {
        return zip (range (len (iterable)), iterable);
    }
    __all__.enumerate = enumerate;

    // Shallow and deepcopy

    function copy (anObject) {
        if (anObject == null || typeof anObject == "object") {
            return anObject;
        }
        else {
            var result = {};
            for (var attrib in obj) {
                if (anObject.hasOwnProperty (attrib)) {
                    result [attrib] = anObject [attrib];
                }
            }
            return result;
        }
    }
    __all__.copy = copy;

    function deepcopy (anObject) {
        if (anObject == null || typeof anObject == "object") {
            return anObject;
        }
        else {
            var result = {};
            for (var attrib in obj) {
                if (anObject.hasOwnProperty (attrib)) {
                    result [attrib] = deepcopy (anObject [attrib]);
                }
            }
            return result;
        }
    }
    __all__.deepcopy = deepcopy;

    // List extensions to Array

    function list (iterable) {                                      // All such creators should be callable without new
        var instance = iterable ? Array.from (iterable) : [];
        // Sort is the normal JavaScript sort, Python sort is a non-member function
        return instance;
    }
    __all__.list = list;
    Array.prototype.__class__ = list;   // All arrays are lists (not only if constructed by the list ctor), unless constructed otherwise
    list.__name__ = 'list';

    /*
    Array.from = function (iterator) { // !!! remove
        result = [];
        for (item of iterator) {
            result.push (item);
        }
        return result;
    }
    */

    Array.prototype.__iter__ = function () {return new __PyIterator__ (this);};

    Array.prototype.__getslice__ = function (start, stop, step) {
        if (start < 0) {
            start = this.length + start;
        }

        if (stop == null) {
            stop = this.length;
        }
        else if (stop < 0) {
            stop = this.length + stop;
        }
        else if (stop > this.length) {
            stop = this.length;
        }

        var result = list ([]);
        for (var index = start; index < stop; index += step) {
            result.push (this [index]);
        }

        return result;
    };

    Array.prototype.__setslice__ = function (start, stop, step, source) {
        if (start < 0) {
            start = this.length + start;
        }

        if (stop == null) {
            stop = this.length;
        }
        else if (stop < 0) {
            stop = this.length + stop;
        }

        if (step == null) { // Assign to 'ordinary' slice, replace subsequence
            Array.prototype.splice.apply (this, [start, stop - start] .concat (source));
        }
        else {              // Assign to extended slice, replace designated items one by one
            var sourceIndex = 0;
            for (var targetIndex = start; targetIndex < stop; targetIndex += step) {
                this [targetIndex] = source [sourceIndex++];
            }
        }
    };

    Array.prototype.__repr__ = function () {
        if (this.__class__ == set && !this.length) {
            return 'set()';
        }

        var result = !this.__class__ || this.__class__ == list ? '[' : this.__class__ == tuple ? '(' : '{';

        for (var index = 0; index < this.length; index++) {
            if (index) {
                result += ', ';
            }
            result += repr (this [index]);
        }

        if (this.__class__ == tuple && this.length == 1) {
            result += ',';
        }

        result += !this.__class__ || this.__class__ == list ? ']' : this.__class__ == tuple ? ')' : '}';;
        return result;
    };

    Array.prototype.__str__ = Array.prototype.__repr__;

    Array.prototype.append = function (element) {
        this.push (element);
    };

    Array.prototype.clear = function () {
        this.length = 0;
    };

    Array.prototype.extend = function (aList) {
        this.push.apply (this, aList);
    };

    Array.prototype.insert = function (index, element) {
        this.splice (index, 0, element);
    };

    Array.prototype.remove = function (element) {
        var index = this.indexOf (element);
        if (index == -1) {
            throw ValueError (new Error ());
        }
        this.splice (index, 1);
    };

    Array.prototype.index = function (element) {
        return this.indexOf (element);
    };

    Array.prototype.py_pop = function (index) {
        if (index == undefined) {
            return this.pop ();  // Remove last element
        }
        else {
            return this.splice (index, 1) [0];
        }
    };

    Array.prototype.py_sort = function () {
        __sort__.apply  (null, [this].concat ([] .slice.apply (arguments)));    // Can't work directly with arguments
        // Python params: (iterable, key = None, reverse = False)
        // py_sort is called with the Transcrypt kwargs mechanism, and just passes the params on to __sort__
        // __sort__ is def'ed with the Transcrypt kwargs mechanism
    };

    Array.prototype.__add__ = function (aList) {
        return list (this.concat (aList));
    };

    Array.prototype.__mul__ = function (scalar) {
        var result = this;
        for (var i = 1; i < scalar; i++) {
            result = result.concat (this);
        }
        return result;
    };

    Array.prototype.__rmul__ = Array.prototype.__mul__;

    // Tuple extensions to Array

    function tuple (iterable) {
        var instance = iterable ? [] .slice.apply (iterable) : [];
        instance.__class__ = tuple; // Not all arrays are tuples
        return instance;
    }
    __all__.tuple = tuple;
    tuple.__name__ = 'tuple';

    // Set extensions to Array
    // N.B. Since sets are unordered, set operations will occasionally alter the 'this' array by sorting it

    function set (iterable) {
        var instance = [];
        if (iterable) {
            for (var index = 0; index < iterable.length; index++) {
                instance.add (iterable [index]);
            }


        }
        instance.__class__ = set;   // Not all arrays are sets
        return instance;
    }
    __all__.set = set;
    set.__name__ = 'set';

    Array.prototype.__bindexOf__ = function (element) { // Used to turn O (n^2) into O (n log n)
    // Since sorting is lex, compare has to be lex. This also allows for mixed lists

        element += '';

        var mindex = 0;
        var maxdex = this.length - 1;

        while (mindex <= maxdex) {
            var index = (mindex + maxdex) / 2 | 0;
            var middle = this [index] + '';

            if (middle < element) {
                mindex = index + 1;
            }
            else if (middle > element) {
                maxdex = index - 1;
            }
            else {
                return index;
            }
        }

        return -1;
    };

    Array.prototype.add = function (element) {
        if (this.indexOf (element) == -1) { // Avoid duplicates in set
            this.push (element);
        }
    };

    Array.prototype.discard = function (element) {
        var index = this.indexOf (element);
        if (index != -1) {
            this.splice (index, 1);
        }
    };

    Array.prototype.isdisjoint = function (other) {
        this.sort ();
        for (var i = 0; i < other.length; i++) {
            if (this.__bindexOf__ (other [i]) != -1) {
                return false;
            }
        }
        return true;
    };

    Array.prototype.issuperset = function (other) {
        this.sort ();
        for (var i = 0; i < other.length; i++) {
            if (this.__bindexOf__ (other [i]) == -1) {
                return false;
            }
        }
        return true;
    };

    Array.prototype.issubset = function (other) {
        return set (other.slice ()) .issuperset (this); // Sort copy of 'other', not 'other' itself, since it may be an ordered sequence
    };

    Array.prototype.union = function (other) {
        var result = set (this.slice () .sort ());
        for (var i = 0; i < other.length; i++) {
            if (result.__bindexOf__ (other [i]) == -1) {
                result.push (other [i]);
            }
        }
        return result;
    };

    Array.prototype.intersection = function (other) {
        this.sort ();
        var result = set ();
        for (var i = 0; i < other.length; i++) {
            if (this.__bindexOf__ (other [i]) != -1) {
                result.push (other [i]);
            }
        }
        return result;
    };

    Array.prototype.difference = function (other) {
        var sother = set (other.slice () .sort ());
        var result = set ();
        for (var i = 0; i < this.length; i++) {
            if (sother.__bindexOf__ (this [i]) == -1) {
                result.push (this [i]);
            }
        }
        return result;
    };

    Array.prototype.symmetric_difference = function (other) {
        return this.union (other) .difference (this.intersection (other));
    };

    Array.prototype.py_update = function () {   // O (n)
        var updated = [] .concat.apply (this.slice (), arguments) .sort ();
        this.clear ();
        for (var i = 0; i < updated.length; i++) {
            if (updated [i] != updated [i - 1]) {
                this.push (updated [i]);
            }
        }
    };

    Array.prototype.__eq__ = function (other) { // Also used for list
        if (this.length != other.length) {
            return false;
        }
        if (this.__class__ == set) {
            this.sort ();
            other.sort ();
        }
        for (var i = 0; i < this.length; i++) {
            if (this [i] != other [i]) {
                return false;
            }
        }
        return true;
    };

    Array.prototype.__ne__ = function (other) { // Also used for list
        return !this.__eq__ (other);
    };

    Array.prototype.__le__ = function (other) {
        return this.issubset (other);
    };

    Array.prototype.__ge__ = function (other) {
        return this.issuperset (other);
    };

    Array.prototype.__lt__ = function (other) {
        return this.issubset (other) && !this.issuperset (other);
    };

    Array.prototype.__gt__ = function (other) {
        return this.issuperset (other) && !this.issubset (other);
    };

    // String extensions

    function str (stringable) {
        try {
            return stringable.__str__ ();
        }
        catch (exception) {
            try {
                return repr (stringable);
            }
            catch (exception) {
                return String (stringable); // No new, so no permanent String object but a primitive in a temporary 'just in time' wrapper
            }
        }
    };
    __all__.str = str;

    String.prototype.__class__ = str;   // All strings are str
    str.__name__ = 'str';

    String.prototype.__iter__ = function () {new __PyIterator__ (this);};

    String.prototype.__repr__ = function () {
        return (this.indexOf ('\'') == -1 ? '\'' + this + '\'' : '"' + this + '"') .py_replace ('\t', '\\t') .py_replace ('\n', '\\n');
    };

    String.prototype.__str__ = function () {
        return this;
    };

    String.prototype.capitalize = function () {
        return this.charAt (0).toUpperCase () + this.slice (1);
    };

    String.prototype.endswith = function (suffix) {
        return suffix == '' || this.slice (-suffix.length) == suffix;
    };

    String.prototype.find  = function (sub, start) {
        return this.indexOf (sub, start);
    };

    String.prototype.__getslice__ = function (start, stop, step) {
        if (start < 0) {
            start = this.length + start;
        }

        if (stop == null) {
            stop = this.length;
        }
        else if (stop < 0) {
            stop = this.length + stop;
        }

        var result = '';
        if (step == 1) {
            result = this.substring (start, stop);
        }
        else {
            for (var index = start; index < stop; index += step) {
                result = result.concat (this.charAt(index));
            }
        }
        return result;
    }

    // Since it's worthwhile for the 'format' function to be able to deal with *args, it is defined as a property
    // __get__ will produce a bound function if there's something before the dot
    // Since a call using *args is compiled to e.g. <object>.<function>.apply (null, args), the function has to be bound already
    // Otherwise it will never be, because of the null argument
    // Using 'this' rather than 'null' contradicts the requirement to be able to pass bound functions around
    // The object 'before the dot' won't be available at call time in that case, unless implicitly via the function bound to it
    // While for Python methods this mechanism is generated by the compiler, for JavaScript methods it has to be provided manually
    // Call memoizing is unattractive here, since every string would then have to hold a reference to a bound format method
    __setProperty__ (String.prototype, 'format', {
        get: function () {return __get__ (this, function (self) {
            var args = tuple ([] .slice.apply (arguments).slice (1));
            var autoIndex = 0;
            return self.replace (/\{(\w*)\}/g, function (match, key) {
                if (key == '') {
                    key = autoIndex++;
                }
                if (key == +key) {  // So key is numerical
                    return args [key] == undefined ? match : str (args [key]);
                }
                else {              // Key is a string
                    for (var index = 0; index < args.length; index++) {
                        // Find first 'dict' that has that key and the right field
                        if (typeof args [index] == 'object' && args [index][key] != undefined) {
                            return str (args [index][key]); // Return that field field
                        }
                    }
                    return match;
                }
            });
        });},
        enumerable: true
    });

    String.prototype.isnumeric = function () {
        return !isNaN (parseFloat (this)) && isFinite (this);
    };

    String.prototype.join = function (strings) {
        strings = Array.from (strings); // Much faster than iterating through strings char by char
        return strings.join (this);
    };

    String.prototype.lower = function () {
        return this.toLowerCase ();
    };

    String.prototype.py_replace = function (old, aNew, maxreplace) {
        return this.split (old, maxreplace) .join (aNew);
    };

    String.prototype.lstrip = function () {
        return this.replace (/^\s*/g, '');
    };

    String.prototype.rfind = function (sub, start) {
        return this.lastIndexOf (sub, start);
    };

    String.prototype.rsplit = function (sep, maxsplit) {    // Combination of general whitespace sep and positive maxsplit neither supported nor checked, expensive and rare
        if (sep == undefined || sep == null) {
            sep = /\s+/;
            var stripped = this.strip ();
        }
        else {
            var stripped = this;
        }

        if (maxsplit == undefined || maxsplit == -1) {
            return stripped.split (sep);
        }
        else {
            var result = stripped.split (sep);
            if (maxsplit < result.length) {
                var maxrsplit = result.length - maxsplit;
                return [result.slice (0, maxrsplit) .join (sep)] .concat (result.slice (maxrsplit));
            }
            else {
                return result;
            }
        }
    };

    String.prototype.rstrip = function () {
        return this.replace (/\s*$/g, '');
    };

    String.prototype.py_split = function (sep, maxsplit) {  // Combination of general whitespace sep and positive maxsplit neither supported nor checked, expensive and rare
        if (sep == undefined || sep == null) {
            sep = /\s+/;
            var stripped = this.strip ();
        }
        else {
            var stripped = this;
        }

        if (maxsplit == undefined || maxsplit == -1) {
            return stripped.split (sep);
        }
        else {
            var result = stripped.split (sep);
            if (maxsplit < result.length) {
                return result.slice (0, maxsplit).concat ([result.slice (maxsplit).join (sep)]);
            }
            else {
                return result;
            }
        }
    };

    String.prototype.startswith = function (prefix) {
        return this.indexOf (prefix) == 0;
    };

    String.prototype.strip = function () {
        return this.trim ();
    };

    String.prototype.upper = function () {
        return this.toUpperCase ();
    };

    String.prototype.__mul__ = function (scalar) {
        var result = this;
        for (var i = 1; i < scalar; i++) {
            result = result + this;
        }
        return result;
    };

    String.prototype.__rmul__ = String.prototype.__mul__;

    // Dict extensions to object

    function __keys__ () {
        var keys = [];
        for (var attrib in this) {
            if (!__specialattrib__ (attrib)) {
                keys.push (attrib);
            }
        }
        return keys;
    }

    function __items__ () {
        var items = [];
        for (var attrib in this) {
            if (!__specialattrib__ (attrib)) {
                items.push ([attrib, this [attrib]]);
            }
        }
        return items;
    }

    function __del__ (key) {
        delete this [key];
    }

    function __clear__ () {
        for (var attrib in this) {
            delete this [attrib];
        }
    }

    function __getdefault__ (aKey, aDefault) {  // Each Python object already has a function called __get__, so we call this one __getdefault__
        var result = this [aKey];
        return result == undefined ? (aDefault == undefined ? null : aDefault) : result;
    }

    function __setdefault__ (aKey, aDefault) {
        var result = this [aKey];
        if (result != undefined) {
            return result;
        }
        var val = aDefault == undefined ? null : aDefault;
        this [aKey] = val;
        return val;
    }

    function __pop__ (aKey, aDefault) {
        var result = this [aKey];
        if (result != undefined) {
            delete this [aKey];
            return result;
        } else {
            // Identify check because user could pass None
            if ( aDefault === undefined ) {
                throw KeyError (aKey, new Error());
            }
        }
        return aDefault;
    }
    
    function __popitem__ () {
        var aKey = Object.keys (this) [0];
        if (aKey == null) {
            throw KeyError (aKey, new Error ());
        }
        var result = tuple ([aKey, this [aKey]]);
        delete this [aKey];
        return result;
    }
    
    function __update__ (aDict) {
        for (var aKey in aDict) {
            this [aKey] = aDict [aKey];
        }
    }
    
    function __values__ () {
        var values = [];
        for (var attrib in this) {
            if (!__specialattrib__ (attrib)) {
                values.push (this [attrib]);
            }
        }
        return values;

    }
    
    function __dgetitem__ (aKey) {
        return this [aKey];
    }
    
    function __dsetitem__ (aKey, aValue) {
        this [aKey] = aValue;
    }

    function dict (objectOrPairs) {
        var instance = {};
        if (!objectOrPairs || objectOrPairs instanceof Array) { // It's undefined or an array of pairs
            if (objectOrPairs) {
                for (var index = 0; index < objectOrPairs.length; index++) {
                    var pair = objectOrPairs [index];
                    if ( !(pair instanceof Array) || pair.length != 2) {
                        throw ValueError(
                            "dict update sequence element #" + index +
                            " has length " + pair.length +
                            "; 2 is required", new Error());
                    }
                    var key = pair [0];
                    var val = pair [1];
                    if (!(objectOrPairs instanceof Array) && objectOrPairs instanceof Object) {
                         // User can potentially pass in an object
                         // that has a hierarchy of objects. This
                         // checks to make sure that these objects
                         // get converted to dict objects instead of
                         // leaving them as js objects.
                         
                         if (!isinstance (objectOrPairs, dict)) {
                             val = dict (val);
                         }
                    }
                    instance [key] = val;
                }
            }
        }
        else {
            if (isinstance (objectOrPairs, dict)) {
                // Passed object is a dict already so we need to be a little careful
                // N.B. - this is a shallow copy per python std - so
                // it is assumed that children have already become
                // python objects at some point.
                
                var aKeys = objectOrPairs.py_keys ();
                for (var index = 0; index < aKeys.length; index++ ) {
                    var key = aKeys [index];
                    instance [key] = objectOrPairs [key];
                }
            } else if (objectOrPairs instanceof Object) {
                // Passed object is a JavaScript object but not yet a dict, don't copy it
                instance = objectOrPairs;
            } else {
                // We have already covered Array so this indicates
                // that the passed object is not a js object - i.e.
                // it is an int or a string, which is invalid.
                
                throw ValueError ("Invalid type of object for dict creation", new Error ());
            }
        }

        // Trancrypt interprets e.g. {aKey: 'aValue'} as a Python dict literal rather than a JavaScript object literal
        // So dict literals rather than bare Object literals will be passed to JavaScript libraries
        // Some JavaScript libraries call all enumerable callable properties of an object that's passed to them
        // So the properties of a dict should be non-enumerable
        __setProperty__ (instance, '__class__', {value: dict, enumerable: false, writable: true});
        __setProperty__ (instance, 'py_keys', {value: __keys__, enumerable: false});
        __setProperty__ (instance, '__iter__', {value: function () {new __PyIterator__ (this.py_keys ());}, enumerable: false});
        __setProperty__ (instance, Symbol.iterator, {value: function () {new __JsIterator__ (this.py_keys ());}, enumerable: false});
        __setProperty__ (instance, 'py_items', {value: __items__, enumerable: false});
        __setProperty__ (instance, 'py_del', {value: __del__, enumerable: false});
        __setProperty__ (instance, 'py_clear', {value: __clear__, enumerable: false});
        __setProperty__ (instance, 'py_get', {value: __getdefault__, enumerable: false});
        __setProperty__ (instance, 'py_setdefault', {value: __setdefault__, enumerable: false});
        __setProperty__ (instance, 'py_pop', {value: __pop__, enumerable: false});
        __setProperty__ (instance, 'py_popitem', {value: __popitem__, enumerable: false});
        __setProperty__ (instance, 'py_update', {value: __update__, enumerable: false});
        __setProperty__ (instance, 'py_values', {value: __values__, enumerable: false});
        __setProperty__ (instance, '__getitem__', {value: __dgetitem__, enumerable: false});    // Needed since compound keys necessarily
        __setProperty__ (instance, '__setitem__', {value: __dsetitem__, enumerable: false});    // trigger overloading to deal with slices
        return instance;
    }

    __all__.dict = dict;
    dict.__name__ = 'dict';
    
    // Docstring setter

    function __setdoc__ (docString) {
        this.__doc__ = docString;
        return this;
    }

    // Python classes, methods and functions are all translated to JavaScript functions
    __setProperty__ (Function.prototype, '__setdoc__', {value: __setdoc__, enumerable: false});

    // General operator overloading, only the ones that make most sense in matrix and complex operations

    var __neg__ = function (a) {
        if (typeof a == 'object' && '__neg__' in a) {
            return a.__neg__ ();
        }
        else {
            return -a;
        }
    };
    __all__.__neg__ = __neg__;

    var __matmul__ = function (a, b) {
        return a.__matmul__ (b);
    };
    __all__.__matmul__ = __matmul__;

    var __pow__ = function (a, b) {
        if (typeof a == 'object' && '__pow__' in a) {
            return a.__pow__ (b);
        }
        else if (typeof b == 'object' && '__rpow__' in b) {
            return b.__rpow__ (a);
        }
        else {
            return Math.pow (a, b);
        }
    };
    __all__.pow = __pow__;

    var __jsmod__ = function (a, b) {
        if (typeof a == 'object' && '__mod__' in a) {
            return a.__mod__ (b);
        }
        else if (typeof b == 'object' && '__rpow__' in b) {
            return b.__rmod__ (a);
        }
        else {
            return a % b;
        }
    };
    __all__.__jsmod__ = __jsmod__;
    
    var __mod__ = function (a, b) {
        if (typeof a == 'object' && '__mod__' in a) {
            return a.__mod__ (b);
        }
        else if (typeof b == 'object' && '__rpow__' in b) {
            return b.__rmod__ (a);
        }
        else {
            return ((a % b) + b) % b;
        }
    };
    __all__.mod = __mod__;

    // Overloaded binary arithmetic
    
    var __mul__ = function (a, b) {
        if (typeof a == 'object' && '__mul__' in a) {
            return a.__mul__ (b);
        }
        else if (typeof b == 'object' && '__rmul__' in b) {
            return b.__rmul__ (a);
        }
        else if (typeof a == 'string') {
            return a.__mul__ (b);
        }
        else if (typeof b == 'string') {
            return b.__rmul__ (a);
        }
        else {
            return a * b;
        }
    };
    __all__.__mul__ = __mul__;

    var __div__ = function (a, b) {
        if (typeof a == 'object' && '__div__' in a) {
            return a.__div__ (b);
        }
        else if (typeof b == 'object' && '__rdiv__' in b) {
            return b.__rdiv__ (a);
        }
        else {
            return a / b;
        }
    };
    __all__.__div__ = __div__;

    var __add__ = function (a, b) {
        if (typeof a == 'object' && '__add__' in a) {
            return a.__add__ (b);
        }
        else if (typeof b == 'object' && '__radd__' in b) {
            return b.__radd__ (a);
        }
        else {
            return a + b;
        }
    };
    __all__.__add__ = __add__;

    var __sub__ = function (a, b) {
        if (typeof a == 'object' && '__sub__' in a) {
            return a.__sub__ (b);
        }
        else if (typeof b == 'object' && '__rsub__' in b) {
            return b.__rsub__ (a);
        }
        else {
            return a - b;
        }
    };
    __all__.__sub__ = __sub__;

    // Overloaded binary bitwise
    
    var __lshift__ = function (a, b) {
        if (typeof a == 'object' && '__lshift__' in a) {
            return a.__lshift__ (b);
        }
        else if (typeof b == 'object' && '__rlshift__' in b) {
            return b.__rlshift__ (a);
        }
        else {
            return a << b;
        }
    };
    __all__.__lshift__ = __lshift__;

    var __rshift__ = function (a, b) {
        if (typeof a == 'object' && '__rshift__' in a) {
            return a.__rshift__ (b);
        }
        else if (typeof b == 'object' && '__rrshift__' in b) {
            return b.__rrshift__ (a);
        }
        else {
            return a >> b;
        }
    };
    __all__.__rshift__ = __rshift__;

    var __or__ = function (a, b) {
        if (typeof a == 'object' && '__or__' in a) {
            return a.__or__ (b);
        }
        else if (typeof b == 'object' && '__ror__' in b) {
            return b.__ror__ (a);
        }
        else {
            return a | b;
        }
    };
    __all__.__or__ = __or__;

    var __xor__ = function (a, b) {
        if (typeof a == 'object' && '__xor__' in a) {
            return a.__xor__ (b);
        }
        else if (typeof b == 'object' && '__rxor__' in b) {
            return b.__rxor__ (a);
        }
        else {
            return a ^ b;
        }
    };
    __all__.__xor__ = __xor__;

    var __and__ = function (a, b) {
        if (typeof a == 'object' && '__and__' in a) {
            return a.__and__ (b);
        }
        else if (typeof b == 'object' && '__rand__' in b) {
            return b.__rand__ (a);
        }
        else {
            return a & b;
        }
    };
    __all__.__and__ = __and__;    
        
    // Overloaded binary compare
    
    var __eq__ = function (a, b) {
        if (typeof a == 'object' && '__eq__' in a) {
            return a.__eq__ (b);
        }
        else {
            return a == b;
        }
    };
    __all__.__eq__ = __eq__;

    var __ne__ = function (a, b) {
        if (typeof a == 'object' && '__ne__' in a) {
            return a.__ne__ (b);
        }
        else {
            return a != b
        }
    };
    __all__.__ne__ = __ne__;

    var __lt__ = function (a, b) {
        if (typeof a == 'object' && '__lt__' in a) {
            return a.__lt__ (b);
        }
        else {
            return a < b;
        }
    };
    __all__.__lt__ = __lt__;

    var __le__ = function (a, b) {
        if (typeof a == 'object' && '__le__' in a) {
            return a.__le__ (b);
        }
        else {
            return a <= b;
        }
    };
    __all__.__le__ = __le__;

    var __gt__ = function (a, b) {
        if (typeof a == 'object' && '__gt__' in a) {
            return a.__gt__ (b);
        }
        else {
            return a > b;
        }
    };
    __all__.__gt__ = __gt__;

    var __ge__ = function (a, b) {
        if (typeof a == 'object' && '__ge__' in a) {
            return a.__ge__ (b);
        }
        else {
            return a >= b;
        }
    };
    __all__.__ge__ = __ge__;
    
    // Overloaded augmented general
    
    var __imatmul__ = function (a, b) {
        if ('__imatmul__' in a) {
            return a.__imatmul__ (b);
        }
        else {
            return a.__matmul__ (b);
        }
    };
    __all__.__imatmul__ = __imatmul__;

    var __ipow__ = function (a, b) {
        if (typeof a == 'object' && '__pow__' in a) {
            return a.__ipow__ (b);
        }
        else if (typeof a == 'object' && '__ipow__' in a) {
            return a.__pow__ (b);
        }
        else if (typeof b == 'object' && '__rpow__' in b) {
            return b.__rpow__ (a);
        }
        else {
            return Math.pow (a, b);
        }
    };
    __all__.ipow = __ipow__;

    var __ijsmod__ = function (a, b) {
        if (typeof a == 'object' && '__imod__' in a) {
            return a.__ismod__ (b);
        }
        else if (typeof a == 'object' && '__mod__' in a) {
            return a.__mod__ (b);
        }
        else if (typeof b == 'object' && '__rpow__' in b) {
            return b.__rmod__ (a);
        }
        else {
            return a % b;
        }
    };
    __all__.ijsmod__ = __ijsmod__;
    
    var __imod__ = function (a, b) {
        if (typeof a == 'object' && '__imod__' in a) {
            return a.__imod__ (b);
        }
        else if (typeof a == 'object' && '__mod__' in a) {
            return a.__mod__ (b);
        }
        else if (typeof b == 'object' && '__rpow__' in b) {
            return b.__rmod__ (a);
        }
        else {
            return ((a % b) + b) % b;
        }
    };
    __all__.imod = __imod__;
    
    // Overloaded augmented arithmetic
    
    var __imul__ = function (a, b) {
        if (typeof a == 'object' && '__imul__' in a) {
            return a.__imul__ (b);
        }
        else if (typeof a == 'object' && '__mul__' in a) {
            return a = a.__mul__ (b);
        }
        else if (typeof b == 'object' && '__rmul__' in b) {
            return a = b.__rmul__ (a);
        }
        else if (typeof a == 'string') {
            return a = a.__mul__ (b);
        }
        else if (typeof b == 'string') {
            return a = b.__rmul__ (a);
        }
        else {
            return a *= b;
        }
    };
    __all__.__imul__ = __imul__;

    var __idiv__ = function (a, b) {
        if (typeof a == 'object' && '__idiv__' in a) {
            return a.__idiv__ (b);
        }
        else if (typeof a == 'object' && '__div__' in a) {
            return a = a.__div__ (b);
        }
        else if (typeof b == 'object' && '__rdiv__' in b) {
            return a = b.__rdiv__ (a);
        }
        else {
            return a /= b;
        }
    };
    __all__.__idiv__ = __idiv__;

    var __iadd__ = function (a, b) {
        if (typeof a == 'object' && '__iadd__' in a) {
            return a.__iadd__ (b);
        }
        else if (typeof a == 'object' && '__add__' in a) {
            return a = a.__add__ (b);
        }
        else if (typeof b == 'object' && '__radd__' in b) {
            return a = b.__radd__ (a);
        }
        else {
            return a += b;
        }
    };
    __all__.__iadd__ = __iadd__;

    var __isub__ = function (a, b) {
        if (typeof a == 'object' && '__isub__' in a) {
            return a.__isub__ (b);
        }
        else if (typeof a == 'object' && '__sub__' in a) {
            return a = a.__sub__ (b);
        }
        else if (typeof b == 'object' && '__rsub__' in b) {
            return a = b.__rsub__ (a);
        }
        else {
            return a -= b;
        }
    };
    __all__.__isub__ = __isub__;

    // Overloaded augmented bitwise
    
    var __ilshift__ = function (a, b) {
        if (typeof a == 'object' && '__ilshift__' in a) {
            return a.__ilshift__ (b);
        }
        else if (typeof a == 'object' && '__lshift__' in a) {
            return a = a.__lshift__ (b);
        }
        else if (typeof b == 'object' && '__rlshift__' in b) {
            return a = b.__rlshift__ (a);
        }
        else {
            return a <<= b;
        }
    };
    __all__.__ilshift__ = __ilshift__;

    var __irshift__ = function (a, b) {
        if (typeof a == 'object' && '__irshift__' in a) {
            return a.__irshift__ (b);
        }
        else if (typeof a == 'object' && '__rshift__' in a) {
            return a = a.__rshift__ (b);
        }
        else if (typeof b == 'object' && '__rrshift__' in b) {
            return a = b.__rrshift__ (a);
        }
        else {
            return a >>= b;
        }
    };
    __all__.__irshift__ = __irshift__;

    var __ior__ = function (a, b) {
        if (typeof a == 'object' && '__ior__' in a) {
            return a.__ior__ (b);
        }
        else if (typeof a == 'object' && '__or__' in a) {
            return a = a.__or__ (b);
        }
        else if (typeof b == 'object' && '__ror__' in b) {
            return a = b.__ror__ (a);
        }
        else {
            return a |= b;
        }
    };
    __all__.__ior__ = __ior__;

    var __ixor__ = function (a, b) {
        if (typeof a == 'object' && '__ixor__' in a) {
            return a.__ixor__ (b);
        }
        else if (typeof a == 'object' && '__xor__' in a) {
            return a = a.__xor__ (b);
        }
        else if (typeof b == 'object' && '__rxor__' in b) {
            return a = b.__rxor__ (a);
        }
        else {
            return a ^= b;
        }
    };
    __all__.__ixor__ = __ixor__;

    var __iand__ = function (a, b) {
        if (typeof a == 'object' && '__iand__' in a) {
            return a.__iand__ (b);
        }
        else if (typeof a == 'object' && '__and__' in a) {
            return a = a.__and__ (b);
        }
        else if (typeof b == 'object' && '__rand__' in b) {
            return a = b.__rand__ (a);
        }
        else {
            return a &= b;
        }
    };
    __all__.__iand__ = __iand__;
    
    // Indices and slices

    var __getitem__ = function (container, key) {                           // Slice c.q. index, direct generated call to runtime switch
        if (typeof container == 'object' && '__getitem__' in container) {
            return container.__getitem__ (key);                             // Overloaded on container
        }
        else {
            return container [key];                                         // Container must support bare JavaScript brackets
        }
    };
    __all__.__getitem__ = __getitem__;

    var __setitem__ = function (container, key, value) {                    // Slice c.q. index, direct generated call to runtime switch
        if (typeof container == 'object' && '__setitem__' in container) {
            container.__setitem__ (key, value);                             // Overloaded on container
        }
        else {
            container [key] = value;                                        // Container must support bare JavaScript brackets
        }
    };
    __all__.__setitem__ = __setitem__;

    var __getslice__ = function (container, lower, upper, step) {           // Slice only, no index, direct generated call to runtime switch
        if (typeof container == 'object' && '__getitem__' in container) {
            return container.__getitem__ ([lower, upper, step]);            // Container supports overloaded slicing c.q. indexing
        }
        else {
            return container.__getslice__ (lower, upper, step);             // Container only supports slicing injected natively in prototype
        }
    };
    __all__.__getslice__ = __getslice__;

    var __setslice__ = function (container, lower, upper, step, value) {    // Slice, no index, direct generated call to runtime switch
        if (typeof container == 'object' && '__setitem__' in container) {
            container.__setitem__ ([lower, upper, step], value);            // Container supports overloaded slicing c.q. indexing
        }
        else {
            container.__setslice__ (lower, upper, step, value);             // Container only supports slicing injected natively in prototype
        }
    };
    __all__.__setslice__ = __setslice__;

	__nest__ (
		__all__,
		'py_arguments', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var A = __class__ ('A', [object], {
						get __init__ () {return __get__ (this, function (self, x, y) {
							if (typeof x == 'undefined' || (x != null && x .hasOwnProperty ("__kwargtrans__"))) {;
								var x = 123;
							};
							if (typeof y == 'undefined' || (y != null && y .hasOwnProperty ("__kwargtrans__"))) {;
								var y = 456;
							};
							var n = 456;
							var kwargs = dict ();
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											case 'self': var self = __allkwargs0__ [__attrib0__]; break;
											case 'x': var x = __allkwargs0__ [__attrib0__]; break;
											case 'y': var y = __allkwargs0__ [__attrib0__]; break;
											case 'm': var m = __allkwargs0__ [__attrib0__]; break;
											case 'n': var n = __allkwargs0__ [__attrib0__]; break;
											default: kwargs [__attrib0__] = __allkwargs0__ [__attrib0__];
										}
									}
									delete kwargs.__kwargtrans__;
								}
								var args = tuple ([].slice.apply (arguments).slice (3, __ilastarg0__ + 1));
							}
							else {
								var args = tuple ();
							}
							self.x = x;
							self.y = y;
							self.args = args;
							self.m = m;
							self.n = n;
							self.kwargs = kwargs;
							self.extra = 'hello';
						});},
						get f () {return __get__ (this, function (self, autoTester) {
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											case 'self': var self = __allkwargs0__ [__attrib0__]; break;
											case 'autoTester': var autoTester = __allkwargs0__ [__attrib0__]; break;
										}
									}
								}
							}
							else {
							}
							autoTester.check (self.x, self.y, self.args, self.m, self.n, self.kwargs, self.extra);
						});}
					});
					var B = __class__ ('B', [A], {
						get __init__ () {return __get__ (this, function (self, x, y) {
							if (typeof y == 'undefined' || (y != null && y .hasOwnProperty ("__kwargtrans__"))) {;
								var y = -(1);
							};
							var m = -(2);
							var kwargs = dict ();
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											case 'self': var self = __allkwargs0__ [__attrib0__]; break;
											case 'x': var x = __allkwargs0__ [__attrib0__]; break;
											case 'y': var y = __allkwargs0__ [__attrib0__]; break;
											case 'm': var m = __allkwargs0__ [__attrib0__]; break;
											case 'n': var n = __allkwargs0__ [__attrib0__]; break;
											default: kwargs [__attrib0__] = __allkwargs0__ [__attrib0__];
										}
									}
									delete kwargs.__kwargtrans__;
								}
								var args = tuple ([].slice.apply (arguments).slice (3, __ilastarg0__ + 1));
							}
							else {
								var args = tuple ();
							}
							A.__init__ (self, y, x, ...args, __kwargtrans__ (__merge__ ({m: n, n: m}, kwargs)));
						});}
					});
					var C = __class__ ('C', [object], {
						get tricky () {return __get__ (this, function (self) {
							var args = tuple ([].slice.apply (arguments).slice (1));
							return args;
						});}
					});
					var run = function (autoTester) {
						if (arguments.length) {
							var __ilastarg0__ = arguments.length - 1;
							if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
								var __allkwargs0__ = arguments [__ilastarg0__--];
								for (var __attrib0__ in __allkwargs0__) {
									switch (__attrib0__) {
										case 'autoTester': var autoTester = __allkwargs0__ [__attrib0__]; break;
									}
								}
							}
						}
						else {
						}
						var f = function (x, y) {
							if (typeof y == 'undefined' || (y != null && y .hasOwnProperty ("__kwargtrans__"))) {;
								var y = -(1);
							};
							var m = -(2);
							var kwargs = dict ();
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											case 'x': var x = __allkwargs0__ [__attrib0__]; break;
											case 'y': var y = __allkwargs0__ [__attrib0__]; break;
											case 'm': var m = __allkwargs0__ [__attrib0__]; break;
											case 'n': var n = __allkwargs0__ [__attrib0__]; break;
											default: kwargs [__attrib0__] = __allkwargs0__ [__attrib0__];
										}
									}
									delete kwargs.__kwargtrans__;
								}
								var args = tuple ([].slice.apply (arguments).slice (2, __ilastarg0__ + 1));
							}
							else {
								var args = tuple ();
							}
							autoTester.check ('#203', kwargs.__class__.__name__);
							autoTester.check ('#203', sorted (kwargs.py_keys ()));
							var f2 = function (x, y) {
								if (typeof y == 'undefined' || (y != null && y .hasOwnProperty ("__kwargtrans__"))) {;
									var y = -(3);
								};
								var m = -(4);
								var kwargs = dict ();
								if (arguments.length) {
									var __ilastarg0__ = arguments.length - 1;
									if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
										var __allkwargs0__ = arguments [__ilastarg0__--];
										for (var __attrib0__ in __allkwargs0__) {
											switch (__attrib0__) {
												case 'x': var x = __allkwargs0__ [__attrib0__]; break;
												case 'y': var y = __allkwargs0__ [__attrib0__]; break;
												case 'm': var m = __allkwargs0__ [__attrib0__]; break;
												case 'n': var n = __allkwargs0__ [__attrib0__]; break;
												default: kwargs [__attrib0__] = __allkwargs0__ [__attrib0__];
											}
										}
										delete kwargs.__kwargtrans__;
									}
									var args = tuple ([].slice.apply (arguments).slice (2, __ilastarg0__ + 1));
								}
								else {
									var args = tuple ();
								}
								autoTester.check (x, y, args, m, n, kwargs);
							};
							f2 (11, 22, 1010, 2020, __kwargtrans__ ({m: 100100, n: 200200, p: 10001000, q: 20002000}));
							autoTester.check (x, y, args, m, n, kwargs);
						};
						f (1, 2, 10, 20, __kwargtrans__ ({m: 100, n: 200, p: 1000, q: 2000}));
						var b = B (3, 4, 30, 40, __kwargtrans__ ({m: 300, n: 400, p: 3000, q: 4000}));
						b.f (autoTester);
						var g = function () {
							var kwargs = dict ();
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											default: kwargs [__attrib0__] = __allkwargs0__ [__attrib0__];
										}
									}
									delete kwargs.__kwargtrans__;
								}
								var args = tuple ([].slice.apply (arguments).slice (0, __ilastarg0__ + 1));
							}
							else {
								var args = tuple ();
							}
							autoTester.check (args, kwargs);
						};
						g (...tuple ([1, 2, 3]), __kwargtrans__ (dict ({'p': 'aP', 'q': 'aQ', 'r': 'anR'})));
						(function __lambda__ (x, y) {
							if (typeof y == 'undefined' || (y != null && y .hasOwnProperty ("__kwargtrans__"))) {;
								var y = -(1);
							};
							var m = -(2);
							var kwargs = dict ();
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											case 'x': var x = __allkwargs0__ [__attrib0__]; break;
											case 'y': var y = __allkwargs0__ [__attrib0__]; break;
											case 'm': var m = __allkwargs0__ [__attrib0__]; break;
											case 'n': var n = __allkwargs0__ [__attrib0__]; break;
											default: kwargs [__attrib0__] = __allkwargs0__ [__attrib0__];
										}
									}
									delete kwargs.__kwargtrans__;
								}
								var args = tuple ([].slice.apply (arguments).slice (2, __ilastarg0__ + 1));
							}
							else {
								var args = tuple ();
							}
							return autoTester.check (x, y, args, m, n, kwargs);
						}) (1, 2, 8, 16, __kwargtrans__ ({m: 128, n: 256.3, p: 1024.3, q: 2048.3}));
						autoTester.check (C ().tricky (...range (4)));
						autoTester.check ('{}-{}'.format (1, 3, 5, 7, 9));
						autoTester.check ('{}-{}'.format (...range (4)));
					};
					__pragma__ ('<all>')
						__all__.A = A;
						__all__.B = B;
						__all__.C = C;
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'attribs_by_name', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var A = __class__ ('A', [object], {
						get __init__ () {return __get__ (this, function (self) {
							self.s = 'hello';
						});}
					});
					var a = A ();
					var run = function (autoTester) {
						autoTester.check (a.s, getattr (a, 's'));
						setattr (a, 's', 'goodbye');
						autoTester.check (a.s, getattr (a, 's'));
						setattr (a, 't', 'exists');
						autoTester.check (hasattr (a, 't'), a.t, getattr (a, 't'));
						delattr (a, 't');
						autoTester.check (hasattr (a, 't'));
					};
					__pragma__ ('<all>')
						__all__.A = A;
						__all__.a = a;
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'builtin_super', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var run = function (autoTester) {
						var show = function () {
							var args = tuple ([].slice.apply (arguments).slice (0));
							autoTester.check (...args);
						};
						var R = __class__ ('R', [object], {
							get __init__ () {return __get__ (this, function (self, a, b) {
								self.a = a;
								self.b = b;
							});}
						});
						var A = __class__ ('A', [R], {
							get __init__ () {return __get__ (this, function (self, a, b, c) {
								__super__ (A, '__init__') (self, a, b);
								self.c = c;
							});},
							get f () {return __get__ (this, function (self, x, y) {
								show ('A.f:', x, y, self.a, self.b, self.c);
							});},
							get g () {return __get__ (this, function (self, x, y) {
								show ('A.g:', x, y);
							});}
						});
						var B = __class__ ('B', [R], {
							get __init__ () {return __get__ (this, function (self, a, b, d) {
								__super__ (B, '__init__') (self, a, b);
								self.d = d;
							});},
							get f () {return __get__ (this, function (self, x, y) {
								show ('B.f:', x, y, self.a, self.b, self.d);
							});},
							get h () {return __get__ (this, function (self, x, y) {
								show ('A.h:', x, y, self.a, self.b, self.d);
							});}
						});
						var C = __class__ ('C', [A], {
							get __init__ () {return __get__ (this, function (self, a, b, c) {
								__super__ (C, '__init__') (self, a, b, c);
							});},
							get f () {return __get__ (this, function (self, x, y) {
								__super__ (C, 'f') (self, x, y);
								show ('C.f:', x, y, self.a, self.b, self.c);
							});}
						});
						var D = __class__ ('D', [B], {
							get __init__ () {return __get__ (this, function (self, a, b, d) {
								__super__ (D, '__init__') (self, a, b, d);
							});},
							get f () {return __get__ (this, function (self, x, y) {
								__super__ (D, 'f') (self, x, y);
								show ('D.f:', x, y, self.a, self.b, self.d);
							});}
						});
						var E = __class__ ('E', [C, D], {
							get __init__ () {return __get__ (this, function (self, a, b, c, d) {
								R.__init__ (self, a, b);
								self.c = c;
								self.d = d;
							});},
							get f () {return __get__ (this, function (self, x, y) {
								C.f (self, x, y);
								D.f (self, x, y);
								show ('E.f:', x, y, self.a, self.b, self.c, self.d);
							});},
							get g () {return __get__ (this, function (self, x, y) {
								__super__ (E, 'g') (self, x, y);
								show ('E.g:', x, y, self.a, self.b, self.c, self.d);
							});},
							get h () {return __get__ (this, function (self, x, y) {
								__super__ (E, 'h') (self, x, y);
								show ('E.h:', x, y, self.a, self.b, self.c, self.d);
							});}
						});
						var rr = R (100, 200);
						show ('--1--');
						var a = A (101, 201, 301);
						a.f (711, 811);
						a.g (721, 821);
						show ('--2--');
						var b = B (102, 202, 302);
						b.f (712, 812);
						b.h (732, 832);
						show ('--3--');
						var c = C (103, 203, 303);
						c.f (713, 813);
						c.g (723, 823);
						show ('--4--');
						var d = D (104, 204, 304);
						d.f (714, 814);
						d.h (734, 834);
						show ('--5--');
						var e = E (105, 205, 305, 405);
						e.f (715, 815);
						e.g (725, 825);
						e.h (735, 835);
					};
					__pragma__ ('<all>')
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'callable_test', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var run = function (test) {
						var func = function (a, b) {
							return a * b;
						};
						test.check (func (3, 4));
						test.check (callable (func));
						for (var a of tuple ([true, false])) {
							test.check (callable (a));
						}
						var a = 1;
						test.check (callable (a));
						var a = 2.3;
						test.check (callable (a));
						var a = 'asdf';
						test.check (callable (a));
						var a = list ([]);
						test.check (callable (a));
						var a = list ([1, 2, 3, 3]);
						test.check (callable (a));
						var a = list (['asdf', 'qwer', 'zxcv']);
						test.check (callable (a));
						var a = dict ({'asdf': 1, 'qwer': 2});
						test.check (callable (a));
						var a = set (list ([1, 2]));
						test.check (callable (a));
						var CallObj = __class__ ('CallObj', [object], {
							get __init__ () {return __get__ (this, function (self, r) {
								self._r = r;
							});},
							get __call__ () {return __get__ (this, function (self) {
								return self._r;
							});}
						});
						__call__ (test.check, test, __call__ (callable, null, CallObj));
						var obj = __call__ (CallObj, null, 2);
						__call__ (test.check, test, __call__ (obj, null));
						__call__ (test.check, test, __call__ (callable, null, obj));
						__call__ (test.check, test, __call__ (callable, null, obj._r));
						var NonCallObj = __class__ ('NonCallObj', [object], {
							get __init__ () {return __get__ (this, function (self, b) {
								self._b = b;
							});},
							get func () {return __get__ (this, function (self) {
								return self._b;
							});}
						});
						__call__ (test.check, test, __call__ (callable, null, NonCallObj));
						var obj2 = __call__ (NonCallObj, null, 2);
						__call__ (test.check, test, __call__ (callable, null, obj2));
						__call__ (test.check, test, __call__ (callable, null, obj2._b));
						__call__ (test.check, test, __call__ (callable, null, obj2.func));
						var NonOpovNonCallObj = __class__ ('NonOpovNonCallObj', [object], {
							get __init__ () {return __get__ (this, function (self, c) {
								self._c = c;
							});},
							get other () {return __get__ (this, function (self, b) {
								return self._c * b;
							});},
							get _getC () {return __get__ (this, function (self) {
								return self._c;
							});},
							get _setC () {return __get__ (this, function (self, val) {
								self._c = val;
							});}
						});
						Object.defineProperty (NonOpovNonCallObj, 'C', property.call (NonOpovNonCallObj, NonOpovNonCallObj._getC, NonOpovNonCallObj._setC));;
						var obj = NonOpovNonCallObj (4);
						test.check (callable (obj));
						test.check (callable (obj.other));
						test.check (callable (obj._c));
						test.check (callable (obj.C));
						var exc = Exception ('asdf');
						test.check (callable (exc));
					};
					__pragma__ ('<all>')
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'classes', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var run = function (autoTester) {
						autoTester.check ('<br>General<br>');
						var A = __class__ ('A', [object], {
							p: 123,
							get __init__ () {return __get__ (this, function (self, x) {
								self.x = x;
								autoTester.check (self.p);
							});},
							get show () {return __get__ (this, function (self, label) {
								autoTester.check ('A.show', label, self.x);
							});},
							get show2 () {return __get__ (this, function (self, label) {
								autoTester.check ('A.show2', label, self.x);
							});}
						});
						var B = __class__ ('B', [object], {
							get __init__ () {return __get__ (this, function (self, y) {
								autoTester.check ('In B constructor');
								self.y = y;
								autoTester.check (self.p);
							});},
							get show () {return __get__ (this, function (self, label) {
								autoTester.check ('B.show', label, self.y);
							});}
						});
						var __left0__ = tuple ([456, 789]);
						B.p = __left0__ [0];
						B.q = __left0__ [1];
						var C = __class__ ('C', [A, B], {
							get __init__ () {return __get__ (this, function (self, x, y) {
								autoTester.check ('In C constructor');
								A.__init__ (self, x);
								B.__init__ (self, y);
							});},
							get show () {return __get__ (this, function (self, label) {
								A.show (self, label);
								B.show (self, label);
								autoTester.check ('C.show', label, self.x, self.y);
							});}
						});
						var a = A (1001);
						a.show ('america');
						autoTester.check (A.p);
						autoTester.check (a.p);
						var b = B (2002);
						b.show ('russia');
						autoTester.check (B.p);
						autoTester.check (b.p);
						autoTester.check (b.q);
						autoTester.check (A.p);
						autoTester.check (a.p);
						var c = C (3003, 4004);
						c.show ('netherlands');
						autoTester.check (C.p);
						autoTester.check (c.p);
						autoTester.check (c.q);
						c.show2 ('amsterdam');
						A.show2 (c, 'rotterdam');
						var show3 = c.show;
						show3 ('copy');
						autoTester.check (hasattr (a, 'x'));
						autoTester.check (hasattr (a, 'y'));
						autoTester.check (hasattr (a, 'p'));
						autoTester.check (hasattr (a, 'q'));
						autoTester.check ('<br><br>Augmented isinstance<br>');
						var simpleTypes = tuple ([dict, list, A, B, C, bool, str, float, int]);
						var tupleTypes = tuple ([tuple ([dict, list]), tuple ([bool, int]), tuple ([bool, A]), tuple ([C, B])]);
						for (var [i, types] of enumerate (tuple ([simpleTypes, tupleTypes]))) {
							for (var [j, aType] of enumerate (types)) {
								for (var [k, anObject] of enumerate (tuple ([dict ({'a': 1}), list ([]), a, C, c, C, b, true, 'a', 1, 1.2]))) {
									autoTester.check (i, j, k, isinstance (anObject, aType));
									if (types == simpleTypes) {
										autoTester.check (i, j, k, isinstance (anObject, simpleTypes));
									}
								}
							}
						}
						autoTester.check ('<br><br>Method resolution order<br>');
						var mro = function (aClass, result) {
							if (typeof result == 'undefined' || (result != null && result .hasOwnProperty ("__kwargtrans__"))) {;
								var result = null;
							};
							var last = 0;
							if (result === null) {
								var result = list ([aClass]);
								var last = 1;
							}
							for (var aBase of aClass.__bases__) {
								if (!(__in__ (aBase, result)) && aBase != object) {
									result.append (aBase);
									mro (aBase, result);
								}
							}
							if (last && __in__ (object, aClass.__bases__)) {
								aRoot.append (object);
							}
							return result;
						};
						autoTester.check (function () {
							var __accu0__ = [];
							for (var aClass of mro (C)) {
								__accu0__.append (aClass.__name__);
							}
							return __accu0__;
						} ());
					};
					__pragma__ ('<all>')
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'cmath', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var pi = Math.PI;
					var e = Math.E;
					var phase = function (x) {
						return (typeof x === 'number' ? 0 : Math.atan2 (x.imag, x.real));
					};
					var polar = function (x) {
						return (typeof x === 'number' ? tuple ([Math.abs (x), 0]) : tuple ([abs (x), phase (x)]));
					};
					var rect = function (r, phi) {
						return __mul__ (r, __add__ (__call__ (Math.cos, Math, phi), __mul__ (complex (0, 1.0), __call__ (Math.sin, Math, phi))));
					};
					var exp = function (x) {
						return (typeof x === 'number' ? complex (x, 0).__exp__ () : x.__exp__ ());
					};
					var log = function (x, base) {
						return (base === undefined ? (typeof x === 'number' ? complex (x, 0).__log__ () : x.__log__ ()) : __div__ (log (x), log (base)));
					};
					var log10 = function (x) {
						return log (x, 10);
					};
					var sqrt = function (x) {
						return exp (__mul__ (log (x), 0.5));
					};
					var sin = function (x) {
						return __mul__ (__neg__ (complex (0, 0.5)), __sub__ (__call__ (exp, null, __mul__ (complex (0, 1.0), x)), __call__ (exp, null, __mul__ (__neg__ (complex (0, 1.0)), x))));
					};
					var cos = function (x) {
						return __mul__ (0.5, __add__ (__call__ (exp, null, __mul__ (complex (0, 1.0), x)), __call__ (exp, null, __mul__ (__neg__ (complex (0, 1.0)), x))));
					};
					var tan = function (x) {
						return __div__ (__mul__ (__neg__ (complex (0, 1.0)), __sub__ (__call__ (exp, null, __mul__ (complex (0, 1.0), x)), __call__ (exp, null, __mul__ (__neg__ (complex (0, 1.0)), x)))), __add__ (__call__ (exp, null, __mul__ (complex (0, 1.0), x)), __call__ (exp, null, __mul__ (__neg__ (complex (0, 1.0)), x))));
					};
					var asin = function (x) {
						return __mul__ (__neg__ (complex (0, 1.0)), __call__ (log, null, __add__ (__mul__ (complex (0, 1.0), x), __call__ (sqrt, null, __sub__ (1, __mul__ (x, x))))));
					};
					var acos = function (x) {
						return __mul__ (__neg__ (complex (0, 1.0)), __call__ (log, null, __add__ (x, __mul__ (complex (0, 1.0), __call__ (sqrt, null, __sub__ (1, __mul__ (x, x)))))));
					};
					var atan = function (x) {
						return __mul__ (complex (0, 0.5), __call__ (log, null, __div__ (__add__ (complex (0, 1.0), x), __sub__ (complex (0, 1.0), x))));
					};
					var sinh = function (x) {
						return __mul__ (0.5, __sub__ (__call__ (exp, null, x), __call__ (exp, null, __neg__ (x))));
					};
					var cosh = function (x) {
						return __mul__ (0.5, __add__ (__call__ (exp, null, x), __call__ (exp, null, __neg__ (x))));
					};
					var tanh = function (x) {
						return __div__ (__sub__ (__call__ (exp, null, x), __call__ (exp, null, __neg__ (x))), __add__ (__call__ (exp, null, x), __call__ (exp, null, __neg__ (x))));
					};
					var asinh = function (x) {
						return __call__ (log, null, __add__ (x, __call__ (sqrt, null, __add__ (1, __mul__ (x, x)))));
					};
					var acosh = function (x) {
						return __call__ (log, null, __add__ (x, __call__ (sqrt, null, __add__ (__neg__ (1), __mul__ (x, x)))));
					};
					var atanh = function (x) {
						return __mul__ (0.5, __call__ (log, null, __div__ (__add__ (1, x), __sub__ (1, x))));
					};
					var isinf = function (x) {
						return x.real == js_Infinite || x.imag == js.Infinite;
					};
					var isfinite = function (x) {
						return !(isinf (x));
					};
					var isnan = function (x) {
						return isNaN (x.real) || isNaN (x.imag);
					};
					__pragma__ ('<all>')
						__all__.acos = acos;
						__all__.acosh = acosh;
						__all__.asin = asin;
						__all__.asinh = asinh;
						__all__.atan = atan;
						__all__.atanh = atanh;
						__all__.cos = cos;
						__all__.cosh = cosh;
						__all__.e = e;
						__all__.exp = exp;
						__all__.isfinite = isfinite;
						__all__.isinf = isinf;
						__all__.isnan = isnan;
						__all__.log = log;
						__all__.log10 = log10;
						__all__.phase = phase;
						__all__.pi = pi;
						__all__.polar = polar;
						__all__.rect = rect;
						__all__.sin = sin;
						__all__.sinh = sinh;
						__all__.sqrt = sqrt;
						__all__.tan = tan;
						__all__.tanh = tanh;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'complex_numbers', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var run = function (autoTester) {
						var x = 567;
						var y = -(3);
						var z = 5 * x + 2 * y;
						autoTester.check (x, y, z);
						var a = __add__ (234, complex (0, 3.0));
						var b = __sub__ (4, complex (0, 5.0));
						var c = __call__ (complex, null, __neg__ (6), 7);
						__call__ (autoTester.check, autoTester, a, b, c);
						var t = __add__ (__sub__ (__mul__ (6, x), __mul__ (3, y)), 7);
						__call__ (autoTester.check, autoTester, t);
						var d = __mul__ (2, a);
						var e = __mul__ (x, b);
						var f = __add__ (__add__ (z, d), e);
						var g = __div__ (a, b);
						var h = __sub__ (a, b);
						var i = __sub__ (x, c);
						var j = __sub__ (a, x);
						var k = __add__ (b, y);
						__call__ (autoTester.check, autoTester, d, e, f, __call__ (round, null, g.real, 2), __call__ (round, null, g.imag, 2), h, i, j, k);
					};
					__pragma__ ('<all>')
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'conditional_expressions', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var f = function (x, b) {
						return (b ? x * x : x + x);
					};
					var run = function (autoTester) {
						var bools = tuple ([false, true]);
						for (var a of bools) {
							for (var b of bools) {
								autoTester.check (f ((a ? 10 : 100), b));
							}
						}
						for (var p of bools) {
							for (var q of bools) {
								for (var r of bools) {
									autoTester.check ((p ? 'a' : (q ? 'b' : (r ? 'c' : 'd'))));
									var a = (r ? (q ? (p ? 'e' : 'f') : 'g') : 'h');
									var b = (p ? 'i' : (q ? 'j' : (r ? 'k' : 'l')));
									var c = ((q ? p : r) ? 'm' : 'n');
									var d = ((p < q && q <= r) ? 'o' : 'p');
									autoTester.check (a, b, c, d);
								}
							}
						}
						var odd = function () {
							var __accu0__ = [];
							for (var x = 0; x < 10; x++) {
								__accu0__.append ((__mod__ (x, 2) ? x : x + 1));
							}
							return __accu0__;
						} ();
						var noDuplicates = set (odd);
						autoTester.check (odd, noDuplicates);
					};
					__pragma__ ('<all>')
						__all__.f = f;
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'control_structures', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var run = function (autoTester) {
						for (var index = 0; index < 10; index++) {
							autoTester.check (index);
						}
						for (var index = 8; index < 16; index++) {
							autoTester.check (index);
						}
						for (var index = 8; index < 16; index += 2) {
							autoTester.check (index);
						}
						for (var index = 10; index > 0; index--) {
							autoTester.check (index);
						}
						for (var index = 16; index > 8; index -= 2) {
							autoTester.check (index);
						}
						for (var animal of tuple (['cat', 'dog', 'turtle', 'goldfish'])) {
							autoTester.check (animal);
						}
						for (var [index, square] of enumerate (function () {
							var __accu0__ = [];
							for (var x = 0; x < 10; x++) {
								if (__mod__ (x, 2)) {
									__accu0__.append (x * x);
								}
							}
							return __accu0__;
						} ())) {
							for (var y of tuple ([1, 2, 3])) {
								for (var z of tuple ([10, 20, 30])) {
									autoTester.check (square + y, z);
								}
							}
						}
						var vehicles = list (['bike', 'train', 'boat', 'car', 'plane', 'bus']);
						for (var doBreak of tuple ([false, true])) {
							for (var doContinue of tuple ([false, true])) {
								var __break2__ = false;
								for (var index = 0; index < 10; index++) {
									var __break3__ = false;
									for (var index2 = 0; index2 < 100; index2 += 10) {
										if (doBreak && index2 == 50) {
											autoTester.check ('break2');
											__break3__ = true;
											break;
										}
										if (doContinue && index2 == 50) {
											autoTester.check ('continue2');
											continue;
										}
									}
									if (!__break3__) {
										autoTester.check ('noBreak2');
									}
									if (doBreak && index == 5) {
										autoTester.check ('break');
										__break2__ = true;
										break;
									}
									if (doContinue && index == 5) {
										autoTester.check ('continue');
										continue;
									}
								}
								if (!__break2__) {
									autoTester.check ('noBreak');
								}
								var index = 0;
								var __break2__ = false;
								while (index < len (vehicles) && vehicles [index] != 'bus') {
									autoTester.check (index, vehicles [index]);
									if (doBreak && vehicles [index] == 'car') {
										autoTester.check ('breakWhile');
										__break2__ = true;
										break;
									}
									if (doContinue && vehicles [index] == 'car') {
										autoTester.check ('continueWhile');
										index++;
										continue;
									}
									index++;
								}
								if (!__break2__) {
									autoTester.check ('noBreakWhile');
								}
							}
							for (var vehicle of vehicles) {
								if (vehicle == 'bike') {
									autoTester.check ('netherlands');
								}
								else if (vehicle == 'car') {
									autoTester.check ('america');
								}
								else if (vehicle == 'boat') {
									autoTester.check ('oceania');
								}
								else {
									autoTester.check ('anywhere');
								}
							}
						}
					};
					__pragma__ ('<all>')
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'dashed_numbers', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var math = {};
					__nest__ (math, '', __init__ (__world__.math));
					var run = function (autoTester) {
						autoTester.check (1000000000);
						autoTester.check (120000.03);
						autoTester.check (16777215);
					};
					__pragma__ ('<use>' +
						'math' +
					'</use>')
					__pragma__ ('<all>')
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'data_structures', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var run = function (autoTester) {
						var aList = list ([1, 2, 3, 'moon', 'stars']);
						autoTester.check (aList);
						aList.insert (3, 'sun');
						autoTester.check (aList);
						autoTester.check (aList.__getslice__ (2, 4, 1));
						autoTester.check (aList.__getslice__ (0, null, 1));
						autoTester.check (aList.__getslice__ (2, null, 1));
						autoTester.check (len (aList));
						aList.append ('milkyway');
						autoTester.check (aList);
						aList.extend (list (['m1', 'm31']));
						autoTester.check (aList);
						var anotherList = list (tuple (['a', 'b', 'c']));
						autoTester.check (anotherList);
						autoTester.check (__in__ ('b', anotherList));
						autoTester.check (__in__ ('d', anotherList));
						var aDict = dict ({1: 'plant', 'animal': 2});
						autoTester.check (aDict);
						autoTester.check (aDict [1], aDict ['animal']);
						var p = function () {
							return 3;
						};
						var q = 4;
						autoTester.check (dict ([[p (), 'three'], [q, 'four']]));
						var aTuple = tuple ([1, 2, 3, 4, 5]);
						autoTester.check (aTuple);
						autoTester.check (len (aTuple));
						var anotherTuple = tuple ([1]);
						autoTester.check (anotherTuple);
						var aSet = new set ([1, 2, 2, 3]);
						autoTester.check (aSet);
						autoTester.check (len (aSet));
						autoTester.check (__in__ (2, aSet));
						autoTester.check (__in__ (4, aSet));
						var anotherSet = set (tuple ([4, 5, 5, 6]));
						autoTester.check (anotherSet);
						var emptySet = set ();
						autoTester.check (emptySet);
						autoTester.check (len (emptySet));
						var aString = 'c_cis_d_dis_e_f_fis_g_gis_a_ais_b_c';
						autoTester.check (__in__ ('cis', aString));
						autoTester.check (__in__ ('g', aString));
						autoTester.check (__in__ ('bes', aString));
						autoTester.check (__in__ ('z', aString));
					};
					__pragma__ ('<all>')
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'decorators', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var run = function (autoTester) {
						var repeat3 = function (bareFunc) {
							var innerFunc = function () {
								var kwargs = dict ();
								if (arguments.length) {
									var __ilastarg0__ = arguments.length - 1;
									if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
										var __allkwargs0__ = arguments [__ilastarg0__--];
										for (var __attrib0__ in __allkwargs0__) {
											switch (__attrib0__) {
												default: kwargs [__attrib0__] = __allkwargs0__ [__attrib0__];
											}
										}
										delete kwargs.__kwargtrans__;
									}
									var args = tuple ([].slice.apply (arguments).slice (0, __ilastarg0__ + 1));
								}
								else {
									var args = tuple ();
								}
								autoTester.check ('BEGIN repeat3');
								for (var i = 0; i < 3; i++) {
									bareFunc (...args, __kwargtrans__ (kwargs));
								}
								autoTester.check ('END repeat3');
							};
							return innerFunc;
						};
						var repeatN = function (n) {
							var repeat = function (bareFunc) {
								var innerFunc = function () {
									var kwargs = dict ();
									if (arguments.length) {
										var __ilastarg0__ = arguments.length - 1;
										if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
											var __allkwargs0__ = arguments [__ilastarg0__--];
											for (var __attrib0__ in __allkwargs0__) {
												switch (__attrib0__) {
													default: kwargs [__attrib0__] = __allkwargs0__ [__attrib0__];
												}
											}
											delete kwargs.__kwargtrans__;
										}
										var args = tuple ([].slice.apply (arguments).slice (0, __ilastarg0__ + 1));
									}
									else {
										var args = tuple ();
									}
									autoTester.check ('BEGIN repeatN ({})'.format (n));
									for (var i = 0; i < n; i++) {
										bareFunc (...args, __kwargtrans__ (kwargs));
									}
									autoTester.check ('END repeatN ({})'.format (n));
								};
								return innerFunc;
							};
							return repeat;
						};
						var Repeater = __class__ ('Repeater', [object], {
							get __init__ () {return __get__ (this, function (self, n) {
								self.n = n;
							});},
							get __call__ () {return __get__ (this, function (self, bareFunc) {
								var innerFunc = function () {
									var kwargs = dict ();
									if (arguments.length) {
										var __ilastarg0__ = arguments.length - 1;
										if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
											var __allkwargs0__ = arguments [__ilastarg0__--];
											for (var __attrib0__ in __allkwargs0__) {
												switch (__attrib0__) {
													default: kwargs [__attrib0__] = __allkwargs0__ [__attrib0__];
												}
											}
											delete kwargs.__kwargtrans__;
										}
										var args = tuple ([].slice.apply (arguments).slice (0, __ilastarg0__ + 1));
									}
									else {
										var args = tuple ();
									}
									autoTester.check ('BEGIN repeat3');
									for (var i = 0; i < self.n; i++) {
										bareFunc (...args, __kwargtrans__ (kwargs));
									}
									autoTester.check ('END repeat3');
								};
								return innerFunc;
							});}
						});
						var funcNoArg = function () {
							autoTester.check ('spam');
						}
						var funcNoArg = repeat3 (funcNoArg)
						var funcNoArg = repeatN (4) (funcNoArg);
						funcNoArg ();
						autoTester.check ();
						var funcArg = function (a) {
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											case 'a': var a = __allkwargs0__ [__attrib0__]; break;
										}
									}
								}
							}
							else {
							}
							autoTester.check ('eggs', a);
						}
						var funcArg = repeatN (2) (funcArg)
						var funcArg = repeat3 (funcArg);
						funcArg (3);
						autoTester.check ();
						funcArg (__kwargtrans__ ({a: 4}));
						autoTester.check ();
						var funcNoArg2 = function () {
							__call__ (autoTester.check, autoTester, 'toast');
						}
						var funcNoArg2 = __call__ (__call__ (Repeater, null, 3), null, funcNoArg2);
						funcNoArg2 ();
						autoTester.check ();
						var funcArg2 = function (a) {
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											case 'a': var a = __allkwargs0__ [__attrib0__]; break;
										}
									}
								}
							}
							else {
							}
							__call__ (autoTester.check, autoTester, 'jam', a);
						}
						var funcArg2 = __call__ (__call__ (Repeater, null, 5), null, funcArg2);
						funcArg2 (3);
						autoTester.check ();
						funcArg2 (__kwargtrans__ ({a: 4}));
						autoTester.check ();
						var py_next = function (bareFunc) {
							var innerFunc = function (value) {
								return bareFunc (value + 1);
							};
							return innerFunc;
						};
						var Number = __class__ ('Number', [object], {
							get __init__ () {return __get__ (this, function (self, value) {
								self.value = value;
							});}
						})
						var Number = py_next (Number);
						autoTester.check ('two', Number (1).value);
						var Test = __class__ ('Test', [object], {
							get f () {return __get__ (this, function (cls, x, y) {
								autoTester.check (cls.__name__, x, y);
							});},
							get g () {return __get__ (this, function (self, x, y) {
								autoTester.check (self.__class__.__name__, x, y);
							});}
						});
						var test = Test ();
						test.f (1, 2);
						test.g (3, 4);
					};
					__pragma__ ('<all>')
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'dict_comprehensions', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var run = function (autoTester) {
						var original = dict ({'Isaac': 'Newton', 'Albert': 'Einstein', 'Paul': 'Dirac'});
						autoTester.check (original);
						var inverted = function () {
							var __accu0__ = [];
							for (var key of __i__ (original)) {
								__accu0__.append (list ([original [key], key]));
							}
							return dict (__accu0__);
						} ();
						autoTester.check (inverted);
					};
					__pragma__ ('<all>')
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'dictionaries', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var run = function (autoTester) {
						var tel = dict ({'guido': 4127, 'jack': 4098});
						autoTester.check (len (tel));
						tel ['sape'] = 4139;
						autoTester.check (tel);
						autoTester.check (tel ['jack']);
						delete tel ['sape'];
						tel ['irv'] = 4127;
						autoTester.check (tel);
						autoTester.check (sorted (list (tel.py_keys ())), false);
						autoTester.check (sorted (tel.py_keys ()));
						autoTester.check (__in__ ('guido', tel));
						autoTester.check (!__in__ ('jack', tel));
						autoTester.check (dict (list ([tuple (['guido', 4127]), tuple (['jack', 4098]), tuple (['sape', 4139])])));
						autoTester.check (autoTester.expectException ((function __lambda__ () {
							return dict (1);
						})));
						autoTester.check (autoTester.expectException ((function __lambda__ () {
							return dict (134.34);
						})));
						autoTester.check (autoTester.expectException ((function __lambda__ () {
							return dict ('asdf');
						})));
						autoTester.check (autoTester.expectException ((function __lambda__ () {
							return dict (list (['1234', 1]));
						})));
						autoTester.check (dict (list ([])));
						autoTester.check (dict (dict ({})));
						autoTester.check (dict (dict ({'asdf': 1, 'qwer': 2})));
						var b = dict ({'a': 2.01, 'b': -(3.3)});
						var d = dict (b);
						autoTester.check (d);
						var b = dict ({'a': 2, 'b': list ([1, 2, 3])});
						var d = dict (b);
						autoTester.check (d);
						var b = dict ({'a': null, 'b': set (list ([1, 2, 3]))});
						var d = dict (b);
						autoTester.check (d);
						var b = dict ({'a': dict ({'c': 2}), 'b': tuple ([1, 2])});
						var d = dict (b);
						autoTester.check (d);
						autoTester.check (d ['a'] ['c']);
						autoTester.check (d.py_get ('a').py_get ('c'));
						autoTester.check (b.py_get ('a').py_get ('c'));
						d ['a'] ['c'] = 3;
						autoTester.check (d.py_get ('a').py_get ('c'));
						autoTester.check (b.py_get ('a').py_get ('c'));
						var knights = dict ({'robin': 'the brave', 'gallahad': 'the pure'});
						for (var [k, v] of __i__ (sorted (knights.py_items ()))) {
							autoTester.check (k, v);
						}
						if (__in__ ('gallahad', knights)) {
							autoTester.check ('gallahad is a knight');
						}
						for (var k of __i__ (sorted (knights))) {
							autoTester.check (k);
						}
						var knight = dict ({'rudolph': 'the righteous'});
						for (var k of __i__ (knight)) {
							autoTester.check (k);
						}
						var tel = dict ({'guido': 123});
						tel.py_update (dict ({'edsger': 42}));
						autoTester.check (tel.py_setdefault ('linus', 456));
						autoTester.check (tel ['linus']);
						autoTester.check (tel.py_setdefault ('guido', 789));
						autoTester.check (tel.py_pop ('guido', 1));
						autoTester.check (tel.py_pop ('guido', 1));
						autoTester.check (tel.py_pop ('edsger', 2));
						autoTester.check (tel.py_pop ('foo', 'bar'));
						autoTester.check (tel.py_pop ('foo', null));
						var d = dict ({});
						d ['a'] = 3777;
						d.__setitem__ ([1, 2], 4777);
						autoTester.check (d ['a'], d.__getitem__ ([1, 2]));
						var d = dict ({});
						__setitem__ (d, 'a', 3777);
						d.__setitem__ ([1, 2], 4777);
						__call__ (autoTester.check, autoTester, __getitem__ (d, 'a'), d.__getitem__ ([1, 2]));
						var knights = dict ({'robin': 'the brave', 'gallahad': 'the pure'});
						autoTester.check (autoTester.expectException ((function __lambda__ () {
							return knights.py_pop ('batman');
						})));
						autoTester.check (autoTester.expectException ((function __lambda__ () {
							return knights.py_pop ('batman', null);
						})));
						autoTester.check (autoTester.expectException ((function __lambda__ () {
							return knights.py_pop ('batman', 'the gullible');
						})));
					};
					__pragma__ ('<all>')
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'div_issues', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var aB = __init__ (__world__.div_issues.issue55).aB;
					var anA = __init__ (__world__.div_issues.issue55).anA;
					var f1 = __init__ (__world__.div_issues.issue55).f1;
					var p = __init__ (__world__.div_issues.issue55).p;
					var q = __init__ (__world__.div_issues.issue55).q;
					var r = __init__ (__world__.div_issues.issue55).r;
					var y = __init__ (__world__.div_issues.issue55).y;
					var run = function (autoTester) {
						autoTester.check ('Issue 24');
						var py_switch = false;
						autoTester.check (py_switch);
						autoTester.check ('Issue 27');
						autoTester.check (list (['zero', 'one', 'two', 'three', 'four']).index ('three'));
						autoTester.check ('Issue 36');
						var results = list ([]);
						for (var i = 0; i < 10; i++) {
							results.append ((function __lambda__ (j) {
								return (function __lambda__ () {
									return j;
								});
							}) (i));
						}
						autoTester.check (function () {
							var __accu0__ = [];
							for (var result of results) {
								__accu0__.append (result ());
							}
							return __accu0__;
						} ());
						autoTester.check ('Issue 37');
						autoTester.check (Math.floor (15 / 7));
						autoTester.check ('Issue 40');
						autoTester.check (65 / (5 * 2));
						autoTester.check ('Issue 50');
						autoTester.check ((Math.floor (((240 + 30) - 1) / 30)) * 30);
						autoTester.check ('Issue 51');
						var a = 1;
						var b = 1;
						autoTester.check (a, b, new set ([a, b]) == new set ([1, 2]));
						autoTester.check ('Issue 52');
						var __left0__ = tuple (['switch', 'case', 'default']);
						var py_switch = __left0__ [0];
						var py_case = __left0__ [1];
						var py_default = __left0__ [2];
						autoTester.check (py_switch, py_case, py_default);
						autoTester.check ('Issue 54');
						var aDict = dict ({1: 11, 2: 22, 3: 33});
						autoTester.check (aDict);
						aDict.py_clear ();
						autoTester.check (aDict);
						autoTester.check ('Issue 60');
						var three = 3;
						var one = three & 1;
						var seven = three | 4;
						var eight = one << 3;
						var four = eight >> 1;
						var aTrue = bool (three & one);
						var aFalse = bool (three & four);
						autoTester.check (3, three, 1, one, 7, seven, 8, eight, 4, four, true, aTrue, false, aFalse);
						autoTester.check ('Issue 65');
						var aList = list ([4, 5, 6]);
						__call__ (autoTester.check, autoTester, __add__ (__add__ (list ([1, 2, 3]), aList), list ([4, 5, 6])));
						__call__ (autoTester.check, autoTester, __mul__ (3, list ([1, 2, 3])));
						__call__ (autoTester.check, autoTester, __mul__ (list ([1, 2, 3]), 3));
						var aString = 'Crocodile';
						__call__ (autoTester.check, autoTester, __add__ (__add__ ('Tiger', aString), 'Elephant'));
						__call__ (autoTester.check, autoTester, __mul__ (3, aString));
						__call__ (autoTester.check, autoTester, __mul__ (aString, 3));
						autoTester.check ('Issue 76');
						var initially17 = 17;
						autoTester.check (initially17);
						var initially17 = Math.floor (initially17 / 2);
						autoTester.check (initially17);
						var initially17 = Math.floor (initially17 / 2);
						autoTester.check (initially17);
						autoTester.check ('Issue 112');
						try {
							if (__envir__.executor_name == __envir__.transpiler_name) {
								var x = new Int8Array (2);
							}
							else {
								var x = list ([null, null]);
							}
							x [0] = 3;
							x [1] = 2;
							for (var i of x) {
								autoTester.check (i);
							}
							if (__in__ ('__esv6__', __symbols__)) {
								var y = 3;
								for (var j of y) {
									autoTester.check (j);
								}
							}
						}
						catch (__except0__) {
							// pass;
						}
						if (__in__ ('__esv6__', __symbols__)) {
							autoTester.check ('Issue 122');
							var chunks = function* (aList, chunkLength) {
								for (var index of range (0, len (aList), chunkLength)) {
									yield aList.__getslice__ (index, index + chunkLength, 1);
								}
							};
							for (var chunk of chunks (function () {
								var __accu0__ = [];
								for (var index = 0; index < 26; index++) {
									__accu0__.append (chr (index + 97));
								}
								return __accu0__;
							} (), 10)) {
								autoTester.check (chunk);
							}
						}
						autoTester.check ('Issue 123');
						autoTester.check (__mod__ (10, 3), __mod__ (10, -(3)), __mod__ (-(10), 3), __mod__ (-(10), -(3)), __mod__ (10, 10), __mod__ (10, -(10)), __mod__ (-(10), 10), __mod__ (-(10), -(10)));
						autoTester.check ('Issue 125');
						var abc = 'abc';
						for (var index of abc) {
							autoTester.check (abc);
						}
						autoTester.check ('Issue 127');
						autoTester.check (dict ({'include_docs': 'true', 'keys': list (['key1', 'key2']), 'limit': 50}));
						autoTester.check ('Issue 134');
						var __left0__ = tuple ([5, 12, -(5), -(5), 0, 0]);
						var x0 = __left0__ [0];
						var x1 = __left0__ [1];
						var x2 = __left0__ [2];
						var x3 = __left0__ [3];
						var x4 = __left0__ [4];
						var x5 = __left0__ [5];
						var x0 = __mod__ (x0, 10);
						var x1 = __mod__ (x1, 5);
						var x2 = __mod__ (x2, 2);
						var x3 = __mod__ (x3, -(3));
						var x4 = __mod__ (x4, 1);
						var x5 = __mod__ (x5, -(1000));
						autoTester.check (x0, x1, x2, x3, x4);
						autoTester.check ('Issue 136');
						var aDict = dict ({'a': 'ape', 'b': 'banana'});
						autoTester.check (aDict.py_get ('a', 'noApe'), aDict.py_get ('b'), aDict.py_get ('c', 'noCarot'), aDict.py_get ('d'));
						autoTester.check ('Issue 144');
						var aList = function () {
							var __accu0__ = [];
							for (var x of list ([1, 2, 3])) {
								__call__ (__accu0__.append, __accu0__, x);
							}
							return __accu0__;
						} ();
						__call__ (autoTester.check, autoTester, aList);
						autoTester.check ('<br><br>Issue 145<br>');
						var SortTest = __class__ ('SortTest', [object], {
							get __init__ () {return __get__ (this, function (self) {
								self.alphabet = 'abcdefghijklmnopqrstuvwxyz';
								self.nChars = 10;
								self.nCols = 10;
								self.nRows = 30;
								self.pseudoRandom = 0;
								var randomWord = function () {
									var word = '';
									for (var iChar = 0; iChar < self.nChars; iChar++) {
										self.pseudoRandom = __mod__ (81212 * self.pseudoRandom + 28411, 134456);
										word += self.alphabet [__mod__ (self.pseudoRandom, 26)];
									}
									return word;
								};
								self.rows = function () {
									var __accu0__ = [];
									for (var iRow = 0; iRow < self.nRows; iRow++) {
										__accu0__.append (function () {
											var __accu1__ = [];
											for (var iCol = 0; iCol < self.nCols; iCol++) {
												__accu1__.append (randomWord ());
											}
											return __accu1__;
										} ());
									}
									return __accu0__;
								} ();
							});},
							get py_sort () {return __get__ (this, function (self) {
								for (var iCol of py_reversed (range (self.nCols))) {
									self.rows.py_sort (__kwargtrans__ ({key: (function __lambda__ (row) {
										return row [iCol];
									})}));
								}
							});}
						});
						var sortTest = SortTest ();
						autoTester.check ('<br>Unsorted:<br>');
						for (var row of sortTest.rows) {
							autoTester.check ('{}<br>'.format (','.join (function () {
								var __accu0__ = [];
								for (var word of row) {
									__accu0__.append (word);
								}
								return __accu0__;
							} ())));
						}
						sortTest.py_sort ();
						autoTester.check ('<br>Sorted:<br>');
						for (var row of sortTest.rows) {
							autoTester.check ('{}<br>'.format (','.join (function () {
								var __accu0__ = [];
								for (var word of row) {
									__accu0__.append (word);
								}
								return __accu0__;
							} ())));
						}
						autoTester.check ('<br><br>Issue 148<br>');
						var aDict = dict ({'items': list ([4, 5, 6])});
						for (var [aKey, aValue] of aDict.py_items ()) {
							autoTester.check ('{}: {}'.format (aKey, aValue));
						}
						autoTester.check ('<br><br>Issue 169<br>');
						autoTester.check (int (1 / float ('inf')), int (1 / float ('-inf')));
						autoTester.check ('<br><br>Issue 178<br>');
						var bitmaps = list ([tuple ([2, '']), tuple ([4, '']), tuple ([8, 'i']), tuple ([16, 'm']), tuple ([32, 'y']), tuple ([64, 'u']), tuple ([128, 'g'])]);
						for (var flags of tuple ([122, 233, 11, 55, 79, 201, 23, 111, 200, 100, 50, 25, 12, 6])) {
							autoTester.check (''.join (function () {
								var __accu0__ = [];
								for (var x of bitmaps) {
									if ((x [0] & flags) > 0) {
										__accu0__.append (x [1]);
									}
								}
								return __accu0__;
							} ()));
						}
						var issue256 = function () {
							autoTester.check ('Issue 256');
							var C = __class__ ('C', [object], {
								get __init__ () {return __get__ (this, function (self, value) {
									self.value = value;
								});}
							});
							var f1 = function (value) {
								return (C (value).value || 'second').capitalize () == 'First';
							};
							var f2 = function (value) {
								return (C (value).value || 'second').capitalize () == 'Second';
							};
							var f3 = function (value) {
								return C (value).value || 'second';
							};
							var f4 = function (value) {
								return C (value).value || 'second';
							};
							autoTester.check (f1 ('first'));
							autoTester.check (f1 (''));
							autoTester.check (f2 ('first'));
							autoTester.check (f2 (''));
							autoTester.check (f3 ('first'));
							autoTester.check (f4 (''));
						};
						issue256 ();
						autoTester.check ('Issue 274');
						var a = 3;
						autoTester.check ('Still alive');
						autoTester.check ('Issue 276');
						var a = 2;
						var b = Math.pow (a, 3);
						var a = Math.pow (a, 4);
						autoTester.check (a, b);
						autoTester.check ('Issue 277');
						var py_new = 3;
						autoTester.check (py_new);
						autoTester.check ('Issue 279');
						var A = __class__ ('A', [object], {
							py_TypeError: 111,
							TypeError: 222
						});
						autoTester.check (A.py_TypeError, A.TypeError);
						autoTester.check ('Still alive');
						autoTester.check ('Issue 301');
						var filter_word = function (word0, word1) {
							if (len (word0) != len (word1)) {
								return false;
							}
							for (var [char0, char1] of zip (word0, word1)) {
								if (char0 != '_' && char0 != char1) {
									return false;
								}
							}
							return true;
						};
						autoTester.check (filter_word ('bee', 'beer'));
						autoTester.check (filter_word ('wine', 'wine'));
						autoTester.check (filter_word ('win_', 'wind'));
						autoTester.check (filter_word ('_in_', 'kind'));
						autoTester.check (filter_word ('min_', 'kind'));
						autoTester.check ('Issue 306');
						var dict_306 = dict ({'Abraham': 'Lincoln', 'Barack': "O'Bama", 'Thomas': 'Jefferson'});
						var results = list ([]);
						try {
							while (true) {
								results.append (dict_306.py_popitem ());
							}
						}
						catch (__except0__) {
							if (isinstance (__except0__, Exception)) {
								var exception = __except0__;
								autoTester.check (sorted (results));
								autoTester.check ("That's it");
							}
							else {
								throw __except0__;
							}
						}
						autoTester.check ('Issue 314');
						try {
							autoTester.check (int (float (123)));
						}
						catch (__except0__) {
							autoTester.check ('a');
						}
						try {
							autoTester.check (float (12.3));
						}
						catch (__except0__) {
							autoTester.check ('b');
						}
						try {
							autoTester.check (int (float ('123')));
						}
						catch (__except0__) {
							autoTester.check ('c');
						}
						try {
							autoTester.check (int (float (' 123')));
						}
						catch (__except0__) {
							autoTester.check ('d');
						}
						try {
							autoTester.check (float (''));
						}
						catch (__except0__) {
							autoTester.check ('e');
						}
						try {
							autoTester.check (float (' '));
						}
						catch (__except0__) {
							autoTester.check ('f');
						}
						try {
							autoTester.check (float ('drie'));
						}
						catch (__except0__) {
							autoTester.check ('g');
						}
						autoTester.check ('Issue 316');
						autoTester.check (list (filter (null, list ([list ([1, 2]), list ([3]), list ([]), list ([4, 5]), list ([6])]))));
						autoTester.check (list (filter ((function __lambda__ (l) {
							return len (l) >= 2;
						}), list ([list ([1, 2]), list ([3]), list ([]), list ([4, 5]), list ([6])]))));
						autoTester.check ('Issue 317');
						var mylist = list ([]);
						try {
							mylist.remove ('value');
						}
						catch (__except0__) {
							if (isinstance (__except0__, ValueError)) {
								var exception = __except0__;
								autoTester.check (exception.__class__.__name__);
							}
							else {
								throw __except0__;
							}
						}
					};
					__pragma__ ('<use>' +
						'div_issues.issue55' +
					'</use>')
					__pragma__ ('<all>')
						__all__.aB = aB;
						__all__.anA = anA;
						__all__.f1 = f1;
						__all__.p = p;
						__all__.q = q;
						__all__.r = r;
						__all__.run = run;
						__all__.y = y;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'div_issues.issue55', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var f1 = __init__ (__world__.div_issues.issue55.a).f1;
					var p = __init__ (__world__.div_issues.issue55.sub1).p;
					var q = __init__ (__world__.div_issues.issue55.sub1).q;
					var r = __init__ (__world__.div_issues.issue55.sub1).r;
					var anA = __init__ (__world__.div_issues.issue55.sub2).anA;
					var aB = __init__ (__world__.div_issues.issue55.sub2).aB;
					var y = __init__ (__world__.div_issues.issue55.sub3).x;
					__pragma__ ('<use>' +
						'div_issues.issue55.a' +
						'div_issues.issue55.sub1' +
						'div_issues.issue55.sub2' +
						'div_issues.issue55.sub3' +
					'</use>')
					__pragma__ ('<all>')
						__all__.aB = aB;
						__all__.anA = anA;
						__all__.f1 = f1;
						__all__.p = p;
						__all__.q = q;
						__all__.r = r;
						__all__.y = y;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'div_issues.issue55.a', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var f1 = function () {
						return 'f1';
					};
					__pragma__ ('<all>')
						__all__.f1 = f1;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'div_issues.issue55.sub1', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var p = 'p';
					var q = 'q';
					var r = 'r';
					__pragma__ ('<all>')
						__all__.p = p;
						__all__.q = q;
						__all__.r = r;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'div_issues.issue55.sub2', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var anA = 'a';
					var aB = 'b';
					__pragma__ ('<all>')
						__all__.aB = aB;
						__all__.anA = anA;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'div_issues.issue55.sub3', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var x = 'x';
					__pragma__ ('<all>')
						__all__.x = x;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'div_pulls', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var A = __class__ ('A', [object], {
						get __init__ () {return __get__ (this, function (self, x) {
							self.x = x;
						});}
					});
					var a = A (5.5);
					var run = function (autoTester) {
						autoTester.check ('Pull 56');
						var s = 'abcdefghij';
						autoTester.check (s.__getslice__ (2, 3, 1));
						autoTester.check (s.__getslice__ (0, 3, 1));
						autoTester.check (s.__getslice__ (2, null, 1));
						autoTester.check (s.__getslice__ (0, null, 2));
						autoTester.check ('Pull 59');
						autoTester.check (list (filter ((function __lambda__ (x) {
							return __mod__ (x, 2) == 0;
						}), range (10))));
						autoTester.check (list (map ((function __lambda__ (x) {
							return x * x;
						}), range (0, 31, 3))));
					};
					__pragma__ ('<all>')
						__all__.A = A;
						__all__.a = a;
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'docstrings', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var __doc__ = 'Just a module\nto test docstrings';
					var run = function (autoTester) {
						var f = function (p) {
							autoTester.check (p);
						} .__setdoc__ ('Just a function\n        called f');
						var C = __class__ ('C', [object], {
							get g () {return __get__ (this, function (self, q) {
								autoTester.check (q);
							} .__setdoc__ ('Just a method\n            called g'));}
						}) .__setdoc__ ('Just a class\n        called C');
						autoTester.check (__doc__);
						autoTester.check ();
						autoTester.check (f.__doc__);
						autoTester.check ();
						autoTester.check (C.__doc__);
						autoTester.check ();
						autoTester.check (C.g.__doc__);
						autoTester.check ();
						f ('Doc');
						C ().g ('strings');
					};
					__pragma__ ('<all>')
						__all__.__doc__ = __doc__;
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'exceptions', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					if (__envir__.executor_name == __envir__.transpiler_name) {
						var BaseException = __class__ ('BaseException', [object], {
						});
					}
					var Ex1 = __class__ ('Ex1', [Exception], {
					});
					var Ex2 = __class__ ('Ex2', [Ex1], {
					});
					var Ex3 = __class__ ('Ex3', [Exception], {
					});
					var Table = __class__ ('Table', [BaseException], {
						get __init__ () {return __get__ (this, function (self) {
							var args = tuple ([].slice.apply (arguments).slice (1));
							self.fields = args;
						});},
						get __repr__ () {return __get__ (this, function (self) {
							return 'Table' + repr (self.fields).py_replace (', ', ',').py_replace ("'", '');
						});}
					});
					var test1 = function () {
						var __except0__ = Exception ('mary');
						__except0__.__cause__ = null;
						throw __except0__;
					};
					var test2 = function (autoTester) {
						try {
							test1 ();
						}
						catch (__except0__) {
							if (isinstance (__except0__, Ex1)) {
								var exception = __except0__;
								autoTester.check (111);
								autoTester.check (exception);
							}
							else if (isinstance (__except0__, Exception)) {
								var exception = __except0__;
								autoTester.check (222);
								autoTester.check (exception);
							}
							else {
								throw __except0__;
							}
						}
					};
					var run = function (autoTester) {
						test2 (autoTester);
						try {
							var __except0__ = Ex2 ('had');
							__except0__.__cause__ = null;
							throw __except0__;
						}
						catch (__except0__) {
							if (isinstance (__except0__, Ex1)) {
								var exception = __except0__;
								autoTester.check ('a');
							}
							else if (isinstance (__except0__, Exception)) {
								var exception = __except0__;
								autoTester.check ('little');
								autoTester.check (exception);
							}
							else {
								throw __except0__;
							}
						}
						autoTester.check (333);
						try {
							var __except0__ = Ex1 ('lamb');
							__except0__.__cause__ = null;
							throw __except0__;
						}
						catch (__except0__) {
							if (isinstance (__except0__, Ex2)) {
								var exception = __except0__;
								autoTester.check ('his');
								autoTester.check (exception);
							}
							else if (isinstance (__except0__, Ex1)) {
								var exception = __except0__;
								autoTester.check ('fleece');
								autoTester.check (exception);
							}
							else if (isinstance (__except0__, Exception)) {
								var exception = __except0__;
								autoTester.check ('was');
								autoTester.check (exception);
							}
							else {
								throw __except0__;
							}
						}
						finally {
							autoTester.check ('white');
						}
						autoTester.check (444);
						var test3 = function () {
							var __except0__ = Ex3 ('as');
							__except0__.__cause__ = null;
							throw __except0__;
						};
						autoTester.check (555);
						try {
							test3 ();
						}
						catch (__except0__) {
							if (isinstance (__except0__, Ex1)) {
								var exception = __except0__;
								autoTester.check ('snow');
								autoTester.check (exception);
							}
							else if (isinstance (__except0__, Exception)) {
								var exception = __except0__;
								autoTester.check ('and');
								autoTester.check (exception);
							}
							else {
								throw __except0__;
							}
						}
						finally {
							autoTester.check ('everywhere');
						}
						autoTester.check (666);
						try {
							var __except0__ = Ex3 ('that');
							__except0__.__cause__ = null;
							throw __except0__;
						}
						catch (__except0__) {
							if (isinstance (__except0__, Ex1)) {
								var exception = __except0__;
								autoTester.check ('mary');
								autoTester.check (exception);
							}
							else autoTester.check ('went');
						}
						finally {
							autoTester.check ('the');
						}
						autoTester.check (777);
						try {
							try {
								var __except0__ = Ex3 ('lamb');
								__except0__.__cause__ = null;
								throw __except0__;
							}
							catch (__except0__) {
								if (isinstance (__except0__, Ex1)) {
									var exception = __except0__;
									autoTester.check ('was');
									autoTester.check (exception);
								}
								else {
									throw __except0__;
								}
							}
							finally {
								autoTester.check ('to');
							}
						}
						catch (__except0__) {
							if (isinstance (__except0__, Ex3)) {
								var exception = __except0__;
								autoTester.check ('go');
								autoTester.check (exception);
							}
							else {
								throw __except0__;
							}
						}
						try {
							var __except0__ = new Table ('he', 'followed', 'her');
							__except0__.__cause__ = null;
							throw __except0__;
						}
						catch (__except0__) {
							if (isinstance (__except0__, Ex1)) {
								var exception = __except0__;
								autoTester.check ('to');
								autoTester.check (exception);
							}
							else if (isinstance (__except0__, Table)) {
								var exception = __except0__;
								autoTester.check ('school');
								autoTester.check (exception);
							}
							else if (isinstance (__except0__, Ex3)) {
								var exception = __except0__;
								autoTester.check ('one');
								autoTester.check (exception);
							}
							else {
								throw __except0__;
							}
						}
						finally {
							autoTester.check ('day');
						}
						try {
							assert ((2 * 8) / 4 == 2, 'Assert error 1');
						}
						catch (__except0__) {
							if (isinstance (__except0__, AssertionError)) {
								var exception = __except0__;
								autoTester.check (exception);
							}
							else {
								throw __except0__;
							}
						}
						try {
							assert ((2 * 8) / 4 == 4, 'Assert error 2');
						}
						catch (__except0__) {
							if (isinstance (__except0__, AssertionError)) {
								var exception = __except0__;
								autoTester.check (exception);
							}
							else {
								throw __except0__;
							}
						}
						try {
							assert ((2 * 8) / 4 == 2);
						}
						catch (__except0__) {
							if (isinstance (__except0__, AssertionError)) {
								var exception = __except0__;
								autoTester.check (exception);
							}
							else {
								throw __except0__;
							}
						}
						try {
							assert ((2 * 8) / 4 == 4);
						}
						catch (__except0__) {
							if (isinstance (__except0__, AssertionError)) {
								var exception = __except0__;
								autoTester.check (exception);
							}
							else {
								throw __except0__;
							}
						}
						autoTester.check (888);
						try {
							autoTester.check ('hello world 1');
							try {
								autoTester.check ('no error 1');
							}
							catch (__except0__) {
							}
						}
						catch (__except0__) {
							autoTester.check ('error 1');
						}
						var i = 1 + 2;
						try {
							autoTester.check ('hello world 2');
							if (i == 3) {
								var __except0__ = Exception ();
								__except0__.__cause__ = null;
								throw __except0__;
							}
							try {
								autoTester.check ('no error 2');
							}
							catch (__except0__) {
							}
						}
						catch (__except0__) {
							autoTester.check ('error 2');
						}
						for (var raiseIt of tuple ([false, true])) {
							try {
								try {
									if (raiseIt) {
										var __except0__ = Exception ();
										__except0__.__cause__ = null;
										throw __except0__;
									}
									autoTester.check ('no error 3');
								}
								finally {
									autoTester.check ('anyhow 3');
								}
							}
							catch (__except0__) {
								autoTester.check ('error 3');
							}
						}
					};
					__pragma__ ('<all>')
						__all__.BaseException = BaseException;
						__all__.Ex1 = Ex1;
						__all__.Ex2 = Ex2;
						__all__.Ex3 = Ex3;
						__all__.Table = Table;
						__all__.run = run;
						__all__.test1 = test1;
						__all__.test2 = test2;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'extended_slices', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var indices = function (key) {
						if (__envir__.executor_name == __envir__.transpiler_name) {
							return (py_typeof (key) == list ? tuple (key) : key);
						}
						else {
							try {
								return key.indices (1000000000);
							}
							catch (__except0__) {
								try {
									return tuple (function () {
										var __accu0__ = [];
										for (var subkey of key) {
											__accu0__.append (indices (subkey));
										}
										return __accu0__;
									} ());
								}
								catch (__except1__) {
									return key;
								}
							}
						}
					};
					var Test = __class__ ('Test', [object], {
						get __init__ () {return __get__ (this, function (self, autoTester) {
							self.autoTester = autoTester;
						});},
						get __getitem__ () {return __get__ (this, function (self, key) {
							self.autoTester.check ('getitem (', indices (key), ')');
							return 1234567;
						});},
						get __setitem__ () {return __get__ (this, function (self, key, value) {
							self.autoTester.check ('setitem (', indices (key), ')', value);
						});}
					});
					var run = function (autoTester) {
						var __left0__ = Test (autoTester);
						var a = __left0__;
						var b = __left0__;
						var c = __left0__;
						var d = __left0__;
						var e = __left0__;
						var f = __left0__;
						var g = __left0__;
						var h = __left0__;
						var i = __left0__;
						var j = __left0__;
						var k = __left0__;
						var l = __left0__;
						a.__setitem__ ([tuple ([1, 2, 3]), tuple ([4, 5, 6])], __getslice__ (b, 7, 8, 9));
						__setslice__ (c, 1, 2, 3, d.__getitem__ ([tuple ([4, 5, 6]), tuple ([7, 8, 9])]));
						e.__setitem__ ([1, tuple ([1, 2, 3]), 3], f.__getitem__ ([4, tuple ([4, 5, 6]), 6]));
						g.__setitem__ ([1, 2, 3], h.__getitem__ ([1, 2, 3]));
						__setitem__ (i, 1, __getitem__ (j, 1));
						__setslice__ (k, 1, 2, 3, __getslice__ (l, 1, 2, 3));
					};
					__pragma__ ('<all>')
						__all__.Test = Test;
						__all__.indices = indices;
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'fstrings', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var math = {};
					__nest__ (math, '', __init__ (__world__.math));
					var run = function (autoTester) {
						var aDict = dict ({'one': 1});
						var aSet = new set (['rose']);
						var anArray = list (['hundred', 100, 'pi', 3.14, 'e', 2.74, 'dozen', 12]);
						var anInt = 144;
						var aFloat = 3.14;
						autoTester.check (aDict);
						autoTester.check (str (aDict));
						autoTester.check (repr (aDict));
						autoTester.check ('aDictionary: ({}, {})'.format ('aDict', 'aDict ["one"]'));
						autoTester.check ('aDictionary: ({}, {})'.format (aDict, aDict ['one']));
						autoTester.check ('aSet: ({}, {})'.format (aSet, __in__ ('rose', aSet)));
						autoTester.check ('anArray ({}, {}, {})'.format (anArray, anArray.__getslice__ (1, 4, 1), anArray [5]));
						autoTester.check ('anInt ({}, {})'.format (anInt, int (math.sqrt (anInt))));
						autoTester.check ('aFloat ({}, {})'.format (aFloat, round (math.sin (aFloat + 2.74), 2)));
					};
					__pragma__ ('<use>' +
						'math' +
					'</use>')
					__pragma__ ('<all>')
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'general_functions', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var A = __class__ ('A', [object], {
						foo: 'bar',
						get __init__ () {return __get__ (this, function (self) {
							self.foo2 = 'bar2';
						});}
					});
					var B = __class__ ('B', [A], {
						foo3: 'bar3',
						get __init__ () {return __get__ (this, function (self) {
							self.foo4 = 'bar4';
						});}
					});
					var run = function (autoTester) {
						autoTester.check ('sort and sorted<br>');
						var a = list ([1, 5, 3, 2, -(1)]);
						var b = list (['sun', 'earth', 'moon']);
						autoTester.check (sorted (a));
						autoTester.check (sorted (b));
						a.py_sort ();
						autoTester.check (a);
						b.py_sort ();
						autoTester.check (b);
						autoTester.check (sorted (a, __kwargtrans__ ({reverse: true})));
						autoTester.check (sorted (b, __kwargtrans__ ({reverse: true})));
						a.py_sort (__kwargtrans__ ({reverse: true}));
						autoTester.check (a);
						b.py_sort (__kwargtrans__ ({reverse: true}));
						autoTester.check (b);
						b.py_sort (__kwargtrans__ ({key: (function __lambda__ (x) {
							return len (x);
						})}));
						autoTester.check (b);
						b.py_sort (__kwargtrans__ ({key: (function __lambda__ (x) {
							return len (x);
						}), reverse: true}));
						autoTester.check (b);
						autoTester.check ('<br><br>dir<br>');
						autoTester.check (function () {
							var __accu0__ = [];
							for (var entry of dir (A)) {
								if (!(entry.startswith ('__'))) {
									__accu0__.append (entry);
								}
							}
							return __accu0__;
						} ());
						autoTester.check (function () {
							var __accu0__ = [];
							for (var entry of dir (A ())) {
								if (!(entry.startswith ('__'))) {
									__accu0__.append (entry);
								}
							}
							return __accu0__;
						} ());
						autoTester.check (function () {
							var __accu0__ = [];
							for (var entry of dir (B)) {
								if (!(entry.startswith ('__'))) {
									__accu0__.append (entry);
								}
							}
							return __accu0__;
						} ());
						autoTester.check (function () {
							var __accu0__ = [];
							for (var entry of dir (B ())) {
								if (!(entry.startswith ('__'))) {
									__accu0__.append (entry);
								}
							}
							return __accu0__;
						} ());
						autoTester.check ('<br><br>any, all, sum<br>');
						var list1 = list (['ape', 'node', 'mice']);
						var list2 = list (['vim', '', 'jet']);
						var list3 = list (['', '', '']);
						var list4 = list ([list ([1, 2]), list ([1]), list ([])]);
						autoTester.check (list1, any (list1), all (list1));
						autoTester.check (list2, any (list2), all (list2));
						autoTester.check (list3, any (list3), all (list3));
						autoTester.check (list4, any (list4), all (list4));
						autoTester.check (sum (range (5)));
						if (__in__ ('__esv6__', autoTester.symbols)) {
							var generator1 = function* () {
								for (var i = 0; i < 5; i++) {
									yield i;
								}
							};
							var generator2 = function* () {
								for (var i = 0; i < 5; i++) {
									if (__mod__ (i, 2)) {
										yield 0;
									}
									else {
										yield i;
									}
								}
							};
							var generator3 = function* () {
								for (var i = 0; i < 5; i++) {
									yield 0;
								}
							};
							autoTester.check (generator1 (), any (generator1 ()), all (generator1 ()));
							autoTester.check (generator2 (), any (generator2 ()), all (generator2 ()));
							autoTester.check (generator3 (), any (generator3 ()), all (generator3 ()));
							autoTester.check (sum (generator1 ()));
						}
					};
					__pragma__ ('<all>')
						__all__.A = A;
						__all__.B = B;
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'globals_function', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var sub = __init__ (__world__.globals_function.sub);
					var xxa = 'mainXxa';
					var xxb = 'mainXxb';
					for (var py_name of tuple (['xxp', 'xxq'])) {
						__globals__ (__all__) [py_name] = 'main{}'.format (py_name.capitalize ());
					}
					var f = function () {
						for (var py_name of tuple (['xxr', 'xxs'])) {
							__globals__ (__all__) [py_name] = 'main{}'.format (py_name.capitalize ());
						}
					};
					var run = function (autoTester) {
						f ();
						sub.run (autoTester);
						autoTester.check ('Check main 1', xxa, xxb);
						autoTester.check ('Check main 2', ...function () {
							var __accu0__ = [];
							for (var py_name of tuple (['xxa', 'xxb', 'xxp', 'xxq', 'xxr', 'xxs'])) {
								__accu0__.append (__globals__ (__all__) [py_name]);
							}
							return __accu0__;
						} ());
						autoTester.check ('Check main 3', sub.xxa, sub.xxb, sub.xxp, sub.xxq, sub.xxr, sub.xxs);
						autoTester.check ('Check main 4', ...sorted (function () {
							var __accu0__ = [];
							for (var [key, value] of __globals__ (__all__).py_items ()) {
								if (key.startswith ('xx')) {
									__accu0__.append (value);
								}
							}
							return __accu0__;
						} ()));
					};
					__pragma__ ('<use>' +
						'globals_function.sub' +
					'</use>')
					__pragma__ ('<all>')
						__all__.f = f;
						__all__.py_name = py_name;
						__all__.run = run;
						__all__.sub = sub;
						__all__.xxa = xxa;
						__all__.xxb = xxb;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'globals_function.sub', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var xxa = 'subXxa';
					var xxb = 'subXxb';
					for (var py_name of tuple (['xxp', 'xxq'])) {
						__globals__ (__all__) [py_name] = 'sub{}'.format (py_name.capitalize ());
					}
					var f = function () {
						for (var py_name of tuple (['xxr', 'xxs'])) {
							__globals__ (__all__) [py_name] = 'sub{}'.format (py_name.capitalize ());
						}
					};
					var run = function (autoTester) {
						f ();
						autoTester.check ('Check sub 1', xxa, xxb);
						autoTester.check ('Check sub 2', ...function () {
							var __accu0__ = [];
							for (var py_name of tuple (['xxa', 'xxb', 'xxp', 'xxq', 'xxr', 'xxs'])) {
								__accu0__.append (__globals__ (__all__) [py_name]);
							}
							return __accu0__;
						} ());
						autoTester.check ('Check sub 3', ...sorted (function () {
							var __accu0__ = [];
							for (var [key, value] of __globals__ (__all__).py_items ()) {
								if (key.startswith ('xx')) {
									__accu0__.append (value);
								}
							}
							return __accu0__;
						} ()));
					};
					__pragma__ ('<all>')
						__all__.f = f;
						__all__.py_name = py_name;
						__all__.run = run;
						__all__.xxa = xxa;
						__all__.xxb = xxb;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'indices_and_slices', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var run = function (autoTester) {
						var all = range (32);
						autoTester.check (all);
						autoTester.check (all.__getslice__ (8, 24, 1));
						autoTester.check (all.__getslice__ (8, 24, 2));
						var aList = list ([3, 4, 7, 8]);
						autoTester.check (aList);
						aList.__setslice__ (4, 4, null, list ([9, 10]));
						autoTester.check (aList);
						aList.__setslice__ (2, 2, null, list ([5, 6]));
						autoTester.check (aList);
						aList.__setslice__ (0, 0, null, list ([1, 2]));
						autoTester.check (aList);
						aList.__setslice__ (0, null, 2, function () {
							var __accu0__ = [];
							for (var x = 0; x < 10; x++) {
								if (__mod__ (x, 2)) {
									__accu0__.append (x + 0.001);
								}
							}
							return __accu0__;
						} ());
						autoTester.check (aList);
					};
					__pragma__ ('<all>')
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'iterators_and_generators', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var Iterable = __class__ ('Iterable', [object], {
						get __init__ () {return __get__ (this, function (self, i) {
							self.aList = range (0, 50, i);
						});},
						get __iter__ () {return __get__ (this, function (self) {
							return Iterator (self);
						});},
						[Symbol.iterator] () {return this.__iter__ ()}
					});
					var Iterator = __class__ ('Iterator', [object], {
						get __init__ () {return __get__ (this, function (self, iterable) {
							self.iterable = iterable;
							self.index = -(1);
						});},
						get __next__ () {return __get__ (this, function (self) {
							self.index++;
							if (self.index > 5) {
								var __except0__ = StopIteration ();
								__except0__.__cause__ = null;
								throw __except0__;
							}
							return self.iterable.aList [self.index];
						});},
						next: __jsUsePyNext__,
						get __iter__ () {return __get__ (this, function (self) {
							return self;
						});},
						[Symbol.iterator] () {return this.__iter__ ()}
					});
					var exhaustableGenerator = function* (i) {
						for (var i = 0; i < 5; i++) {
							yield 2 * i;
						}
					};
					var run = function (autoTester) {
						var exhaustableGenExp = function () {
							var __accu0__ = [];
							for (var a of list ([10, 20, 30])) {
								__accu0__.append ((a * a) * a);
							}
							return py_iter (__accu0__);
						} ();
						var iterables = list ([Iterable (7), exhaustableGenerator (5), function () {
							var __accu0__ = [];
							for (var i = 0; i < 5; i++) {
								__accu0__.append (i * 3);
							}
							return __accu0__;
						} (), exhaustableGenExp]);
						for (var iterable of iterables) {
							autoTester.check ('[1]');
							var iterator = py_iter (iterable);
							try {
								while (true) {
									autoTester.check (py_next (iterator));
								}
							}
							catch (__except0__) {
								if (isinstance (__except0__, Exception)) {
									var exception = __except0__;
									autoTester.check (exception.__class__.__name__);
								}
								else {
									throw __except0__;
								}
							}
							autoTester.check ('[2]');
							var iterator = py_iter (iterable);
							try {
								while (true) {
									autoTester.check (py_next (iterator));
								}
							}
							catch (__except0__) {
								if (isinstance (__except0__, Exception)) {
									var exception = __except0__;
									autoTester.check (exception.__class__.__name__);
								}
								else {
									throw __except0__;
								}
							}
						}
						for (var iterable of iterables) {
							autoTester.check ('[3]');
							for (var n of iterable) {
								autoTester.check (n);
							}
							autoTester.check ('[4]');
							for (var n of iterable) {
								autoTester.check (n);
							}
						}
						var a = 0;
						var vals = list ([1, 2, 3]);
						var ret = py_iter (vals);
						for (var m of ret) {
							a += m;
						}
						autoTester.check (a);
						var test0 = function* () {
							var r = 0;
							while (true) {
								var r = r + (yield r);
							}
						};
						var gen0 = test0 ();
						py_next (gen0);
						autoTester.check ((function () {return gen0.next (1).value}) ());
						autoTester.check ((function () {return gen0.next (2).value}) ());
						var test1 = function* () {
							var r = 0;
							while (true) {
								var r = (yield r) + r;
							}
						};
						var gen1 = test1 ();
						py_next (gen1);
						autoTester.check ((function () {return gen1.next (3).value}) ());
						autoTester.check ((function () {return gen1.next (4).value}) ());
						var subGenerator = function* () {
							yield 27;
							yield 37;
							yield 47;
						};
						var mainGenerator = function* () {
							yield 17;
							yield* subGenerator ();
							yield 57;
						};
						autoTester.check (...function () {
							var __accu0__ = [];
							for (var i of mainGenerator ()) {
								__accu0__.append (i);
							}
							return __accu0__;
						} ());
						var subCoroutine = function* () {
							autoTester.check (38);
							yield;
							autoTester.check (48);
							yield;
							autoTester.check (58);
							yield;
							autoTester.check (68);
						};
						var mainCoroutine = function* () {
							autoTester.check (18);
							yield;
							autoTester.check (28);
							yield* subCoroutine ();
							autoTester.check (78);
							yield;
							autoTester.check (88);
						};
						var m = mainCoroutine ();
						for (var i = 0; i < 5; i++) {
							(function () {return m.next (null).value}) ();
						}
					};
					__pragma__ ('<all>')
						__all__.Iterable = Iterable;
						__all__.Iterator = Iterator;
						__all__.exhaustableGenerator = exhaustableGenerator;
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
    __nest__ (
        __all__,
        'itertools', {
            __all__: {
                __inited__: false,
                __init__: function (__all__) {
                    var count = function* (start, step) {
                        if (start == undefined) {
                            start = 0;
                        }
                        if (step == undefined) {
                            step = 1;
                        }
                        while (true) {
                            yield start;
                            start += step;
                        }
                    }
                    var cycle = function* (iterable) {                      
                        let buffer = Array.from (iterable); // Can't reset, Chrome can't obtain iter from gener
                        while (true) {
                            for (let item of buffer) {
                                yield item;
                            }
                        }
                    }
                    var repeat = function* (item, n) {
                        if (typeof n == 'undefined') {
                            while (true) {
                                yield item;
                            }
                        }
                        else {
                            for (let index = 0; index < n; index++) {
                                yield item;
                            }
                        }
                    }
                    var accumulate = function* (iterable, func) {
                        let sum;
                        let first = true;
                        if (func) {
                            for (let item of iterable) {
                                if (first) {
                                    sum = item;
                                    first = false;
                                }
                                else {
                                    sum = func (sum, item);
                                }
                                yield sum;
                            }
                        }
                        else {
                            for (let item of iterable) {
                                if (first) {
                                    sum = item;
                                    first = false;
                                }
                                else {
                                    sum = sum + item;
                                }
                                yield sum;
                            }
                        }
                    }
                    var chain = function* () {
                        let args = [] .slice.apply (arguments);                         
                        for (let arg of args) {
                            for (let item of arg) {
                                yield item;
                            }
                        }
                    }
                    chain.from_iterable = function* (iterable) {                        
                        for (let item of iterable) {
                            for (let subItem of item) {
                                yield subItem;
                            }
                        }
                    }
                    var compress = function* (data, selectors) {
                        let dataIterator = data [Symbol.iterator] .call (data);
                        let selectorsIterator = selectors [Symbol.iterator] ();
                        while (true) {
                            let dataItem = dataIterator.next ();
                            let selectorsItem = selectorsIterator.next ();
                            if (dataItem.done || selectorsItem.done) {
                                break;
                            }
                            else {
                                if (selectorsItem.value) {
                                    yield dataItem.value;
                                }
                            }
                        }
                    }
                    var dropwhile = function* (pred, seq) {
                        let started = false;
                        for (let item of seq) {
                            if (started) {
                                yield item;
                            }
                            else if (!pred (item)) {
                                started = true;
                                yield item;
                            }
                        }
                    }
                    var filterfalse = function* (pred, seq) {
                        for (let item of seq) {
                            if (!pred (item)) {
                                yield item;
                            }
                        }
                    }
                    var groupby = function* (iterable, keyfunc) {
                        let anIterator = iterable [Symbol.iterator] ();
                        let item = anIterator.next ();
                        
                        if (item.done) {
                            return;
                        }
                        
                        let groupKey = keyfunc (item.value);
                        let more = true;
                        
                        function* group () {
                            while (true) {
                                yield (item.value);
                                item = anIterator.next ();
                                
                                if (item.done) {
                                    more = false;
                                    return;
                                }
                                
                                let key = keyfunc (item.value);
                                
                                if (key != groupKey) {
                                    groupKey = key;
                                    return;
                                }
                            }
                        }
                        
                        while (more) {
                            yield tuple ([groupKey, group ()]);
                        }
                    }
                    
                    var islice = function* () {
                        let start;  // Have to be defined at function level, or Closure compiler will loose them after a yield 
                        let stop;   //
                        let step;   //
                        
                        let args = [] .slice.apply (arguments);
                        let anIterator = args [0][Symbol.iterator] ();
                        if (args.length == 2) {
                            stop = args [1];
                            start = 0;
                            step = 1;
                        }
                        else {
                            start = args [1];
                            stop = args [2];
                            if (args.length == 4) {
                                step = args [3];
                            }
                            else {
                                step = 1;
                            }
                        }
                        for (let index = 0; index < start; index++) {
                            if (anIterator.next (). done) {
                                return;
                            }
                        }
                        for (let index = 0; index < stop - start; index++) {
                            let next = anIterator.next ();
                            if (next.done) {
                                return;
                            }
                            if (index % step == 0) {
                                yield next.value;
                            }
                        }
                    }
                    var starmap = function* (func, seq) {
                        let anIterator = seq [Symbol.iterator] ();
                        while (true) {
                            let next = anIterator.next ()
                            if (next.done) {
                                return;
                            }
                            else {
                                yield func (...next.value); 
                            }
                        }
                    }
                    var takewhile = function* (pred, seq) {
                        for (let item of seq) {
                            if (pred (item)) {
                                yield item;
                            }
                            else {
                                return;
                            }
                        }
                    }
                    var tee = function (iterable, n) {
                        if (n == undefined) {
                            n = 2;
                        }
                        let all = [];                               // Don't return iterator since destructuring assignment cannot yet deal with that
                        let one = list (iterable);
                        for (let i = 0; i < n; i++) {
                            all.append (one [Symbol.iterator] ());  // Iterator rather than list, exhaustable for semantic equivalence
                        }
                        return list (all);
                    }
                    
                    var product = function () {
                        let args = [] .slice.apply (arguments);
                        if (args.length && args [args.length - 1] .hasOwnProperty ('__kwargtrans__')) {
                            var repeat = args.pop () ['repeat']; 
                        }
                        else {
                            var repeat = 1;
                        }
                        
                        let oldMolecules = [tuple ([])];
                        for (let i = 0; i < repeat; i++) {
                            for (let arg of args) {
                                let newMolecules = [];
                                for (let oldMolecule of oldMolecules) {
                                    for (let atom of arg) {
                                        newMolecules.append (tuple (oldMolecule.concat (atom)));
                                    }
                                }
                                oldMolecules = newMolecules;
                            }
                        }
                        return list (oldMolecules); // Also works if args is emptpy
                    }
                    var permutations = function (iterable, r) {
                        if (r == undefined) {
                            try {
                                r = len (iterable);
                            }
                            catch (exception) {
                                r = len (list (iterable));
                            }
                        }
                        let aProduct = product (iterable, __kwargtrans__ ({repeat: r}));
                        let result = [];
                        for (let molecule of aProduct) {
                            if (len (set (molecule)) == r) {    // Weed out doubles
                                result.append (molecule);
                            }
                        }
                        return list (result);
                    }
                    var combinations = function (iterable, r) {
                        let tail = list (iterable);
                        function recurse (tail, molecule, rNext) {
                            for (let index = 0; index < len (tail) - rNext; index++) {
                                let newMolecule = molecule.concat (tail.slice (index, index + 1));

                                if (rNext) {
                                    recurse (tail.slice (index + 1), newMolecule, rNext - 1);
                                }
                                else {
                                    result.append (tuple (newMolecule));
                                }
                            }
                        }
                        let result = [];
                        recurse (tail, tail.slice (0, 0), r - 1);
                        return list (result);
                    }
                    var combinations_with_replacement = function (iterable, r) {
                        let tail = list (iterable);
                        function recurse (tail, molecule, rNext) {
                            for (let index = 0; index < len (tail); index++) {
                                let newMolecule = molecule.concat (tail.slice (index, index + 1));

                                if (rNext) {
                                    recurse (tail.slice (index), newMolecule, rNext - 1);
                                }
                                else {
                                    result.append (tuple (newMolecule));
                                }
                            }
                        }
                        let result = [];
                        recurse (tail, tail.slice (0, 0), r - 1);
                        return list (result);
                    }
                    //<all>
                    __all__.count = count;
                    __all__.cycle = cycle;
                    __all__.repeat = repeat;
                    __all__.accumulate = accumulate;
                    __all__.chain = chain;
                    __all__.compress = compress;
                    __all__.dropwhile = dropwhile;
                    __all__.filterfalse = filterfalse;
                    __all__.groupby = groupby;
                    __all__.islice = islice;
                    __all__.starmap = starmap;
                    __all__.takewhile = takewhile;
                    __all__.tee = tee;
                    __all__.product = product;
                    __all__.permutations = permutations;
                    __all__.combinations = combinations;
                    __all__.combinations_with_replacement = combinations_with_replacement;
                    //</all>
                }
            }
        }
    );
	__nest__ (
		__all__,
		'lambda_functions', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var run = function (autoTester) {
						var z = 1000;
						autoTester.check ((function __lambda__ (x, y) {
							return (x + y) + z;
						}) (111, 222));
						var f = function (list0, list1, aFunc) {
							return function () {
								var __accu0__ = [];
								for (var elem of zip (list0, list1)) {
									__accu0__.append (aFunc (...elem));
								}
								return __accu0__;
							} ();
						};
						var x = f (range (10), range (0, 100, 10), (function __lambda__ (x, y) {
							return (x + y) + z;
						}));
						autoTester.check (x);
						autoTester.check (f (range (10, 20), range (100, 200, 10), (function __lambda__ (x, y) {
							return x * y + 100 * z;
						})));
						autoTester.check (f (range (10, 20), range (100, 200, 10), (function __lambda__ () {
							var args = tuple ([].slice.apply (arguments).slice (0));
							return args [0] * args [1] + 100 * z;
						})));
					};
					__pragma__ ('<all>')
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'list_comprehensions', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var run = function (autoTester) {
						var squares = function () {
							var __accu0__ = [];
							for (var i = 0; i < 10; i++) {
								if (__mod__ (i, 2)) {
									__accu0__.append (i * i);
								}
							}
							return __accu0__;
						} ();
						autoTester.check (squares);
						var tuples = function () {
							var __accu0__ = [];
							for (var x of tuple ([100, 200, 300, 400, 500, 600, 700])) {
								for (var y of tuple ([10, 20, 30, 40, 50, 60, 70])) {
									if ((20 < y && y < 60)) {
										for (var z of tuple ([1, 2, 3, 4, 5, 6, 7])) {
											if ((200 < x && x < 600)) {
												if ((2 < z && z < 6)) {
													__accu0__.append (tuple ([x, y, z]));
												}
											}
										}
									}
								}
							}
							return __accu0__;
						} ();
						autoTester.check (tuples);
						var tricky = function () {
							var __accu0__ = [];
							for (var [x, y] of tuple ([tuple ([10, 11]), tuple ([20, 21])])) {
								__accu0__.append (tuple ([2 * x, 3 * y]));
							}
							return __accu0__;
						} ();
						autoTester.check (tricky);
						var nested = function () {
							var __accu0__ = [];
							for (var x of function () {
								var __accu1__ = [];
								for (var x = 0; x < 3; x++) {
									__accu1__.append (x * x);
								}
								return __accu1__;
							} ()) {
								__accu0__.append (2 * x);
							}
							return __accu0__;
						} ();
						autoTester.check (nested);
						var a = 100;
						var x = 5;
						var scopeTest = function () {
							var __accu0__ = [];
							for (var x = 0; x < 5; x++) {
								__accu0__.append (x + a);
							}
							return __accu0__;
						} ();
						autoTester.check (x);
						autoTester.check (scopeTest);
					};
					__pragma__ ('<all>')
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'local_classes', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var run = function (autoTester) {
						var A = __class__ ('A', [object], {
							B: __class__ ('B', [object], {
								C: __class__ ('C', [object], {
									get __init__ () {return __get__ (this, function (self, x) {
										self.x = x;
									});},
									get tell () {return __get__ (this, function (self) {
										autoTester.check (self.x);
										autoTester.check (self.e);
									});},
									e: 3
								}),
								get __init__ () {return __get__ (this, function (self, x) {
									self.x = x;
								});},
								get tell () {return __get__ (this, function (self) {
									autoTester.check (self.x);
									autoTester.check (self.d);
								});},
								d: 2
							}),
							c: 1,
							get __init__ () {return __get__ (this, function (self, x) {
								self.x = x;
							});},
							get tell () {return __get__ (this, function (self) {
								autoTester.check (self.x);
								autoTester.check (self.c);
							});}
						});
						var f = function (x) {
							var G = __class__ ('G', [object], {
								H: __class__ ('H', [object], {
									get __init__ () {return __get__ (this, function (self, x) {
										self.x = x;
									});},
									get tell () {return __get__ (this, function (self) {
										autoTester.check (self.x);
										autoTester.check (self.i);
									});},
									i: 5
								}),
								get __init__ () {return __get__ (this, function (self, x) {
									self.x = x;
								});},
								get tell () {return __get__ (this, function (self) {
									autoTester.check (self.x);
								});},
								k: 4
							});
							var g = G (6);
							g.tell ();
							autoTester.check (g.k);
							var h = G.H (7);
							h.tell ();
							autoTester.check (h.i);
							var P = __class__ ('P', [A.B], {
							});
							var p = P (7);
							p.tell ();
							autoTester.check (p.d);
						};
						var a = A (8);
						var b = a.B (9);
						var c = b.C (10);
						a.tell ();
						b.tell ();
						c.tell ();
						autoTester.check (a.c);
						autoTester.check (b.d);
						f (7);
					};
					__pragma__ ('<all>')
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'math', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var pi = Math.PI;
					var e = Math.E;
					var exp = Math.exp;
					var expm1 = function (x) {
						return Math.exp (x) - 1;
					};
					var log = function (x, base) {
						return (base === undefined ? Math.log (x) : Math.log (x) / Math.log (base));
					};
					var log1p = function (x) {
						return Math.log (x + 1);
					};
					var log2 = function (x) {
						return Math.log (x) / Math.LN2;
					};
					var log10 = function (x) {
						return Math.log (x) / Math.LN10;
					};
					var pow = Math.pow;
					var sqrt = Math.sqrt;
					var sin = Math.sin;
					var cos = Math.cos;
					var tan = Math.tan;
					var asin = Math.asin;
					var acos = Math.acos;
					var atan = Math.atan;
					var atan2 = Math.atan2;
					var hypot = Math.hypot;
					var degrees = function (x) {
						return (x * 180) / Math.PI;
					};
					var radians = function (x) {
						return (x * Math.PI) / 180;
					};
					var sinh = Math.sinh;
					var cosh = Math.cosh;
					var tanh = Math.tanh;
					var asinh = Math.asinh;
					var acosh = Math.acosh;
					var atanh = Math.atanh;
					var floor = Math.floor;
					var ceil = Math.ceil;
					var trunc = Math.trunc;
					var isnan = isNaN;
					var inf = Infinity;
					var nan = NaN;
					__pragma__ ('<all>')
						__all__.acos = acos;
						__all__.acosh = acosh;
						__all__.asin = asin;
						__all__.asinh = asinh;
						__all__.atan = atan;
						__all__.atan2 = atan2;
						__all__.atanh = atanh;
						__all__.ceil = ceil;
						__all__.cos = cos;
						__all__.cosh = cosh;
						__all__.degrees = degrees;
						__all__.e = e;
						__all__.exp = exp;
						__all__.expm1 = expm1;
						__all__.floor = floor;
						__all__.hypot = hypot;
						__all__.inf = inf;
						__all__.isnan = isnan;
						__all__.log = log;
						__all__.log10 = log10;
						__all__.log1p = log1p;
						__all__.log2 = log2;
						__all__.nan = nan;
						__all__.pi = pi;
						__all__.pow = pow;
						__all__.radians = radians;
						__all__.sin = sin;
						__all__.sinh = sinh;
						__all__.sqrt = sqrt;
						__all__.tan = tan;
						__all__.tanh = tanh;
						__all__.trunc = trunc;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'metaclasses', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var UppercaserMeta = __class__ ('UppercaserMeta', [py_metatype], {
						get __new__ () {return __get__ (this, function (meta, py_name, bases, attribs) {
							var upperAttribs = {};
							for (var attribKey in attribs) {
								upperAttribs [(attribKey.startswith ('__') ? attribKey : attribKey.upper ())] = attribs [attribKey];
							}
							return py_metatype.__new__ (meta, py_name, bases, upperAttribs);
						});}
					});
					var Uppercaser = __class__ ('Uppercaser', [object], {
					}, UppercaserMeta);
					var Animal = __class__ ('Animal', [Uppercaser], {
						Thoughts: __class__ ('Thoughts', [object], {
							quantity: 7
						}),
						color: 'Brown',
						state: 'Moving',
						get move () {return __get__ (this, function (self) {
							return 'Move';
						});}
					});
					var Plant = __class__ ('Plant', [Uppercaser], {
						Thoughts: __class__ ('Thoughts', [object], {
							quantity: 6
						}),
						color: 'Green',
						state: 'Growing',
						get grow () {return __get__ (this, function (self) {
							return 'Grow';
						});}
					});
					var Stone = __class__ ('Stone', [object], {
						Thoughts: __class__ ('Thoughts', [object], {
							quantity: 5
						}),
						color: 'Gray',
						get be () {return __get__ (this, function (self) {
							return 'Being';
						});}
					});
					var run = function (autoTester) {
						var animal = Animal ();
						autoTester.check (animal.THOUGHTS.quantity, Animal.COLOR, animal.COLOR, animal.MOVE ());
						var plant = Plant ();
						autoTester.check (plant.THOUGHTS.quantity, Plant.COLOR, plant.COLOR, plant.GROW ());
						var stone = Stone ();
						autoTester.check (stone.Thoughts.quantity, Stone.color, stone.color, stone.be ());
					};
					__pragma__ ('<all>')
						__all__.Animal = Animal;
						__all__.Plant = Plant;
						__all__.Stone = Stone;
						__all__.Uppercaser = Uppercaser;
						__all__.UppercaserMeta = UppercaserMeta;
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'module_builtin', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var canonizeString = function (aString) {
						if (__envir__.executor_name == 'transcrypt') {
							return aString.py_replace ('\t', '\\t').py_replace ('\n', '\\n');
						}
						else {
							return aString;
						}
					};
					var canonizeStringList = function (stringList) {
						return function () {
							var __accu0__ = [];
							for (var aString of stringList) {
								__accu0__.append (canonizeString (aString));
							}
							return __accu0__;
						} ();
					};
					var run = function (autoTester) {
						autoTester.check ('min', min (-(1.1), -(1), -(3)));
						autoTester.check ('max', max (-(1.1), -(1), -(3)));
						autoTester.check ('abs', abs (-(1)), abs (1), abs (0), abs (-(0.1)), abs (0.1));
						autoTester.check ('ord', ord ('a'), ord ('e´' [0]));
						autoTester.check ('round', round (4.006), round (4.006, 2), round (4060, -(2)), round (-(4.006)), round (-(4.006), 2), round (-(4060), -(2)), round (1 / 2.0), round (1 / 2.0, 1), round (1 / 2, 1), round (1 / 3.0, 2), round (-(1) / 2.0), round (-(1) / 2.0, 1), round (-(1) / 2, 1), round (-(1) / 3.0, 2), round (0.5), round (0.51), round (1.5), round (1.51), round (1.51), round (2.5), round (2.59), round (3.5), round (3.59), round (-(0.5)), round (-(0.51)), round (-(1.5)), round (-(1.51)), round (-(1.51)), round (-(2.5)), round (-(2.59)), round (-(3.5)), round (-(3.59)));
						var strings = list (['der des dem den die der den die das des dem das', 'an auf hinter ueber    neben vor   zwischen', '\n            durch\n            fuer\n            ohne\n            um\n            bis\n            gegen\n            entlang\n        ', 'eins,zwei,drie,vier,fuenf,sechs,sieben']);
						autoTester.check ('<br><br>split');
						for (var aString of strings) {
							autoTester.check (canonizeString (aString), canonizeStringList (aString.py_split ()), canonizeStringList (aString.py_split (' ')), canonizeStringList (aString.py_split (' ', 4)), canonizeStringList (aString.py_split ('\t')), canonizeStringList (aString.py_split ('\t', 4)), canonizeStringList (aString.py_split ('\n')), canonizeStringList (aString.py_split ('\n', 4)), canonizeStringList (aString.py_split (',')), canonizeStringList (aString.py_split (',', 4)), '<br>');
						}
						autoTester.check ('<br>rsplit');
						for (var aString of strings) {
							autoTester.check (canonizeString (aString), canonizeStringList (aString.rsplit ()), canonizeStringList (aString.rsplit (' ')), canonizeStringList (aString.rsplit (' ', 4)), canonizeStringList (aString.rsplit ('\t')), canonizeStringList (aString.rsplit ('\t', 4)), canonizeStringList (aString.rsplit ('\n')), canonizeStringList (aString.rsplit ('\n', 4)), canonizeStringList (aString.rsplit (',')), canonizeStringList (aString.rsplit (',', 4)), '<br>');
						}
					};
					__pragma__ ('<all>')
						__all__.canonizeString = canonizeString;
						__all__.canonizeStringList = canonizeStringList;
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'module_cmath', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var acos = __init__ (__world__.cmath).acos;
					var acosh = __init__ (__world__.cmath).acosh;
					var asin = __init__ (__world__.cmath).asin;
					var asinh = __init__ (__world__.cmath).asinh;
					var atan = __init__ (__world__.cmath).atan;
					var atanh = __init__ (__world__.cmath).atanh;
					var cos = __init__ (__world__.cmath).cos;
					var cosh = __init__ (__world__.cmath).cosh;
					var e = __init__ (__world__.cmath).e;
					var exp = __init__ (__world__.cmath).exp;
					var isfinite = __init__ (__world__.cmath).isfinite;
					var isinf = __init__ (__world__.cmath).isinf;
					var isnan = __init__ (__world__.cmath).isnan;
					var log = __init__ (__world__.cmath).log;
					var log10 = __init__ (__world__.cmath).log10;
					var phase = __init__ (__world__.cmath).phase;
					var pi = __init__ (__world__.cmath).pi;
					var polar = __init__ (__world__.cmath).polar;
					var rect = __init__ (__world__.cmath).rect;
					var sin = __init__ (__world__.cmath).sin;
					var sinh = __init__ (__world__.cmath).sinh;
					var sqrt = __init__ (__world__.cmath).sqrt;
					var tan = __init__ (__world__.cmath).tan;
					var tanh = __init__ (__world__.cmath).tanh;
					var twoPi = 2 * pi;
					var nDecs = 5;
					var run = function (autoTester) {
						__call__ (autoTester.check, autoTester, __call__ (phase, null, __add__ (1, complex (0, 1.0))));
						var aPolar = __call__ (polar, null, __add__ (3, complex (0, 5.0)));
						__call__ (autoTester.check, autoTester, __call__ (round, null, __getitem__ (aPolar, 0), nDecs), __getitem__ (aPolar, 1));
						var aRect = __call__ (rect, null, ...aPolar);
						__call__ (autoTester.check, autoTester, __call__ (round, null, aRect.real), __call__ (round, null, aRect.imag));
						var anExp = __call__ (exp, null, __sub__ (__neg__ (2.2), complex (0, 3.3)));
						__call__ (autoTester.check, autoTester, __call__ (round, null, anExp.real, nDecs), __call__ (round, null, anExp.imag, nDecs));
						var aLog = __call__ (log, null, anExp);
						__call__ (autoTester.check, autoTester, __call__ (round, null, aLog.real, nDecs), __call__ (round, null, aLog.imag, nDecs));
						var anExp10 = __pow__ (aLog, 10);
						__call__ (autoTester.check, autoTester, __call__ (round, null, anExp10.real, nDecs), __call__ (round, null, anExp10.imag, nDecs));
						var aLog10 = __call__ (log10, null, anExp10);
						__call__ (autoTester.check, autoTester, __call__ (round, null, aLog10.real, nDecs), __call__ (round, null, aLog10.imag, nDecs));
						var anExpRect = __pow__ (aLog, aRect);
						__call__ (autoTester.check, autoTester, __call__ (round, null, anExpRect.real, nDecs), __call__ (round, null, anExpRect.imag, nDecs));
						var aLogRect = __call__ (log, null, anExpRect, aRect);
						__call__ (autoTester.check, autoTester, __call__ (round, null, aLogRect.real, nDecs), __call__ (round, null, aLogRect.imag, nDecs));
						var aSqrt = __call__ (sqrt, null, complex (0, 1.0));
						__call__ (autoTester.check, autoTester, __call__ (round, null, aSqrt.real, nDecs), __call__ (round, null, aSqrt.imag, nDecs));
						__call__ (autoTester.check, autoTester, __call__ (sqrt, null, 4));
						var anotherSqrt = __call__ (sqrt, null, __neg__ (4));
						__call__ (autoTester.check, autoTester, __call__ (round, null, anotherSqrt.real), __call__ (round, null, anotherSqrt.imag));
						var anAsin = __call__ (asin, null, __add__ (1, complex (0, 2.0)));
						__call__ (autoTester.check, autoTester, __call__ (round, null, anAsin.real, nDecs), __call__ (round, null, anAsin.imag, nDecs));
						var anAcos = __call__ (acos, null, __add__ (__neg__ (2), complex (0, 3.0)));
						__call__ (autoTester.check, autoTester, __call__ (round, null, anAcos.real, nDecs), __call__ (round, null, anAcos.imag, nDecs));
						var anAtan = __call__ (atan, null, __sub__ (3, complex (0, 4.0)));
						__call__ (autoTester.check, autoTester, __call__ (round, null, anAtan.real, nDecs), __call__ (round, null, anAtan.imag, nDecs));
						var aSin = __call__ (sin, null, anAsin);
						__call__ (autoTester.check, autoTester, __call__ (round, null, aSin.real), __call__ (round, null, aSin.imag));
						var aCos = __call__ (cos, null, anAcos);
						__call__ (autoTester.check, autoTester, __call__ (round, null, aCos.real), __call__ (round, null, aCos.imag));
						var aTan = __call__ (tan, null, anAtan);
						__call__ (autoTester.check, autoTester, __call__ (round, null, aTan.real), __call__ (round, null, aTan.imag));
						var anAsinh = __call__ (asinh, null, aCos);
						__call__ (autoTester.check, autoTester, __call__ (round, null, anAsinh.real, nDecs), __call__ (round, null, anAsinh.imag, nDecs));
						var anAcosh = __call__ (acosh, null, aSin);
						__call__ (autoTester.check, autoTester, __call__ (round, null, anAcosh.real, nDecs), __call__ (round, null, anAcosh.imag, nDecs));
						var anAtanh = __call__ (atanh, null, aTan);
						__call__ (autoTester.check, autoTester, __call__ (round, null, anAtanh.real, nDecs), __call__ (round, null, anAtanh.imag, nDecs));
						var aSinh = __call__ (sinh, null, anAsinh);
						__call__ (autoTester.check, autoTester, __call__ (round, null, aSinh.real), __call__ (round, null, aSinh.imag));
						var aCosh = __call__ (cosh, null, anAcosh);
						__call__ (autoTester.check, autoTester, __call__ (round, null, aCosh.real), __call__ (round, null, aCosh.imag));
						var aTanh = __call__ (tanh, null, anAtanh);
						__call__ (autoTester.check, autoTester, __call__ (round, null, aTanh.real), __call__ (round, null, aTanh.imag));
					};
					__pragma__ ('<use>' +
						'cmath' +
					'</use>')
					__pragma__ ('<all>')
						__all__.acos = acos;
						__all__.acosh = acosh;
						__all__.asin = asin;
						__all__.asinh = asinh;
						__all__.atan = atan;
						__all__.atanh = atanh;
						__all__.cos = cos;
						__all__.cosh = cosh;
						__all__.e = e;
						__all__.exp = exp;
						__all__.isfinite = isfinite;
						__all__.isinf = isinf;
						__all__.isnan = isnan;
						__all__.log = log;
						__all__.log10 = log10;
						__all__.nDecs = nDecs;
						__all__.phase = phase;
						__all__.pi = pi;
						__all__.polar = polar;
						__all__.rect = rect;
						__all__.run = run;
						__all__.sin = sin;
						__all__.sinh = sinh;
						__all__.sqrt = sqrt;
						__all__.tan = tan;
						__all__.tanh = tanh;
						__all__.twoPi = twoPi;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'module_itertools', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var accumulate = __init__ (__world__.itertools).accumulate;
					var chain = __init__ (__world__.itertools).chain;
					var combinations = __init__ (__world__.itertools).combinations;
					var combinations_with_replacement = __init__ (__world__.itertools).combinations_with_replacement;
					var compress = __init__ (__world__.itertools).compress;
					var count = __init__ (__world__.itertools).count;
					var cycle = __init__ (__world__.itertools).cycle;
					var dropwhile = __init__ (__world__.itertools).dropwhile;
					var filterfalse = __init__ (__world__.itertools).filterfalse;
					var groupby = __init__ (__world__.itertools).groupby;
					var islice = __init__ (__world__.itertools).islice;
					var permutations = __init__ (__world__.itertools).permutations;
					var product = __init__ (__world__.itertools).product;
					var repeat = __init__ (__world__.itertools).repeat;
					var starmap = __init__ (__world__.itertools).starmap;
					var takewhile = __init__ (__world__.itertools).takewhile;
					var tee = __init__ (__world__.itertools).tee;
					var pow = __init__ (__world__.math).pow;
					var fibonacci = function* () {
						var __left0__ = tuple ([0, 1]);
						var a = __left0__ [0];
						var b = __left0__ [1];
						for (var i = 0; i < 10; i++) {
							yield a;
							var __left0__ = tuple ([b, a + b]);
							var a = __left0__ [0];
							var b = __left0__ [1];
						}
					};
					var squares = function () {
						var __accu0__ = [];
						for (var i = 0; i < 10; i++) {
							__accu0__.append (i * i);
						}
						return __accu0__;
					} ();
					var chars = 'thequickbrownfoxjumpsoverthelazydog';
					var run = function (autoTester) {
						autoTester.check ('islice count', list (islice (count (10, 2), 4, 40, 3)));
						autoTester.check ('islice cycle', list (islice (cycle (fibonacci ()), 15)));
						autoTester.check ('repeat', list (repeat (3.14, 15)));
						autoTester.check ('islice repeat', list (islice (repeat (2.74), 15)));
						autoTester.check ('accumulate', list (accumulate (range (5))));
						var add = function (total, element) {
							return total + element;
						};
						autoTester.check ('accumulate', list (accumulate (list (['alamak', 'mirach', 'sirrah']), add)));
						autoTester.check ('chain', list (chain (fibonacci (), squares, chars)));
						autoTester.check ('chain.from_iterable', list (chain.from_iterable (list (['ape', 'node', 'mice', 'vim', 'sus', 'jet']))));
						var selectors = list ([true, true, false, true, false, false, true, true, false, true]);
						autoTester.check ('compress', list (compress (function () {
							var __accu0__ = [];
							for (var [index, py_selector] of enumerate (selectors)) {
								__accu0__.append ('{}{}'.format ((py_selector ? 'take' : 'leave'), index));
							}
							return __accu0__;
						} (), selectors)));
						autoTester.check ('dropwhile', list (dropwhile ((function __lambda__ (x) {
							return x < 5;
						}), list ([1, 4, 6, 4, 1]))));
						autoTester.check ('filterfalse', list (filterfalse ((function __lambda__ (x) {
							return __mod__ (x, 2);
						}), range (10))));
						var things = list ([tuple (['animal', 'bear']), tuple (['animal', 'duck']), tuple (['plant', 'cactus']), tuple (['vehicle', 'speed boat']), tuple (['vehicle', 'school bus'])]);
						for (var [key, group] of groupby (things, (function __lambda__ (x) {
							return x [0];
						}))) {
							for (var thing of group) {
								autoTester.check ('A {} is a {}.'.format (thing [1], key));
							}
							autoTester.check (' ');
						}
						autoTester.check ('islice', list (islice (list ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), 2, 9, 2)));
						autoTester.check ('starmap', function () {
							var __accu0__ = [];
							for (var x of starmap (pow, list ([tuple ([2, 5]), tuple ([3, 2]), tuple ([10, 3])]))) {
								__accu0__.append (int (x));
							}
							return __accu0__;
						} ());
						autoTester.check ('takewhile', list (takewhile ((function __lambda__ (x) {
							return x < 5;
						}), list ([1, 4, 6, 4, 1]))));
						var __left0__ = tee (islice (count (), 5));
						var i1 = __left0__ [0];
						var i2 = __left0__ [1];
						autoTester.check ('tee', list (i1), list (i1), list (i2));
						autoTester.check ('product', list (product ('ABCD', 'xy')), list (product (range (2), __kwargtrans__ ({repeat: 3}))));
						autoTester.check ('permutations', list (permutations ('ABCD')), list (permutations ('ABCD', 2)));
						autoTester.check ('combinations', list (combinations ('ABCD', 2)), list (combinations (list ([1, 2, 3, 4, 5]), 3)), list (combinations (islice (count (), 6), 4)));
						autoTester.check ('combinations_with_replacement', list (combinations_with_replacement ('ABCD', 2)), list (combinations_with_replacement (list ([1, 2, 3, 4, 5]), 3)), list (combinations_with_replacement (islice (count (), 6), 4)));
					};
					__pragma__ ('<use>' +
						'itertools' +
						'math' +
					'</use>')
					__pragma__ ('<all>')
						__all__.accumulate = accumulate;
						__all__.chain = chain;
						__all__.chars = chars;
						__all__.combinations = combinations;
						__all__.combinations_with_replacement = combinations_with_replacement;
						__all__.compress = compress;
						__all__.count = count;
						__all__.cycle = cycle;
						__all__.dropwhile = dropwhile;
						__all__.fibonacci = fibonacci;
						__all__.filterfalse = filterfalse;
						__all__.groupby = groupby;
						__all__.islice = islice;
						__all__.permutations = permutations;
						__all__.pow = pow;
						__all__.product = product;
						__all__.repeat = repeat;
						__all__.run = run;
						__all__.squares = squares;
						__all__.starmap = starmap;
						__all__.takewhile = takewhile;
						__all__.tee = tee;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'module_math', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var acos = __init__ (__world__.math).acos;
					var acosh = __init__ (__world__.math).acosh;
					var asin = __init__ (__world__.math).asin;
					var asinh = __init__ (__world__.math).asinh;
					var atan = __init__ (__world__.math).atan;
					var atan2 = __init__ (__world__.math).atan2;
					var atanh = __init__ (__world__.math).atanh;
					var ceil = __init__ (__world__.math).ceil;
					var cos = __init__ (__world__.math).cos;
					var cosh = __init__ (__world__.math).cosh;
					var degrees = __init__ (__world__.math).degrees;
					var e = __init__ (__world__.math).e;
					var exp = __init__ (__world__.math).exp;
					var expm1 = __init__ (__world__.math).expm1;
					var floor = __init__ (__world__.math).floor;
					var hypot = __init__ (__world__.math).hypot;
					var inf = __init__ (__world__.math).inf;
					var isnan = __init__ (__world__.math).isnan;
					var log = __init__ (__world__.math).log;
					var log10 = __init__ (__world__.math).log10;
					var log1p = __init__ (__world__.math).log1p;
					var log2 = __init__ (__world__.math).log2;
					var nan = __init__ (__world__.math).nan;
					var pi = __init__ (__world__.math).pi;
					var pow = __init__ (__world__.math).pow;
					var radians = __init__ (__world__.math).radians;
					var sin = __init__ (__world__.math).sin;
					var sinh = __init__ (__world__.math).sinh;
					var sqrt = __init__ (__world__.math).sqrt;
					var tan = __init__ (__world__.math).tan;
					var tanh = __init__ (__world__.math).tanh;
					var trunc = __init__ (__world__.math).trunc;
					var _check = function (nr, autoTester) {
						if (isinstance (nr, float)) {
							var nr = str (nr).__getslice__ (0, 15, 1);
						}
						autoTester.check (nr);
					};
					var run = function (autoTester) {
						var check = (function __lambda__ (nr) {
							return _check (nr, autoTester);
						});
						check (pi);
						check (e);
						check (exp (3));
						check (int (expm1 (5)));
						check (log (0.2));
						check (round (log (1024, 2)));
						check (log1p (5));
						check (int (log2 (257)));
						check (int (log10 (1001)));
						check (pow (3, 4.5));
						check (sqrt (25.1));
						check (sin (10));
						check (cos (10));
						check (tan (10));
						check (asin (0.5));
						check (acos (0.5));
						check (atan (0.5));
						check (atan2 (1, 2));
						check (int (hypot (3, 4.1)));
						check (degrees (pi / 2.1));
						check (radians (90));
						check (sinh (1));
						check (cosh (1));
						check (tan (1));
						check (asinh (70));
						check (acosh (70));
						check (atan (70));
						check (floor (3.5));
						check (ceil (3.5));
						check (trunc (3.5));
						check (isnan (3));
						check (isnan (nan));
					};
					__pragma__ ('<use>' +
						'math' +
					'</use>')
					__pragma__ ('<all>')
						__all__._check = _check;
						__all__.acos = acos;
						__all__.acosh = acosh;
						__all__.asin = asin;
						__all__.asinh = asinh;
						__all__.atan = atan;
						__all__.atan2 = atan2;
						__all__.atanh = atanh;
						__all__.ceil = ceil;
						__all__.cos = cos;
						__all__.cosh = cosh;
						__all__.degrees = degrees;
						__all__.e = e;
						__all__.exp = exp;
						__all__.expm1 = expm1;
						__all__.floor = floor;
						__all__.hypot = hypot;
						__all__.inf = inf;
						__all__.isnan = isnan;
						__all__.log = log;
						__all__.log10 = log10;
						__all__.log1p = log1p;
						__all__.log2 = log2;
						__all__.nan = nan;
						__all__.pi = pi;
						__all__.pow = pow;
						__all__.radians = radians;
						__all__.run = run;
						__all__.sin = sin;
						__all__.sinh = sinh;
						__all__.sqrt = sqrt;
						__all__.tan = tan;
						__all__.tanh = tanh;
						__all__.trunc = trunc;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'modules', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var modules = {};
					__nest__ (modules, 'mod1.mod11.mod111', __init__ (__world__.modules.mod1.mod11.mod111));
					__nest__ (modules, 'mod3', __init__ (__world__.modules.mod3));
					__nest__ (modules, 'mod1.mod11.mod112', __init__ (__world__.modules.mod1.mod11.mod112));
					__nest__ (modules, 'mod1', __init__ (__world__.modules.mod1));
					__nest__ (modules, 'mod1.mod11', __init__ (__world__.modules.mod1.mod11));
					__nest__ (modules, 'mod2', __init__ (__world__.modules.mod2));
					__nest__ (modules, 'mod2.mod21', __init__ (__world__.modules.mod2.mod21));
					__nest__ (modules, 'mod2.mod22', __init__ (__world__.modules.mod2.mod22));
					var aliasMod111 =  __init__ (__world__.modules.mod1.mod11.mod111);
					var aMod1 =  __init__ (__world__.modules.mod1);
					var mod111 = __init__ (__world__.modules.mod1.mod11.mod111);
					var mod112 = __init__ (__world__.modules.mod1.mod11.mod112);
					var aMod21 = __init__ (__world__.modules.mod2.mod21);
					var aMod22 = __init__ (__world__.modules.mod2.mod22);
					var mod3GetTwoHundred = __init__ (__world__.modules.mod3).mod3GetTwoHundred;
					var mod3Hundred = __init__ (__world__.modules.mod3).mod3Hundred;
					var x = __init__ (__world__.modules.mod3).x;
					var A = __init__ (__world__.modules.mod1.mod11.mod111).A;
					var a = modules.mod1.mod11.mod111.A (12345);
					var pi = modules.mod1.pi;
					var f = modules.mod2.f;
					var run = function (autoTester) {
						autoTester.check ('modules');
						autoTester.check (a.f ());
						autoTester.check (modules.mod1.mod11.mod112.f ());
						autoTester.check (modules.mod1.mod11.e);
						autoTester.check (pi);
						autoTester.check (f (102030));
						autoTester.check (modules.mod2.mod21.f ());
						var B = modules.mod2.mod22.B;
						var b = B ();
						autoTester.check (b.x);
						autoTester.check (modules.mod3.x);
						var a2 = aliasMod111.A (6789101112);
						autoTester.check (a2.f ());
						autoTester.check (aMod1.pi);
						var a3 = mod111.A (100.001);
						autoTester.check (a3.f ());
						autoTester.check (mod112.f ());
						autoTester.check (aMod21.f ());
						autoTester.check (aMod22.B ().x);
						autoTester.check (mod3Hundred);
						autoTester.check (mod3GetTwoHundred ());
						autoTester.check (A (123.321).f ());
						var mod4 = __init__ (__world__.modules.mod4);
						autoTester.check (mod4.mod4Add2FromMod5 (449));
					};
					__pragma__ ('<use>' +
						'modules.mod1' +
						'modules.mod1.mod11' +
						'modules.mod1.mod11.mod111' +
						'modules.mod1.mod11.mod112' +
						'modules.mod2' +
						'modules.mod2.mod21' +
						'modules.mod2.mod22' +
						'modules.mod3' +
						'modules.mod4' +
					'</use>')
					__pragma__ ('<all>')
						__all__.A = A;
						__all__.a = a;
						__all__.aMod21 = aMod21;
						__all__.aMod22 = aMod22;
						__all__.f = f;
						__all__.mod111 = mod111;
						__all__.mod112 = mod112;
						__all__.mod3GetTwoHundred = mod3GetTwoHundred;
						__all__.mod3Hundred = mod3Hundred;
						__all__.pi = pi;
						__all__.run = run;
						__all__.x = x;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'modules.mod1', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var pi = 3.1415693588;
					__pragma__ ('<all>')
						__all__.pi = pi;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'modules.mod1.mod11', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var e = 2.74;
					__pragma__ ('<all>')
						__all__.e = e;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'modules.mod1.mod11.mod111', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var A = __class__ ('A', [object], {
						get __init__ () {return __get__ (this, function (self, x) {
							self.x = x;
						});},
						get f () {return __get__ (this, function (self) {
							return self.x;
						});}
					});
					__pragma__ ('<all>')
						__all__.A = A;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'modules.mod1.mod11.mod112', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var f = function () {
						return "Paris, c'est la vie\n";
					};
					__pragma__ ('<all>')
						__all__.f = f;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'modules.mod2', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var f = function (p) {
						return 2 * p;
					};
					__pragma__ ('<all>')
						__all__.f = f;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'modules.mod2.mod21', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var f = function () {
						return 'London is the town for me\n';
					};
					__pragma__ ('<all>')
						__all__.f = f;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'modules.mod2.mod22', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var B = __class__ ('B', [object], {
						get __init__ () {return __get__ (this, function (self) {
							self.x = 'Geef mij maar Amsterdam\n';
						});}
					});
					__pragma__ ('<all>')
						__all__.B = B;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'modules.mod3', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var x = 'Toen wij uit Rotterdam vertrokken, vertrokken wij uit Rotterdam\n';
					var mod3Hundred = 100;
					var mod3GetTwoHundred = function () {
						return 200;
					};
					__pragma__ ('<all>')
						__all__.mod3GetTwoHundred = mod3GetTwoHundred;
						__all__.mod3Hundred = mod3Hundred;
						__all__.x = x;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'modules.mod4', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var mod4Add2FromMod5 = function (variable) {
						var mod5Add2 = __init__ (__world__.modules.mod5).mod5Add2;
						return mod5Add2 (variable);
					};
					var mod4Add1 = function (variable) {
						return variable + 1;
					};
					__pragma__ ('<use>' +
						'modules.mod5' +
					'</use>')
					__pragma__ ('<all>')
						__all__.mod4Add1 = mod4Add1;
						__all__.mod4Add2FromMod5 = mod4Add2FromMod5;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'modules.mod5', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var modules = {};
					var mod5Add2 = function (variable) {
						__nest__ (modules, 'mod4', __init__ (__world__.modules.mod4));
						return modules.mod4.mod4Add1 (variable + 1);
					};
					__pragma__ ('<use>' +
						'modules.mod4' +
					'</use>')
					__pragma__ ('<all>')
						__all__.mod5Add2 = mod5Add2;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'nonlocals', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var run = function (autoTester) {
						var test1 = 1;
						var test2 = 2;
						var f = function () {
							var test1 = 10;
							test2 = 20;
							autoTester.check (test1, test2);
						};
						f ();
						autoTester.check (test1, test2);
					};
					__pragma__ ('<all>')
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'operator_overloading', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var Matrix = __class__ ('Matrix', [object], {
						get __init__ () {return __get__ (this, function (self, nRows, nCols, elements) {
							if (typeof elements == 'undefined' || (elements != null && elements .hasOwnProperty ("__kwargtrans__"))) {;
								var elements = list ([]);
							};
							self.nRows = nRows;
							self.nCols = nCols;
							if (len (elements)) {
								self._ = elements;
							}
							else {
								self._ = function () {
									var __accu0__ = [];
									for (var row = 0; row < nRows; row++) {
										__accu0__.append (function () {
											var __accu1__ = [];
											for (var col = 0; col < nCols; col++) {
												__accu1__.append (0);
											}
											return __accu1__;
										} ());
									}
									return __accu0__;
								} ();
							}
						});},
						get __matmul__ () {return __get__ (this, function (self, other) {
							var result = Matrix (self.nRows, other.nCols);
							for (var iTargetRow = 0; iTargetRow < result.nRows; iTargetRow++) {
								for (var iTargetCol = 0; iTargetCol < result.nCols; iTargetCol++) {
									for (var iTerm = 0; iTerm < self.nCols; iTerm++) {
										result._ [iTargetRow] [iTargetCol] += self._ [iTargetRow] [iTerm] * other._ [iTerm] [iTargetCol];
									}
								}
							}
							return result;
						});},
						get __imatmul__ () {return __get__ (this, function (self, other) {
							return self.__matmul__ (other);
						});},
						get __mul__ () {return __get__ (this, function (self, other) {
							if (py_typeof (other) == Matrix) {
								var result = Matrix (self.nRows, self.nCols);
								for (var iRow = 0; iRow < self.nRows; iRow++) {
									for (var iCol = 0; iCol < self.nCols; iCol++) {
										result._ [iRow] [iCol] = self._ [iRow] [iCol] * other._ [iRow] [iCol];
									}
								}
								return result;
							}
							else {
								return self.__rmul__ (other);
							}
						});},
						get __rmul__ () {return __get__ (this, function (self, scalar) {
							var result = Matrix (self.nRows, self.nCols);
							for (var iRow = 0; iRow < self.nRows; iRow++) {
								for (var iCol = 0; iCol < self.nCols; iCol++) {
									result._ [iRow] [iCol] = scalar * self._ [iRow] [iCol];
								}
							}
							return result;
						});},
						get __imul__ () {return __get__ (this, function (self, other) {
							return self.__mul__ (other);
						});},
						get __add__ () {return __get__ (this, function (self, other) {
							var result = Matrix (self.nRows, self.nCols);
							for (var iRow = 0; iRow < self.nRows; iRow++) {
								for (var iCol = 0; iCol < self.nCols; iCol++) {
									result._ [iRow] [iCol] = self._ [iRow] [iCol] + other._ [iRow] [iCol];
								}
							}
							return result;
						});},
						get __getitem__ () {return __get__ (this, function (self, index) {
							return self._ [index];
						});},
						get __setitem__ () {return __get__ (this, function (self, index, value) {
							self._ [index] = value;
						});},
						get __repr__ () {return __get__ (this, function (self) {
							return repr (self._);
						});}
					});
					var Functor = __class__ ('Functor', [object], {
						get __init__ () {return __get__ (this, function (self, factor) {
							self.factor = factor;
						});},
						get __call__ () {return __get__ (this, function (self, x, y) {
							if (typeof y == 'undefined' || (y != null && y .hasOwnProperty ("__kwargtrans__"))) {;
								var y = -(1);
							};
							var m = -(2);
							var kwargs = dict ();
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											case 'self': var self = __allkwargs0__ [__attrib0__]; break;
											case 'x': var x = __allkwargs0__ [__attrib0__]; break;
											case 'y': var y = __allkwargs0__ [__attrib0__]; break;
											case 'm': var m = __allkwargs0__ [__attrib0__]; break;
											case 'n': var n = __allkwargs0__ [__attrib0__]; break;
											default: kwargs [__attrib0__] = __allkwargs0__ [__attrib0__];
										}
									}
									delete kwargs.__kwargtrans__;
								}
								var args = tuple ([].slice.apply (arguments).slice (3, __ilastarg0__ + 1));
							}
							else {
								var args = tuple ();
							}
							return tuple ([self.factor * x, self.factor * y, function () {
								var __accu0__ = [];
								for (var arg of args) {
									__accu0__.append (self.factor * arg);
								}
								return __accu0__;
							} (), self.factor * m, self.factor * n]);
						});}
					});
					var f = Functor (10);
					var g = function (x, y) {
						if (typeof y == 'undefined' || (y != null && y .hasOwnProperty ("__kwargtrans__"))) {;
							var y = -(1);
						};
						var m = -(2);
						var kwargs = dict ();
						if (arguments.length) {
							var __ilastarg0__ = arguments.length - 1;
							if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
								var __allkwargs0__ = arguments [__ilastarg0__--];
								for (var __attrib0__ in __allkwargs0__) {
									switch (__attrib0__) {
										case 'x': var x = __allkwargs0__ [__attrib0__]; break;
										case 'y': var y = __allkwargs0__ [__attrib0__]; break;
										case 'm': var m = __allkwargs0__ [__attrib0__]; break;
										case 'n': var n = __allkwargs0__ [__attrib0__]; break;
										default: kwargs [__attrib0__] = __allkwargs0__ [__attrib0__];
									}
								}
								delete kwargs.__kwargtrans__;
							}
							var args = tuple ([].slice.apply (arguments).slice (2, __ilastarg0__ + 1));
						}
						else {
							var args = tuple ();
						}
						return tuple ([x, y, args, m, n]);
					};
					var run = function (autoTester) {
						var m0 = Matrix (3, 3, list ([list ([1, 2, 3]), list ([4, 5, 6]), list ([7, 8, 10])]));
						var m1 = Matrix (3, 3, list ([list ([10, 20, 30]), list ([40, 50, 60]), list ([70, 80, 90])]));
						var m4 = Matrix (3, 3, list ([list ([1, 1, 2]), list ([2, 2, 3]), list ([3, 3, -(5)])]));
						var m5 = Matrix (3, 3, list ([list ([1, 1, 2]), list ([2, 2, 3]), list ([3, 3, -(5)])]));
						var x = 3;
						var y = (x * 4) * x;
						var fast = 2 * 3;
						fast++;
						__setitem__ (__getitem__ (m1, 1), 2, __getitem__ (__getitem__ (m0, 1), 2));
						var slow = __add__ (2, 3);
						var m2 = __add__ (__mul__ (m0, m1), __mul__ (m1, __add__ (m0, m1)));
						var m3 = __mul__ (__mul__ (2, __add__ (__mul__ (__mul__ (__mul__ (2, m0), 3), m1), __mul__ (m2, 4))), 2);
						__call__ (autoTester.check, autoTester, __getitem__ (__getitem__ (m0, 1), 1), __getitem__ (__getitem__ (m0, 1), 2), __getitem__ (__getitem__ (m1, 1), 1), __getitem__ (__getitem__ (m1, 1), 2));
						var m1 = __call__ (__iadd__, null, m1, m0);
						var m2 = __call__ (__imul__, null, m2, m1);
						var m5 = __call__ (__imatmul__, null, m5, m4);
						var m6 = __matmul__ (m0, m1);
						var fast2 = 16 * y + 1;
						fast *= 2;
						autoTester.check (m0, m1);
						autoTester.check (x, y);
						autoTester.check (m2);
						autoTester.check (m3);
						autoTester.check (m5);
						autoTester.check (m6);
						autoTester.check (fast, slow, fast2);
						var x = 'marker';
						__call__ (autoTester.check, autoTester, __call__ (f, null, 3, 4, 30, 40, __kwargtrans__ ({m: 300, n: 400, p: 3000, q: 4000})));
						__call__ (autoTester.check, autoTester, __call__ (g, null, 3, 4, 30, 40, __kwargtrans__ ({m: 300, n: 400, p: 3000, q: 4000})));
						__call__ (autoTester.check, autoTester, __eq__ (__call__ (set, null, tuple ([1, 2, 3])), __call__ (set, null, tuple ([3, 2, 1]))));
						__call__ (autoTester.check, autoTester, __ne__ (__call__ (set, null, tuple ([1, 2, 3])), __call__ (set, null, tuple ([3, 2, 1]))));
						__call__ (autoTester.check, autoTester, __eq__ (__call__ (set, null, tuple ([1, 3])), __call__ (set, null, tuple ([3, 2, 1]))));
						__call__ (autoTester.check, autoTester, __ne__ (__call__ (set, null, tuple ([1, 3])), __call__ (set, null, tuple ([3, 2, 1]))));
						__call__ (autoTester.check, autoTester, __lt__ (__call__ (set, null, tuple ([1, 2])), __call__ (set, null, tuple ([3, 2, 1]))));
						__call__ (autoTester.check, autoTester, __le__ (__call__ (set, null, tuple ([1, 2, 3])), __call__ (set, null, tuple ([3, 2, 1]))));
						__call__ (autoTester.check, autoTester, __gt__ (__call__ (set, null, tuple ([1, 2, 3])), __call__ (set, null, tuple ([2, 1]))));
						__call__ (autoTester.check, autoTester, __ge__ (__call__ (set, null, tuple ([1, 2, 3])), __call__ (set, null, tuple ([3, 2, 1]))));
						__call__ (autoTester.check, autoTester, __eq__ (tuple ([1, 2, 3]), tuple ([1, 2, 3])));
						__call__ (autoTester.check, autoTester, __eq__ (list ([1, 2, 3]), list ([1, 2, 3])));
						__call__ (autoTester.check, autoTester, __ne__ (tuple ([1, 2, 3]), tuple ([1, 2, 3])));
						__call__ (autoTester.check, autoTester, __ne__ (list ([1, 2, 3]), list ([1, 2, 3])));
						__call__ (autoTester.check, autoTester, __eq__ (tuple ([2, 1, 3]), tuple ([1, 2, 3])));
						__call__ (autoTester.check, autoTester, __eq__ (list ([2, 1, 3]), list ([1, 2, 3])));
						__call__ (autoTester.check, autoTester, __ne__ (tuple ([2, 1, 3]), tuple ([1, 2, 3])));
						__call__ (autoTester.check, autoTester, __ne__ (list ([2, 1, 3]), list ([1, 2, 3])));
						var Bitwise = __class__ ('Bitwise', [object], {
							get __lshift__ () {return __get__ (this, function (self, other) {
								autoTester.check ('lshift');
							});},
							get __rlshift__ () {return __get__ (this, function (self, other) {
								autoTester.check ('rlshift');
							});},
							get __rshift__ () {return __get__ (this, function (self, other) {
								autoTester.check ('rshift');
							});},
							get __rrshift__ () {return __get__ (this, function (self, other) {
								autoTester.check ('rrshift');
							});},
							get __or__ () {return __get__ (this, function (self, other) {
								autoTester.check ('or');
							});},
							get __ror__ () {return __get__ (this, function (self, other) {
								autoTester.check ('ror');
							});},
							get __xor__ () {return __get__ (this, function (self, other) {
								autoTester.check ('xor');
							});},
							get __rxor__ () {return __get__ (this, function (self, other) {
								autoTester.check ('rxor');
							});},
							get __and__ () {return __get__ (this, function (self, other) {
								autoTester.check ('and');
							});},
							get __rand__ () {return __get__ (this, function (self, other) {
								autoTester.check ('rand');
							});}
						});
						var bitwise = Bitwise ();
						__lshift__ (bitwise, list ([]));
						__lshift__ (list ([]), bitwise);
						__call__ (autoTester.check, autoTester, __lshift__ (32, 2));
						__rshift__ (bitwise, list ([]));
						__rshift__ (list ([]), bitwise);
						__call__ (autoTester.check, autoTester, __rshift__ (32, 2));
						__or__ (bitwise, list ([]));
						__or__ (list ([]), bitwise);
						__call__ (autoTester.check, autoTester, __or__ (1, 4));
						__xor__ (bitwise, list ([]));
						__xor__ (list ([]), bitwise);
						__call__ (autoTester.check, autoTester, __xor__ (11, 13));
						__and__ (bitwise, list ([]));
						__and__ (list ([]), bitwise);
						__call__ (autoTester.check, autoTester, __and__ (12, 20));
						var a = 32;
						var a = __call__ (__ilshift__, null, a, 2);
						__call__ (autoTester.check, autoTester, a);
						autoTester.check (32 << 2);
						autoTester.check (32 >> 2);
						autoTester.check (1 | 4);
						autoTester.check (11 ^ 13);
						autoTester.check (12 & 20);
						var a = 32;
						a <<= 2;
						autoTester.check (a);
						var A = __class__ ('A', [object], {
							get __init__ () {return __get__ (this, function (self) {
								self.b = dict ({});
							});}
						});
						var a = A ();
						a.b ['c'] = 'd';
						__setitem__ (a.b, 'c', __call__ (__iadd__, null, __getitem__ (a.b, 'c'), 'e'));
						autoTester.check (a.b ['c']);
					};
					__pragma__ ('<all>')
						__all__.Functor = Functor;
						__all__.Matrix = Matrix;
						__all__.f = f;
						__all__.g = g;
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'org.transcrypt.autotester', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var itertools = {};
					var HTMLGenerator = __init__ (__world__.org.transcrypt.autotester.html).HTMLGenerator;
					var DataConverter = __init__ (__world__.org.transcrypt.autotester.html).DataConverter;
					var JSTesterUI = __init__ (__world__.org.transcrypt.autotester.html).JSTesterUI;
					__nest__ (itertools, '', __init__ (__world__.itertools));
					var getFileLocation = function (ancestor) {
						if (__envir__.executor_name == __envir__.transpiler_name) {
							var s = null;
							
										var e = new Error();
										if ( ! e.stack ) {
										  console.log("MAJOR ISSUE: Browser Error lacks Stack");
										} else {
										  s = e.stack;
										}
										
							var frames = null;
							
										var linereg = new RegExp("\n\r|\n", "g");
										frames = s.toString().split(linereg);
										
							if (frames === null || len (frames) < 2) {
								console.log("Failed to Split Stack");
								return 'UNKNOWN:???';
							}
							var gpFrame = frames [ancestor * 2 + 1];
							var frameReg = '([^(]*)\\(?([^:]*:)\\/{2,3}([^:/]*:?)([^:]*):(\\d+):(\\d+)';
							var m = null;
							
										var r = new RegExp(frameReg);
										m = r.exec(gpFrame);
										
							if (m) {
								var filepath = m [4];
								var pathParts = filepath.py_split ('/');
								var filename = pathParts [len (pathParts) - 1];
								var lineno = m [5];
								return '{}:{}'.format (filename, lineno);
							}
							else {
								console.log("Failed to Match Frame");
								return 'UNKNOWN:???';
							}
						}
					};
					var AutoTester = __class__ ('AutoTester', [object], {
						get __init__ () {return __get__ (this, function (self, symbols) {
							if (typeof symbols == 'undefined' || (symbols != null && symbols .hasOwnProperty ("__kwargtrans__"))) {;
								var symbols = list ([]);
							};
							self.symbols = symbols;
							self._currTestlet = 'UNKNOWN';
							self.testDict = dict ({});
							self.refDict = dict ({});
							if (__envir__.executor_name == __envir__.transpiler_name) {
								self.ui = JSTesterUI ();
							}
							else {
								self.ui = null;
							}
						});},
						get sortedRepr () {return __get__ (this, function (self, any) {
							var tryGetNumKey = function (key) {
								if (py_typeof (key) == str) {
									try {
										return int (key);
									}
									catch (__except0__) {
										try {
											return float (key);
										}
										catch (__except1__) {
											return key;
										}
									}
								}
								else {
									return key;
								}
							};
							if (py_typeof (any) == dict) {
								return ('{' + ', '.join (function () {
									var __accu0__ = [];
									for (var [index, key] of enumerate (sorted (function () {
										var __accu1__ = [];
										for (var key of any.py_keys ()) {
											__accu1__.append (tryGetNumKey (key));
										}
										return __accu1__;
									} (), __kwargtrans__ ({key: (function __lambda__ (aKey) {
										return str (aKey);
									})})))) {
										__accu0__.append ('{}: {}'.format (repr (key), repr (any [key])));
									}
									return __accu0__;
								} ())) + '}';
							}
							else if (py_typeof (any) == set) {
								if (len (any)) {
									return ('{' + ', '.join (sorted (function () {
										var __accu0__ = [];
										for (var item of list (any)) {
											__accu0__.append (str (item));
										}
										return __accu0__;
									} ()))) + '}';
								}
								else {
									return repr (any);
								}
							}
							else if (py_typeof (any) == range) {
								return repr (list (any));
							}
							else {
								return repr (any);
							}
						});},
						get check () {return __get__ (this, function (self) {
							var ancestor = 2;
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											case 'self': var self = __allkwargs0__ [__attrib0__]; break;
											case 'ancestor': var ancestor = __allkwargs0__ [__attrib0__]; break;
										}
									}
								}
								var args = tuple ([].slice.apply (arguments).slice (1, __ilastarg0__ + 1));
							}
							else {
								var args = tuple ();
							}
							var position = getFileLocation (ancestor);
							var item = ' '.join (function () {
								var __accu0__ = [];
								for (var arg of args) {
									__accu0__.append (self.sortedRepr (arg));
								}
								return __accu0__;
							} ());
							if (__envir__.executor_name == __envir__.transpiler_name) {
								self.testDict [self._currTestlet].append (tuple ([position, item]));
							}
							else {
								self.refDict [self._currTestlet].append (tuple ([position, item]));
							}
						});},
						get expectException () {return __get__ (this, function (self, func) {
							try {
								func ();
								return 'no exception';
							}
							catch (__except0__) {
								if (isinstance (__except0__, Exception)) {
									var exc = __except0__;
									return 'exception';
								}
								else {
									throw __except0__;
								}
							}
						});},
						get throwToError () {return __get__ (this, function (self, func) {
							try {
								return func ();
							}
							catch (__except0__) {
								if (isinstance (__except0__, Exception)) {
									var exc = __except0__;
									return tuple ([null, '!!!{}'.format (str (exc))]);
								}
								else {
									throw __except0__;
								}
							}
						});},
						get checkEval () {return __get__ (this, function (self, func) {
							var ret = self.throwToError (func);
							self.check (ret, __kwargtrans__ ({ancestor: 3}));
						});},
						get checkPad () {return __get__ (this, function (self, val, count) {
							for (var i = 0; i < count; i++) {
								self.check (val);
							}
						});},
						get _getTotalErrorCnt () {return __get__ (this, function (self, testData, refData) {
							var errCount = 0;
							for (var [i, [refPos, refItem]] of enumerate (refData)) {
								try {
									var __left0__ = testData [i];
									var testPos = __left0__ [0];
									var testItem = __left0__ [1];
									if (testItem != refItem) {
										errCount++;
									}
								}
								catch (__except0__) {
									errCount++;
								}
							}
							return errCount;
						});},
						get compare () {return __get__ (this, function (self) {
							var dc = DataConverter ();
							self.refDict = dc.getPythonResults ();
							var totalErrors = 0;
							var sKeys = sorted (self.refDict.py_keys ());
							for (var key of sKeys) {
								var refData = self.refDict [key];
								try {
									var testData = self.testDict [key];
									if (testData === null) {
										var __except0__ = KeyError ('No Test Data Module: {}'.format (key));
										__except0__.__cause__ = null;
										throw __except0__;
									}
								}
								catch (__except0__) {
									if (isinstance (__except0__, KeyError)) {
										self.ui.appendSeqRowName (key, len (refData));
										for (var [i, [refPos, refItem]] of enumerate (refData)) {
											self.ui.appendTableResult (key, null, null, refPos, refItem, false);
										}
										continue;
									}
									else {
										throw __except0__;
									}
								}
								var errCount = self._getTotalErrorCnt (testData, refData);
								var collapse = errCount == 0;
								self.ui.appendSeqRowName (key, errCount);
								for (var [i, [refPos, refItem]] of enumerate (refData)) {
									try {
										var __left0__ = testData [i];
										var testPos = __left0__ [0];
										var testItem = __left0__ [1];
									}
									catch (__except0__) {
										var testPos = null;
										var testItem = null;
									}
									self.ui.appendTableResult (key, testPos, testItem, refPos, refItem, collapse);
								}
								totalErrors += errCount;
							}
							self.ui.setOutputStatus (totalErrors == 0);
						});},
						get _cleanName () {return __get__ (this, function (self, py_name) {
							var ret = py_name;
							var invalidChars = list (['~', '!', '@', '$', '%', '^', '&', '*', '(', ')', '+', '=', ',', '.', '/', "'", ';', ':', '"', '?', '>', '<', '[', ']', '\\', '{', '}', '|', '`', '#', ' ']);
							for (var ch of invalidChars) {
								var ret = ret.py_replace (ch, '_');
							}
							return ret;
						});},
						get run () {return __get__ (this, function (self, testlet, testletName) {
							var testletName = self._cleanName (testletName);
							self._currTestlet = testletName;
							if (__envir__.executor_name == __envir__.transpiler_name) {
								self.testDict [self._currTestlet] = list ([]);
							}
							else {
								self.refDict [self._currTestlet] = list ([]);
							}
							try {
								testlet.run (self);
							}
							catch (__except0__) {
								if (isinstance (__except0__, Exception)) {
									var exc = __except0__;
									if (self.ui !== null) {
										self.ui.setOutputStatus (false);
										self.ui.showException (testletName, exc);
									}
									else {
										__except0__.__cause__ = null;
										throw __except0__;
									}
								}
								else {
									throw __except0__;
								}
							}
						});},
						get done () {return __get__ (this, function (self) {
							if (__envir__.executor_name == __envir__.transpiler_name) {
								self.compare ();
							}
							else {
								var fnameBase = __main__.__file__.__getslice__ (0, -(3), 1).py_replace ('\\', '/').rsplit ('/', 1) [-(1)];
								var hg = HTMLGenerator (fnameBase);
								for (var minified of tuple ([false, true])) {
									hg.generate_html (self.refDict, minified);
								}
							}
						});}
					});
					__pragma__ ('<use>' +
						'itertools' +
						'org.transcrypt.autotester.html' +
					'</use>')
					__pragma__ ('<all>')
						__all__.AutoTester = AutoTester;
						__all__.DataConverter = DataConverter;
						__all__.HTMLGenerator = HTMLGenerator;
						__all__.JSTesterUI = JSTesterUI;
						__all__.getFileLocation = getFileLocation;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'org.transcrypt.autotester.html', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var okColor = 'green';
					var errorColor = 'red';
					var highlightColor = 'yellow';
					var testletNameColor = 'blue';
					var messageDivId = 'message';
					var referenceDivId = 'python';
					var refResultDivId = 'pyresults';
					var refPosDivId = 'pypos';
					var testDivId = 'transcrypt';
					var tableId = 'resulttable';
					var resultsDivId = 'results';
					var faultRowClass = 'faultrow';
					var testletHeaderClass = 'testletheader';
					var transValClass = 'trans-val';
					var transPosClass = 'trans-pos';
					var pyValClass = 'py-val';
					var pyPosClass = 'py-pos';
					var excAreaId = 'exc-area';
					var excHeaderClass = 'exc-header';
					var forceCollapseId = 'force-collapse';
					var forceExpandId = 'force-expand';
					var HTMLGenerator = __class__ ('HTMLGenerator', [object], {
						get __init__ () {return __get__ (this, function (self, filenameBase) {
							if (typeof filenameBase == 'undefined' || (filenameBase != null && filenameBase .hasOwnProperty ("__kwargtrans__"))) {;
								var filenameBase = null;
							};
							self._fnameBase = filenameBase;
						});},
						get generate_html () {return __get__ (this, function (self, refDict, minified) {
							if (typeof minified == 'undefined' || (minified != null && minified .hasOwnProperty ("__kwargtrans__"))) {;
								var minified = false;
							};
							if (self._fnameBase === null) {
								var __except0__ = ValueError ('Filename Base must be defined to generate');
								__except0__.__cause__ = null;
								throw __except0__;
							}
							var minInfix = (minified ? '.min' : '');
							var fname = minInfix.join (list ([self._fnameBase, '.html']));
							var jsFileName = minInfix.join (list ([self._fnameBase, '.js']));
							var jsPath = '{}/{}'.format (__envir__.target_subdir, jsFileName);
							f = open (fname, 'w');
							f.write ('<html><head>');
							self._writeCSS (f);
							f.write ('</head><body>');
							self._writeStatusHeaderTemplate (f);
							var dc = DataConverter ();
							dc.writeHiddenResults (f, refDict);
							self._writeTableArea (f);
							f.write ('<script src="{}"></script>\n\n'.format (jsPath));
							f.write ('</body></html>');
							f.close ();
						});},
						get _writeCSS () {return __get__ (this, function (self, f) {
							var cssOut = '\n\t\t<style>\n\t\t  body {\n\t\t    max-width: 100%;\n\t\t  }\n\t\t  .faultrow > td {\n\t\t     background-color: LightCoral;\n\t\t  }\n\t\t  #resulttable {\n\t\t    border-collapse: collapse;\n\t\t    width: 100%;\n\t\t    table-layout: fixed;\n\t\t  }\n\t\t  #resulttable th, #resulttable td {\n\t\t    border: 1px solid grey;\n\t\t  }\n\t\t  .testletheader > td {\n\t\t    background-color: LightSkyBlue;\n\t\t  }\n\t\t  .header-pos {\n\t\t    width: 20%;\n\t\t  }\n\t\t  .header-val {\n\t\t    width: 30%;\n\t\t  }\n\t\t  .py-pos,.trans-pos {\n\t\t    width: 20%;\n\t\t    overflow: hidden;\n\t\t  }\n\t\t  .py-val, .trans-val {\n\t\t    width: 30%;\n\t\t    overflow-x: auto;\n\t\t  }\n\t\t  .exc-header {\n\t      color: red;\n\t\t  }\n\t\t  .collapsed {\n\t\t    display: None;\n\t\t  }\n\t\t</style>\n\t\t';
							f.write (cssOut);
						});},
						get _writeStatusHeaderTemplate () {return __get__ (this, function (self, f) {
							f.write ('<b>Status:</b>\n');
							f.write ('<div id="{}"></div><br><br>\n\n'.format (messageDivId));
						});},
						get _writeTableArea () {return __get__ (this, function (self, f) {
							f.write ('<div id="{}"></div>'.format (excAreaId));
							f.write ('<div id="{}">'.format (resultsDivId));
							f.write ('<div> <a id="{}" href="#"> Collapse All</a> <a id="{}" href="#">Expand All</a></div>'.format (forceCollapseId, forceExpandId));
							f.write ('<table id="{}"><thead><tr> <th colspan="2"> CPython </th> <th colspan="2"> Transcrypt </th> </tr>'.format (tableId));
							f.write ('<tr> <th class="header-pos"> Location </th> <th class="header-val"> Value </th> <th class="header-val"> Value </th> <th class="header-pos"> Location </th> </tr></thead><tbody></tbody>');
							f.write ('</table>');
							f.write ('</div>');
						});}
					});
					var DataConverter = __class__ ('DataConverter', [object], {
						get writeHiddenResults () {return __get__ (this, function (self, f, refDict) {
							f.write ('<div id="{}" style="display: None">'.format (referenceDivId));
							for (var key of refDict.py_keys ()) {
								var itemData = ' | '.join (function () {
									var __accu0__ = [];
									for (var x of refDict [key]) {
										__accu0__.append (x [1]);
									}
									return __accu0__;
								} ());
								var posContent = ' | '.join (function () {
									var __accu0__ = [];
									for (var x of refDict [key]) {
										__accu0__.append (x [0]);
									}
									return __accu0__;
								} ());
								f.write ('<div id="{}">\n'.format (key));
								f.write ('<div id="{}">{}</div>\n\n'.format (refResultDivId, itemData));
								f.write ('<div id="{}">{}</div>\n'.format (refPosDivId, posContent));
								f.write ('</div>\n');
							}
							f.write ('</div></div>\n');
						});},
						get getPythonResults () {return __get__ (this, function (self) {
							var refData = document.getElementById (referenceDivId);
							var refDict = dict ({});
							for (var child of refData.children) {
								var keyName = child.getAttribute ('id');
								var __left0__ = self._extractPosResult (child);
								var posData = __left0__ [0];
								var resultData = __left0__ [1];
								refDict [keyName] = zip (posData, resultData);
							}
							return refDict;
						});},
						get _extractPosResult () {return __get__ (this, function (self, elem) {
							var resultData = null;
							var posData = null;
							for (var e of elem.children) {
								var idStr = e.getAttribute ('id');
								if (idStr == refResultDivId) {
									var resultData = e.innerHTML.py_split (' | ');
								}
								else if (idStr == refPosDivId) {
									var posData = e.innerHTML.py_split (' | ');
								}
								else {
									// pass;
								}
							}
							return tuple ([posData, resultData]);
						});}
					});
					var getRowClsName = function (py_name) {
						return 'mod-' + py_name;
					};
					var JSTesterUI = __class__ ('JSTesterUI', [object], {
						get __init__ () {return __get__ (this, function (self) {
							self.expander = TestModuleExpander ();
						});},
						get setOutputStatus () {return __get__ (this, function (self, success) {
							if (success) {
								document.getElementById (messageDivId).innerHTML = '<div style="color: {}">Test succeeded</div>'.format (okColor);
							}
							else {
								document.getElementById (messageDivId).innerHTML = '<div style="color: {}"><b>Test failed</b></div>'.format (errorColor);
							}
						});},
						get appendSeqRowName () {return __get__ (this, function (self, py_name, errCount) {
							var table = document.getElementById (tableId);
							var row = table.insertRow (-(1));
							row.id = py_name;
							row.classList.add (testletHeaderClass);
							self.expander.setupCollapseableHeader (row, errCount == 0);
							var headerCell = row.insertCell (0);
							headerCell.innerHTML = (py_name + ' | Errors = ') + str (errCount);
							headerCell.colSpan = 4;
							headerCell.style.textAlign = 'center';
						});},
						get appendTableResult () {return __get__ (this, function (self, py_name, testPos, testItem, refPos, refItem, collapse) {
							if (typeof collapse == 'undefined' || (collapse != null && collapse .hasOwnProperty ("__kwargtrans__"))) {;
								var collapse = false;
							};
							var clsName = getRowClsName (py_name);
							var table = document.getElementById (tableId);
							var row = table.insertRow (-(1));
							row.classList.add (clsName);
							if (testItem != refItem) {
								row.classList.add (faultRowClass);
								var refPos = '!!!' + refPos;
							}
							else {
								self.expander.setCollapsed (row, collapse);
							}
							var cpy_pos = row.insertCell (0);
							cpy_pos.innerHTML = refPos;
							cpy_pos.classList.add (pyPosClass);
							var cpy_val = row.insertCell (1);
							cpy_val.innerHTML = refItem;
							cpy_val.classList.add (pyValClass);
							var trans_val = row.insertCell (2);
							if (testItem !== null) {
								trans_val.innerHTML = testItem;
							}
							trans_val.classList.add (transValClass);
							var trans_pos = row.insertCell (3);
							if (testPos !== null) {
								trans_pos.innerHTML = testPos;
							}
							trans_pos.classList.add (transPosClass);
						});},
						get showException () {return __get__ (this, function (self, testname, exc) {
							var excElem = document.getElementById (excAreaId);
							var header = document.createElement ('H2');
							header.classList.add (excHeaderClass);
							header.innerHTML = 'Exception Thrown in JS Runtime';
							excElem.appendChild (header);
							var content = document.createElement ('p');
							content.innerHTML = 'Exception in {}: {}'.format (testname, str (exc));
							excElem.appendChild (content);
							var stacktrace = document.createElement ('p');
							if (exc.stack !== null) {
								stacktrace.innerHTML = str (exc.stack);
							}
							else {
								stacktrace.innerHTML = 'No Stack Trace Available!';
							}
						});}
					});
					var TestModuleExpander = __class__ ('TestModuleExpander', [object], {
						get __init__ () {return __get__ (this, function (self) {
							self.collapsedClass = 'collapsed';
							self.modCollapseClass = 'mod-collapsed';
							self._expandCollapseAllFuncs ();
						});},
						get setCollapsed () {return __get__ (this, function (self, row, collapse) {
							if (collapse) {
								row.classList.add (self.collapsedClass);
							}
							else {
								row.classList.remove (self.collapsedClass);
							}
						});},
						get setupCollapseableHeader () {return __get__ (this, function (self, row, startCollapsed) {
							if (typeof startCollapsed == 'undefined' || (startCollapsed != null && startCollapsed .hasOwnProperty ("__kwargtrans__"))) {;
								var startCollapsed = false;
							};
							if (startCollapsed) {
								row.classList.add (self.modCollapseClass);
							}
							var toggleCollapse = function (evt) {
								var headerRow = evt.target.parentElement;
								var doCollapse = !(headerRow.classList.contains (self.modCollapseClass));
								self.collapseModule (headerRow, doCollapse);
							};
							row.onclick = toggleCollapse;
						});},
						get collapseModule () {return __get__ (this, function (self, headerRow, doCollapse) {
							var py_name = headerRow.id;
							var table = document.getElementById (tableId);
							var clsName = getRowClsName (py_name);
							var allRows = table.tHead.children;
							var rows = filter ((function __lambda__ (x) {
								return x.classList.contains (clsName);
							}), allRows);
							for (var row of rows) {
								self.setCollapsed (row, doCollapse);
							}
							if (doCollapse) {
								headerRow.classList.add (self.modCollapseClass);
							}
							else {
								headerRow.classList.remove (self.modCollapseClass);
							}
						});},
						get _expandCollapseAllFuncs () {return __get__ (this, function (self) {
							var applyToAll = function (evt, collapse) {
								var table = document.getElementById (tableId);
								var filtFunc = (function __lambda__ (x) {
									return x.classList.contains (testletHeaderClass);
								});
								var headerRows = filter (filtFunc, table.tHead.children);
								for (var headerRow of headerRows) {
									self.collapseModule (headerRow, collapse);
								}
							};
							var collapseAll = function (evt) {
								evt.preventDefault ();
								applyToAll (evt, true);
								return false;
							};
							var expandAll = function (evt) {
								evt.preventDefault ();
								applyToAll (evt, false);
								return false;
							};
							var forceCollapse = document.getElementById (forceCollapseId);
							forceCollapse.onclick = collapseAll;
							var forceExpand = document.getElementById (forceExpandId);
							forceExpand.onclick = expandAll;
						});}
					});
					__pragma__ ('<all>')
						__all__.DataConverter = DataConverter;
						__all__.HTMLGenerator = HTMLGenerator;
						__all__.JSTesterUI = JSTesterUI;
						__all__.TestModuleExpander = TestModuleExpander;
						__all__.errorColor = errorColor;
						__all__.excAreaId = excAreaId;
						__all__.excHeaderClass = excHeaderClass;
						__all__.faultRowClass = faultRowClass;
						__all__.forceCollapseId = forceCollapseId;
						__all__.forceExpandId = forceExpandId;
						__all__.getRowClsName = getRowClsName;
						__all__.highlightColor = highlightColor;
						__all__.messageDivId = messageDivId;
						__all__.okColor = okColor;
						__all__.pyPosClass = pyPosClass;
						__all__.pyValClass = pyValClass;
						__all__.refPosDivId = refPosDivId;
						__all__.refResultDivId = refResultDivId;
						__all__.referenceDivId = referenceDivId;
						__all__.resultsDivId = resultsDivId;
						__all__.tableId = tableId;
						__all__.testDivId = testDivId;
						__all__.testletHeaderClass = testletHeaderClass;
						__all__.testletNameColor = testletNameColor;
						__all__.transPosClass = transPosClass;
						__all__.transValClass = transValClass;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'properties', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var A = __class__ ('A', [object], {
						p: 1234,
						get getX () {return __get__ (this, function (self) {
							return self._x;
						});},
						get setX () {return __get__ (this, function (self, value) {
							self._x = value;
						});},
						get getY () {return __get__ (this, function (self) {
							return self._y;
						});},
						get setY () {return __get__ (this, function (self, value) {
							self._y = 1000 + value;
						});},
						get getY2 () {return __get__ (this, function (self) {
							return self._y;
						});},
						get setY2 () {return __get__ (this, function (self, value) {
							self._y = value;
						});},
						get getT () {return __get__ (this, function (self) {
							return self._t;
						});},
						get setT () {return __get__ (this, function (self, value) {
							self._t = value;
						});},
						get getU () {return __get__ (this, function (self) {
							return self._u + 10000;
						});},
						get setU () {return __get__ (this, function (self, value) {
							self._u = value - 5000;
						});}
					});
					var __left0__ = tuple ([property.call (A, A.getX, A.setX), property.call (A, A.getY, A.setY), property.call (A, A.getY2, A.setY2)]);
					Object.defineProperty (A, 'x', __left0__ [0]);;
					Object.defineProperty (A, 'y', __left0__ [1]);;
					Object.defineProperty (A, 'y2', __left0__ [2]);;
					Object.defineProperty (A, 't', property.call (A, A.getT, A.setT));;
					Object.defineProperty (A, 'u', property.call (A, A.getU, A.setU));;
					A.q = 5678;
					var B = __class__ ('B', [object], {
						get getZ () {return __get__ (this, function (self) {
							return self.z_;
						});},
						get setZ () {return __get__ (this, function (self, value) {
							self.z_ = value;
						});}
					});
					Object.defineProperty (B, 'z', property.call (B, B.getZ, B.setZ));;
					var C = __class__ ('C', [object], {
						get __init__ () {return __get__ (this, function (self) {
							self.offset = 1234;
						});},
						get getW () {return __get__ (this, function (self) {
							return self.w_ + self.offset;
						});},
						get setW () {return __get__ (this, function (self, value) {
							self.w_ = value - self.offset;
						});}
					});
					Object.defineProperty (C, 'w', property.call (C, C.getW, C.setW));;
					var run = function (autoTester) {
						var a1 = A ();
						var a2 = A ();
						a1.y2 = 1000;
						a2.y2 = 2000;
						a1.x = 5;
						a1.y = 6;
						a2.x = 7;
						a2.y = 8;
						a1.t = 77;
						a1.u = 88;
						autoTester.check (a1.x, a1.y, a1.y2);
						autoTester.check (a2.x, a2.y, a2.y2);
						autoTester.check (a1.p, a2.p, a1.q, a2.q);
						autoTester.check (a1.t, a1.u);
						var b = B ();
						var c = C ();
						b.z = 100100;
						c.z = 200200;
						c.w = 300300;
						autoTester.check (a1.x, b.z, c.z, c.w);
						c.w = 400400;
						c.z = 500500;
						b.z = 600600;
						autoTester.check (a1.x, b.z, c.z, c.w);
					};
					__pragma__ ('<all>')
						__all__.A = A;
						__all__.B = B;
						__all__.C = C;
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'proxies', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var run = function (autoTester) {
						var CodedStore = __class__ ('CodedStore', [object], {
							get __init__ () {return __get__ (this, function (self) {
								try {
									self ["__dict__"] = {}
								}
								catch (__except0__) {
									// pass;
								}
							});},
							get __setattr__ () {return __get__ (this, function (self, py_name, message) {
								self.__dict__ ['_' + py_name] = 'coded_' + message;
							});},
							get __getattr__ () {return __get__ (this, function (self, py_name) {
								return 'decoded_' + self.__dict__ ['_' + py_name];
							});},
							get peek () {return __get__ (this, function (self, py_name) {
								return self.__dict__ ['_' + py_name];
							});}
						});
						var s = CodedStore ();
						s.john = 'brown';
						s.mary = 'white';
						autoTester.check (s.peek ('john'));
						autoTester.check (s.peek ('mary'));
						autoTester.check (s.john);
						autoTester.check (s.mary);
						var A = __class__ ('A', [object], {
							get __init__ () {return __get__ (this, function (self) {
								self.p = 1;
								self.q = 2;
							});}
						});
						var B = __class__ ('B', [A], {
							get __getattr__ () {return __get__ (this, function (self, py_name) {
								return 'Faked {}'.format (py_name);
							});}
						});
						var C = __class__ ('C', [A], {
							get __setattr__ () {return __get__ (this, function (self, py_name, value) {
								autoTester.check ('Set faked {}'.format (py_name));
								A.__setattr__ (self, py_name, value);
							});}
						});
						var D = __class__ ('D', [B, C], {
						});
						var a = A ();
						var b = B ();
						var c = C ();
						var d = D ();
						autoTester.check (a.p, a.q);
						a.p = 3;
						autoTester.check (a.p, a.q);
						autoTester.check (b.p, b.q, b.r, b.s);
						b.p = 4;
						b.r = 5;
						autoTester.check (b.p, b.q, b.r, b.s);
						autoTester.check (c.p, c.q);
						c.p = 6;
						c.q = 7;
						autoTester.check (c.p, c.q);
						autoTester.check (d.p, d.q, d.r, d.s);
						d.p = 8;
						d.q = 9;
						d.r = 10;
						d.s = 11;
						autoTester.check (d.p, d.q, d.r, d.s);
					};
					__pragma__ ('<all>')
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'reprtest', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var run = function (test) {
						var v = 1;
						test.check (repr (v));
						test.check (str (v));
						var v = 'asdf';
						test.check (repr (v));
						test.check (str (v));
						var v = true;
						test.check (repr (v));
						test.check (str (v));
						var v = false;
						test.check (repr (v));
						test.check (str (v));
						var v = 1.2;
						test.check (repr (v));
						test.check (str (v));
						var v = -(31.2);
						test.check (repr (v));
						test.check (str (v));
						var v = 6.3e-11;
						test.check (repr (v));
						test.check (str (v));
						var v = 2.4e+38;
						test.check (repr (v));
						test.check (str (v));
						var v = -(3.4e-22);
						test.check (repr (v));
						test.check (str (v));
						var v = -(8.9e+33);
						test.check (repr (v));
						test.check (str (v));
						var v = null;
						test.check (repr (v));
						test.check (str (v));
						var v = list ([null]);
						test.check (repr (v));
						test.check (str (v));
						var v = list ([null, null]);
						test.check (repr (v));
						test.check (str (v));
						var v = list ([null, 1.02]);
						test.check (repr (v));
						test.check (str (v));
						var v = list ([1, 3.000234]);
						test.check (repr (v));
						test.check (str (v));
						var v = list ([1, 2, 3]);
						test.check (repr (v));
						test.check (str (v));
						var v = list ([1.04, 2.03, 3.005]);
						test.check (repr (v));
						test.check (str (v));
						var v = list (['asdf', 2.00009, '1234']);
						test.check (repr (v));
						test.check (str (v));
						var v = set (list ([1, 2, 3]));
						test.check (repr (v));
						test.check (str (v));
						var v = set (list ([]));
						test.check (repr (v));
						test.check (str (v));
						var v = tuple ([1, 2]);
						test.check (repr (v));
						test.check (str (v));
						var v = tuple ([3.4, 4.4]);
						test.check (repr (v));
						test.check (str (v));
						var v = tuple ([null, 5.32]);
						test.check (repr (v));
						test.check (str (v));
						var v = dict ({});
						test.check (repr (v));
						test.check (str (v));
						var v = dict ({'a': 1});
						test.check (repr (v));
						test.check (str (v));
						var d = dict ({'asdf': 3.4});
						test.check (repr (d));
						test.check (str (d));
						var d = dict ({'qwer': 'qwerqwer qwerqwer'});
						test.check (repr (d));
						test.check (str (d));
						var d = dict ({'a9342': null});
						test.check (repr (d));
						test.check (str (d));
						var d = dict ({'nfdns': true});
						test.check (repr (d));
						test.check (str (d));
						var d = dict ({'alel;e;': false});
						test.check (repr (d));
						test.check (str (d));
						var d = dict ({'didi': list ([true, false, true])});
						test.check (repr (d));
						test.check (str (d));
						var d = dict ({'bibi': list ([1, 2, 3])});
						test.check (repr (d));
						test.check (str (d));
						var d = dict ({'gigi': list (['Asdf', 'qwer', 'rewer'])});
						test.check (repr (d));
						test.check (str (d));
						var d = dict ({'hihi': tuple (['esdf', 'qwer', 'rewer'])});
						test.check (repr (d));
						test.check (str (d));
						var d = dict ({'jiji': list ([null, null, null])});
						test.check (repr (d));
						test.check (str (d));
						var d = dict ({'jiji': tuple ([1.3, 3.4])});
						test.check (repr (d));
						test.check (str (d));
						var d = dict ({'jiji': dict ({'c': 4})});
						test.check (repr (d));
						test.check (str (d));
						var Test1 = __class__ ('Test1', [object], {
							get __init__ () {return __get__ (this, function (self, val) {
								self._val = val;
							});},
							get __str__ () {return __get__ (this, function (self) {
								return '[Test1 {}]'.format (self._val);
							});},
							get __repr__ () {return __get__ (this, function (self) {
								return str (self);
							});}
						});
						var Test2 = __class__ ('Test2', [object], {
							get __init__ () {return __get__ (this, function (self, val) {
								self._val = val;
							});},
							get __repr__ () {return __get__ (this, function (self) {
								return '[Test2 {},{}]'.format (self._val, self._val * 2);
							});},
							get __str__ () {return __get__ (this, function (self) {
								return repr (self);
							});}
						});
						var Test3 = __class__ ('Test3', [Test2], {
							get __str__ () {return __get__ (this, function (self) {
								return '[Test3 {}]'.format (self._val);
							});}
						});
						var Test4 = __class__ ('Test4', [object], {
							get __init__ () {return __get__ (this, function (self, val) {
								self._val = val;
							});},
							get __repr__ () {return __get__ (this, function (self) {
								return '[Test4 {}]'.format (self._val);
							});}
						});
						var t1 = Test1 (2);
						test.check (repr (t1));
						test.check (str (t1));
						var t1 = Test1 (4.5);
						test.check (repr (t1));
						test.check (str (t1));
						var t1 = Test1 ('blarg');
						test.check (repr (t1));
						test.check (str (t1));
						var t1 = Test1 (list ([1, 2, 3]));
						test.check (repr (t1));
						test.check (str (t1));
						var t2 = Test2 (3);
						test.check (repr (t2));
						test.check (str (t2));
						var t2 = Test2 (7.6);
						test.check (repr (t2));
						test.check (str (t2));
						var t2 = Test2 (-(8.9));
						test.check (repr (t2));
						test.check (str (t2));
						var t3 = Test3 (8);
						test.check (repr (t3));
						test.check (str (t3));
						var t3 = Test3 (3.4);
						test.check (repr (t3));
						test.check (str (t3));
						test.check (repr (list ([t1, t2, 3])));
						var d = dict ({'irew': t1});
						test.check (repr (d));
						test.check (str (d));
						var d = dict ({'irew': list ([t1, t2, t3])});
						test.check (repr (d));
						test.check (str (d));
						var t4 = Test4 ('qwer');
						test.check (repr (t4));
						test.check (str (t4));
					};
					__pragma__ ('<all>')
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'set_comprehensions', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var run = function (autoTester) {
						var even = function () {
							var __accu0__ = [];
							for (var i of list ([0, 9, 1, 7, 2, 8, 3, 6, 4, 5])) {
								__accu0__.append (2 * i);
							}
							return set (__accu0__);
						} ();
						autoTester.check (even);
						var odd = function () {
							var __accu0__ = [];
							for (var i of list ([5, 6, 7, 8, 9, 4, 3, 1, 2, 0])) {
								__accu0__.append (2 * i + 1);
							}
							return set (__accu0__);
						} ();
						autoTester.check (odd);
						even.add (12);
						even.add (12);
						autoTester.check (even);
						even.discard (12);
						even.discard (12);
						autoTester.check (even);
						var uni = even.union (odd);
						autoTester.check (uni);
						autoTester.check (odd.isdisjoint (even));
						autoTester.check (uni.isdisjoint (even));
						autoTester.check (even.issuperset (uni));
						autoTester.check (uni.issuperset (even));
						autoTester.check (even.issubset (uni));
						autoTester.check (uni.issubset (even));
						var first = new set ([4, 1, 0, 5, 3, 2, 6]);
						autoTester.check (first);
						var second = new set ([3, 5, 6, 9, 4, 7, 8]);
						autoTester.check (second);
						var inter = first.intersection (second);
						autoTester.check (inter);
						var diff = first.difference (second);
						autoTester.check (diff);
						var symDiff = first.symmetric_difference (second);
						autoTester.check (symDiff);
						var aSet = new set ([200, 4, 5, 100]);
						aSet.py_update (first, symDiff, second);
						autoTester.check (aSet);
					};
					__pragma__ ('<all>')
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'simple_and_augmented_assignment', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var A = __class__ ('A', [object], {
						get __init__ () {return __get__ (this, function (self) {
							self.i = 0;
						});},
						get f () {return __get__ (this, function (self) {
							return self.i;
						});}
					});
					var a = A ();
					var run = function (autoTester) {
						var x = 3;
						var y = 5;
						var z = x + y;
						autoTester.check (z);
						var l = list ([1, 2, 3]);
						l [1] = l [2];
						autoTester.check (l);
						x++;
						autoTester.check (x);
						x++;
						autoTester.check (x);
						x++;
						autoTester.check (x);
						y--;
						autoTester.check (y);
						y--;
						autoTester.check (y);
						y--;
						autoTester.check (y);
						x += -(3);
						autoTester.check (x);
						x += 6;
						autoTester.check (x);
						y -= 3;
						autoTester.check (y);
						l [1] += l [1];
						autoTester.check (l);
						x += y;
						y += x;
						autoTester.check (x, y);
						var f = a.f;
						a.i++;
						autoTester.check (f ());
						a.i += 10;
						autoTester.check (f ());
						a.i += a.i;
						autoTester.check (f ());
					};
					__pragma__ ('<all>')
						__all__.A = A;
						__all__.a = a;
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'truthyness', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var run = function (autoTester) {
						autoTester.check (len (dict ({1: 2})));
						autoTester.check ('Select nonemtpy container, if any<br>');
						autoTester.check (__t__ (0) || tuple ([1, 2, 3]));
						autoTester.check (__t__ (tuple ([])) || tuple ([1, 2, 3]));
						autoTester.check (__t__ (tuple ([])) || tuple ([]));
						autoTester.check (__t__ (-__t__ ((1))) || __t__ (0) || tuple ([1, 2, 3]));
						autoTester.check (__t__ (tuple ([])) || __t__ (0) || tuple ([1, 2, 3]));
						autoTester.check (__t__ (tuple ([])) || __t__ (tuple ([])) || tuple ([1, 2, 3]));
						autoTester.check (__t__ (tuple ([])) || __t__ (tuple ([])) || tuple ([]));
						autoTester.check (__t__ (list ([0])) || list ([1, 2, 3]));
						autoTester.check (__t__ (list ([])) || list ([1, 2, 3]));
						autoTester.check (__t__ (list ([])) || list ([]));
						autoTester.check (__t__ (list ([-__t__ ((1))])) || __t__ (list ([0])) || list ([1, 2, 3]));
						autoTester.check (__t__ (list ([])) || __t__ (list ([0])) || list ([1, 2, 3]));
						autoTester.check (__t__ (list ([])) || __t__ (list ([])) || list ([1, 2, 3]));
						autoTester.check (__t__ (list ([])) || __t__ (list ([])) || list ([]));
						autoTester.check (__t__ (new set ([0])) || new set ([1, 2, 3, 4]));
						autoTester.check (__t__ (set ()) || new set ([1, 2, 3, 4]));
						autoTester.check (__t__ (set ()) || set ());
						autoTester.check (__t__ (new set ([-__t__ ((1))])) || __t__ (new set ([0])) || new set ([1, 2, 3, 5]));
						autoTester.check (__t__ (set ()) || __t__ (new set ([0])) || new set ([1, 2, 3, 6]));
						autoTester.check (__t__ (set ()) || __t__ (set ()) || new set ([1, 2, 3, 7]));
						autoTester.check (__t__ (set ()) || __t__ (set ()) || set ());
						autoTester.check (__t__ (dict ({0: 10})) || dict ({1: 11, 2: 12, 3: 13}));
						autoTester.check (__t__ (dict ({})) || new set ([1, 2, 3, 8]));
						autoTester.check (__t__ (dict ({})) || dict ({}));
						autoTester.check (__t__ (dict ([[-__t__ ((1)), -__t__ ((11))]])) || __t__ (dict ({0: 10})) || dict ({1: 11, 2: 12, 3: 13}));
						autoTester.check (__t__ (dict ({})) || __t__ (dict ({0: 10})) || dict ({1: 11, 2: 12, 3: 13}));
						autoTester.check (__t__ (dict ({})) || __t__ (dict ({})) || dict ({1: 11, 2: 12, 3: 13}));
						autoTester.check (__t__ (dict ({})) || __t__ (dict ({})) || dict ({}));
						autoTester.check ('<br><br>');
						autoTester.check ('Boolean evaluations');
						for (var expression of tuple (['<br> -- falsy -- <br>', tuple ([]), list ([]), set (), dict ({}), 0, '', 3 > 5, false, '<br> -- truthy -- <br>', tuple ([1, 2, 3]), list ([1, 2, 3]), new set ([1, 2, 3]), dict ({'a': 1, 'b': 2, 'c': 3}), 3, 'hello', 5 > 3, true])) {
							if (__t__ (__in__ (expression, tuple (['<br> -- falsy -- <br>', '<br> -- truthy -- <br>'])))) {
								autoTester.check (expression);
							}
							else {
								autoTester.check (expression, ' . . . ');
								autoTester.check ('operators');
								autoTester.check (!__t__ ((!__t__ ((expression)))));
								autoTester.check (!__t__ ((!__t__ ((__t__ (true) && expression)))));
								autoTester.check (!__t__ ((!__t__ ((__t__ (false) || expression)))));
								autoTester.check (!__t__ ((!__t__ ((__t__ (expression) && true)))));
								autoTester.check (!__t__ ((!__t__ ((__t__ (expression) && false)))));
								autoTester.check ('if');
								if (__t__ (expression)) {
									autoTester.check (true);
								}
								else {
									autoTester.check (false);
								}
								if (__t__ (__t__ (expression) || expression)) {
									autoTester.check (true);
								}
								else {
									autoTester.check (false);
								}
								if (__t__ (false)) {
									autoTester.check ('if');
								}
								else if (__t__ (expression)) {
									autoTester.check ('elif');
								}
								else {
									autoTester.check ('else');
								}
								autoTester.check ('while');
								while (__t__ (expression)) {
									autoTester.check (true);
									break;
								}
								autoTester.check ('condex');
								autoTester.check ((__t__ (expression) ? true : false));
							}
						}
						if (__t__ (0.0)) {
							autoTester.check ('0.0');
						}
						else if (__t__ (0.1)) {
							autoTester.check ('0.1');
						}
						else {
							autoTester.check ("Shouldn't be here...");
						}
						var A = __class__ ('A', [object], {
						});
						autoTester.check (!__t__ ((!__t__ ((A ())))));
					};
					__pragma__ ('<all>')
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'tuple_assignment', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var run = function (autoTester) {
						var __left0__ = tuple ([tuple ([1, 2]), 'santa-claus', new set ([3, 4]), 5]);
						var a = __left0__ [0][0];
						var b = __left0__ [0][1];
						var santa = __left0__ [1];
						var c = __left0__ [2][0];
						var d = __left0__ [2][1];
						var e = __left0__ [3];
						autoTester.check (a, b, c, d, e, santa);
						for (var [i, x] of enumerate (tuple ([0.5, 1.5, 2.5, 3.5]))) {
							autoTester.check (i, x);
						}
						var __left0__ = tuple ([3.14, 2.74]);
						var e = __left0__ [0];
						var pi = __left0__ [1];
						var __left0__ = tuple ([pi, e]);
						var e = __left0__ [0];
						var pi = __left0__ [1];
						autoTester.check (e, pi);
						var f = function () {
							return function () {
								var __accu0__ = [];
								for (var i = 7000; i < 10000; i += 1000) {
									__accu0__.append (tuple ([i, 2 * i]));
								}
								return __accu0__;
							} ();
						};
						var g = function () {
							return f;
						};
						var __left0__ = g () ();
						var k = __left0__ [0][0];
						var l = __left0__ [0][1];
						var m = __left0__ [1][0];
						var n = __left0__ [1][1];
						var o = __left0__ [2][0];
						var p = __left0__ [2][1];
						autoTester.check (k, l, m, n, o, p);
					};
					__pragma__ ('<all>')
						__all__.run = run;
					__pragma__ ('</all>')
				}
			}
		}
	);
	(function () {
		var py_arguments = {};
		var attribs_by_name = {};
		var builtin_super = {};
		var callable_test = {};
		var classes = {};
		var complex_numbers = {};
		var conditional_expressions = {};
		var control_structures = {};
		var dashed_numbers = {};
		var data_structures = {};
		var decorators = {};
		var dict_comprehensions = {};
		var dictionaries = {};
		var div_issues = {};
		var div_pulls = {};
		var docstrings = {};
		var exceptions = {};
		var extended_slices = {};
		var fstrings = {};
		var general_functions = {};
		var globals_function = {};
		var indices_and_slices = {};
		var iterators_and_generators = {};
		var lambda_functions = {};
		var list_comprehensions = {};
		var local_classes = {};
		var metaclasses = {};
		var module_builtin = {};
		var module_cmath = {};
		var module_itertools = {};
		var module_math = {};
		var modules = {};
		var nonlocals = {};
		var operator_overloading = {};
		var org = {};
		var properties = {};
		var proxies = {};
		var reprtest = {};
		var set_comprehensions = {};
		var simple_and_augmented_assignment = {};
		var truthyness = {};
		var tuple_assignment = {};
		__nest__ (org, 'transcrypt.autotester', __init__ (__world__.org.transcrypt.autotester));
		__nest__ (py_arguments, '', __init__ (__world__.py_arguments));
		__nest__ (attribs_by_name, '', __init__ (__world__.attribs_by_name));
		__nest__ (builtin_super, '', __init__ (__world__.builtin_super));
		__nest__ (callable_test, '', __init__ (__world__.callable_test));
		__nest__ (classes, '', __init__ (__world__.classes));
		__nest__ (complex_numbers, '', __init__ (__world__.complex_numbers));
		__nest__ (conditional_expressions, '', __init__ (__world__.conditional_expressions));
		__nest__ (control_structures, '', __init__ (__world__.control_structures));
		if (__in__ ('__py3.6__', __symbols__)) {
			__nest__ (dashed_numbers, '', __init__ (__world__.dashed_numbers));
		}
		__nest__ (data_structures, '', __init__ (__world__.data_structures));
		__nest__ (decorators, '', __init__ (__world__.decorators));
		__nest__ (dict_comprehensions, '', __init__ (__world__.dict_comprehensions));
		__nest__ (dictionaries, '', __init__ (__world__.dictionaries));
		__nest__ (div_issues, '', __init__ (__world__.div_issues));
		__nest__ (div_pulls, '', __init__ (__world__.div_pulls));
		__nest__ (docstrings, '', __init__ (__world__.docstrings));
		__nest__ (exceptions, '', __init__ (__world__.exceptions));
		__nest__ (extended_slices, '', __init__ (__world__.extended_slices));
		if (__in__ ('__py3.6__', __symbols__)) {
			__nest__ (fstrings, '', __init__ (__world__.fstrings));
		}
		__nest__ (general_functions, '', __init__ (__world__.general_functions));
		__nest__ (globals_function, '', __init__ (__world__.globals_function));
		__nest__ (indices_and_slices, '', __init__ (__world__.indices_and_slices));
		if (__in__ ('__esv6__', __symbols__)) {
			__nest__ (iterators_and_generators, '', __init__ (__world__.iterators_and_generators));
		}
		__nest__ (lambda_functions, '', __init__ (__world__.lambda_functions));
		__nest__ (list_comprehensions, '', __init__ (__world__.list_comprehensions));
		__nest__ (local_classes, '', __init__ (__world__.local_classes));
		__nest__ (metaclasses, '', __init__ (__world__.metaclasses));
		__nest__ (module_builtin, '', __init__ (__world__.module_builtin));
		__nest__ (module_cmath, '', __init__ (__world__.module_cmath));
		if (__in__ ('__esv6__', __symbols__)) {
			__nest__ (module_itertools, '', __init__ (__world__.module_itertools));
		}
		__nest__ (module_math, '', __init__ (__world__.module_math));
		__nest__ (modules, '', __init__ (__world__.modules));
		__nest__ (nonlocals, '', __init__ (__world__.nonlocals));
		__nest__ (operator_overloading, '', __init__ (__world__.operator_overloading));
		__nest__ (properties, '', __init__ (__world__.properties));
		__nest__ (reprtest, '', __init__ (__world__.reprtest));
		if (__in__ ('__esv6__', __symbols__)) {
			__nest__ (proxies, '', __init__ (__world__.proxies));
		}
		__nest__ (set_comprehensions, '', __init__ (__world__.set_comprehensions));
		__nest__ (simple_and_augmented_assignment, '', __init__ (__world__.simple_and_augmented_assignment));
		__nest__ (truthyness, '', __init__ (__world__.truthyness));
		__nest__ (tuple_assignment, '', __init__ (__world__.tuple_assignment));
		var autoTester = org.transcrypt.autotester.AutoTester ();
		autoTester.run (py_arguments, 'arguments');
		autoTester.run (attribs_by_name, 'attribs_by_name');
		autoTester.run (builtin_super, 'builtin_super');
		autoTester.run (callable_test, 'callable');
		autoTester.run (classes, 'classes');
		autoTester.run (complex_numbers, 'complex_numbers');
		autoTester.run (conditional_expressions, 'conditional_expressions');
		autoTester.run (control_structures, 'control_structures');
		if (__in__ ('__py3.6__', __symbols__)) {
			autoTester.run (dashed_numbers, 'dashed_numbers');
		}
		autoTester.run (data_structures, 'data_structures');
		autoTester.run (decorators, 'decorators');
		autoTester.run (dict_comprehensions, 'dict_comprehensions');
		autoTester.run (dictionaries, 'dictionaries');
		autoTester.run (div_issues, 'div_issues');
		autoTester.run (div_pulls, 'div_pulls');
		autoTester.run (docstrings, 'docstrings');
		autoTester.run (exceptions, 'exceptions');
		autoTester.run (extended_slices, 'extended_slices');
		if (__in__ ('__py3.6__', __symbols__)) {
			autoTester.run (fstrings, 'fstrings');
		}
		autoTester.run (globals_function, 'globals_function');
		autoTester.run (general_functions, 'general_functions');
		autoTester.run (indices_and_slices, 'indices_and_slices');
		if (__in__ ('__esv6__', __symbols__)) {
			autoTester.run (iterators_and_generators, 'iterators_and_generators');
		}
		autoTester.run (lambda_functions, 'lambda_functions');
		autoTester.run (list_comprehensions, 'list_comprehensions');
		autoTester.run (local_classes, 'local_classes');
		autoTester.run (metaclasses, 'metaclasses');
		autoTester.run (module_builtin, 'module_builtin');
		autoTester.run (module_cmath, 'module_cmath');
		if (__in__ ('__esv6__', __symbols__)) {
			autoTester.run (module_itertools, 'module_itertools');
		}
		autoTester.run (module_math, 'module_math');
		autoTester.run (modules, 'modules');
		autoTester.run (nonlocals, 'nonlocals');
		autoTester.run (operator_overloading, 'operator_overloading');
		autoTester.run (properties, 'properties');
		autoTester.run (reprtest, 'repr_str');
		if (__in__ ('__esv6__', __symbols__)) {
			autoTester.run (proxies, 'proxies');
		}
		autoTester.run (set_comprehensions, 'set_comprehensions');
		autoTester.run (simple_and_augmented_assignment, 'simple_and_augmented_assignment');
		autoTester.run (truthyness, 'truthyness');
		autoTester.run (tuple_assignment, 'tuple_assignemt');
		autoTester.done ();
		__pragma__ ('<use>' +
			'arguments' +
			'attribs_by_name' +
			'builtin_super' +
			'callable_test' +
			'classes' +
			'complex_numbers' +
			'conditional_expressions' +
			'control_structures' +
			'dashed_numbers' +
			'data_structures' +
			'decorators' +
			'dict_comprehensions' +
			'dictionaries' +
			'div_issues' +
			'div_pulls' +
			'docstrings' +
			'exceptions' +
			'extended_slices' +
			'fstrings' +
			'general_functions' +
			'globals_function' +
			'indices_and_slices' +
			'iterators_and_generators' +
			'lambda_functions' +
			'list_comprehensions' +
			'local_classes' +
			'metaclasses' +
			'module_builtin' +
			'module_cmath' +
			'module_itertools' +
			'module_math' +
			'modules' +
			'nonlocals' +
			'operator_overloading' +
			'org.transcrypt.autotester' +
			'properties' +
			'proxies' +
			'reprtest' +
			'set_comprehensions' +
			'simple_and_augmented_assignment' +
			'truthyness' +
			'tuple_assignment' +
		'</use>')
		__pragma__ ('<all>')
			__all__.autoTester = autoTester;
		__pragma__ ('</all>')
	}) ();
   return __all__;
}
window ['autotest'] = autotest ();
