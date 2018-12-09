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
            if (!product[needed_term] || needed_term =="EMPTY PRODUCTIONS")
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