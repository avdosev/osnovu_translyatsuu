import { lexer } from "./lexer.js"

export function MySONparser(text, func = function(key, value) {return value;}) {
    /*
    Данные в формате JSON (RFC 4627) представляют собой:
        JavaScript-объекты { ... } или
        Массивы [ ... ] или
        Значения одного из типов:
            строки в двойных кавычках,
            число,
            логическое значение true/false,
            null.
    */
    var lexTable = {
        "indentation" : {
            "regexp" : /^(\s+)/,
            "skip" : true
        },
        "objectStart" : {
            "regexp" : /^\{/
        },
        "objectStop" : {
            "regexp" : /^\}/
        },
        "init" : {
            "regexp" : /^:/
        },
        "massStart" : {
            "regexp" : /^\[/
        },
        "massStop" : {
            "regexp" : /^\]/
        },
        "string_constant" : {
            "regexp" : /^((\".*?[^\\]\"))/,
            "link" : "arrayOfIdent"
        },
        "digit_const" : {
            "regexp" : /^(\d+)\b/
        },
        "boolean_const" : {
            "regexp" : /^(true)|(false)|(null)\b/
        },
        "separate" : {
            "regexp" : /^,/
        }
    };


    //return parsing(lexer(text, lexTable));

}