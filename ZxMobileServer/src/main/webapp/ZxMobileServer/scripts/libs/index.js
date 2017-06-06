//lib 下主引入包
define(function (require, exports, module) {
	
	//require-text 引入文本
    require("text");

    require("zepto");
    
    //zepto 扩展
    require("zepto-extend");
    
    //backbone深度依赖
    require("underscore");
    
    //暴露全局对像Backbone
    require("backbone");
    
    //Marionette
    require("marionette");
    
    require("../mui/mui");
    
    require("./fastclick/fastclick");
    
    /*require("./Hammer/hammer.min.js");*/
    
    require("cssJs");

});