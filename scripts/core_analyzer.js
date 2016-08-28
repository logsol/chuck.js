/*
 * This will generate a core/channel/client overview of a class
 *
 * usage: 
 * node scripts/core_analyzer.js [relative/path/class.js] -> relative path from core/client/channel split
 *
 * example:
 * node scripts/core_analyzer.js GameObjects/Item.js
 * 
 * example result: 
 * 
 * | CHANNEL                               | CORE                                  | CLIENT
 * |---------------------------------------|---------------------------------------|--------------------------------
 * |                                       | getBodyDef                            |
 * |                                       | getFixtureDef                         |
 * |                                       | createFixture                         |
 * |                                       | flip                                  | flip
 * | beingGrabbed                          | beingGrabbed                          |
 * | beingReleased                         | beingReleased                         |
 * | onCollisionChange                     | onCollisionChange                     |
 * |                                       | reposition                            |
 * |                                       | getGrabPoint                          |
 * |                                       | throw                                 |
 * |                                       | accelerateBody                        |
 * |                                       | destroy                               | destroy
 * |                                       |                                       | createMesh
 * |                                       |                                       | render
 * | getLastMovedBy                        |                                       |
 * | setLastMovedBy                        |                                       |
 * | isGrabbingAllowed                     |                                       |
 * | isReleasingAllowed                    |                                       |
 *
 */

var fs = require('fs');
var util = require('util');
var esprima = require('esprima');
var escodegen = require('escodegen');

var info = [];
var overview = {};

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

function readFile (path, category, fileName) {
    //console.log("+++++ " + moduleName + " ++++++");
    var contents = fs.readFileSync(path + "/" + category + "/" + fileName); 
    contents = contents.toString(); 
    
    getMethods(path, fileName, contents, category);
}

function getMethods (path, fileName, contents, category) {

    category = category.toLowerCase();

    overview[category] = [];

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



    for (var j = 0; j < module.length; j++) {
        var expression = module[j];

        if (expression.type == "ExpressionStatement") {
            if(expression.expression && expression.expression.right) {
                if(expression.expression.right.type == "FunctionExpression") {
                    overview[category].push(expression.expression.left.property.name);
                }
            }
        }
    }

    //console.log(escodegen.generate(tree, generatorOption));
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


var superOverview = {};
function display (category) {

    var all = ["core", "client", "channel"];
    var removeIndex = all.indexOf(category);
    all.splice(removeIndex, 1);

    for (var k in overview[category]) {

        var name = overview[category][k];

        if(superOverview.hasOwnProperty(name)) {
            continue;
        }

        var first = all[0];
        var second = all[1];

        fv = 0 + (overview[first].indexOf(name) !== -1);
        sv = 0 + (overview[second].indexOf(name) !== -1);

        superOverview[name] = {};

        superOverview[name][category] = 1;
        superOverview[name][first] = fv;
        superOverview[name][second] = sv;
        superOverview[name]['count'] = 1 + fv + sv;
    }
}

function show(){
    var alle = ['channel', 'core', 'client'];
    console.log("| CHANNEL                               | CORE                                  | CLIENT");
    console.log("|---------------------------------------|---------------------------------------|--------------------------------");
    for (var method in superOverview) {
        var line = "";

        for (var i = 0; i < alle.length; i++) {
            if (superOverview[method] && superOverview[method].hasOwnProperty(alle[i])) {

                line += "| " ;

                if(superOverview[method][alle[i]] === 1) {
                    line += method;
                    line += Array(39 - method.length).join(" ");
                } else {
                    line += Array(39).join(" ");
                }

                
            } else {

            }

        }
        console.log(line)        
    }
}



readFile("app/Game", "Core", process.argv[2]);
readFile("app/Game", "Channel", process.argv[2]);
readFile("app/Game", "Client", process.argv[2]);

display("core")
display("client")
display("channel")

console.log("\n")
show()
console.log("\n")