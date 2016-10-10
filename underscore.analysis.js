//underscore.js 1.8.3源码解读
(function(){

//基本设置，配置

//将this 赋值给局部变量root
var root = this;
//将原来全局环境中的变量 '_' 赋值给变量previousUnderscore 进行缓存
//在后面的 noConflict 方法中有用到

var previousUnderscore = root._;

//缓存变量，便于压缩代码 此压缩为压缩到min.js版本 而不是gzip压缩

var ArrayProto = Array.prototype,ObjProto = Object.prototype, FuncProto = Function.prototype;

//缓存变量，便于压缩代码 同时可以减少在原型链中的查找次数(提高代码效率)

var 
   push = ArrayProto.push,
   slice = ArrayProto.slice,
   toString = ObjProto.toString,
   hasOwnProperty = ObjProto.hasOwnProperty;

//ES5原生方法，如果浏览器支持，则 underscore 中会优先使用

var 
   nativeIsArray = Array.isArray,
   nativeKeys    = Object.keys,
   nativeBind    = FuncProto.bind,
   nativeCreate  = Object.create;

var Ctor = function(){};

//核心函数
// '_' 其实是一个构造函数
//支持无 new 调用的构造函数
//讲传入的参数(实际要操作的数据) 赋值给 this._wrapped属性

var _ = function(obj){
 //以下均正对OOP形式的调用
 //如果是非OOP形式的调用，不会进入该函数内部
 //如果 obj 已经是 '_' 函数的实例 ，则直接返回 obj
 if(obj instanceof _) return obj;

 //如果不是 '_' 函数的实例
 //则调用 new 运算符，返回实例化的对象
 if(!(this instanceof _)) return new _(obj);

 //将 obj 赋值给this._wrapped 属性
 this._wrapped = obj;

};    


}.call(this));