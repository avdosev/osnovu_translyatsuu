export function parser(arrayOfTokens, config)
{
    var start = ["<программа>"];
    var currentIndex = 0;
    //var output = [];

    function walk(stack) {
        var currentStackSymbol;
        var currentToken;
        var localAst = [];
        while (stack.length) {

            currentToken = arrayOfTokens[currentIndex];
            currentStackSymbol = stack.pop();

            if (currentStackSymbol[0]!='<') {// если текущий символ – терминал
                if (currentToken == currentStackSymbol ||
                        currentToken[0] == 'ident' && currentStackSymbol == 'id'||
                        currentToken[0] == 'hex_dig_const' && currentStackSymbol == 'num'||
                        currentToken[0] == 'real_dig_const' && currentStackSymbol == 'num'||
                        currentToken[0] == 'int_dig_const' && currentStackSymbol == 'num'||
                        currentToken[0] == 'string_constant' && currentStackSymbol == 'num') {
                        if (currentToken != currentStackSymbol)
                            console.log(currentStackSymbol + " -> " + currentToken[1]);
                        else 
                            console.log(currentStackSymbol, " -> ", currentToken);
                    currentIndex += 1;
                }
                else {
                    console.log("Ошибка: неожиданный терминал: "  + currentStackSymbol + ", хотя должен был быть: " + currentToken  + ", содержимое стека: " + stack);
                    console.log("Текущий индекс: ", currentIndex);
                    throw 0;
                }
            }
            else {// текущий символ – нетерминал
                if (currentToken[0] == 'ident')
                    currentToken = 'id';

                if (currentToken[0] == 'hex_dig_const'||
                    currentToken[0] == 'real_dig_const'||
                    currentToken[0] == 'int_dig_const'||
                    currentToken[0] == 'string_constant')
                    currentToken = 'num';

                if (config[currentStackSymbol] !== undefined) {
                    if (config[currentStackSymbol][currentToken] !== undefined) {
                        var production = config[currentStackSymbol][currentToken];
                        console.log(currentStackSymbol + " -> " + production);
                        if (typeof(production) == 'object') {
                            production = production.slice();//бам на нах сука горит ебучий джc почему никто не сказал что массивы так не копируются
                            var newStack = [];
                            while (production.length) {
                                newStack.push(production.pop());
                            }
                            localAst.push({"type" : currentStackSymbol,
                                            "body" : walk(newStack)});
                        }
                        else {
                            console.log("Ошибка: неверное правило. Правая часть не является массивом: " + currentStackSymbol + " " + production);
                            throw 2;
                        }
                    }
                    else {                
                        console.log("Ошибка: для сочетания терминала и нетерминала не задано правило: " + currentStackSymbol + " " + currentToken);
                        throw 3;
                    }
                }
                else {
                    console.log("Ошибка: не удается найти правило для нетерминала: " + currentStackSymbol);
                    throw 4;
                }  
            }
        }
        if (currentIndex > arrayOfTokens.length) throw 5;
        return localAst;
    }

    try {
        console.log("как происходил анализ: ");
        var ast = walk(start);
    }
    catch (error) {
        console.log(config);
        return error;
    }
    
    return ast;
}