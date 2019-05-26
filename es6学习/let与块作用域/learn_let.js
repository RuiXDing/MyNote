/**
 * es6前只有全局作用域和函数作用域，es6引入块级作用域
 * var定义的变量是全局变量，同时也是window对象的变量，
 * 它存在变量提升（即不论变量在哪里声明，都会提到程序一开始）
 * 
 * 新的变量声明关键字let和const不存在变量提升
 * 虽然不存在变量提升了，但是仍然会去找这个变量，即 暂时性死区（TDZ）
 * 准确的说：当程序的控制流程在新的作用域（module function 或 block 作用域）进行实例化时
 *          在此作用域中用let/const声明的变量会先在作用域中被创建出来，但因此时还未进行词法绑定，
 *          所以是不能被访问的，如果访问就会抛出错误
 * 也就是说，这个变量在声明之前都是不可用的，
 * 而var声明的变量由于变量提升，在声明前使用是当做undefined处理的
*/
// let a=2;
// //立即执行函数
// (function(){
//    let a=1;
//    console.log(a);
// })();

//console.log(arg);
//var arg=3;
console.log (typeof(arg));//undefined此处体现了var的变量提升
var arg=3;
console.log (typeof(arg));//number
if(true)
{
   //console.log(arg);//报错暂时性死区，注释掉这句程序才能正常运行
   let arg;
   console.log(arg);//undefined
   arg=2;
   console.log(arg);//2
   
}
/**在大括号不存在的情况下，相当于不存在块级作用域 */
`use strict`
let test=0;
if(true){
   //大括号的内块作用域
   console.log(test);//0
}

/**const只能保证该变量所指向的地址保持不变，地址内的东西可以改变
 * 不过，对于基本数据类型，地址内的东西就是数据本身
 * 而引用数据类型就不是了，如果真的想将对象冻结，应该使用Object.freeze方法。
 */



