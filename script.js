import { getDataFromServer } from "./js/server-helper.js"
import { compiler } from "./js/compiler/compiler.js"
import { printProductionTable, printNontermsTable, printTermsTable } from "./js/kyrsach_generation/kyrsuch_print.js";


document.addEventListener('DOMContentLoaded', main);

function main() {
    //тупо особенность работы функции гетДата
    getDataFromServer("./config/lexem-table.json", get_lexer);
    function get_lexer(lexTable) {
        getDataFromServer("./config/grammar-table.json", get_grammar);
        function get_grammar(grammarTable) {
            getDataFromServer("./config/codogeneration-table.json", get_codegen);
            function get_codegen(codTable) {
                var out = compiler(document.querySelector('code.eiffel-language').textContent, lexTable, grammarTable, codTable);
                //print kyrsuch
                printProductionTable(grammarTable); printNontermsTable(grammarTable); printTermsTable(grammarTable);
                document.querySelector('code.javascript-language').innerHTML = out;
            }
        }
    }
}
