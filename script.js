import { getDataFromServer } from "./js/server-helper.js"
import { compiler } from "./js/compiler/compiler.js"
import { lexer } from "./js/compiler/lexer.js"
import { parser } from "./js/compiler/parser.js"
import { printProductionTable, printNontermsTable, printTermsTable, printDrevoVuvoda } from "./js/kyrsach_generation/kyrsuch_print.js";


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
                document.querySelector('code.javascript-language').innerHTML = out;
                //добавляем в хедер сгенерированный код на джс
                const script = document.createElement('script')
                script.innerHTML = out;
                script.async = true;
                script.className ="generating_code";
                document.head.appendChild(script);

                //print kyrsuch
                printProductionTable(grammarTable); printNontermsTable(grammarTable); printTermsTable(grammarTable);
                printDrevoVuvoda(parser(lexer(document.querySelector('code.eiffel-language').textContent, lexTable), grammarTable, true));
            }
        }
    }
}
