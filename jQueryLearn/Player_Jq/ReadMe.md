###Jquery实践
试着用Jquery把之前写的播放器重写了一下，用JQuery语法替换了之前的一些js语句  
其中用到的Jquery知识：
+ Jquery是围绕Jquery对象使用的，$()是jQuery的构造函数
+ 基础语法`$(selector).action()`，选择符（selector）"查询"和"查找" HTML 元素,jQuery 的 action() 执行对元素的操作
+ jQuery选择器：基于已经存在的 CSS 选择器，除此之外，它还有一些自定义的选择器
+ jQuery事件:click,mousemove···
+ 注册jQuery事件：
  ```javascript
  //参数：事件名称，方法
  $().on("",function(){
    //函数内容  
  })
  ```
+ 操作DOM及CSS：
  ```javascript
  $().text;
  $().html;
  $().css(name)//获取css属性
  $().css(name,value)//修改属性
  ```
