/*
 * First version of the optimizer, relying completely on regular expressions
 * 
 * it grabs the code as text and just executes the outermost function (module level)
 * therefore it would not execute any real code, only setup the prototype functinos
 * and the constructor
 *
 * since some modules use "return new Module();" to create a singleton, I added 
 * a mechanism to remove the "new" keyword and get the same kind of non-executing behaviour
 *
 * the trial failed because i could not replace the old constructor with the new one
 * with simple replace algorithms because of whitespace differences
 *
 * Spits out some small statistics at the end, which is quite nice
 */

var fs = require('fs');

var successful = [];
var canceled = [];
var noconstruct = [];
var repaired = [];

function readdir (path) {
	var filesNames = fs.readdirSync(path)

	for (var i = 0; i < filesNames.length; i++) {

		var fileName = filesNames[i];
		var newPath = path + "/" + fileName;

		if(path == "app/Lib/Vendor"){
			continue;
		}

		if(fileName.indexOf(".js") == -1) {
		    var stats = fs.lstatSync(newPath);
			if (stats.isDirectory()) {
				readdir(newPath);
			}
			continue;
		}

		var moduleName = fileName.split(".js").join("");

		var contents = fs.readFileSync(newPath); 
		contents = contents.toString(); 

		// remove define construct around module, just get the module function
		contents = contents.replace(/define\(\[[^\]]*\],\s*([\s\S]*)\);/, '$1'); 

		// remove new from last return / disable singletons (eg. return new NotificationCenter;)
		var before = contents;
		contents = contents.replace(/([\s\S]*)return new ([a-zA-Z0-9]*)\s*\(?.*\);/, '$1return $2;');
		if (contents != before){
			repaired.push(moduleName);
		}


		eval("var module = " + contents);

		try {
			// test run, to get possible exceptions
			var Parent = function(){};
			var constructor = module(Parent);

			if (typeof constructor == 'object') {
				noconstruct.push(newPath);
				continue;
			}

			//var optimizedModule = optimize(moduleName, module);
			//console.log(optimizedModule);

			successful.push(newPath);

		} catch (e) {
			//console.log(e) // see whats making it cancel
			canceled.push(newPath);
		}
	};
}

function optimize(moduleName, module) {
/*
	var better = module.toString();

	var Parent = function(){};
	var constructor = module(Parent).toString();

	var regex = /^\s*this\.(.*) = (.*)\n?/mig;
	var props = [];

	do {
		match = regex.exec(constructor);
		if(match) {
			props.push(moduleName + ".prototype." + match[1] + " = " + match[2]);
		}

	} while (match != null);
	
	// remove original this.prop
	constructor = constructor.replace(regex, '');

	// add prototype variables at bottom of constructor
	if (props.length > 0) {
		constructor = constructor + "\n\n" + props.join("\n");
	}
	//constructor = constructor.replace("function " + moduleName + "(", "function " + moduleName + " (");
	*/

	return "";
}

readdir("app");


console.log("- Successful:", successful.length)
console.log("- Canceled:", canceled.length)
console.log("- No Constructor:", noconstruct.length)
console.log("- Repaired Singletons:", repaired.length)

console.log("canceled:", canceled)
console.log("no constructor:", noconstruct)
//console.log("successful:", successful)