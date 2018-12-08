export function codeGenerator(derevo, degenerationTable, arrayOfIdent, arrayOfConst) {
    //ну шо генератор
    function generatorStr(obj) {//fix
        var newstr = '';
        
        return newstr;
    }

    //гуляем по древу
    function walk(vetochka) {

        var output = "";

        for (var i in vetochka) {
            if (typeof(vetochka[i]) == 'object') {
                output += generatorStr(vetochka[i]);
            }
        }

        return output;
    }

    return walk(derevo);
}