exports.solve = function(fileName) {
    let formula = readFormula(fileName);
    let result = doSolve(formula.clauses, formula.variables);
    return result; // two fields: isSat and satisfyingAssignment
}

// Receives the current assignment and produces the next one
function nextAssignment(currentAssignment) {
  // implement here the code to produce the next assignment based on currentAssignment. 
    let stop = false;

    for (let x = 0 ; !stop ; x++) {
        if (currentAssignment[x] == 0)  {
            currentAssignment[x] = 1;
            stop = true;
        } else {
            currentAssignment[x] = 0;
        }
    }

    return currentAssignment;
}

function doSolve(clauses, assignment) {
    let isSat = false;
    let total = Math.pow(2, assignment.length);
    let counter = 0;

    while ((!isSat) && (counter != total)/* must check whether this is the last assignment or not*/) {
    // does this assignment satisfy the formula? If so, make isSat true. 
    // if not, get the next assignment and try again. 
        let clausesClone = [];
        for (let x = 0 ; x < clauses.length ; x++) {
            clausesClone.push(2);
            for (let y = 0 ; y < clauses[x].length ; y++) {
                let finish = false;
                for (let w = 1 ; w <= assignment.length & !finish ; w++) {
                    if (Number(clauses[x][y]) == w) {
                        clausesClone.push(Number(assignment[w-1]));
                        finish = true;
                    }
                    if (Number(clauses[x][y]) == -w) {
                        if (Number(assignment[w-1]) == 0) {
                            clausesClone.push(1);
                        } else {
                            clausesClone.push(0);
                        }
                        finish = true;
                    }
                }
            }
        }

        clausesClone.pop();
        clausesClone.shift();
        let add = 0;
        let keepChecking = true;

        for (let x = 0 ; x < clausesClone.length & keepChecking ; x++) {
            if (clausesClone[x] != 2) {
                add += clausesClone[x];
                if (clausesClone.length-1 == x ) {
                    if (add == 0) {
                        isSat = false;
                    } else {
                        isSat = true;
                    }
                }
            } else if (add == 0) {
                isSat = false;
                keepChecking = false;
            } else {
                add = 0;
                isSat = true;
            }
        }

        if (!isSat) {
            counter ++;
            assignment = nextAssignment(assignment);
        }
    }
    let result = {'isSat': isSat, satisfyingAssignment: null}
    if (isSat) {
        result.satisfyingAssignment = assignment;
    }
    return result
}
  
function readFormula(fileName) {
  // To read the file, it is possible to use the 'fs' module. 
  // Use function readFileSync and not readFile. 
  // First read the lines of text of the file and only afterward use the auxiliary functions.
    const fs = require("fs");
    let text = fs.readFileSync(fileName,"utf8").toString();// = ...  //  an array containing lines of text extracted from the file.
    let lines = text.split('\r\n');
    let clauses = readClauses(lines);
    let variables = readVariables(clauses);
  
  // In the following line, text is passed as an argument so that the function
  // is able to extract the problem specification.
    let specOk = checkProblemSpecification(lines, clauses, variables);

    let result = { 'clauses': [], 'variables': [] }
    if (specOk) {
        result.clauses = clauses;
        result.variables = variables;
    }
    return result
}

function readClauses(lines) {
    let arrayClauses = [];  
    for (let x = 0 ; x < lines.length ; x++) {
        if (lines[x].charAt(0) != 'p' && lines[x].charAt(0) != 'c' && lines[x].charAt(0) != '') {
            arrayClauses.push(lines[x]);     
        }
    }
    for (let w = 0 ; w < arrayClauses.length ; w++) {
        arrayClauses[w] = arrayClauses[w].split(' ');
    }
    for (let z = 0 ; z < arrayClauses.length ; z++) {
        if (arrayClauses[z][arrayClauses[z].length-1] != '0') {
            arrayClauses[z] = arrayClauses[z].concat(arrayClauses[z+1]);
            arrayClauses = arrayClauses.splice(z+1,1);
            z--;
        } else {
            arrayClauses[z].pop();
        }
    }
    return arrayClauses;
    
}

function readVariables (clauses) {
    let arrayVariables = [];
    let totalVariables = 0;
    for (let x = 0 ; x < clauses.length ; x++) {
        for (let v = 0 ; v < clauses[x].length ; v++) {
            if (totalVariables < clauses[x][v]) {
                totalVariables = clauses[x][v];
            }
        }
    }
    for (let y = 0 ; y < totalVariables ; y++) {
        arrayVariables.push(0);
    }
    return arrayVariables;
}

function checkProblemSpecification (lines, clauses, variables) {
    for (let x = 0 ; x < lines.length ; x++) {
        if (lines[x].includes(variables.length + " " + clauses.length)) {
            return true;
        }
    }
    return false;
}
