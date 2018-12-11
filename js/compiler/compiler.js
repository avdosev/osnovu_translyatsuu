import { lexer } from "./lexer.js"
import { parser } from "./parser.js"
import { transformer } from "./transformer.js";
import { codeGenerator } from "./code_generator.js";

export function compiler(input, lexTable, grammarTableInputLanguage, codeGeneratorTableOutputLanguage) {
    let tokens = lexer(input, lexTable);
    console.log(tokens);
    let ast    = parser(tokens, grammarTableInputLanguage);
    console.log("получившиеся абстрактное синтаксическое дерево:");
    console.log(ast);
    let newAst = transformer(ast);
    //console.log(newAst);
    let output = codeGenerator(newAst, codeGeneratorTableOutputLanguage, tokens[1], tokens[2]);
    // и просто вернём вывод!
    return output;
}