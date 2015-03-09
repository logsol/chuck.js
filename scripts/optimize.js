/*
 * This is supposed to be a code optimizer.
 *
 * usage: 
 * node scripts/optimize.js
 *
 * based on https://developers.google.com/speed/articles/optimizing-javascript
 * I wanted to automatically replace properties as discribed under "Initializing instance variables"
 *
 * So far it is the only thing this script does, but the potential for more is there.
 * Also it does not (yet) write to any files, only outputs the results in the console.
 *
 * The script fully disasembles the entire codebase (with esprima) and reconstructs (via escodegen) it 
 * with a few optimisations unfortunately it loses ambiguous new lines and such, so that it might 
 * not be entirely usable as a code replacing script - it could perhaps be used as a compile script in
 * production
 *
 * But it has also nice things as at will add semicolons everywhere automatically and will 
 * definately keep a solid indentation style for everything. Since it lacks a lot of extra
 * \n newlines it looks quite cluttered though.
 *
 */

var fs = require('fs');
var util = require('util');
var esprima = require('esprima');
var escodegen = require('escodegen');

var info = [];

var generatorOption =     {
    format: {
        indent: {
            style: '    ',
            base: 0,
            adjustMultilineComment: true//false
        },
        newline: '\n',
        space: ' ',
        json: false,
        renumber: false,
        hexadecimal: false,
        quotes: 'single',
        escapeless: false,
        compact: false,
        parentheses: true,
        semicolons: true,
        safeConcatenation: true
    },
    moz: {
        starlessGenerator: false,
        parenthesizedComprehensionBlock: false,
        comprehensionExpressionStartsWithAssignment: false
    },
    parse: null,
    comment: true,
    sourceMap: undefined,
    sourceMapRoot: null,
    sourceMapWithCode: false,
    file: undefined,
    directive: false,
    verbatim: undefined
};

function readdir (path) {
    var filesNames = fs.readdirSync(path)

    for (var i = 0; i < filesNames.length; i++) {

        var fileName = filesNames[i];
        var fullPath = path + "/" + fileName;

        if(path == "app/Lib/Vendor"){
            continue;
        }

        if(fileName.indexOf(".js") == -1) {
            var stats = fs.lstatSync(fullPath);
            if (stats.isDirectory()) {
                readdir(fullPath);
            }
            continue;
        }

        readFile(path, fileName);
    };
}

function readFile (path, fileName) {
    //console.log("+++++ " + moduleName + " ++++++");
    var contents = fs.readFileSync(path + "/" + fileName); 
    contents = contents.toString(); 
    
    optimize(path, fileName, contents);
}

function optimize (path, fileName, contents) {
    var fullPath = path + "/" + fileName;
    var moduleName = fileName.split(".js").join("");
    var tree = esprima.parse(contents);

    // find moduleId from return statement on module level
    var module = tree.body[0].expression.arguments[1].body.body;
    var moduleId = findModuleId(module);

    if (!moduleId) {
        info.push("could not find moduleId in: " + fullPath);
        return;
    }

    if (moduleId == "Parent") {
        info.push("not optimizing empty module (returning Parent) in: " + fullPath);
        return;
    }

    // find constructor
    var constructorPosition = findConstructorPosition(module, moduleId);
    if (constructorPosition === false) {
        info.push("could not find constructor in: " + fileName)
        return;
    }
    var constructor = module[constructorPosition];
    transformProps(tree, moduleId, constructor, constructorPosition);

    console.log(escodegen.generate(tree, generatorOption));
}

function findModuleId (module) {
    var moduleId = false;
    for (var j = 0; j < module.length; j++) {
        var expression = module[j];

        //console.log(util.inspect(expression, { showHidden: true, depth: 4 }));

        if (expression.type == "ReturnStatement") {
            
            if(expression.argument.type == "Identifier") {

                // for return Module;
                moduleId = expression.argument.name; 
                break;

            } else if (expression.argument.type == "NewExpression") {

                // for return new Module;
                moduleId = expression.argument.callee.name; 
                break;

            } else {
                info.push("Unexpected return type at module level. " + fullPath)
            }
        }
    }
    return moduleId;
};

function findConstructorPosition (module, moduleId) {

    for (var j = 0; j < module.length; j++) {
        var expression = module[j];

        if (expression.type == "FunctionDeclaration" && expression.id.name == moduleId) {
            return j;
        }
    }
    return false;
}

function transformProps (tree, moduleId, constructor, constructorPosition) {
    var props = [];
    for (var k = constructor.body.body.length - 1; k >= 0; k--) {
        var line = constructor.body.body[k];

        if(line.expression
            && line.expression.type == "AssignmentExpression"
            && line.expression.operator == "="
            && line.expression.left.type == "MemberExpression"
            && line.expression.left.object.type == "ThisExpression"
            && line.expression.right.type == "Literal") {

            // remove "this" properties with with value type from constructor
            constructor.body.body.splice(k, 1);
            //console.log(util.inspect(line, { showHidden: true, depth: 4 }));

            props.push({
                name: line.expression.left.property.name,
                value: line.expression.right.value,
                raw: line.expression.right.raw
            });
        }
    };

    // generate prototype properties
    for (var l = 0; l < props.length; l++) {
        var attributes = props[l];

        var prop = { type: 'ExpressionStatement',
          expression:
           { type: 'AssignmentExpression',
             operator: '=',
             left:
              { type: 'MemberExpression',
                computed: false,
                object:
                 { type: 'MemberExpression',
                   computed: false,
                   object: { type: 'Identifier', name: moduleId },
                   property: { type: 'Identifier', name: 'prototype' } },
                property: { type: 'Identifier', name: attributes.name } },
             right: { type: 'Literal', value: attributes.value, raw: attributes.raw } } }

        // place property after constructor
        tree.body[0].expression.arguments[1].body.body.splice(constructorPosition+1, 0, prop);
    };
}

readdir("app");
console.log(info)
