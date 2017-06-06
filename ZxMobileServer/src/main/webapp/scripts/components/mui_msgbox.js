define(['zepto'],function(){
	var TAG = "MUI.MsgBox";
	MUI.log(TAG,"----start----");
	var box = MUI.MsgBox ={
			_forbidLayerId : "backMsgDiv",
			_contentLayerId : "contentMsgDiv",
			_creatCnt : 0,
			_tplMsgBox : null,
			hideDialog : null,
		    showDialog : null,
			init : function() {
				box._tplMsgBox = [//
				'<div class="js-dialog-content ui-alert">',//
				'  <div class="ui-alert-header"><h3 class="ui-alert-title">{{title}}</h3></div>',//
				'  <div class="ui-alert-body" role="note">',//
				'	 <p>{{msg}}</p>',//
				'  </div>',//
				'  <div class="ui-alert-footer">',//
				'	   <a role="button" class="ui-alert-button" id="msg_box_ok">{{okName}}</button>',//
				'	 {{if cancleAct}}',//
				'	   <a role="button" class="ui-alert-button" id="msg_box_cancle">{{cancleName}}</button>',//
				'	 {{/if}}',//
				'  </div>',//
				'</div>' ].join("");
				MUI.log(TAG,"----init----");
			},
			// 弹出窗口
			alertinfo : function(msg, title, okAct) {
				MUI.log(TAG,"----alertinfo----");
				MUI.MsgBox.openMsgBox(msg, title, okAct || MUI.MsgBox.hideMsgBox);
			},
			//确认框
			confirm : function(msg, title, okAct, cancleAct,okName,cancleName) {
				MUI.log(TAG,"----confirm----");
				MUI.MsgBox.openMsgBox(msg, title, okAct, cancleAct
						|| MUI.MsgBox.hideMsgBox,okName,cancleName);
			},
			openMsgBox : function(msg, title, okAct, cancleAct,okName,cancleName) {
				MUI.log(TAG,"----openMsgBox----");
				if (this._creatCnt) {
					return;
				}
				this._creatCnt++;
				var layer = $("<div></div>");
				layer.attr('id',this._contentLayerId);
				this._lastLayer = layer.appendTo('body');
				layer = $(layer).css('display','block').addClass("ui-dialog");
				var tpl = box._tplMsgBox;
				var hasCancle=MUI.isDefined(cancleAct);
				MUI.log(TAG,"----openMsgBox cancle----" + hasCancle);
				var html = MUI.templet(tpl, {
					title : title || '提示',
					msg : msg || '',
					cancleAct : hasCancle,
					okName:okName || "确认",
					cancleName:cancleName || "取消"
				});
				layer.append(html);

				$('html').addClass('js-effect-from-below');
				
				this.hideDialog && clearTimeout(this.hideDialog);
				layer.one($.support.transition.end,function(){
				})
				showDialog = setTimeout(function(){
					layer.addClass('js-show');
				},30);

				//确定
				$("#msg_box_ok").on("click", function() {
					MUI.log(TAG,"----msg_box_ok----");
					okAct && okAct(layer);
				}); 

				if (hasCancle) {
					$("#msg_box_cancle").on("click", function() {
						MUI.log(TAG,"----msg_box_cancle----");
						cancleAct && cancleAct(layer);
					});
				}
			},
			hideMsgBox : function() {
				MUI.log(TAG,"----hideMsgBox----" + box._creatCnt);
				this.showDialog && clearTimeout(this.showDialog);
			    $('.ui-dialog').removeClass('js-show');
				if (box._creatCnt-- <= 0) {
					box._creatCnt = Math.max(box._creatCnt, 0);
					return;
				}
				try {
					box.closeMsgBoxForbider();
					hideDialog = setTimeout(function(){
						$('html').removeClass('js-effect-from-below');		
						box.removeDivId(box._contentLayerId);
					},300);
				} catch (e) {
					MUI.log(TAG,"----hideMsgPanel error----");
				}
			},
			removeDivId : function(divId) {
				var handle = document.getElementById(divId);
				if (handle) {
					handle.parentNode.removeChild(handle);
				}
			},
			closeMsgBoxForbider : function(divId) {
				divId = divId ? divId : this._forbidLayerId;
				this.removeDivId(divId);
			}
					
	};
	box.init();
	MUI.log(TAG,"----end----");
	return MUI;
});