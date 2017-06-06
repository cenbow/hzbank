define(function(require, exports, module){
	
	var CustomStorage = module.exports = function(){ 
		this.db = {};
	};
	
	_.extend(CustomStorage.prototype, {
		get: function(key){
            return this.db[key];
        },

		set: function(key, value){
            this.db[key] = value;
        },

		remove: function(key){
            var value = this.db[key];
            delete this.db[key];
            return value;
        },
        clear:function(){
            this.db={};
        }
	});
	
});
