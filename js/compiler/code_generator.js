export function codeGenerator(derevo, degenerationTable, arrayOfIdent, arrayOfConst) {
    //ну шо генератор
    function generatorStr(obj) {//fix
        var str = '';
        var ptab = degenerationTable[obj["type"]];
        if (ptab) {
            if (obj.value) {
                if (obj.type == "<value_id>") {
                    str += `${arrayOfIdent[obj.value[1]]}`;
                } else if (obj["type"] == "<value_num>") {
                    str += `${arrayOfConst[obj.value[1]]}`;
                } else {
                    console.log("не понятное значение");
                    throw 0;
                }
            }
            else {
               str += ptab["before"];
               str += walk(obj.body);
               str += ptab["after"];
            }
        }
        else {
            str += walk(obj.body);
        }
        return str;
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