export function lexer(codeText, lexTable) {    
    var tokens = [];
    var output = [];
    var arrayOfConst = [];
    var arrayOfIdent = [];
    var ErrorList = [];
    
    while (codeText.length != 0) {
        for (var key in lexTable) {
            var match = codeText.match(lexTable[key].regexp);//ищем а потом удаляем
            if (match !== null) {
                match = match[0];               

                if (key == "error") {
                    if (ErrorList.length >= 10) {
                        console.log(ErrorList);
                        console.log(tokens);
                        console.log("Too many errors, stopping lexer.");
                        return;
                    }
                    else {
                        codeText = codeText.replace(lexTable[key].regexp, '');
                        ErrorList.push(match)
                        break;
                    }
                }

                // проверяем, чтобы слово находилось в списке нужных слов, либо чтобы этого списка не было
                if ((lexTable[key].list != null) && (!lexTable[key].list.includes(match))) {
                    // нет в списке нужных слов, пропускаем
                    continue;
                }
                else {
                    codeText = codeText.replace(lexTable[key].regexp, '');
                    //если пропустить то уступаем
                    if (lexTable[key].skip == true) {
                        break;
                    }

                    // если есть link, добавляем слово туда
                    if (lexTable[key].link) {
                        if (lexTable[key].link == "arrayOfIdent") {
                            if (!arrayOfIdent.includes(match)) {         
                                arrayOfIdent.push(match);
                            }

                            match = [key, arrayOfIdent.indexOf(match)]
                        }
                        else if (lexTable[key].link == "arrayOfConst") {
                            if (!arrayOfConst.includes(match)) {
                                arrayOfConst.push(match)
                            }

                            match = [key, arrayOfConst.indexOf(match)]
                        }
                        else {
                            console.error(`oshibka lexing link: ${link}`);
                        }
                        
                    }
                }
                // добавить элемент в массив
                output.push(`Идентификатор: ${match}, Токен: ${key}`);
                tokens.push(match);
                break;
            }
        }
        //если вообще ни одна регулярка не сработала 
        //на случай если буду редачить таблицу лексем и сделаю косяк
        if (match == null) { console.error("you regexp don`t ready"); console.error(codeText); return; }
    }
    console.log("как проходил лексический анализ:");
    console.log(output);
    return [tokens, arrayOfIdent, arrayOfConst, ErrorList];
}