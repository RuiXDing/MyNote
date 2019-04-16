/*js对象的表示
对象是JavaScript的一种数据类型，是引用数据类型
    是一组组键值对的集合。
    在oop的思想下，对象是某种事物的抽象，是封装了属性和方法的一个容器。
*/
//一、键值对
//对象的所有键名都是字符串（ES6 又引入了 Symbol 值也可以作为键名），所以加不加引号都可以
//“键值”可以是任何数据类型
//如果键名是数字，会被转换成字符串
//键值对之间用逗号隔开，最后一个键值对后逗号加不加无所谓
var obj={
    name:"Hello",
    1:"test",
    //如果键名不符合标识名的条件（比如第一个字符为数字，或者含有空格或运算符），且也不是纯数字，则必须加上引号，否则会报错。
    //1name：test,        //报错
    '1p': 'Hello World',  //不报错
    fun:function() {
        console.log("这是obj的属性fun的值，是一个方法哦!");
    }
};
//console.log(obj.1);  //此处会报错 键名为数字时不可以用 . 来获取属性，会被当成小数点。

//动态创建对象的属性
obj.size=4;

//两种读取属性的方式
console.log(obj.name);
console.log(obj['name']);
console.log(obj[1]);   
obj.fun();
console.log(obj.size);

/*
上述是一个对象，下面是多个对象之间的关系
 */
//链式引用 属性的值还是一个对象
var obj2={
    pre:obj
};
console.log(obj2.pre.size); //4
//不同的变量名指向同一个对象，那么它们都是这个对象的引用(object毕竟是引用数据类型嘛,这里和java是一样的)
//修改其中一个变量，会影响到其他所有变量,但是如果取消某一个变量对于原对象的引用，不会影响到另一个变量
var obj_1=obj;
var obj_2=obj;
obj_1.size=2;      //为属性赋值
console.log(obj_2.size); //2
obj_1={
};
console.log(obj_2.size); //2

/**
 * 属性的其他操作
 */
//属性的查找
console.log(Object.keys(obj)); //Array(5) ["1", "name", "1p", "fun", "size"] //Object.keys()是Object自身的方法，也称静态方法
//删除
//只有一种情况，delete命令会返回false，那就是该属性存在，且不得删除。
//删除后，再读取1p属性就会返回undefined，而且Object.keys方法的返回值也不再包括该属性。
//delete命令只能删除对象本身的属性，无法删除继承的属性,但是执行删除仍然会返回true
delete obj["1p"];  
//判断是否为对象的属性
//1.in    不能识别哪些属性是对象自身的，哪些属性是继承
console.log("1" in obj);       //true
console.log('toString' in obj) //true
//2.hasOwnProperty
console.log(obj.hasOwnProperty("toString")) //false
console.log(typeof(obj));
console.log(obj.toString()); //[object Object]
//遍历
//for...in循环有两个使用注意点。
//它遍历的是对象所有可遍历（enumerable）的属性，会跳过不可遍历的属性。 
//它不仅遍历对象自身的属性，还遍历继承的属性。
for (var p in obj) {
    console.log(p);     //name fun size  不可遍历的属性被跳过了
}
//操作同一个对象的多个属性
/**
 * with(对象){
 * 语句
 * }
 *但是因为with区块没有改变作用域，它的内部依然是当前作用域
 *所以如果with区块内部有变量的赋值操作，必须是当前对象已经存在的属性，否则会创造一个当前作用域的全局变量。
 *所以这个东西不建议使用（忘了它吧233）
 * /
/**
 * 二、OOP
 * JavaScript 语言的对象体系，不是基于“类”的，而是基于构造函数（constructor）和原型链（prototype）
 */
//1.构造函数  (其实声明的写法上就是个普通函数，js的函数式编程是源自c语言的，区别在于内部用到this)
var Animal=function(){
    'use strict';
    this.name="animal";  //这里反而必须用等号了 emm，之前的键值对表示还必须用冒号嘞
}
//2.new
//new相当于是对构造函数的执行，并返回一个由构造函数指定类型的对象
//(好吧，并不是这么简单的相当于)
//使用new命令时，它后面的函数依次执行下面的步骤。
// 创建一个空对象，作为将要返回的对象实例。
// 将这个空对象的原型，指向构造函数的prototype属性。
// 将这个空对象赋值给函数内部的this关键字。
// 开始执行构造函数内部的代码。
//所以不new就相当于单纯的执行了那个方法里的内容
//为避免漏掉new，使用use strict命令保证了该函数在严格模式下运行
//在严格模式下，函数内部的this不能指向全局对象，默认等于undefined，导致不加new调用会报错
var animal_obj=new Animal(); //类似于 var animal_obj={name:"animal"};
// var objX=new Object(1);
// console.log(Object.getOwnPropertyNames(objX));
//题外话
//属性描述对象（越学需要学的越多555）
var arr=[1,2]; //虽然数组也是对象，可以用new的，不过因为new穿的参数不同会引发其他结果，所以还是这样好些
console.log(Object.getOwnPropertyNames(arr));//["0", "1", "length"]返回所有属性
console.log(Object.keys(arr));               //["0", "1"]  返回所有可见属性

//3.在没有构造函数的情况下，已一个现有的对象为模板构造新对象
//Object.create();
var student1={
    name:"xxx",
    age:12
}
var student2=Object.create(student1);
console.log(student2.name); //xxx

//4.this
//使用一个变量固定this的值，然后内层函数调用这个变量，是非常常见的做法，请务必掌握。
//this的指向是动态的，取决于当前的运行环境
//事实上，正是由于需要获取当前运行环境，才诞生了this

/**
 * 5.原型链
*两个基本观点：函数是第一公民，地位与基本数据类型一样。
*             一切都是对象(Object)
* 所以，函数也是对象
*/
//上面写了一个Animal构造函数
console.log(Animal instanceof Object);//true
/**
 * 为了更好的理解，把对象分为一般对象和函数对象
 * 每一个函数在声明时都会自带一个原型对象，这个原型对象是函数的prototype属性指向的内容
 */
console.log(Animal.prototype); //Object {constructor: }
/**
 * 显然，这个原型对象有一个可见的属性constructor
 * 那，它有何用？作为一个普通函数，这个原型对象没用，但是当它是构造函数时就不一样了
 * 当它是构造函数时，这个原型对象就相当于是所有通过构造函数构造的对象的公共区域
 * 原型对象的属性也会copy给实例对象
 */
//constructor指向构造函数
console.log(Animal.prototype.constructor); //function(){ … }
var animal1=new Animal();
Animal.prototype.protoName="这是原型对象的名字";
console.log(animal1.protoName);    //这是原型对象的名字
console.log(animal1.constructor);  //function(){ … }
/**
 * 原型对象有了，原型链又是啥？
 * 事实上，每一个对象都有一个__proto__属性，它指向生成该对象的构造函数的原型对象
 * 不过需要注意的是，__proto__属性并非标准中的实现，只是浏览器中实现了这个语法
 * 实际应用中尽量不要使用
 * 例如，animal1的__proto__就是Animal.prototype
 */
console.log(animal1.__proto__===Animal.prototype);//true
/**
 * 既然每个对象都有__proto__属性，那么原型对象也有呀，这就以__proto__为联系形成了一条链状结构
 * 那么链的尽头呢
 */
var myObject=new Object();
//输出Object的实例对象myObject的原型，即Object的原型对象
console.log(myObject.__proto__);//Object {constructor: , __defineGetter__: , __defineSetter__: , hasOwnProperty: , __lookupGetter__: , …}
console.log(animal1.__proto__.__proto__);//Object {constructor: , __defineGetter__: , __defineSetter__: , hasOwnProperty: , __lookupGetter__: , …}
/**
 * animal1的原型的原型是Object的原型
 * 即Animal函数的原型对象的原型是Object的原型,所以说Animal继承自Object
 * 但是Animal并没有显示的继承，所以默认的对象都继承自Object
 */
console.log(animal1.__proto__.__proto__.__proto__);//null，链的尽头是null
/**
 * 6.继承
 * 上面已经提及，默认的对象都继承自Object，现在让它继承自别的
 */
//构造函数
function Dog(){
   Animal.call(this); //调用父类的构造函数
}
Dog.prototype=Object.create(Animal.prototype); //子类的原型指向以父类的原型对象为蓝本创建的对象
Dog.prototype.constructor=Dog;                 //修改constructor使得Dog.prototype真正成为Dog的原型对象
//这样就相当于在原型链上添加了Dog

/**
 * 7.class
 * 是es6的新特性，也算是oop的部分，一块学吧
 * class写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已
 * 本质仍是原型，类的数据类型就是函数，类本身就指向构造函数，
 * 类的所有方法都定义在类的prototype属性上面。
 */