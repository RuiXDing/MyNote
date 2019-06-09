/**
 * 闭包与作用域相关
 * Javascript语言特有的"链式作用域"结构（chain scope）
 * 子对象会一级一级地向上寻找所有父对象的变量。所以，父对象的所有变量，对子对象都是可见的，反之则不成立。
 */

///函数内部声明变量的时候，一定要使用var命令。如果不用的话，你实际上声明了一个全局变量！
//在函数的内部再定义一个函数，可以使内部函数访问到外部函数的局部变量

function out() {
    var n = 0;
    function inner() {
        n++;
        alert(n);
    }
    return inner();
}

var m = out(); //1

//在本质上，闭包就是将函数内部和函数外部连接起来的一座桥梁

// var name = "The Window";

// var object = {
//     name: "My Object",

//     getNameFunc: function () {
//         return function () {
//             return this.name;
//         };
//     }
// };

// alert(object.getNameFunc());   //function () {return this.name;};
// alert(object.getNameFunc()()); //The.window

var name = "The Window";

　　var object = {
　　　　name : "My Object",

　　　　getNameFunc : function(){
　　　　　　var that = this;
　　　　　　return function(){
　　　　　　　　return that.name;
　　　　　　};

　　　　}

　　};

　alert(object.getNameFunc()()); //My Object

/** 
 * 可以使用闭包来模拟私有方法
 * 私有方法不仅仅有利于限制对代码的访问：还提供了管理全局命名空间的强大能力，避免非核心的方法弄乱了代码的公共接口部分。
 * 
 * 模块模式（module pattern）
*/