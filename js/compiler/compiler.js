import { lexer } from "./lexer.js"
import { parser } from "./parser.js"
import { transformer } from "./transformer.js";
import { codeGenerator } from "./code_generator.js";

export function compiler(input, lexTable, grammarTableInputLanguage) {
    let tokens = lexer(input, lexTable);
    console.log(tokens);
    let ast    = parser(tokens[0], grammarTableInputLanguage);
    console.log(ast);
    let newAst = transformer(ast);
    console.log(newAst);
    let output = codeGenerator(newAst);
    // и просто вернём вывод!
    return output;
}