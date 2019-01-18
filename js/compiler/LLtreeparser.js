export function parser(tokens, config)
{
    var arrayOfTokens = tokens[0].slice();
    arrayOfTokens.push("eps");//это окозалось полезным
    var start = ["<программа>"];
    var currentIndex = 0;
    var output = [];

    function or(array) {
        for( var item in array) {
            console.log(`walk on ${array[item]}`)
            if (walk(array[item].slice()))
                return true;
        }
        console.log("ни один не прошел");
        return false;
    }
    
    function walk(stack) {
        var res = true;
        var currentStackSymbol;
        var currentToken;
        var tempIndex = currentIndex;
        while (stack.length) {
            currentToken = arrayOfTokens[currentIndex];
            currentStackSymbol = stack.shift();

            if (Array.isArray(currentStackSymbol)) {
                if (!or(currentStackSymbol.slice())) {
                    currentIndex = tempIndex;
                    return false;
                }
            } else if ((currentStackSymbol[0]=='<' && currentStackSymbol[currentStackSymbol.length-1]=='>' && currentStackSymbol.length != 2)) {
                if (!or(config[currentStackSymbol].slice())) {
                    currentIndex = tempIndex;
                    console.log("не прошел или");
                    return false;
                }
            } else {
                if (currentToken == currentStackSymbol) {
                    currentIndex++;
                } else {
                    currentIndex = tempIndex;
                    console.log(`токены, ${currentToken} and ${currentStackSymbol}, не равны возвращаемся`);
                    return false;
                }
            }
        }
        return res;
    }
    
    var res = walk(start);

    console.log(res);
    
    return res;
}