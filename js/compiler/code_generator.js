export function codeGenerator(derevo, degenerationTable, arrayOfIdent, arrayOfConst) {
    //ну шо генератор
    function generatorStr(obj) {
        var str = '';
        var ptab = degenerationTable[obj["type"]];
        if (ptab) {
            if (ptab["before"]) str += ptab["before"];
            if (obj.value) {
                if (ptab["pre_value"]) str += ptab["pre_value"];
                if (obj.type == "<value_id>") {
                    str += `${arrayOfIdent[obj.value[1]]}`;
                } else if (obj["type"] == "<value_num>") {
                    str += `${arrayOfConst[obj.value[1]]}`;
                } else if (Array.isArray(obj.value)) {
                    str += walk(obj.value)
                } else {
                    console.log("не понятное значение value");
                    throw 0;
                }
                if (ptab["post_value"]) str += ptab["post_value"];
            }
            if (obj.body) {
                if (ptab["pre_body"]) str += ptab["pre_body"];
                str += walk(obj.body);
                if (ptab["post_body"]) str += ptab["post_body"];
            }
            if (ptab["after"]) str += ptab["after"];
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