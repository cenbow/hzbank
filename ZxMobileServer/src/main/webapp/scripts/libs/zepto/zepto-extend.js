// zepto -extend
/*
 * 提供 $.Deferredpromises API. 依赖"callbacks" 模块. 
 * 当包含这个模块时候, $.ajax() 支持promise接口链式的回调。
 * zepto-Deferred
 * 
 * 为"deferred"模块提供 $.Callbacks。  
 * zepto-callbacks
 * 
 * 实验性的支持 jQuery CSS 表达式 实用功能，比如 $('div:first')和 el.is(':visible')。
 * zepto-selector
 */


//zepto Deferred
;(function($){
  var slice = Array.prototype.slice

  function Deferred(func) {
    var tuples = [
          // action, add listener, listener list, final state
          [ "resolve", "done", $.Callbacks({once:1, memory:1}), "resolved" ],
          [ "reject", "fail", $.Callbacks({once:1, memory:1}), "rejected" ],
          [ "notify", "progress", $.Callbacks({memory:1}) ]
        ],
        state = "pending",
        promise = {
          state: function() {
            return state
          },
          always: function() {
            deferred.done(arguments).fail(arguments)
            return this
          },
          then: function(/* fnDone [, fnFailed [, fnProgress]] */) {
            var fns = arguments
            return Deferred(function(defer){
              $.each(tuples, function(i, tuple){
                var fn = $.isFunction(fns[i]) && fns[i]
                deferred[tuple[1]](function(){
                  var returned = fn && fn.apply(this, arguments)
                  if (returned && $.isFunction(returned.promise)) {
                    returned.promise()
                      .done(defer.resolve)
                      .fail(defer.reject)
                      .progress(defer.notify)
                  } else {
                    var context = this === promise ? defer.promise() : this,
                        values = fn ? [returned] : arguments
                    defer[tuple[0] + "With"](context, values)
                  }
                })
              })
              fns = null
            }).promise()
          },

          promise: function(obj) {
            return obj != null ? $.extend( obj, promise ) : promise
          }
        },
        deferred = {}

    $.each(tuples, function(i, tuple){
      var list = tuple[2],
          stateString = tuple[3]

      promise[tuple[1]] = list.add

      if (stateString) {
        list.add(function(){
          state = stateString
        }, tuples[i^1][2].disable, tuples[2][2].lock)
      }

      deferred[tuple[0]] = function(){
        deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments)
        return this
      }
      deferred[tuple[0] + "With"] = list.fireWith
    })

    promise.promise(deferred)
    if (func) func.call(deferred, deferred)
    return deferred
  }

  $.when = function(sub) {
    var resolveValues = slice.call(arguments),
        len = resolveValues.length,
        i = 0,
        remain = len !== 1 || (sub && $.isFunction(sub.promise)) ? len : 0,
        deferred = remain === 1 ? sub : Deferred(),
        progressValues, progressContexts, resolveContexts,
        updateFn = function(i, ctx, val){
          return function(value){
            ctx[i] = this
            val[i] = arguments.length > 1 ? slice.call(arguments) : value
            if (val === progressValues) {
              deferred.notifyWith(ctx, val)
            } else if (!(--remain)) {
              deferred.resolveWith(ctx, val)
            }
          }
        }

    if (len > 1) {
      progressValues = new Array(len)
      progressContexts = new Array(len)
      resolveContexts = new Array(len)
      for ( ; i < len; ++i ) {
        if (resolveValues[i] && $.isFunction(resolveValues[i].promise)) {
          resolveValues[i].promise()
            .done(updateFn(i, resolveContexts, resolveValues))
            .fail(deferred.reject)
            .progress(updateFn(i, progressContexts, progressValues))
        } else {
          --remain
        }
      }
    }
    if (!remain) deferred.resolveWith(resolveContexts, resolveValues)
    return deferred.promise()
  }

  $.Deferred = Deferred
})(Zepto)


//zepto CallBacks
;(function($){
	  // Create a collection of callbacks to be fired in a sequence, with configurable behaviour
	  // Option flags:
	  //   - once: Callbacks fired at most one time.
	  //   - memory: Remember the most recent context and arguments
	  //   - stopOnFalse: Cease iterating over callback list
	  //   - unique: Permit adding at most one instance of the same callback
	  $.Callbacks = function(options) {
	    options = $.extend({}, options)

	    var memory, // Last fire value (for non-forgettable lists)
	        fired,  // Flag to know if list was already fired
	        firing, // Flag to know if list is currently firing
	        firingStart, // First callback to fire (used internally by add and fireWith)
	        firingLength, // End of the loop when firing
	        firingIndex, // Index of currently firing callback (modified by remove if needed)
	        list = [], // Actual callback list
	        stack = !options.once && [], // Stack of fire calls for repeatable lists
	        fire = function(data) {
	          memory = options.memory && data
	          fired = true
	          firingIndex = firingStart || 0
	          firingStart = 0
	          firingLength = list.length
	          firing = true
	          for ( ; list && firingIndex < firingLength ; ++firingIndex ) {
	            if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
	              memory = false
	              break
	            }
	          }
	          firing = false
	          if (list) {
	            if (stack) stack.length && fire(stack.shift())
	            else if (memory) list.length = 0
	            else Callbacks.disable()
	          }
	        },

	        Callbacks = {
	          add: function() {
	            if (list) {
	              var start = list.length,
	                  add = function(args) {
	                    $.each(args, function(_, arg){
	                      if (typeof arg === "function") {
	                        if (!options.unique || !Callbacks.has(arg)) list.push(arg)
	                      }
	                      else if (arg && arg.length && typeof arg !== 'string') add(arg)
	                    })
	                  }
	              add(arguments)
	              if (firing) firingLength = list.length
	              else if (memory) {
	                firingStart = start
	                fire(memory)
	              }
	            }
	            return this
	          },
	          remove: function() {
	            if (list) {
	              $.each(arguments, function(_, arg){
	                var index
	                while ((index = $.inArray(arg, list, index)) > -1) {
	                  list.splice(index, 1)
	                  // Handle firing indexes
	                  if (firing) {
	                    if (index <= firingLength) --firingLength
	                    if (index <= firingIndex) --firingIndex
	                  }
	                }
	              })
	            }
	            return this
	          },
	          has: function(fn) {
	            return !!(list && (fn ? $.inArray(fn, list) > -1 : list.length))
	          },
	          empty: function() {
	            firingLength = list.length = 0
	            return this
	          },
	          disable: function() {
	            list = stack = memory = undefined
	            return this
	          },
	          disabled: function() {
	            return !list
	          },
	          lock: function() {
	            stack = undefined;
	            if (!memory) Callbacks.disable()
	            return this
	          },
	          locked: function() {
	            return !stack
	          },
	          fireWith: function(context, args) {
	            if (list && (!fired || stack)) {
	              args = args || []
	              args = [context, args.slice ? args.slice() : args]
	              if (firing) stack.push(args)
	              else fire(args)
	            }
	            return this
	          },
	          fire: function() {
	            return Callbacks.fireWith(this, arguments)
	          },
	          fired: function() {
	            return !!fired
	          }
	        }

	    return Callbacks
	  }
	})(Zepto)
	
	
//zepto selector
;(function($){
  var zepto = $.zepto, oldQsa = zepto.qsa, oldMatches = zepto.matches
  /*
  *  检察一个元素是否可见。除了要判断display是否是none之外，还判断了width和height是否是0，
  双叹号是强制转化成boolean类型
  */
  function visible(elem){
    elem = $(elem)
    return !!(elem.width() || elem.height()) && elem.css("display") !== "none"
  }

  // 实现的是jquey选择器扩展的一部分
  // http://api.jquery.com/category/selectors/jquery-selector-extensions/
  //
  // 每一个filter函数的参数都能接受当前值，所有考虑范围内的节点和括号中的值
  // this就是当前被考虑的node. 函数返回的是node(s), null 或者是undefined
  //
  // 复杂的选择器是不被支持的，比如下面的：
  //   li:has(label:contains("foo")) + li:has(label:contains("bar"))
  //   ul.inner:first > li
  var filters = $.expr[':'] = {
    visible:  function(){ if (visible(this)) return this },//可见
    hidden:   function(){ if (!visible(this)) return this },//不可见
    selected: function(){ if (this.selected) return this },//选中
    checked:  function(){ if (this.checked) return this },//勾选中
    parent:   function(){ return this.parentNode },//父节点
    first:    function(idx){ if (idx === 0) return this },//第一个元素
    last:     function(idx, nodes){ if (idx === nodes.length - 1) return this },//最后一个元素
    eq:       function(idx, _, value){ if (idx === value) return this },//相同的元素
    contains: function(idx, _, text){ if ($(this).text().indexOf(text) > -1) return this },//内容含有的元素
    has:      function(idx, _, sel){ if (zepto.qsa(this, sel).length) return this }//
  }

  var filterRe = new RegExp('(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*'),//一个强大的正则表达式用来分解选择器的的，见下面
      childRe  = /^\s*>/,
      classTag = 'Zepto' + (+new Date())

  function process(sel, fn) {//分解选择器为三部分，第一部分是选择器本身，第二部分是选择器的值filter中的函数名称，第三部分是参数
    //例如：（1）filterRe.exec(":eq(2)")
    //得到的结果：[":eq(2)", "", "eq", "2"]
    //（2）filterRe.exec(":visible")
    //得到的结果：[":visible", "", "visible", undefined]
    // quote the hash in `a[href^=#]` expression
    sel = sel.replace(/=#\]/g, '="#"]')
    var filter, arg, match = filterRe.exec(sel)
    if (match && match[2] in filters) {
      filter = filters[match[2]], arg = match[3]//filter为filters中对应的函数
      sel = match[1]
      if (arg) {
        var num = Number(arg)
        if (isNaN(num)) arg = arg.replace(/^["']|["']$/g, '')
        else arg = num
      }
    }
    return fn(sel, filter, arg)
  }

  zepto.qsa = function(node, selector) {
    return process(selector, function(sel, filter, arg){
      try {
        var taggedParent
        if (!sel && filter) sel = '*'
        else if (childRe.test(sel))
          // support "> *" child queries by tagging the parent node with a
          // unique class and prepending that classname onto the selector
          taggedParent = $(node).addClass(classTag), sel = '.'+classTag+' '+sel

        var nodes = oldQsa(node, sel)
      } catch(e) {
        console.error('error performing selector: %o', selector)
        throw e
      } finally {
        if (taggedParent) taggedParent.removeClass(classTag)
      }
      return !filter ? nodes :
        zepto.uniq($.map(nodes, function(n, i){ return filter.call(n, i, nodes, arg) }))
    })
  }

 //
 //selector和function(sel,filter,arg){}传到process中，
 //处理完后，运行function(sel,filter,arg){},其中sel是selector经过强大正则之后的第二块，filter是filters中对于的函数，arg是selector中的参数
  zepto.matches = function(node, selector){
    return process(selector, function(sel, filter, arg){
      return (!sel || oldMatches(node, sel)) &&
        (!filter || filter.call(node, null, arg) === node)
    })
  }
})(Zepto)


	