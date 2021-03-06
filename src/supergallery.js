(function($){
	var Supergallery = function(target,_o){
		_o = _o || {};
		this.o = {
			selectors:{
				main:'.main',					//メイン画像が入っている要素のセレクタ
				thumb:'.thumb',					//サムネイルが入っている要素のセレクタ
				nextBtn:'.nextBtn',				//「次へ」ボタン用のセレクタ
				prevBtn:'.prevBtn',				//「前へ」ボタン用のセレクタ
				indicator:'.indicator'			//ページインジケーター用のセレクタ
			},
			animation:{
				type:'fade',					//画像の切替アニメーションの種類 (fade:クロスフェード slide:スライド)
				duration:400,					//画像の切替アニメーションのかかる時間
				easing:'swing'					//画像の切替のイージング（プラグイン等で拡張したものも扱えます。）
			},
			timer:{
				enable:true,					//自動めくり機能を有効にする
				interval:3000,					//自動めくりの間隔
				stopOnHover:true				//マウスオーバー時にタイマーを止める
			},
			nav:{
				autoHideNaviBtn:true,
				duration:400,
				easing:'swing',
				hiddenClassName:'hidden'
			},
			other:{
				initialSelect:0,				//一番はじめに選択しておく要素のインデックス
				selectedClassName:'selected',	//選択されている時につけておくサムネイル・ページインジケーター用のクラス
				loop:true,						//最後の要素まで行ったら最初に戻るかどうか
				disablePageChangeStartEvent:false,
				disablePageChangeEndEvent:false,
				disableCss3Transition:false,
				changePageEvent:'click'
			}
		};
		$.extend(true,this.o,_o);
		this.$target = $(target);
		this.$main = this.$target.find(this.o.selectors.main);
		this.$mainChildren = this.$main.children();
		this.$thumb = this.$target.find(this.o.selectors.thumb);
		this.$thumbChildren = this.$thumb.children();
		this.$indicator = this.$target.find(this.o.selectors.indicator);
		this.$indicatorChildren = this.$indicator.children();
		this.$nextBtn = this.$target.find(this.o.selectors.nextBtn);
		this.$prevBtn = this.$target.find(this.o.selectors.prevBtn);
		this.current = null;
		this.target = null;
		this.timerId = null;
		this.num = this.$mainChildren.length;
		this.length = this.num;
		this.canUseCss3Transition = (function(){
			var body = document.body || document.documentElement,bodyStyle = body.style;
			return bodyStyle.WebkitTransition !== undefined || bodyStyle.MozTransition !== undefined || bodyStyle.OTransition !== undefined || bodyStyle.transition !== undefined;
		})();
		this.isAnimate = false;
		this.init();
	};

	Supergallery.prototype.init = function(){
		var sg = this,
			clickEvent = ('ontouchend' in window) ? 'touchend' : 'click',
			thumbClickEvent = (clickEvent !== 'touchend') ?  sg.o.other.changePageEvent : clickEvent;

		if(!sg.$main.length){
			throw 'mainの数が0個です。セレクタが間違っているかもしれません。 this.o.selectors.main : ' + sg.o.selectors.main;
		}
		if(!this.$mainChildren.length){
			throw 'mainの中に何もありません！';
		}

		sg.$main
			.css({
				position:'relative',
				overflow:'hidden'
			});
		sg.$mainChildren
			.css({
				position:'absolute'
			})
			.eq(sg.o.other.initialSelect)
				.css({display:'block'})
			.end()
			.not(':eq(' +sg.o.other.initialSelect+ ')')
				.css({display:'none'});
		if(sg.canUseCss3Transition && !sg.o.other.disableCss3Transition){
			if(sg.o.animation.type === 'fade'){
				sg.$mainChildren
					.css({
						opacity:0
					});
			}
			if(sg.o.animation.easing === 'swing'){
				sg.o.animation.easing = 'in-out';
			}
		}


		if(sg.$thumbChildren.length){
			sg.$thumbChildren
				.each(function(n){
					$(this)
						.on(thumbClickEvent,function(){
							if(sg.isAnimate){ return false; }
							sg.changeTo(n);
						});
				});
		}
		if(sg.$indicatorChildren.length){
			sg.$indicatorChildren
				.each(function(n){
					$(this)
						.on(clickEvent,function(){
							if(sg.isAnimate){ return false; }
							sg.changeTo(n);
						});
				});
		}
		if(sg.$nextBtn.length){
			sg.$nextBtn.on(clickEvent,function(){
				if(sg.isAnimate){ return false; }
				var target = sg.current + 1;
				if(target < sg.num){
					sg.changeTo(target);
				}else{
					if(sg.o.other.loop){
						sg.changeTo(0);
					}
				}
			});
		}
		if(sg.$prevBtn.length){
			sg.$prevBtn.on(clickEvent,function(){
				if(sg.isAnimate){ return false; }
				var target = sg.current - 1;
				if(target >= 0){
					sg.changeTo(target);
				}else{
					if(sg.o.other.loop){
						sg.changeTo(sg.num - 1);
					}
				}
			});
		}

		if(sg.o.timer.enable && sg.o.timer.interval){
			sg.setTimer();
		}
		if(sg.o.timer.enable && sg.o.timer.interval && sg.o.timer.stopOnHover){
			sg.$target
				.on('mouseover',function(){
					sg.clearTimer();
				})
				.on('mouseout',function(){
					sg.setTimer();
				});
		}
		sg.changeTo(sg.o.other.initialSelect,true);
		sg.$target.data('supergallery',sg);
		return this;
	};
	Supergallery.prototype.changeTo = function(n,noAnimation){
		var sg = this;
		sg.isAnimate = true;
		if(n === 'next'){
			n = (sg.current + 1 < sg.length) ? sg.current + 1 : (sg.o.other.loop) ? 0 : sg.current;
		}else if(n === 'prev'){
			n = (sg.current - 1 >= 0) ? sg.current - 1 : (sg.o.other.loop) ? sg.length - 1 : sg.current;
		}
		if(n === sg.current){
			sg.isAnimate = false;
			return false;
		}
		sg.target = n;

		if(!sg.o.other.disablePageChangeStartEvent){
			sg.$target.trigger('pageChangeStart',n);
		}
		var duration = noAnimation ? 0 :sg.o.animation.duration;
		var oldNum = sg.current;
		var $_target = sg.$mainChildren.eq(n),$_oldTarget = sg.$mainChildren.eq(oldNum);
		var navDuration = noAnimation ? 0 : sg.o.nav.duration;
		var targetAnimationComplete = function(){
			sg.isAnimate = false;
			if(!sg.o.other.disablePageChangeEndEvent){
				sg.$target.trigger('pageChangeEnd',n);
			}
		};
		var oldTargetAnimationComplete;
		if(sg.o.animation.type === 'fade'){
			oldTargetAnimationComplete = function(){
				if(!sg.o.other.disablePageChangeEndEvent){
					$(this).css({display:'none'});
				}
			};
			if(sg.canUseCss3Transition && !sg.o.other.disableCss3Transition){
				$_target
					.stop(true,false)
					.css({
						display:'block'
					})
					.transition({
						opacity:1
					},duration,targetAnimationComplete);
				if(oldNum !== null){
					$_oldTarget
						.stop(true,false)
						.transition({
							opacity:0
						},duration,oldTargetAnimationComplete);
				}
			}else{
				$_target
					.stop(true,false)
					.fadeTo(duration,1,targetAnimationComplete);
				if(oldNum !== null){
					$_oldTarget
						.stop(true,false)
						.fadeTo(duration,0,oldTargetAnimationComplete);
				}
			}
		}else if(sg.o.animation.type === 'slide'){
			var startPos = $_target.outerWidth() * ((oldNum < n) ? 1 : -1);
			var endPos = $_oldTarget.outerWidth() * ((oldNum < n) ? -1 : 1);
			if(noAnimation){
				$_target
					.css({
						left:0,
						display:'block'
					});
				if(oldNum !== null){
					$_oldTarget
						.css({
							display:'none'
						});
				}

				sg.isAnimate = false;
				if(!sg.o.other.disablePageChangeEndEvent){
					sg.$target.trigger('pageChangeEnd',n);
				}
			}else{
				if(sg.canUseCss3Transition && !sg.o.other.disableCss3Transition){
					$_target
						.css({
							left:startPos,
							display:'block'
						})
						.stop(true,false)
						.transition({
							left:0
						},duration,sg.o.animation.easing);
					$_oldTarget
						.stop(true,false)
						.transition({
							left:endPos
						},duration,sg.o.animation.easing,targetAnimationComplete);
				}else{
					$_target
						.css({
							left:startPos,
							display:'block'
						})
						.stop(true,false)
						.animate({
							left:0
						},duration,sg.o.animation.easing);
					$_oldTarget
						.stop(true,false)
						.animate({
							left:endPos
						},duration,sg.o.animation.easing,targetAnimationComplete);
				}

			}
		}

		sg.$mainChildren
			.eq(n)
			.addClass(sg.o.other.selectedClassName)
				.end()
			.not(':eq('+ n +')')
				.removeClass(sg.o.other.selectedClassName);

		sg.$indicatorChildren
			.eq(n)
				.addClass(sg.o.other.selectedClassName)
			.end()
			.not(':eq('+ n +')')
				.removeClass(sg.o.other.selectedClassName);

		sg.$thumbChildren
			.eq(n)
				.addClass(sg.o.other.selectedClassName)
			.end()
			.not(':eq(' + n + ')')
				.removeClass(sg.o.other.selectedClassName);

		if(n <= 0){
			sg.$prevBtn
				.addClass(sg.o.nav.hiddenClassName);
		}else{
			sg.$prevBtn
				.removeClass(sg.o.nav.hiddenClassName);
		}
		if(n >= sg.length - 1){
			sg.$nextBtn
				.addClass(sg.o.nav.hiddenClassName);
		}else{
			sg.$nextBtn
				.removeClass(sg.o.nav.hiddenClassName);
		}

		if(sg.o.nav.autoHideNaviBtn && !sg.o.other.loop){
			if(n <= 0){
				sg.$prevBtn
					.stop(true,false)
					.fadeTo(navDuration,0,sg.o.nav.easing,function(){
						sg.$prevBtn
							.hide();
					});
			}else{
				sg.$prevBtn
					.stop(true,false)
					.fadeTo(navDuration,1);
			}
			if(n >= sg.length - 1){
				sg.$nextBtn
					.stop(true,false)
					.fadeTo(navDuration,0,sg.o.nav.easing,function(){
						sg.$nextBtn
							.hide();
					});
			}else{
				sg.$nextBtn
					.stop(true,false)
					.fadeTo(navDuration,1);
			}
		}

		sg.current = n;
	};

	Supergallery.prototype.setTimer = function(){
		var sg = this;
		if(sg.timerId){
			sg.clearTimer();
		}
		sg.timerId = setInterval(function(){
			var target = sg.current + 1;
			if(target < sg.num){
				sg.changeTo(target);
			}else{
				if(sg.o.other.loop){
					sg.changeTo(0);
				}else{
					sg.clearTimer();
				}
			}
		},sg.o.timer.interval);
	};

	Supergallery.prototype.clearTimer = function(){
		clearInterval(this.timerId);
	};

	Supergallery.prototype.destroy = function(removeStyles){
		var sg = this,clickEvent = ('ontouchend' in window) ? 'touchend' : 'click';
		removeStyles = removeStyles || false;
		sg.clearTimer();
		sg.$nextBtn
			.add(sg.$prevBtn)
			.add(sg.$indicatorChildren)
			.add(sg.$thumbChildren)
			.off(clickEvent);

		sg.$target
			.off('mouseover')
			.off('mouseout');

		sg.$target
			.find('.' + sg.o.other.selectedClassName)
				.removeClass(sg.o.other.selectedClassName);

		sg.$target
			.removeData('supergallery');

		if(removeStyles){
			sg.$main
				.add(sg.$mainChildren)
				.add(sg.$prevBtn)
				.add(sg.$nextBtn)
				.removeAttr('style');
		}
	};

	Supergallery.prototype.changeToNext = function(){
		var sg = this;
		if(sg.current + 1 < sg.length){
			sg.changeTo(sg.current + 1);
			return true;
		}else{
			return false;
		}
	};

	Supergallery.prototype.changeToPrev = function(){
		var sg = this;
		if(sg.current - 1 >= 0){
			sg.changeTo(sg.current - 1);
			return true;
		}else{
			return false;
		}
	};

	var core = {
		supergallery:function(targetSelector,_o){
			return new Supergallery(targetSelector,_o);
		},
		superThumbGallery:function(targetSelector,_o){
			_o = _o || {};
			var o = {
				selectors:{
					main:'.mainHolder',
					thumbPages:'.thumbHolder',
					thumbBtns:'.thumbBtn',
					selected:'selected'
				},
				timer:{
					enable:true,
					interval:3000,
					stopOnHover:true
				},
				thumbNum:5,
				main:{
					selectors:{
						thumb:''
					},
					timer:{
						enable:false
					}
				},
				thumb:{
					selectors:{
						main:'.thumbPages',
						thumb:'',
						nextBtn:'',
						prevBtn:''
					},
					animation:{
						type:'slide'
					},
					timer:{
						enable:false
					}
				}
			};
			$.extend(true,o,_o);
			$.extend(true,o.main.timer,o.timer);

			o.main.selectors.thumb = '';
			o.thumb.selectors.thumb = '';
			o.thumb.selectors.nextBtn = '';
			o.thumb.selectors.prevBtn = '';
			o.thumb.selectors.indicator = '';

			var mainSelector = [targetSelector,o.selectors.main].join(' ');
			var thumbPagesSlector = [targetSelector,o.selectors.thumbPages].join(' ');
			var main = $.supergallery(mainSelector,o.main);
			var thumbPages = $.supergallery(thumbPagesSlector,o.thumb);
			var $_thumbBtns = $([targetSelector,o.selectors.thumbPages,o.thumb.selectors.main,o.selectors.thumbBtns].join(' '));

			$(mainSelector)
				.on('pageChangeStart',function(e,num){
					thumbPages.changeTo(parseInt(num / o.thumbNum,10));
					$_thumbBtns
						.eq(num)
							.addClass(o.selectors.selected.replace('.',''))
						.end()
						.not(':eq('+ num +')')
							.removeClass(o.selectors.selected.replace('.',''));
				});

			if(o.timer.enable && o.timer.interval && o.timer.stopOnHover){
				$(targetSelector)
					.hover(function(){
						main.clearTimer();
					},function(){
						main.setTimer();
					});
			}


			$_thumbBtns
				.each(function(n){
					$(this).click(function(){
						main.changeTo(n);
					});
				});
			return {
				main:main,
				thumbPages:thumbPages
			};
		}
	};

	var fn = {
		supergallery:function(_o){
			$(this)
				.each(function(){
					var sg = new Supergallery(this,_o);
					$(this).data('supergallery',sg);
				});
			return this;
		}
	};
	$.extend(core);
	$.fn.extend(fn);
})(jQuery);
