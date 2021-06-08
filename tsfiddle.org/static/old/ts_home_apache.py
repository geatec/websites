from ts_base import *

class Home:
	def __init__ (self, master):
		self.master = master
					
	def getStructure (self):
		return '''
			<div class="splash">			
				<div class="announcement-bar">
					<div class="text lane">
						Current version: 3.4.222 'Athens'
					</div>
				</div>
				<div class="panorama">
					<div class="slogan">
						Lean, fast, open!
					</div>
				</div>
				<div class="summary lane">
					<div>
						<h1>Clear standard syntax</h1>
						
						<p>
						Transcrypt has exactly the same clear, powerful syntax that Python is famous for, without the need for any proprietary extensions.
						
						<p>
						It supports string slicing with [i:j:k], matrix and vector operations with +, -, *, / and more, out of the box.
						
						<p>
						It compiles to compact, readable JavaScript that can be debugged from the Python source code using sourcemaps.
					</div>
					<div>
						<h1>Superior scalability</h1>

						<p>
						Python was designed for large scale programs from the ground up.
						
						<p>
						Hierarchical modules, local classes and multiple inheritance are all supported by Transcrypt, allowing a flexible, yet stable overall structure.

						<p>
						Transcrypt comes integrated with a static type validator, a linter and a minifier, enabling effective cooperation of large teams on extensive projects.
					</div>
					<div>
						<h1>One project, one language</h1>
						
						<p>
						Python is used everywhere at the back-end, from web servers to scientific computing. Now you can use it at the front-end as well.
						
						<p>
						Transcrypt offers seamless access to any JavaScript library and also runs on top of Node.js.
						
						<p>
						Python source code and JavaScript target code roughly have the same size, so your pages load as fast as ever.
					</div>
				</div>
			</div>
			<div class="flowchart lane section">
				<h1>Installing and using it is simple</h2>
				
				<img src="http://www.transcrypt.org/illustrations/workflow.png" alt="Transcrypt workflow">
			</div>
			<div class="introduction lane section">		
				<h1>Harness the power of Python for increasingly complex web applications</h1>
				
				<p>
				Transcrypt produces readable, debuggable, lean and mean JavaScript. The minified <u>downloads are measured in kB's</u> rather than MB's. And it's precompiled for speed. As for the availabity of libraries, a clear choice has been made to seamlessly integrate with the JavaScript universe of free, high-quality web oriented software. No need to reinvent the wheel. Calling JavaScript functions from Python, attaching Python event handlers to DOM elements, passing native data between Python and JavaScript, it all happens without any conversion or special syntax.
				<br>
				
				<p>
				Transcrypt stays as close to the Python original as possible without sacrificing performance. <u>Multiple inheritance</u>, recursive tuple assignment, multi-loop nested list comprehensions, LHS and RHS extended slices, assignment of bound functions, lambdas, named, default, *args and **kwargs parameters, properties, optional operator overloading, iterators, generators, selective exception handling and a hierarchical module system are just a few of its characteristics that make this clear. Transcrypt is parsed by CPython's AST module, so no surprises there.
				 
				<p>
				Transcrypt features <u>multi-level sourcemaps</u>, so you can debug your application comfortably, working from the Python source code in your browser, even if the generated JavaScript is minified. It also has a unique autotest feature that makes back to back regression testing with CPython a snap.

				<p>
				Transcrypt comes with 3rd party tools for <u>optional static type validation</u> (experimental), lightweight consistency checks and minification, all at the tip of a command line switch. It can generate code for JavaScript 5 and 6. All tools are fully integrated in the distribution, one simple pip install will get you started. 
			</div>
			<div class="correspondence lane section">
				<h1>Even with multiple inheritance there's a simple correspondence between Python and JavaScript</h1>
				
				<p>
				The ability to understand exactly what's going on under the hood, allows for fine grained optimizations. Speed up an inner loop? Use <i>__pragma__('js',...)</i> to freely mix Python with native JavaScript. Not that you'll need it often... An expression like <i>i+=1</i> is compiled to <i>i++</i>, and optional call caching bypasses the prototype chain, making repeated function calls even faster than handwritten JavaScript.
				
				<p>
				<img src="illustrations/class_compare_doc.png" alt="Python and JavaScript side by side">
			</div>
			<div class="mix lane section">
				<h1>Transcrypt can be mixed seamlessly with JavaScript and HTML</h1>
				
				<p>
				Anything you can do in JavaScript, you can do in Transcrypt. You'll always have immediate access to the newest libraries, use the newest DOM functions, interact with the newest HTML or CSS. Just join the party without restrictions.
				
				<p>
				<img src="illustrations/hello_doc.png" alt="Seamless mix with JavaScript and HTML">
			</div>
			<div class="free lane section">
				<h1>It's free. It's open. It's yours.</h1>
				
				<p>
				Transcrypt is released under the <a href="http://www.apache.org/licenses/LICENSE-2.0.txt">Apache 2 open source license</a>. You can download the source code, modify it, keep it in a locker, cut and paste from it, make it part of your product, contribute to its development, anything you like.
			</div>
		'''
				
	def getLayout (self):
		return '''	
			.content-structure .splash {
				position: relative;
				width: 100%;
				overflow: hidden;
				background-color: ''' + lightBrown + ''';
			}

			.content-structure .announcement-bar {
				position: relative;
				width: 100%;
				color: ''' + black + ''';
				background-color: ''' + lightGray + ''';
			}

			.content-structure .announcement-bar .text {
				position: relative;
				top: 25%;
				text-align: center;
				font-family: open sans, arial, sans serif;
				font-weight: 100;
				font-size: 80%;
			}
						
			.content-structure .panorama {
				position: relative;
				width: 100%
				background-size: cover;
				background-position: center;
				background-image:
				url("illustrations/athens_panorama.jpg");
			}
			
			.content-structure .panorama .slogan {
				position: relative;
				float: left;
				top: 60%;
				padding: 0% 2% 0% 2%;
				color: ''' + black + ''';
				background-color: ''' + transparentLogoGreen + ''';
				font-family: open sans, sans serif;		
				font-style: italic;
				font-weight: 700;
				font-size: 200%;
				visibility: ''' + ('visible' if self.master.landscape else 'hidden') + ''';
			}
						
			.content-structure .summary {
				position: relative;
				color: ''' + white + ''';
			}
			
			.content-structure .summary div {
				position: relative;
				float: ''' + ('left' if self.master.landscape else 'top') + ''';
				width: ''' + ('29%' if self.master.landscape else '95%') + ''';
				padding: 6% 2% 6% 2%;
			}
						
			.content-structure .summary h1 {
				position: relative;
				color: ''' + black + ''';
				background-color: ''' + transparentLogoGreen + ''';
				text-align: center;
				padding: 2%;
				margin: 0 0 0 2%;
				font-family: open sans, arial, sans
			}
			
			.content-structure .summary p {
				margin: 4% 0 0 6%;
				font-size: 90%;
			}
			
			.content-structure .introduction {
				background-color: ''' + lightGray + ''';
				clear: both;
			}

			.content-structure .flowchart {
				background-color: ''' + white + ''';
				clear: both;
			}

			.content-structure .flowchart img {
				width: 100%;
				max-width: 700;
			}
			
			.content-structure .mix {
				background-color: ''' + lightGray + ''';
				clear: both;
			}

			.content-structure .correspondence {
				background-color: ''' + white + ''';
				clear: both;
			}

			.content-structure .free {
				background-color: ''' + white + ''';
				clear: both;
			}
		'''
		
	def getScale (self):
		return '''
			.content-structure .splash {
				min-height: ''' + str (0.85 * window.innerHeight) + ''';				
			}
			
			.content-structure .announcement-bar {
				height:	''' + str (0.04 * window.innerHeight) + ''';		
			}
		
			.content-structure .panorama {
				height: ''' + str (0.35 * window.innerHeight) + ''';
			}
		'''

