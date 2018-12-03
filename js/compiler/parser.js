export function parser(arrayOfTokens, config)
{
    arrayOfTokens.push("<<конец строки>>");
    var stack = ["<<конец строки>>", "<программа>"];
    var currentIndex = 0;
    var output = [];
    var currentStackSymbol;
    var currentToken;


    if (!arrayOfTokens) {
        console.log("Ошибка: список лексем пуст.")
        return "Error"
    }
    
    function nextPars() {
        currentToken = arrayOfTokens[currentIndex];

        currentStackSymbol = stack.pop();

        if (currentStackSymbol[0]!='<') {// если текущий символ – терминал
            if (currentToken == currentStackSymbol ||
                    currentToken[0] == 'ident' && currentStackSymbol == 'id'||
                    currentToken[0] == 'hex_dig_const' && currentStackSymbol == 'num'||
                    currentToken[0] == 'real_dig_const' && currentStackSymbol == 'num'||
                    currentToken[0] == 'int_dig_const' && currentStackSymbol == 'num') {
                if (currentToken[0] == 'ident' && currentStackSymbol == 'id'||
                    currentToken[0] == 'hex_dig_const' && currentStackSymbol == 'num'||
                    currentToken[0] == 'real_dig_const' && currentStackSymbol == 'num'||
                    currentToken[0] == 'int_dig_const' && currentStackSymbol == 'num')
                        output.push(currentStackSymbol + " -> " + currentToken[1]);
            }
            else {
                throw 0;
            }
        }
        else {// текущий символ – нетерминал
            if (currentStackSymbol == "<<конец строки>>") {
                if (currentStackSymbol == currentToken)
                    return currentStackSymbol;
                else {
                    throw 1;
                }
            }

            if (currentToken[0] == 'ident')
                currentToken = 'id';

            if (currentToken[0] == 'hex_dig_const'||
                currentToken[0] == 'real_dig_const'||
                currentToken[0] == 'int_dig_const')
                currentToken = 'num';

            if (config[currentStackSymbol]) {
                if (config[currentStackSymbol][currentToken]) {
                    var production = config[currentStackSymbol][currentToken];
                    output.push(currentStackSymbol + " -> " + production);
                    if (typeof(production)=='object') {
                        while (production.length) {
                            stack.push(production.pop());
                        }
                    }
                    else {
                        throw 2;
                    }
                }
                else {                
                    
                    throw 3;
                }
            }
            else {
                throw 4;
            }  
        }

        return currentStackSymbol;
    }

    function walk() {
        var localAST = [];
        for (; currentIndex < arrayOfTokens.length-1;) {
            try {
                var p = nextPars();
            }
            catch (error) {
                switch (error) {
                    case 0:
                        console.log("Ошибка: неожиданный терминал.");
                        break;
                    case 1:
                        console.log("Ошибка: ожидался конец строки, а найден символ: " + currentToken);
                        console.log("Содержимое магазина: " + stack);
                        break;
                    case 2:
                        console.log("Ошибка: неверное правило. Правая часть не является массивом: " + currentStackSymbol + " " + production);
                        break;
                    case 3:
                        console.log("Ошибка: для сочетания терминала и нетерминала не задано правило: " + currentStackSymbol + " " + currentToken);
                        break;
                    case 4:
                        console.log("Ошибка: не удается найти правило для нетерминала: " + currentStackSymbol);
                }
                throw "INVALID";
            }
            if (p[0] == '<') {//если возвращен нетерминал
                localAST[p] = walk();
            }
            else {//если терминал
                localAST.push(p);
                currentIndex++;
            }
        }
        return localAST;
    }

    try {
        var ast = walk();
    }
    catch (error) {
        return error;
    }

    console.log(output);
    
    return ast;
}