/**
короч считай це интсрукцией
"..." - терминал - просто токен
"<...>" - нетерминал - он строит наше дерево
"<<...>>" - сверхнетерминал - он говорит то как построится наше дерево, можно сказать он настраивает наш парсер
типо документация для сверхнетерминалов
"<<put_in_tree>>" - закидывает айди или нум как ветку со значением
"<<value>>" - оно нужно для того чтоб  и предыдущее но только для нетерминалов
"<<dont_recursion_reversal>>" - не разворачивает рекурсию
"<<dont_push_if_empty>>" - не кидает если получилось тело ветки окозалось пустым
"<<EMPTY PRODUCTIONS>>" - тупо удобство, в норм граматике должно быть много пустых а в формате джсын не оч писать для каждого терминала
*/
export function parser(tokens, config, outputType = false)
{
    var arrayOfTokens = tokens[0];
    var start = ["<программа>"];
    var currentIndex = 0;
    var output = [];
    
    function walk(stack) {
        var currentStackSymbol;
        var currentToken;
        var localAst = [];
        while (stack.length) {

            currentToken = arrayOfTokens[currentIndex];
            currentStackSymbol = stack.pop();

            if (!(currentStackSymbol[0]=='<' && currentStackSymbol[currentStackSymbol.length-1]=='>' && currentStackSymbol.length != 2)) {// если текущий символ – терминал
                if (currentToken == currentStackSymbol ||
                        currentToken[0] == 'ident' && currentStackSymbol == 'id'||
                        currentToken[0] == 'hex_dig_const' && currentStackSymbol == 'num'||
                        currentToken[0] == 'real_dig_const' && currentStackSymbol == 'num'||
                        currentToken[0] == 'int_dig_const' && currentStackSymbol == 'num'||
                        currentToken[0] == 'string_constant' && currentStackSymbol == 'num') {
                        if (currentToken != currentStackSymbol) {
                            output.push(currentStackSymbol + " -> " + currentToken[1]);
                            if (outputType) localAst.push((currentToken[0] == 'ident' && currentStackSymbol == 'id' ? tokens[1] : tokens[2])[currentToken[1]]);
                        }
                        else {
                            output.push(currentToken);
                            if (outputType) localAst.push(currentStackSymbol);
                        }
                    
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
                    if (config[currentStackSymbol][currentToken] !== undefined || (config[currentStackSymbol]["<<EMPTY PRODUCTIONS>>"] !== undefined && config[currentStackSymbol]["<<EMPTY PRODUCTIONS>>"].indexOf(currentToken) != -1)) {
                        var production = config[currentStackSymbol][currentToken];
                        if (production === undefined) production = [];
                        output.push(currentStackSymbol + " -> " + production);
                        if (typeof(production) == 'object') {
                            production = production.slice();//бам на нах сука горит ебучий джc почему никто не сказал что массивы так не копируются
                            var newStack = production.reverse();

                            if (config[currentStackSymbol]["<<dont_recursion_reversal>>"] && !config[currentStackSymbol]["<<value>>"]) {
                                var inw = walk(newStack);
                                for (var i in inw) {
                                    localAst.push(inw[i])
                                }
                            }
                            else if (config[currentStackSymbol]["<<put_in_tree>>"]) {
                                walk(newStack);
                                if (!outputType)
                                localAst.push({"type"  : currentStackSymbol,
                                               "value" : arrayOfTokens[currentIndex-1]});
                                else { 
                                    localAst.push({"type" : arrayOfTokens[currentIndex-1][0] == 'ident' ? 'id' : 'num',
                                                  "body"  : (arrayOfTokens[currentIndex-1][0] == 'ident' ? tokens[1] : tokens[2])[arrayOfTokens[currentIndex-1][1]]});//хз че подумает чувак который впервые это увидит
                                }

                            } else if (config[currentStackSymbol]["<<value>>"]) {
                                //технически у этого огромный потанцевал и идея сверхнетерминалов охеренна
                                //можно довести до того что наше дерево будет настолько ветвистым что оно будет ветвистее реального дерева
                                //ток хузе как надо будет ебланить кодогенератор тогда
                                let crs = currentStackSymbol;
                                let body_ast = [], value_ast = [];
                                body_ast = walk(newStack.slice(newStack.indexOf("<<value>>")+1))
                                value_ast = walk(config[crs]["<<value>>"].slice().reverse())
                                if (!outputType) {
                                    body_ast = body_ast.concat(walk(newStack.slice(0, newStack.indexOf("<<value>>"))))
                                    localAst.push({"type" : crs,
                                                   "value": value_ast,
                                                   "body" : body_ast});
                                }
                                else {
                                    body_ast = body_ast.concat(value_ast, walk(newStack.slice(0, newStack.indexOf("<<value>>"))));
                                    localAst.push({"type" : currentStackSymbol,
                                                   "body" : body_ast});
                                }
                            }
                            else {
                                var if_empty = config[currentStackSymbol]["<<dont_push_if_empty>>"];
                                localAst.push({"type" : currentStackSymbol,
                                               "body" : walk(newStack)});
                                if (if_empty && localAst[localAst.length-1].body.length == 0) {
                                    localAst.pop();
                                }
                            }
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
        ast = error;
    }
    console.log(output);
    return ast;
}