export function printProductionTable (config) { 
    var out_message = "";
    for (var nonterm in config)
    {
        var product = config[nonterm];
        var temp_string = "";
        temp_string = temp_string + nonterm + ' ::= ';
        var temp = [], br = false;
        for (var needed_term in product)
        {
            if (!product[needed_term] || needed_term =="<<EMPTY PRODUCTIONS>>")
            {
                if (temp_string.indexOf("ε")==-1)
                    temp.push("ε");
            }
            else if (product[needed_term] !== true && temp_string.indexOf(product[needed_term].join(" "))==-1)
                temp.push(product[needed_term].join(" "))
            else
                br = true;
        }
        if (br) {br = false; continue;}
        temp_string += temp.join(" | ");
        out_message += temp_string + "\n";
    }
    console.log(out_message);
}

export function printNontermsTable(config)
{
    var nonterm_arr = [];
    for (var nonterm in config)
        nonterm_arr.push(nonterm);

    console.log(nonterm_arr.join(", "));

}

export function printTermsTable(config)
{
    var term_arr = [];
    for (var nonterm in config)
    {
        for (var needed_term in config[nonterm])
        {
            for (var key in config[nonterm][needed_term])
            {
                var term = config[nonterm][needed_term][key];
                if (term_arr.indexOf(term)==-1 && !(term[0]=='<' && term[term.length-1]=='>' && term.length != 2))
                {
                    term_arr.push(term);
                } 
            }
        }
    }
    console.log(term_arr.sort().join(" "));
}

function getStringTree(tree)
{
    return recursiveStrTree(tree[0]);

    function recursiveStrTree(node)
    {
        var text = "";
        if (node !== undefined)
        {//Литэвкэн ты дэвэлен? елс иф топ, да?
            if (node.body != undefined && node.body.length == 0)
                text += node.type + "(ε)";
            else if (node.type == "id" || node.type == "num")
                text += node.body;
            else if (typeof(node) == "string") {
                if (node == '(')
                    text += '❲'; // технически, это не скобка, так что парсер на основе скобок работает корректно
                else if (node == ')')
                    text += '❳'; 
                else if (node == ',')
                    text += '،'
                else
                    text += node;
            }
            else if (typeof(node.body) == "string")
                text += node.type;
            else if (typeof(node.body) == "object")
            {
                var insert = node.type;
                if (insert.match(/<[a-zA-Z]+>/) !== null) {insert = "&#60" + insert.substring(1,insert.length-1) + "&#62";};//да это костыль ну и шо
                text += insert + '(' + recursiveStrTree(node.body[0]);

                if (node.body[1])
                {
                    for (var key in node.body)
                    {
                        if (key!=0)
                            text += ", " + recursiveStrTree(node.body[key]);
                    }
                }
                text += ')';
            }
        }
        return text;
    }
}

export function printDrevoVuvoda(tr, out_id = 'run_out_id')
{
    
    drawTree(getStringTree(tr));
    function drawTree(t)
    {
        asyncScript("./js/kyrsach_generation/tree.js", function() { 
            document.getElementById(out_id).innerHTML = rewriteDiagonalLines(window.Tree.getSVG(window.Tree.parse(t)));
        });
    }
    
}

//я не разобрался как подключить по нормальному((
//дмитриев красаучег - разобрался
function asyncScript(src, callback) {
    const script = document.createElement('script')
    script.src = src;
    script.async = true;
    script.onload = callback;
    document.head.appendChild(script);
}

/****************************************************************************************
* Возвращает код дерева в svg формате
*/
export function getTreeAsText()
{
    return document.getElementById('run_out_id').innerHTML;
}

/****************************************************************************************
* превращает все диагональные линии в вертикальные и горизонтальные
*/
function rewriteDiagonalLines(tree)
{
    tree = tree.slice();
    var linesArray = tree.match(/<line x1="\d+" y1="\d+" x2="\d+" y2="\d+".*?\/\>/g)
    for (var line in linesArray)
    {
        if (linesArray[line] != null)
        {
            var coordinates = linesArray[line].match(/"([0-9]+)"/g)
            if (coordinates != null)
            {

                var x1 = +(coordinates[0].replace(/"/g, ''));
                var y1 = +(coordinates[1].replace(/"/g, ''));
                var x2 = +(coordinates[2].replace(/"/g, ''));
                var y2 = +(coordinates[3].replace(/"/g, ''));
                if (x1 != x2)
                {
                    // заменить текущую диагональ на две вертикали и одну горизонталь
                    var y3 = (y1+y2)/2;
                    var newLine = 
                    '<line x1="'+ x1 +'" y1="'+ y1 +'" x2="'+ x1 +'" y2="'+ y3 +'" stroke="black" style="stroke-width:1px;"/>'+
                    '<line x1="'+ x2 +'" y1="'+ y2 +'" x2="'+ x2 +'" y2="'+ y3 +'" stroke="black" style="stroke-width:1px;"/>'+
                    '<line x1="'+ x1 +'" y1="'+ y3 +'" x2="'+ x2 +'" y2="'+ y3 +'" stroke="black" style="stroke-width:1px;"/>';
                    tree = tree.replace(linesArray[line], newLine);
                }
            }
        }
    }
    return tree;
}

/****************************************************************************************
*как то связано с получением дерева из хтмл хз що це такое
*/
export function getHTML() 
{
    return '<!DOCTYPE html> <!-- html 5 --> <html lang="en"> <head> <meta charset="UTF-8">'+
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">'+
    '<meta http-equiv="X-UA-Compatible" content="ie=edge">' +
    '</head><body><p><center><div id="run_out_id" >'+
    document.getElementById('run_out_id').innerHTML +
    "</center></p></body></html>";
}


