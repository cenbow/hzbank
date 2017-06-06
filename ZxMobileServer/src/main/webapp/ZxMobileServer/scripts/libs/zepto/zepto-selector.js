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