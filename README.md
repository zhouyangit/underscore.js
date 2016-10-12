JavaScript语言精粹学习笔记

语法

1、注释
JS提供了两种注释方式：一种是块注释：/* 被注释的内容 */ ，另一种是行注释：// 被注释的内容。 使用块注释是不安全的，例如，使用正则表达式：

// /*
    var test = /test*/;
// */
2、数字

var isNaN = isNaN(number); // 用isNaN方法判断是否为数字，不是数字返回true,反之，返回false
3、字符串不可变

'A' === '\u0041'; // true
'c' + 'a' + 't' === 'cat'; // true
'cat'.toUpperCase() === 'CAT'; // true
4、语句
条件判断会被当成false的值：false,null,undefined,'',0,NaN,其他所有值都为被当做true。

5、运算符
typeof运算符产生的值有：'number','string','boolean','undefined','function','object'.
'+' 运算符只有在运算符两端运算数都为数字时进行相加，其他情况是字符串连接。
'/' 运算符可能产生一个非整数结果，即使两个运算数都是整数。
'&&' 运算符使用技巧：当&&的第一个运算数的值为假时，取第一个运算数的值，反之，取第二个的值。

0 && 1; // 0
false && true; // false
true && false; // false
1 && 2; // 2
|| 运算符使用技巧：当第一个运算数的值为为真时，取第一个运算数的值，反之，取第二个的值。一般使用这种技巧设置默认值。

undefined || 0; //0
null || {}; // {}
0 || []; // []
1 || true; // 1
以上技巧利用了&&和||的短路原理，&&运算符左边的值为假时，不再执行右边的值，||运算符左边的值为真，则不再执行右边的值。

对象

1、使用字面量创建对象
对象属性值可以使用undefined以外的任何值

var obj = {};
obj.name = 'Better';
obj.age = 24;
obj['first-name'] = 'liao'; //由于first-name不是合法的标识符，所以必须使用[]，不能使用.
obj.last_name = 'longdong'; // last_name为合法标识符
2、引用
对象通过引用进行传递

var a = {}, b ={}, c = {}; //a,b,c属于不同的对象，因为它们的引用不同
a == b; // false
a.name = 'Better';
b.name = 24;
console.log(a); // {name: 'Better'}
console.log(b); // {name: 24}

var a = b = c = {}; // a,b,c属于同一个对象，因为它们的引用（地址）相同
a === b; // true
a.name = 'Better';
b.age = 24;
console.log(a); // {name: 'Better', age: 24}
console.log(b); // {name: 'Better', age: 24}
3、原型
每个对象都有原型对象，所谓的原型链，就是查找对象的属性和方法时，首先，查找对象本身是否有该属性或者方法，如果没有，则沿着原型对象进行查找，直到Object.prototype，如果都没有则返回undefined.

// 模拟Object.create()方法创建新对象
if( typeof Object.create === 'function'){
    Object.create = function (obj) {
        var F = function(){};
        F.prototype = obj;
        return new F();
    }
}
obj.hasOwnProperty('name'); // 该方法用于检测对象本身是否拥有该属性，不会查找原型链中的属性和方法
4、全局变量
减少全局变量主要有两种方式：一、使用命名空间，二、使用闭包

// 使用命名空间
var mynamespace = {};
mynamespace.module1 = {
    name : 'xiaoxin',
    age: 24
};
mynamespace.module2 = {
    name: 'xiaowu',
    age: 22
};
// 使用闭包，创建唯一ID
var create = function(){
    var num = 0;
    return function(){
        return num ++;
    }
}
var uId = create();
uId(); // 0
uId(); // 1
uId(); // 2
函数

在JavaScript中函数就是对象。对象字面量产生的对象连接到Object.prototype，函数对象连接到Funtion.prototype（该原型对象本身连接到Object.prototype）。
每个函数在创建时两个附加隐藏属性：函数的上下文和实现函数行为的代码。每个函数对象在创建时也带有一个prototype属性，它的值是一个拥有constructor属性，该属性指向该函数对象。

var f = function(){};
f.prototype.constructor === f; // true
1、函数字面量（函数表达式）
函数表达式与函数声明的区别：

// 函数表达式
console.log(fun1); // undefined
var fun1 = function(){
    console.log(123);
};
console.log(fun1); // function(){console.log(123)};

// 函数声明
console.log(fun2); // function fun2(){console.log(456)};
function fun2(){
    console.log(456);
};
console.log(fun2); // function fun2(){console.log(456)};

var fun3 = function(){
    console.log(666);
};
function fun3(){
    console.log(888);
};
console.log(fun3()); // 666
//结论：1、函数表达式和函数声明都会进行变量提升；2、函数表达式会覆盖同名的函数声明
2、函数调用
JavaScript中一共有四种函数调用模式：方法调用模式、函数调用模式、构造函数调用模式和apply调用模式。

方法调用模式
当函数作为一个对象的方法（属性）时，this指向该对象。
var myObj = {}; // 创建一个对象
myObj.name = 'Better';
myObj.method = function(){ // 给对象添加方法
    console.log(this.name);
};
myObj.method(); // 'Better'
函数调用模式
当一个函数没有作为一个对象的方法（属性）时，this指向全局对象（window对象）
// 全局函数
function add(a, b){
    return a + b;
};
add(1, 2); // 3

myObj.value = 2;
myObj.double = function(){
    console.log(this);
    var that = this; // 把指向myObj对象的this指针，存到that变量中
    var helper = function(){
        console.log(this); // 这里的this指向window对象
        that.value = add(that.value, that.value);
    };
    helper(); // 以函数形式进行调用helper函数
};
myObj.double(); // 以方法的形式调用double函数
myObj.value; // 4
构造函数调用模式
如果函数前面带上new来调用，那么this指向该新对象上，使用new调用函数也会改变return语句的行为，如果return的是对象则返回该对象，否则，返回（this）新创建的对象。
// 创建一个构造函数，约定构造函数使用大写开头
function Fun(string){
    this.status = string;
};
// 给构造函数添加公共方法
Fun.prototype.getStatus = function(){
    return this.status;
};
// 创建实例
var fun = new Fun('Better');
fun.getStatus(); // 'Better'
// 不推荐使用该方法
apply调用模式
apply方法有两个参数，第一个参数thisObj，是绑定this执行的上下文，第二个参数argArr，参数数组。
// 创建一个构造函数，约定构造函数使用大写开头
function Fun(string){
    this.status = string;
};
// 给构造函数添加公共方法
Fun.prototype.getStatus = function(){
    return this.status;
};
// 创建实例
var fun = new Fun('Better');
fun.getStatus(); // 'Better'

// this指向全局对象
function add(a, b){
    return a + b;
};
var arr = [3, 4];
var sum = add.apply(null, arr); // 7

// this指向obj对象
var obj = {};
obj.status = 24;
Fun.prototype.getStatus.apply(obj); // 24
fun.getStatus.apply(obj); // 24
fun.getStatus.apply(this);

// apply方法第一个参数为null或者undefined时，this指向全局对象（非严格模式下）
function test(){
    console.log(this);
};
test.apply(null); // this指向全局对象（window对象）
test.apply(undefined); // this指向全局对象（window对象）
test.apply(this); // this指向全局对象（window对象）
test.apply(1); // this指向Number对象
test.apply('string'); // this指向String对象
test.apply(true); // this指向Boolean对象

// 结论：通俗的说，就是把某个方法放到apply方法的第一个参数（thisObj）作用域下执行。
3、arguments类数组参数对象
arguments对象是一个类数组对象，只有length属性，没有数组相关方法。它可以获取函数调用时的参数列表。该对象只能在函数内部使用。

var sum = function(){
    var sum = 0;
    for(var i = 0, len = arguments.length; i < len; i ++){
        sum += arguments[i];
    }
    return sum;
};
console.log(sum(1, 2, 3, 4, 5)); // 15
4、异常
JavaScript提供了一套异常处理机制。

var add = function(a, b){
    if(typeof a !== 'number' || typeof b !== 'number'){
        throw {
            name: 'TypeError',
            message: 'add needs numbers'
        };
    }
    return a + b;
};
add(1, 2); // 3
add(1, '2'); // 报错
add(); // 报错

// try_catch代码块
var try_it = function(){
    try{
        add('one');
    }catch(e){
        console.log(e.name + ' : ' + e.message);
    }
};
try_id(); // TypeError : add needs numbers
5、给类型添加方法
通过给Object.prototype添加方法使得该方法对所有对象可用。
通过给Function.prototype添加方法使得该方法对所有函数可用。

// 给Function.prototype添加方法
Function.prototype.method = function(name, func){
    if(!this.prototype[name]){
        this.prototype[name] = func;
    }
};

// 给Number对象添加一个integer方法
Number.method('integer', function(){
    var funName = this < 0 ? 'ceil' : 'floor'; 
    return Math[funName](this);
});
(10/4).integer(); // 2
(-10/4).integer(); // -2

// 给String对象添加一个移除两端字符串的方法
String.method('trim', function(){
    return this.replace(/^\s+|\s+$/, '');
});
'  Better '.trim(); // 'Better'
6、递归
递归函数会直接或间接地调用自身的一种函数。一般来说，一个递归函数调用自身去解决它的子问题。
递归可以非常高效地操作树形结构，比如浏览器端的文档对象模型（DOM）。每次递归调用时处理给定树的一小段。

// walk_the_DOM调用自身去处理每一个子节点
var walk_the_DOM = function walk(node, func){
    func(node);
    node = node.firstChild;
    while(node){
        walk(node, func);
        node = node.nextSibling;
    }
};
// 创建一个通过属性查找节点的函数
var getElementByAttribute = function(attr, value){
    var results = [];
    walk_the_DOM(document.body, function(node){
        var actual = node.nodeType === 1 && node.getAttribute(attr);
        if(typeof actual === 'string' && (actual === value || typeof value !== 'string')){
            results.push(node);
        }
    });
    return results;
};

// 利用递归，计算一个数的阶乘
var factorial = function factorial(i, a){
    a = a || 1;
    if(i < 2){
        return a;
    }
    return factorial(i - 1, a * i);
};
factorial(3); // 6
factorial(3, 2); // 12
factorial(3, 3); // 18

// 不建议在匿名函数中使用arguments.callee()
// 在给函数表达式一个名称或者使用函数声明而该函数必须调用自己时，禁止使用 arguments.callee()
// 在ES5的严格模式中禁止使用 arguments.callee()
function create(){
    return function(num){
        if(num < 2){
            return 1;
        }else{
            return num * arguments.callee(num - 1);
        }
    }   
};
var result = create()(3); // 6
7、作用域
作用域控制着变量与参数的可见性和生命周期。
JavaScript有函数作用域，但没有块级作用域，最好的做法是在函数体的顶部声明函数中可能用到的所有变量。

// 函数内的变量会进行变量提升，所以运行cxt()函数，前两次console.log(c);没有报错
function cxt(){
    var a = 1, b = 2;
    console.log(c); // undefined
    function innerFun(){
        var a = 6, b =7, c = 8;
        console.log(a, b, c); // 6 7
    }
    innerFun();
    console.log(c); // undefined
    if(a == 1){ // false
        var c = 3;
    };
    console.log(c); // 3
}
8、闭包
闭包是指有权访问另一个函数作用域中的变量的函数，创建闭包的最常见的方式就是在一个函数内创建另一个函数，通过另一个函数访问这个函数的局部变量。

var myObject = function(){
    var value = 0;
    return {
        increment: function(inc){
            value += typeof inc === 'number' ? inc : 1;
        },
        getValue: function(){
            return value;
        }
    };
}();

// 创建一个名为quo的构造函数
var quo = function(status){
    return {
        getStatus: function(){
            return status;
        }
    };
};
// 构造一个quo实例
var myQuo = quo('crazy');
console.log(myQuo.getStatus()); // 'crazy'
// 这个构造函数被设计成无需加new来使用，所以名字也没有首字母大写

// 定义一个函数，它设置一个DOM节点为黄色，然后把它渐变为白色
var fade = function(node){
    var level = 1;
    var step = function(){
        var hex = level.toString(16); // 转化为16进制数
        console.log(hex);
        node.style.backgroundColor = '#FFFF' + hex + hex;
        if(level < 15){
            level += 1;
            setTimeout(step, 100);
        }
    };
    setTimeout(step, 100);
};
fade(document.body);
9、回调
回调函数可以让不连续的事件处理变得更容易。

// 这种同步请求会阻塞进程
request = prepare_the+request();
response = send_request_synchronously(request);
display(response);

// 更好的方式使用异步回调请求
request = prepare_the_request();
send_request_asynchronously(request, function(response){
    display(response);
});
10、模块
可以使用函数和闭包来构造模块。
模块是一个提供接口却隐藏状态与实现的函数或对象。
模块模式的一般形式：一个定义了私有变量和函数的函数；利用闭包创建可以访问私有变量和函数的特权函数；最后返回这个特权函数，或者把它们保存到一个可访问的地方。

// 给所有函数都添加该方法
Function.prototype.method = function(name, func){
    if(!this.prototype[name]){
        this.prototype[name] = func;
    }
}
String.method('deentityify', function(){
    // 字符实体表
    var entity = {
        quot: '""',
        lt: '<',
        gt: '>'
    };
    // 返回deentityify方法
    return function(){
        // 使用字符串的replace方法
        // 查找‘&’开头和‘;’结束的子字符串
        return this.replace(/&([^&;]+);/g, function(a, b){
            console.log(a, b); // a为正则表达式第一个匹配，b为第二个匹配（正则表达式圆括号里的匹配）
            var r = entity[b];
            return typeof r === 'string' ? r : a;
        });
    }
}()); // 这里使用立即执行函数
console.log('&lt;&quot;&gt;'.deentityify()); // <"">

// 构造一个用来产生序列号的对象
var serial_marker = function(){
    // 返回一个用来产生唯一字符串的对象
    // 唯一字符串由两部分组成：前缀+序列号
    // 该对象包含一个设置前缀的方法，一个设置序列号的方法和一个产生唯一字符串的gensym方法
    var prefix = '';
    var seq = 0;
    return {
        set_prefix: function(p){
            prefix = String(p);
        },
        set_seq: function(s){
            seq = s;
        },
        gensym: function(){
            var result = prefix + seq;
            seq += 1;
            return result;
        }
    };
};
var seqer = serial_marker();
seqer.set_prefix('Q');
seqer.set_seq(1000);
var unique = seqer.gensym(); // unique is "Q1000"
var unique = seqer.gensym(); // "Q1001"
模块模式通常结合单例模式（Singleton Pattern）使用。
JavaScript的单例就是用对象字面量表示法创建的对象，对象的属性值可以是数值或函数，并且属性值在该对象的生命周期中不会发生变化。

11、链式调用（级联）
方法返回this而不是undefined就可以启用链式调用（级联），链式调用可以产生出具备强大表现力的接口。

getElement('myBoxDiv').
    move(100, 200).
    width(100).
    height(200).
    color('red').
    on(mouseover, func);
12、记忆
函数可以用对象去记住先前操作的结果，从而避免多余的运算。这种优化被称为记忆。JavaScript的对象和数组要实现这种优化是非常方便的。

// Fibonacci数列，斐波那契数列，特点，前面相邻两项之和等于后一项的值。
var fibonacci = function(n){
    return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
};
for(var i =0; i <= 10; i ++){
    console.log(i, fibonacci(i));
}
// 0 0
// 1 1
// 2 1
// 3 2
// 4 3
// 5 5
// 6 8
// 7 13
// 8 21
// 9 34
// 10 55
// fibonacci被调用了453次，除了我们调用了11次，其它的调用大都在计算已经计算过的值

// 上面的例子做了很多重复的工作，下面进行一下优化
var fibonacci = function(){
    var memo = [0, 1];
    var fib = function(n){
        var result = memo[n];
        if(typeof result !== 'number'){ // 判断是否已经存在结果
            result = fib(n - 1) + fib(n - 2);
            memo[n] = result;
        }
        return result;
    };
    return fib;
}();
for(var i =0; i <= 10; i ++){
    console.log(i, fibonacci(i));
}
// 这样优化后只调用了29次，我们调用了11次，函数自身调用了18次

// 编写一个函数来帮助我们构造带记忆动能的函数，他返回一个管理memo存储和在需要是调用func函数的shell函数。
var memoizer = function(memo, func){
    var shell = function(n){
        var result = memo[n];
        if(typeof result !== 'number'){
            result = func(shell, n);
            memo[n] = result;
        }
        return result;
    };
    return shell;
};
// 使用memoizer来定义fibonacci函数
var fibonacci = memoizer([0, 1], function(shell, n){
    return shell(n - 1) + shell(n - 2);
});
// 使用memoizer来定义factoriala函数
var factorial = memoizer([1, 1], function(shell, n){
    return n * shell(n - 1);
});
继承

1、伪类
当一个函数对象被创建时，Function构造器产生的函数对象会运行类似这样的一些代码：

this.prototype = {constructor: this};
新函数对象被赋予一个prototype属性，其值是包含一个constructor属性且属性值为该新函数对象。每个函数都拥有一个prototype对象。

function f(){};
f.prototype.constructor === f; // true
定义一个构造器并给原型添加方法

// 父类
// 创建构造函数
var Mammal = function(name){
    this.name = name;   
};
// 给原型添加方法
Mammal.prototype.getName = function(){
    return this.name;   
};
Mammal.prototype.say = function(){
    return this.saying || 'hello';
};
var myMammal = new Mammal('Herb the Mammal');
var name = myMammal.getName(); // 'Herb the Mammal'

// 子类
var Cat = function(name){
    this.name = name;
    this.saying = 'meow';
};
// 替换Cat.prototype为一个新的Mammal实例(继承父类)
Cat.prototype = new Mammal();
// 给新的原型对象添加方法
Cat.prototype.purr = function(n){
    var i, s = '';
    for(i = 0; i < n; i += 1){
        if(s){
            s += '-';
        }
        s += 'r';
    }
    return s;
};
Cat.prototype.getName = function(){
    return this.say() + ' ' + this.name + ' ' + this.say(); 
};
var myCat = new Cat('Henrietta');
var say =  myCat.say(); // 'meow'
var purr = myCat.purr(5); // 'r-r-r-r-r'
var name = myCat.getName(); // 'meow Henrietta meow'

// 隐藏prototype操作细节，这部分代码要用到上面Mammal父类代码，才能运行
Function.prototype.method = function(name, func){
    if(!this.prototype[name]){
        this.prototype[name] = func;
    }
    return this;
};
Function.method('inherits', function(Parent){
    this.prototype = new Parent();
    return this;
});
var Cat = function(name){
    this.name = name;
    this.saying = 'meow';
}.
    inherits(Mammal).
    method('purr', function(n){
        var i, s = '';
        for(i = 0; i < n; i += 1){
            if(s){
                s += '-';
            }
            s += 'r';
        }
        return s;
    }).
    method('getName', function(){
        return this.say() + ' ' + this.name + ' ' + this.say();
    });
var cat = new Cat('icat');
cat.getName(); // 'icat'
cat.purr(5); // r-r-r-r-r
// 这种方法的缺点：没有私有环境，所有的属性都是公开的。
2、原型

// 创建一个有用的对象
var myMammal = {
    name: 'Herb the Mammal',
    getName: function(){
        return this.name;
    },
    says: function(){
        return this.saying || '';
    }
};
// 使用Object.create()方法构造出更多的实例来
var myCat = Object.create(myMammal);
myCat.name = 'Henrietta';
myCat.saying = 'meow';
myCat.purr = function(n){
    var i, s = '';
    for(i = 0; i < n; i ++){
        if(s){
            s += '-';
        }
        s += 'r';
    }
    return s;
};
myCat.getName = function(){
    return this.says() + ' ' + this.name + ' ' + this.says();
};
// 这是一种“差异化继承”，通过制定一个新的对象，我们指明了它与所基于的基本对象的区别。
3、函数化
前面的例子中的name属性和saying属性是完全公开的，下面这个例子让name属性和saying属性变成私有变量：

// 模块模式的应用
var mammal = function(spec){
    var that = {};
    that.getName = function(){
        return spac.name;
    };
    that.says = function(){
        return spec.saying || '';
    };
    return that;
};
var myMammal = mammal({name: 'Herb'});

var cat = function(spec){
    spec.saying = spec.saying || 'meow';
    var that = mammal(spec);
    that.purr = function(n){
        var i, s = '';
        for(i = 0; n < i; i ++){
            if(s){
                s += '-';
            }
            s += 'r';
        }
        return s;
    };
    that.getName = function(){
        return that.says() + ' ' + spec.name + ' ' + that.says();
    };
    return that;
};
var myCat = cat({name: 'Henrietta'});

// 函数化模式给我们提供了一个处理父类的方法
Function.prototype.method = function(name, func){
    if(!this.prototype[name]){
        this.prototype[name] = func;
    }
    return this;
};
Object.method('superior', function(name){
    var that = this;
    method = that[name];
    return function(){
        return method.apply(that, arguments);
    }
});
var coolcat = function(spec){
    var that = cat(spec);
    var superGetName = that.superior('getName');
    that.getName = function(){
        return 'like ' + superGetName() + ' baby';
    };
    return that;
};
var myCoolCat = coolcat({name: 'Bix'});
var name = myCoolCat.getName(); // 'like meow Bix meow baby'
4、部件

var eventuality = function(that){
    var registry = {};
    that.fire = function(event){
        var array,
            func,
            handler,
            i,
            type = typeof event === 'string' ? event : event.type;
        // 如果这个事件存在一组事件处理程序，那么就遍历它们并按顺序依次执行
        if(registry.hasOwnProperty(type)){
            array = registry[type];
            for(i = 0; i < array.length; i ++){
                handler = array[i];
                // 每个处理程序包含一个方法和一组可选的参数
                // 如果该方法是一个字符串形式的名字，那么寻找到该函数
                func = handler.method;
                if(typeof func === 'string'){
                    func = this[func];
                }
                func.apply(this, handler.parameters || [event]);
            }
        }
        return this;
    };
    that.on = function(type, method, parameters){
        // 注册一个事件，构造一条处理程序条目，将它插入到处理程序数组中，如果这种类型的事件还不存在，就构造一个
        var handler = {
            method: method,
            parameters: parameters
        };
        if(registry.hasOwnProperty(type)){
            registry[type].push(handler);
        }else{
            registry[type] = [handler];
        }
        return this;
    };
    return that;
};
// 用这种方式，一个构造函数可以从一套部件中组装出对象来
数组

数组是一段线性分配的内存，它通过整数去计算偏移并访问其中的元素。数组可以是很快的数据结构。但是，JavaScript没有像这种数组一样的数据结构。
JavaScript提供了一种拥有一些类数组（array-like）特性的对象，它把数组的下标转变成字符串，用其作为属性。它的性能明显的比真正的数组慢，但它可以更方便的使用。
1、数组字面量
数组的第一个值将获得属性名'0'，第二个将获得属性名'1'，依次类推：

// 数组字面量
var empty = [];
var numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
console.log(empty[1]); // undefined
console.log(numbers[1]); // 'one'
console.log(numbers['1']); // 'one'
console.log(empty.length); // 0
console.log(numbers.length); // 10

// 对象字面量
var numbers_object = {
    '0': 'zero',
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
    '6': 'six',
    '7': 'seven',
    '8': 'eight',
    '9': 'nine'
};
// 在大多数语言中，一个数组的所有元素都要求是相同的类型。但是，JavaScript允许数组包含任意混合类型的值
var misc = ['steing', 66, true, null, undefined, [1, 2, 3], NaN, {name: 'Better'}];
numbers和numbers_object两者的区别：

numbers继承自Array.prototype，而numbers_object继承自Object.prototype
numbers继承了大量操作数组的方法
numbers有length属性，而numbers_object则没有
2、长度
JS数组的length属性没有上限，如果你用等于或大于当前length的数字作为下标来保存一个元素，那么length将增大来容纳新元素，不会发生数组越界错误。

// length属性的值是这个数组的最大整数属性名加1，它不一定等于数组里属性的个数
var myArray = [];
console.log(myArray.length); // 0
// myArray[10000] = true;
myArray['10000'] = true;
console.log(myArray.length); // 10001

// 可以直接设置数组length属性的值，设置更大的length不会给数组分配更多的空间，
// 而把length设小将导致所有等于大于新length的属性被删除
var numArr = [0, 1, 2, 3, 4, 5];
numArr.length = 3;
console.log(numArr); // [0, 1, 2]

// 添加新元素到数组尾部
numArr[numArr.length] = 3;
console.log(numArr); // [0, 1, 2, 3]

// 添加新元素到数组尾部，使用push方法
numArr.push(4);
console.log(numArr); // [0, 1, 2, 3, 4]
3、删除
由于JavaScript的数组其实就是对象，所以可以使用delete运算符移出数组中的元素，但是数组中会遗留一个空洞。

var numArr = [0, 1, 2, 3, 4, 5];
delete numArr[2];
console.log(numArr); // [0, 1, undefined, 3, 4, 5]

// 使用数组中的splice()方法
var numArr = [0, 1, 2, 3, 4, 5];
// 从数组下标为2的位置开始，删除1个数组元素，
// 并在该位置插入66这个元素，返回被删除的元素数组[2]
numArr.splice(2, 1, 66); // [2]
console.log(numArr); // [0, 1, 66, 3, 4, 5]
4、枚举
因为JS中的数组也是对象，所有可以使用for in语句来遍历数组的所有属性。
但是，使用for in语句无法保证属性的顺序，而且存在从原型链中得到意外属性的可能

// 使用for in遍历数组的属性（不推荐）
var nums = ['zero', 'one', 'two', 'three'];
for(var num in nums){
    console.log(num, nums[num]);
}
// 推荐使用for循环遍历数组
for(var i = 0, len = nums.length; i < len; i ++){
    console.log(i, nums[i]);
}
5、判断数组（包括其它类型）

// 本书中使用的方法（数组中的length不可枚举，length能否通过for in遍历出来？）
var arr = [];
var obj = {};
var is_array = function(value){
    return value &&  // 判断这个值是否为真
        typeof value === 'object' &&  // 是否为对象
        typeof value.length === 'number' &&  // 是否存在length属性而且值为数字类型
        typeof value.splice === 'function' &&  // 是否存在splice方法
        !(value.propertyIsEnumerable('length'));  // length属性是否可枚举
};
console.log(is_array(arr)); // true
console.log(is_array(obj)); // false

// 判断一个值是否为数组（最常用的方法）
function isArray(value){
    return Object.prototype.toString.call(value) === '[object Array]';
}
var arr = [];
var num = 1;
var bool = true;
var str = 'string';
var obj = {};
var func = function(){};
console.log(isArray(arr)); // true
console.log(Object.prototype.toString.call(num)); // '[object Number]'
console.log(Object.prototype.toString.call(bool)); // '[object Boolean]'
console.log(Object.prototype.toString.call(str)); // '[object String]'
console.log(Object.prototype.toString.call(obj)); // '[object Object]'
console.log(Object.prototype.toString.call(func)); // '[object Function]'
console.log(Object.prototype.toString.call(null)); // '[object Null]'
console.log(Object.prototype.toString.call(undefined)); // '[object Undefined]'
// PS: 使用该方法的前提是Object对象的toString()方法没有被重写
6、方法
JS提供了一套用于操作数组的方法，这些方法被存放在Array.prototype中，我们可以通过在Array.prototype中添加方法来扩充数组方法

// 扩充一个方法，每个数组都会继承这个方法
Array.prototype.reduce1 = function(func, value){
    for(var i =0, len = this.length; i < len; i ++){
        value = func(this[i], value);
    }
    return value;
};
var arr = [1, 2, 3, 4, 5];
var add = function(a, b){
    return a + b;
};
var mult = function(a, b){
    return a * b;
};
var sum = arr.reduce1(add, 0); // 15
var product = arr.reduce1(mult, 1); // 120

// 因为数组也是对象，所以可以单独给数组添加方法
arr.total = function(){
    return this.reduce1(add, 0);
};
total = arr.total(); // 15
7、维度

// 定义一个初始化数组的方法
Array.dim = function(dimension, initial){
    var a = [], i;
    for(i = 0; i < dimension; i ++){
        a[i] = initial;
    }
    return a;
}
// 创建一个包含6个6的数组
var myArray = Array.dim(6, 6); // [6, 6, 6, 6, 6, 6]

// 多维数组
var matrix = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
];
matrix[2][0]; // 6

// 数组矩阵
Array.matrix = function(m, n, initValue){
    var i, j, a, mat = [];
    for(i = 0; i < m; i ++){
        a = [];
        for(j = 0; j < n; j ++){
            a[j] = initValue;
        }
        mat[i] = a;
    }
    return mat;
}
// 创建一个用6填充的4×4矩阵
var myMatrix = Array.matrix(4, 4, 6);
console.log(myMatrix[3][3]); // 6

// 创建一个恒等矩阵
Array.identity = function(n){
    var i, mat = Array.matrix(n, n, 6);
    for(i =0; i < n; i ++){
        mat[i][i] = 8
    }
    return mat;
}
var myMatrix1 = Array.identity(4);
console.log(myMatrix1[3][2]); // 6
console.log(myMatrix1[3][3]); // 8
正则表达式

正则表达式是一门简单语言的语法规范，它以方法的形式被用于对字符串中的信息进行查找、替换和提取操作。
处理正则表达式的方法主要有：regexp.exec、regepx.test、string.match、string.replace、string.search、string.split。

正则表达式常用字符说明：

点字符：. 匹配除回车（\r）、换行(\n) 、行分隔符（\u2028）和段分隔符（\u2029）以外的所有字符。
位置字符：^ 表示字符串的开始位置，$ 表示字符串的结束位置。
选择字符：| 表示“或”，如，a|b，表示匹配a或b。
转义符：\ 用来转义正在表达式中有特殊含义的字符，如+、-、?等，如，\+，表示匹配 + 。
脱字符： [^abc] 表示匹配除a、b、c之外的任意字符。
连字符：[0-9] 表示匹配0~9的数字。[A-Z] 表示匹配A到Z的26个大写字母。
预定义模式：
预定义模式常见模式的简写方式
重复类：{n,m} 表示重复不少于n次，不多于m次。
量词符：
1、a? 表示匹配a出现0次或1次，等同于a{0,1}。
2、a* 表示匹配a出现0次或多次，等同于a{0,}。
3、a+ 表示匹配a出现1次或多次，等同于a{1,}。
贪婪模式：默认情况下都是最大可能匹配，即匹配直到下一个字符不满足匹配规则为止。这被称为贪婪模式。
非贪婪模式：
1、*? 表示某个模式出现0次或多次，匹配时采用非贪婪模式。
2、+? 表示某个模式出现1次或多次，匹配时采用非贪婪模式。
修饰符：
1、g 修饰符表示全局匹配（global）。
2、i 修饰符表示忽略大小写（ignorecase）。
3、m 修饰符表示多行模式（multiline），会修改^和$的行为。
组匹配：(abc) 表示组匹配，正则表达式的括号表示分组匹配，括号中的模式可以用来匹配分组的内容。
非捕获组匹配： (?:abc) 表示非捕获组匹配，非捕获组匹配不返回该组匹配的内容，即匹配的结果中不计入这个括号（匹配分组）。
组匹配和非捕获组匹配的区别：
1、使用exec和match方法时会把组匹配放入到exec和match方法返回的匹配数组（匹配分组）中。
2、非捕获组匹配性能要比组匹配性能好。
1、例子

// 匹配URL的正则表达式
var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;

var url = 'http://www.better.com:8080/goodparts?q#fragment';

// 使用正则表达式的exec()方法，该方法返回一个匹配数组
var result_arr = parse_url.exec(url);
var names = ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'];
var line_end = '\n';
var i;
for(i = 0, len = names.length; i < len; i ++){
    console.log(names[i] + ' : ' + result_arr[i] + line_end);
}
// 输出结果：
// url : http://www.better.com:8080/goodparts?q#fragment
// scheme : http
// slash : /
// host : www.better.com
// port : 8080
// path : goodparts
// query : q
// hash : fragment

// 匹配数字的正则表达式
var parse_num = /^-?\d+(?:\.\d*)?(?:e[+\-]?\d+)?$/i;
var test_num = function(num){
    return parse_num.test(num);
}
console.log(test_num('1')); // true
console.log(test_num('-1')); // true
console.log(test_num('0.01')); // true
console.log(test_num('0.')); // true
console.log(test_num('1.2.3')); // false
console.log(test_num('123.45e-67')); // true
console.log(test_num('123.45E+67')); // true
console.log(test_num('123.456D-7')); // false
// 通常用非捕获型分组来代替少量不优美的捕获型分组是很好的方法
// 因为捕获会有性能上的损失。
2、结构
正则表达式有两种创建方式：

// 最常用的方式（字面量）
var reg = /^\d+$/g;
console.log(reg.test(123)); // true
console.log(reg.test('123s')); // false

// 使用RegExp构造器，这时的反斜杠（\）和字面量中有不同的含义
// 通常需要双写反斜杠进行转义
var reg = new RegExp('^\\d+$', 'g');
console.log(reg.test(123)); // true
console.log(reg.test('123s')); // false
方法

JavaScript有不少内置对象，比如，Array,Date,RegExp,Error,Math以及基本数据类型的封装对象，Number,Boolean,String等，这些内置对象都提供许多操作该类型的属性和方法，这些方法存放在内置对象中或者内置对象的原型对象中。

1、Array

// array.concat(item...)方法，连接数组
var a = [1, 2, 3];
var b = ['a', 'b', 'c'];
var c = a.concat(b, true); // [1, 2, 3, "a", "b", "c", true]

// array.join(separator)方法，该方法性能优于+运算符连接字符串
var a = ['a', 'b', 'c'];
var c = a.join(' @ '); // "a @ b @ c"

// array.pop()方法，移出数组中最后一个元素，如果数组为空，则该方法返回undefined。
// array.pop()方法和array.push()方法组合使用可以模拟后进先出队列
var a = ['a', 'b', 'c'];
var c = a.pop(); // 'c'
console.log(a); // ['a', 'b']

// 实现pop()方法
Array.prototype.pop = function(){
    return this.splice(this.length - 1, 1)[0];
};

// array.push(item...)方法，在数组末尾添加元素
var a = [1, 2, 3];
var b = ['a', 'b', 'c'];
var c = a.push(b, true); // 5，返回新数组的长度
console.log(a); // [1, 2, 3, ['a', 'b', 'c'], true]

// 实现push()方法
Array.prototype.push = function(){
    // 把push方法的参数添加到splice方法的第三个参数中
    this.splice.apply(this, [this.length, 0].concat(Array.prototype.slice.apply(arguments)));
    return this.length;
};

// array.reverse()方法，反转数组中元素的顺序。
var a = [1, 2, 3];
var b = a.reverse(); // [3, 2, 1]

// array.shift()方法，移出数组中的第一个元素，如果数组为空，则该方法返回undefined。
// shift方法通常比pop方法慢得多
var a = [1, 2, 3];
var b = a.shift(); // 1
console.log(a); // [2, 3]

// 实现shift方法
Array.prototype.shift = function(){
    return this.splice(0, 1)[0];
};

// array.slice(startIndex, endIndex)方法，截取数组
var a = [1, 2, 3];
console.log(a.slice(0, 1)); // [0]
console.log(a.slice(1)); // [2, 3]
console.log(a.slice(1, 3)); // [2, 3]

// array.sort(comparefn)方法,对数组进型排序
// 不传比较函数，默认的比较函数会把所有元素转化为字符串然后再进行比较
var a = [3, 1, 5, 23, 16, 8];
console.log(a.sort()); // [1, 16, 23, 3, 5, 8]

// 使用比较函数
var a = [3, 1, 8, 5, '4', 23, 16, 8];
var compareFun = function(a, b){
    return a - b;
};
console.log(a.sort(compareFun)); // [1, 3, "4", 5, 8, 8, 16, 23]

// array.splice(startIndex, delCount, insertItem)
var a = [1, 2, 3, 4, 5];
var b = a.splice(2, 1, 6, 6); // [3] ,返回被移除的元素数组
console.log(a); // [1, 2, 6, 6, 4, 5]

var a = [1, 2, 3, 4, 5];
var b = a.splice(2, 1, [6, 6]); // [3] ,返回被移除的元素数组
console.log(a); // [1, 2, [6, 6], 4, 5]

// array.unshift(item...)方法，把元素添加到数组的首部
var a = [1, 2, 3, 4];
var b = a.unshift(0); // 5，返回新数组的长度
console.log(a); // [0, 1, 2, 3, 4]

// 实现unshift()方法
Array.prototype.unshift = function(){
    this.splice.apply(this, [0, 0].concat(Array.prototype.slice.apply(arguments)));
    return this.length;
};
操作数组的方法都存放在Array.prototype原型对象中，其中，包括ES5和ES6新增的数组方法，如forEach,reduce,map,entries,every,some等方法。

2、Function
函数对象有两个比较常用的方法：apply和call方法。这个两个方法的区别是：前者的参数是以数组的形式传递，而后者这是单个单个的传递。
func.apply(thisArg, argArray)，该方法的第一个参数：将func方法放到thisArg作用域下执行，也就是说，将func方法的this指向thisArg，第二个参数（可选）：要传递给func方法的参数数组。func.call(thisArg, arg1, arg2, ...)。

// 利用apply方法实现bind方法
Function.prototype.bind = function(that){
    // 返回一个函数，调用这个函数就像它是that对象的方法一样
    var self = this;
    console.log('self: ', self);
    var slice = Array.prototype.slice;
    console.log('arguments: ', arguments);
    var args = slice.apply(arguments, [1]);
    return function(){
        return self.apply(that, args.concat(slice.apply(arguments, [0])));
    };
};

var test = function(){
    return this.value;
}.bind({value: 'Better'});
console.log(test()); // 'Better'
3、Number
Number对象提供了很多操作数字的方法。这些属性和方法存放在Number对象或者Number.prototype原型对象中。

// number.toExponential(fractionDigits)，该方法把number转换成一个指数形式的字符串。
console.log(Math.PI.toExponential()); // 3.141592653589793e+0
console.log(Math.PI.toExponential(0)); // 3e+0
console.log(Math.PI.toExponential(2)); // 3.14e+0

// number.toFixed(fractionDigits)，该方法把number转换成一个十进制形式的字符串。
console.log(Math.PI.toFixed()); // 3
console.log(Math.PI.toFixed(0)); // 3
console.log(Math.PI.toFixed(2)); // 3.14

// number.toPrecision(precision)，该方法把number转换成一个十进制形式的字符串，precision是有效数字的位数
console.log(Math.PI.toPrecision()); // 3.141592653589793
console.log(Math.PI.toPrecision(2)); // 3.1
console.log(Math.PI.toPrecision(4)); // 3.142

// number.toString(radix)，该方法把number转换成一个字符，radix表示进制基数
console.log(Math.PI.toString()); // 3.141592653589793
console.log(Math.PI.toString(2)); // 11.001001000011111101101010100010001000010110100011
console.log(Math.PI.toString(8)); // 3.1103755242102643
console.log(Math.PI.toString(16)); // 3.243f6a8885a3
4、Object

// object.hasOwnProperty(name)，该方法用来检查某个对象是否包含某个属性或者方法，
// 该方法不会检测原型链中的属性和方法
var obj1 = {member: true};
var obj2 = Object.create(obj1);
console.log(obj1.hasOwnProperty('member')); // true
console.log(obj2.hasOwnProperty('member')); // false
console.log(obj2.member); // true
5、RegExp

regexp.exec(string)方法是正则表达式中最强大（和最慢）的方法。如果它成功的匹配，它会返回一个数组。数组中下标为0的元素将包含正则表达式regexp匹配的子字符串。下标为1的元素是分组1捕获的文本，下标为2的元素是分组2捕获的文本，依次类推。如果匹配失败，则返回null。
regexp.test(string)方法是正则表达式中最简单（和最快）的方法。如果匹配成功，返回true，否则，返回false。不要对这个方法使用g标识。
// regexp.exec(string)，匹配邮箱
var regexpEmail = /^(\w+)@(\w+\.\w{2,4})$/;
var QQEmail = '924902324@qq.com';
var gmail = 'liaolongdong@gmail.com';
console.log(regexpEmail.exec(QQEmail));

// 0: "924902324@qq.com"
// 1: "924902324"
// 2: "qq.com"
// index: 0
// input: "liaolongdong@gmail.com"

console.log(regexpEmail.exec(gmail));

// 0: "liaolongdong@gmail.com"
// 1: "liaolongdong"
// 2: "gmail.com"
// index: 0
// input: "liaolongdong@gmail.com"

// regexp.test(string)
var a = /&.+;/.test('Better &amp; Beans'); // true

// 实现test方法
RegExp.prototype.test = function(string){
    return this.exec(string) !== null;
};
6、String
操作字符串的方法大多数都存放在String.prototype原型对象中

// string.charAt(pos)方法，返回string中pos位置的字符
var name = 'Better';
console.log(name.charAt(-1)); // ''
console.log(name.charAt(1)); // 'e'
console.log(name.charAt(8)); // ''

// 实现charAt方法
String.prototype.charAt = function(pos){
    return this.slice(pos, pos + 1);
};

// string.charCodeAt(pos)方法，返回string中pos位置处的字符的字符编码。
var name = 'Better';
console.log(name.charCodeAt(-1)); // NaN
console.log(name.charCodeAt(1)); // 101
console.log(name.charCodeAt(name.length)); // NaN

// string.concat(string...)方法，把字符串连接起来构造一个新字符串
// 这个方法比较少用，因为连接字符串使用+运算符更方便
var str = 'B'.concat('i', 'g'); // 'Big'

// string.indexOf(searchString, position)，在string中查找另一个字符串searchString
// 如果查找到，返回第一个匹配字符的位置，否则，返回-1
var name = 'Better';
console.log(name.indexOf('t')); // 2
console.log(name.indexOf('t', 3)); // 3
console.log(name.indexOf('Bet')); // 0
console.log(name.indexOf('BB')); // -1

// string.lastIndexOf(searchString, position)，该方法和indexOf方法类似
// 这个方法是从字符串末尾开始查找而不是从头开始查找
var name = 'Better';
console.log(name.lastIndexOf('t')); // 3
console.log(name.lastIndexOf('t', 2)); // 2
console.log(name.lastIndexOf('BB')); // -1

// string.localeCompare(that)，该方法用于比较两个字符串。
console.log('a'.charCodeAt(0)); // 97
console.log('A'.charCodeAt(0)); // 65
console.log('a'.localeCompare('A')); // -1
console.log('A'.localeCompare('a')); // 1
console.log('a'.localeCompare('a')); // 0
console.log('aa'.localeCompare('a')); // 1

var m = ['AAA', 'A', 'aa', 'a', 'Aa', 'aaa'];
m.sort(function(a, b){
    return a.localeCompare(b);
});
console.log(m); // ["a", "A", "aa", "Aa", "aaa", "AAA"]

// string.match(regexp)，如果没有g标识符，和使用regexp.exec(string)的结果相同
// 如果regexp带有g标识符，那么它返回一个包含除捕获分组之外的所有匹配数组
var text = '<html><body class="center"><p>' +
            'This is <b>bold</b>!</p></body></html>';
var tagsReg = /[^<>]+|<(\/?)([A-Za-z]+)([^<>]*)>/g;
var a, i;
a = text.match(tagsReg);
for(i = 0, len = a.length; i < len; i ++){
    console.log('[' + i + '] ' + a[i]);
}
// 结果：
// [0] <html>
// [1] <body class="center">
// [2] <p>
// [3] This is 
// [4] <b>
// [5] bold
// [6] </b>
// [7] !
// [8] </p>
// [9] </body>
// [10] </html>

// string.replace(searchValue, replaceValue)
//该方法对string进行查找和替换操作，然后返回一个新的字符串。
// searchValue可以是字符串或者正则表达式，如果为字符串，只会替换第一个匹配
var string = 'fall_in_love_with';
console.log(string.replace('_', '-')); // fall-in_love_with

// 如果searchValue是一个正则表达式而且带有g标识符，那它将替换所有匹配
// 如果没有带g标识符，那么它仅替换第一个匹配的位置。
var string = 'fall_in_love_with';
console.log(string.replace(/_/g, '-')); // fall-in-love-with
console.log(string.replace(/_/, '-')); // fall-in_love_with

var oldareacode = /\((\d{3})\)/g;
console.log('(555)666-1212'.replace(oldareacode, '$1-')); // 555-666-1212

// 如果replaceValue是一个函数，此方法将对每个匹配依次调用，
// 并且该函数返回的字符串被用作替换文本。传递给这个函数的第一个参数是整个被匹配的文本。
// 第二个参数是分组1捕获的文本，下一个参数是分组2捕获的文本，依次类推
String.prototype.entityify = (function(){
    var character = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;'
    };
    return function(){
        return this.replace(/[<>&"]/g, function(c){
            return character[c];
        });
    }
}()); // 这里使用立即执行函数
console.log('<&>'.entityify()); // &lt;&amp;&gt;

// string.search(regexp)，该方法和indexOf类似，
//区别是该方法只能接受一个正则表达式作为参数而不是字符串
var strSay = 'I fell in love with you at first sight !';
console.log(strSay.search(/love/)); // 10
console.log(strSay.search(/hate/)); // -1

// string.slice(start, end)，截取字符串
var strSay = 'I fell in love with you at first sight !';
console.log(strSay.slice(2, 23)); // fell in love with you
console.log(strSay.slice(24)); // at first sigth
console.log(strSay.slice(-7)); // sigth !

// string.split(separator, limit)，该方法把字符串分割成一个字符串数组。
// separator参数可以是字符串也可以是正则表达式
// limit参数可选，该参数用来限制被分割的片段数量
var digits = '0123456789';
console.log(digits.split('')); // ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
console.log(digits.split('', 6)); // ["0", "1", "2", "3", "4", "5"]

var ip = '192.168.1.0';
var str = '|a|b|c|';
console.log(ip.split('.')); // ["192", "168", "1", "0"]
console.log(str.split('|')); // ["", "a", "b", "c", ""]

var text = 'first, middle  , last';
console.log(text.split(/\s*,\s*/)); // ["first", "middle", "last"]

// PS：来自分组捕获的文本将会被包含在被分割的数组中
var text = 'first, middle  , last';
console.log(text.split(/\s*(,)\s*/)); // ["first", ",", "middle", ",", "last"]

// string.substring(start, end)，该方法和slice方法一样，只是它不能处理负数参数，我们平时可以使用slice替代它

// string.toLocaleLowerCase()和string.toLowerCase()，把字符串的字母转换成小写
console.log('ABCabc'.toLocaleLowerCase()); // 'abcabc'
console.log('ABCabc'.toLowerCase()); // 'abcabc'

// string.toLocaleUpperCase()和string.toUpperCase()，把字符串的字母转换成大写
console.log('ABCabc'.toLocaleUpperCase()); // 'ABCABC'
console.log('ABCabc'.toUpperCase()); // 'ABCABC'

// String.fromCharCode(char...)
console.log(String.fromCharCode(67, 97, 116)); // 'Cat'
