'use strict';
/****************************************************************************************
                                     Работа с деревьями

Дерево задаётся структурой: { nm, ar }, где nm - имя узла, а ar - массив ветвей.
Все функции реализованы в статическом и динамическом вариантах (при используем new)
В статические функции можно передавать экземпляры класса Tree, так как
они не отличаются от струтуры { nm, ar }

                                          (с) 2016-nov steps: synset.com, absolutist.com
****************************************************************************************/
function Tree(tr) 
{
   if(tr){
      this.nm  = tr.nm;     
      this.ar  = tr.ar;
   }
}
/****************************************************************************************
*                                      Динамические методы                              *
****************************************************************************************/

/****************************************************************************************
* Скопировать дерево, вернуть новое (не по ссылке!)
*/
Tree.prototype.copy = function (tr)
{
   tr = Tree.prototype.copy(tr);     
   this.nm  = tr.nm;     
   this.ar  = tr.ar;   
}
/****************************************************************************************
* Получить максимальную глубину дерева t
*/
Tree.prototype.depth = function ()
{
   return Tree.depth(this);
}
/****************************************************************************************
* Получить количество узлов дерева tr
*/
Tree.prototype.numNodes = function ()
{
   return Tree.numNodes(this);
}
/****************************************************************************************
* Получить количество листьев (терминальных узлов) дерева tr
*/
Tree.prototype.numLeaves = function ()
{
   return Tree.numLeaves(this);
}
/****************************************************************************************
* Получить массив узлов дерева tr, имеющих свойство prop в значении val
*/
Tree.prototype.arrProp = function(prop, val)
{
   return Tree.arrProp(this, prop, val);
}
/****************************************************************************************
* Вернуть дерево глубиной depth c branches ветвями в каждом узле.
*/
Tree.prototype.create = function (depth, branches)
{
   let tr = Tree.create(depth, branches);
   this.nm  = tr.nm;     
   this.ar  = tr.ar;   
}
/****************************************************************************************
* Получить случайное дерево.
* depth - максимальная глубина,  branches - максимальное числом ветвей,
* cut - вероятность обрыва ветки (0 < cut < 1)
*/
Tree.prototype.rand = function (depth, branches, cut)
{
   let tr = Tree.rand(depth, branches, cut);
   this.nm  = tr.nm;     
   this.ar  = tr.ar;   
}
/****************************************************************************************
* Установить свойство par в значение val для всего дерева tr, не более чем на глубину depth
*/
Tree.prototype.set = function (par, val, depth)
{
   Tree.set(this, par, val, depth);
}
/****************************************************************************************
* Установить свойство par в значение val для узлов  дерева tr с именем nm
*/
Tree.prototype.setNm = function (par, val, nm)
{
   Tree.setNm(this, par, val, nm)
}
/****************************************************************************************
* Вызвать функицю fun(tr) для каждого узла дерева
*/
Tree.prototype.calc = function (fun)
{
   Tree.calc(this, fun);
}
/****************************************************************************************
* Получить список всех узлов дерева и присовить им id в этом массиве, 
* установить поля vis,opn,chk (для getGIF)
*/
Tree.prototype.getNodes = function (tr, calc)
{
   if(!tr)
      tr = this;
   if(!calc){                                     // первый запуск
      this.nodes = [];
      this.getNodes(tr, true);
      return this.nodes;
   }
   
   tr.id = this.nodes.length;   
   tr.vis = true;                                 // видимый узел
   tr.opn = true;                                 // открытый узел
   tr.chk = 0;                                    // помеченный узел (разные виды пометки)
   this.nodes.push(tr);
   
   if(tr.ar)
   for(let i=tr.ar.length; i--; )
      this.getNodes(tr.ar[i], true);   
}
/****************************************************************************************
* Получить дерево из строки st в функциональной форме root(node1(leaf1,leaf2),leaf3)
* Грамматика
* NODE :-  NAME(LIST) | NAME
* LIST :-  NODE,LIST  | NODE
*/
Tree.prototype.parse = function (st)
{
   Tree.pos = 0;                                  // статическая перемнная положение в st
   let tr = Tree.parseNODE(st);
   this.nm  = tr.nm;     
   this.ar  = tr.ar;      
}
/****************************************************************************************
* Получить дерево в JSON-формате
*/
Tree.prototype.getJSON = function ()
{
   return Tree.getJSON(this);
}
/****************************************************************************************
* Получить дерево в функциональном виде
*/
Tree.prototype.getFun = function ()
{
   return Tree.getFun(this);
}
/****************************************************************************************
* Получить дерево tr в виде html-перечислений ul-li. Вызывать без второго аргумента
*/
Tree.prototype.getUL = function ()
{
   return Tree.getUL(this);
}
/****************************************************************************************
* Распечатать дерево в символах псевдографики. 
* При стартовом запуску calc отсутсвует и функция возвращает строку, разделённую "\n"
* Если calc есть (рекурся) функция возвращает массив строк.
*/
Tree.prototype.getANSII = function ()
{
   return Tree.getANSII(this);
}
/****************************************************************************************
* Получить графическое представление дерева в svg-формате.
*/
Tree.prototype.getSVG = function ()
{
   return Tree.getSVG(this);
}
/****************************************************************************************
*                                      Статические методы                              *
****************************************************************************************/

/****************************************************************************************
* Скопировать дерево, вернуть новое (не по ссылке!)
*/
Tree.copy = function (tr)
{
   return JSON.parse(JSON.stringify(tr));     
}
/****************************************************************************************
* Получить максимальную глубину дерева t
*/
Tree.depth = function (tr)
{
   if(!tr.ar || tr.ar.length==0)
      return  0;                                  // финальный лист или узел без потомков
      
   let max = 0;
   for(let i=0; i < tr.ar.length; i++){
      let d = this.depth(tr.ar[i]);               // рекурсивно для ветвей
      if(d > max)                                 // ищем самую глубокую
         max = d;
   }
   return max+1;
}
/****************************************************************************************
* Получить количество узлов дерева tr
*/
Tree.numNodes = function (tr)
{
   if(!tr.ar || tr.ar.length==0)
      return  1;                                  // финальный лист
      
   let sum = 0;
   for(let i=0; i < tr.ar.length; i++)            // рекурсивно для ветвей
      sum += this.numNodes(tr.ar[i]);             // складываем узлы на них
   return 1+sum;                                  // сумма этого и потомков
}
/****************************************************************************************
* Получить количество листьев (терминальных узлов) дерева tr
*/
Tree.numLeaves = function (tr)
{
   if(!tr.ar || tr.ar.length==0)
      return  1;                                  // финальный лист
      
   let sum = 0;
   for(let i=tr.ar.length; i--; )                 // рекурсивно для ветвей
      sum += this.numLeaves(tr.ar[i]);            // складываем узлы на них
   return sum;                                    // сумма только потомков
}
/****************************************************************************************
* Вернуть дерево глубиной depth c branches ветвями в каждом узле.
*/
Tree.create = function (depth, branches)
{
   if(this.count===undefined)                     // статическая переменная 
      this.count = -1;                            // для нумерации узлов
   this.count++;                                  // следующий узел
      
   if(depth <= 0)                                 // обрываем рост дерева или по глубине
      return { nm: this.count};                   
    
   let nm = this.count;                           // запоминаем (потомки увеличат)    
   let ar = new Array(branches);
   for(let i=ar.length; i--; )                    // рекурсивно для потомков   
      ar[i] = this.create(depth-1, branches); 
   return  { nm:nm, ar:ar };
}
/****************************************************************************************
* Получить случайное дерево.
* depth - максимальная глубина,  branches - максимальное числом ветвей,
* cut - вероятность обрыва ветки (0 < cut < 1)
*/
Tree.rand = function (depth, branches, cut)
{
   if(this.count===undefined)                     // статическая переменная 
      this.count = -1;                            // для нумерации узлов
   this.count++;                                  // следующий узел
      
   if(depth < 1 || Math.random() < cut)           // обрываем рост дерева или по глубине
      return { nm: this.count};                   // или по вероятности 0 < cut < 1
    
   let nm = this.count;                           // запоминаем (потомки увеличат)    
   let ar = new Array(1+Math.floor(Math.random()*branches));
   for(let i=ar.length; i--; )                    // рекурсивно для потомков   
      ar[i] = this.rand(depth-1, branches, cut); 
   return  { nm:nm, ar:ar };
}
/****************************************************************************************
* Установить свойство par в значение val для всего дерева tr, не более чем на глубину depth
*/
Tree.set = function (tr, par, val, depth)
{
   if(depth !== undefined){
      if(depth < 0)
         return;
      depth--;
   }
   tr[par] = val;
   if(tr.ar)
   for(let i=tr.ar.length; i--; )
      this.set(tr.ar[i], par, val, depth);
}
/****************************************************************************************
* Установить свойство par в значение val для узлов  дерева tr с именем nm
*/
Tree.setNm = function (tr, par, val, nm)
{
   if(tr.nm === nm)
      tr[par] = val;
   if(tr.ar)
   for(let i=tr.ar.length; i--; )
      this.setNm(tr.ar[i], par, val, nm);
}
/****************************************************************************************
* Вызвать функицю fun(tr) для каждого узла дерева
*/
Tree.calc = function (tr, fun)
{
   if(!tr)
      tr = this;
   fun(tr);
   if(tr.ar)
   for(let i=tr.ar.length; i--; )
      this.calc(tr.ar[i], fun);
}
/****************************************************************************************
* Получить дерево из строки st в функциональной форме root(node1(leaf1,leaf2),leaf3)
* Грамматика
* NODE :-  NAME(LIST) | NAME
* LIST :-  NODE,LIST  | NODE
*/
Tree.parse = function (st)
{
   this.pos = 0;                                  // статическая перемнная положение в st
   return Tree.parseNODE(st);
}
// получаем дерево в виде корневого узла:         NODE :-  NAME(LIST) | NAME
//
Tree.parseNODE = function (st)
{
   let tr = {nm: this.parseNAME(st) };   
   if(st.charAt(this.pos)==="("){
      this.pos++;
      tr.ar = this.parseLIST(st);
   }
   return tr;                                     
}
// получаем имя узла, включа любые символы, кроме "(,)"
//
Tree.parseNAME = function (st)
{
   let pos1 = this.pos;      // начало имени
   while(this.pos < st.length && "(,)".indexOf(st.charAt(this.pos))<0 )   
      this.pos++;
    return st.substring(pos1,this.pos);
}
// получаем список потомков в виде массива        LIST :-  NODE,LIST  | NODE
//
Tree.parseLIST = function (st)
{
   let lst = [ this.parseNODE(st) ];              // первый элемент списка
   if(this.pos>=st.length)                        
      return lst;                                 // конец строки и списка
   else if(st.charAt(this.pos)===","){            
      this.pos++;                                 // дошли до запятой
      return lst.concat(this.parseLIST(st));
   }
   else if(st.charAt(this.pos)===")"){            
      this.pos++;                                 // закрывающая скобка, конец списка
      return lst;
   }
   else
      return lst;                                 // ошибка синтаксиса
}
/****************************************************************************************
*                               Функции вывода деревьев
****************************************************************************************/

/****************************************************************************************
* Получить дерево в JSON-формате
*/
Tree.getJSON = function (tr)
{   
   return JSON.stringify(tr).replace(/"(\w+)":/g, "$1:");
}
/****************************************************************************************
* Получить дерево в функциональном виде
*/
Tree.getFun = function (tr)
{
   if(!tr.ar)
      return  tr.nm;                              // финальный лист
      
   let res = tr.nm+"(";
   for(let i=0; i < tr.ar.length ; i++)
      res += this.getFun(tr.ar[i])                // рекурсивно для ветвей
           + (i+1 < tr.ar.length? "," : "");      // запятая в списке
   return res + ")";
}
/****************************************************************************************
* Получить дерево tr в виде html-перечислений ul-li. Вызывать без второго аргумента
*/
Tree.getUL = function (tr, ul)
{        
   if(!tr.ar)
      return  "<li>" + tr.nm + "</li>";           // финальный лист
   
   let res = (!ul? '<ul style="line-height:0.9em;">':'')
           + "<li>" + tr.nm + "<ul>";
   for(let i=0; i < tr.ar.length; i++)
      res += this.getUL(tr.ar[i], true);          // рекурсивно для ветвей
   return res + "</ul></li>"+(!ul? "<ul>":"");
}
/****************************************************************************************
* Распечатать дерево в символах псевдографики. 
* При стартовом запуску calc отсутсвует и функция возвращает строку, разделённую "\n"
* Если calc есть (рекурся) функция возвращает массив строк.
*/
Tree.getANSII = function (tr, calc)
{
   if(!calc){                                     // первый запуск (не рекурсия)                
      let st  = ""; 
      let lst = this.getANSII(tr, true);          // получаем массив строк, котрые
      for(let i=0; i < lst.length; i++)           // сворачиваем в одну стрку
         st += lst[i]+"\n";                       // перевод каретки - для <pre>
      return st;
   }
   
   if(!tr.ar || tr.ar.length===0)                 // это лист, возвращаем только имя
      return ["-"+tr.nm];
   
   let lst = [];                                  // список строк, который вернёт узел
   lst.push("-" + tr.nm);      
   for(let i=0; i < tr.ar.length; i++){           // по всем потомкам
      let nxt = this.getANSII(tr.ar[i], true);    // получаем массив строк потомка
      for(let j=0; j < nxt.length; j++){          // добавляем его в массив этого узла
         let ch = "   ";                          // линии, соединяющие узлы         
         if(j===0){                               // первая строка (с именем потомка)
            if(i+1 !== tr.ar.length)              // не последний потомок
               ch = tr.ar[i].ar? " +-": " |-";    // " + " для папки и " |-" для листа
            else                                  // последний потомок
               ch = tr.ar[i].ar? " +-": " L-";    // тоже, но нет линии вниз
         }
         else if(i+1 !== tr.ar.length)            // соединительная линия вниз
            ch = " | ";            
            
         lst.push(ch+nxt[j]);
      }
   }
   return lst;
}
/****************************************************************************************
* Произошло действие на узле с индексом id из массива this.nodes
*/
Tree.prototype.clk = function (id, knd)
{
   let n = this.nodes[id];                        // получаем узел с индексом id
   switch(knd){                                   
      case 0:                                     // свернуть, развернуть узел
         n.opn = !n.opn;
         if(n.ar)
         for(let i=n.ar.length; i--; )
            n.ar[i].vis =  n.opn;
         if(this.show) 
            this.show();                          // вызываем функцию перерисовки
         return;
      case 1:                                     // на иконке узла, листа
         n.chk = (n.chk!==1?  1: 0);
         if(n.ar)
            Tree.set(n, "chk", n.chk);            // применяем ко всем ниже   
         Tree.chngeChk(this);                     // для папок заменяем 1 на 2, если частичный выбор  
         if(this.select)
            this.select(n);                       // вызываем функцию обработки выбора
         if(this.show)        
            this.show();                          // вызываем функцию перерисовки
         return;
      case 2:                                     // на названии 
         if(this.click)  
            this.click(n);                        // вызываем функцию обработки клика
         return;
   }
}
/****************************************************************************************
* закрыть все узлы на дереве ниже глубины depth
*/
Tree.prototype.close  = function (depth)
{
   Tree.set(this, "opn", false);
   Tree.set(this, "opn", true, depth-1);
   Tree.set(this, "vis", false);
   Tree.set(this, "vis", true, depth);
}
/****************************************************************************************
* для нетерминальных узлов ставим chk = 2, если он содержит узлы с chk=2,
* или часть помеченных и часть непомеченных потомков
*/
Tree.chngeChk = function (tr)
{
   if(!tr.ar)
     return tr.chk;
     
   let nch=0;
   for(let i=tr.ar.length; i-- ; ){
      this.chngeChk(tr.ar[i]);  
      if(tr.ar[i].chk === 2)
         return tr.chk = 2;
      if(tr.ar[i].chk === 1)
         nch++;
   }
   if(nch === 0)
      return tr.chk = 0;
   if(nch < tr.ar.length)        
      return tr.chk = 2;     
   return tr.chk;      
}

/****************************************************************************************
* Получить графическое представление дерева в svg-формате.
* При стартовом запуске r отсутствует
*/
Tree.svg = { 
   h    : 20,             // высота ящика для узла
   w    : 20,             // минимальная ширина ящика для узла
   r    : 5,              // радиус скругления ящика
   chW  : 10,             // ширина буквы 
   skpY: 30,              // отступить от имени узла 
   skpX: 10,              // отступить от соседнего узла вправо
   cFill: "#FFC",         // цвет заливки
   cText: "blue",         // цвет текста
   cLine: "black",        // цвет линий
   bound: false,          // показывать ограничивающие ящики
   colors: [],            // массив цветов заливки ящиков по номеру свойства chk узла
};
Tree.getSVG = function (tr, r)
{
   if(!r){                                        // стартовый запуск
      let r = {x:1, y:1, w:0, h:this.svg.h};      // окружающий дерево ящик 
      let res = this.getSVG(tr, r);               // рекурсия      
      return this.svgHead(r.w+2,r.h+2)+res+'\n</svg>'; // крайние линии не подрежутся
   }   
   let svg = Tree.svg, h = svg.h;

   let w = Math.max(svg.w, svg.chW*(""+tr.nm).length);  // ширина ящика
   let svgW, svgH;
   if(tr.svg){
      w = parseFloat(tr.svg.substr(tr.svg.search(/width=\"\d+/)+7, 10)) +svg.r;
      h = parseFloat(tr.svg.substr(tr.svg.search(/height=\"\d+/)+8, 10))+svg.r;      
   }
   
   let res = "";      
   let x=r.x, arrX = [];                          // массив координат X для соед.лининий
   if(tr.ar){
      for(let i=0; i < tr.ar.length; i++){
         if(tr.ar[i].vis !== undefined && tr.ar[i].vis == false)
            continue;
         let b = {x:x, y:r.y+svg.skpY, w:0, h:h};  
         
         res +=  this.getSVG(tr.ar[i], b);        // прямоугольники потомков этого узла

         arrX.push(x+b.w/2);                   
         if(b.h > r.h)
            r.h = b.h;
          if(i+1 < tr.ar.length) 
             b.w += svg.skpX;                     // щель между блоками
          r.w += b.w;  x += b.w;
      }
      r.h += svg.skpY;                            // величина отступа потомков
   }
      
   r.w = Math.max(r.w, w);                        // может быть шире потомков 
   
   let fill = svg.cFill;                          // цвет заливки ящика
   if(tr.chk!==undefined && svg.colors && svg.colors.length>0)      
      fill = svg.colors[tr.chk];                  // цвета помеченных узлов

   let text =  svg.cText;   
   if(fill.length===4 && fill.charAt(0)==='#' ){  // инвертируем цвет текста
      let cr = parseInt(fill.charAt(1),16),  cg = parseInt(fill.charAt(2),16), cb = parseInt(fill.charAt(3),16);
      //text = '#' + (15-cr).toString(16) + (15-cg).toString(16) + (15-cb).toString(16); // инверсия
      let gray = 0.2126 * cr + 0.7152 * cg + 0.0722 * cb; // серый цвет
      text = (gray > 8)? "#000": "#fff";          // белый или чёрный
   }
          
   let box = "", lines = "";;
   if(tr.hide === undefined || tr.hide == false){
      box = this.svgBox(r.x+(r.w-w)/2, r.y, w, h, fill)   // рисуем прямоугольник:
      if(tr.svg)                                          // рисуем svg-картинку
         box += '<g transform="translate('+(r.x+r.w/2-w/2+svg.r/2)+' '+(r.y+h/2-h/2+svg.r/2)+')">'+tr.svg+'</g>';      
      else if(tr.nm !== undefined)
         box += this.svgText(tr.nm, r.x+r.w/2, r.y+h/2, text);// и текст в нём  
   }
 
   for(let i=0; i < arrX.length; i++)             // рисуем соединительные линии
      lines += ((tr.ar[i].hide !== undefined && tr.ar[i].hide == true)? "":
         this.svgLine(r.x+r.w/2, r.y+ h/2, arrX[i], r.y+h/2+svg.skpY));
   
   let outbox = svg.bound?  svgDashBox(r.x,r.y,r.w,r.h) : "";     
   
   return outbox + lines + box + res + '\n';      // линии, потом узел, потом потомки     
}
//------------------------------------------------------------------- элементы svg-файла:
Tree.svgHead = function(w,h) {        // заголовок svg-файла
   return '<svg width="'+Math.round(w*100)/100+'px" height="'+Math.round(h*100)/100+'px" '
      +'style="vertical-align:top;text-anchor:middle;font-family:monospace;font-size:16px;">\n';
}
Tree.svgBox = function(x,y,w,h,fill){ // ящик со скруглёнными краями цветом заливки fill
   return '<rect x="'+Math.round(x*100)/100+'" y="'+Math.round(y*100)/100
      +'" width="'+Math.round(w*100)/100+'" height="'+Math.round(h*100)/100  
      +'" stroke="black" rx="5" ry="5" style="stroke-width:1px;" fill="'+fill+'"/>\n';
}
Tree.svgDashBox = function(x,y,w,h){ // прозрачный прямоугольный ящик пунктиром
   return '<rect x="'+Math.round(x*100)/100+'" y="'+Math.round(y*100)/100
      +'" width="'+Math.round(w*100)/100+'" height="'+Math.round(h*100)/100
      +'" stroke="#555" stroke-dasharray="3 4" style="stroke-width:1px;" fill="none"/>\n';
}    
Tree.svgText = function(txt,x,y, с){     // текст, центрированный относительно x,y
   return '<text x="'+ Math.round(x*100)/100 +'" y="'+Math.round(y*100)/100  
      +'" alignment-baseline="middle" fill="' + с +'">'
      + txt + '</text>\n';
}
Tree.svgLine = function(x1,y1,x2,y2){ // линия между двумя точками
   return '<line x1="'+Math.round(x1*100)/100+'" y1="'+Math.round(y1*100)/100
      +'" x2="'+Math.round(x2*100)/100+'" y2="'+Math.round(y2*100)/100
      +'" stroke="'+this.svg.cLine+'" style="stroke-width:1px;"/>\n';        
}
