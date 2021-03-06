# jQuery Supergallery Plugin2
Version 1.4.0

Otto Kamiya (MegazalRock)  
mail : otto@mgzl.jp  
twitter : @megazal_rock  
facebook : facebook.com/megazalrock

## 更新履歴
* 1.4.3 changeToNext(), changeToPrev()関数を追加  
nextBtnとprevBtnのhiddenClass付与はloopを無視するように変更
* 1.4.0 クリック以外のイベントも利用できるように変更
* 1.3.4 bugfix
* 1.3.0 css3transitionを利用可能であれば利用するように変更
* 1.2.8 changeToにnextとprevを指定可能に
* 1.2.7 changePageイベントを発生させないオプションの追加
* 1.2.5 .destroy()の実装・README.mdの更新
* 1.2.4 Fixes #4 #5 #9
* 1.2.3 メイン画像にもselectedクラスを付与するように変更
* 1.2.0 ページインジケーター機能追加・Readme更新
* 1.1.1 bugfix
* 1.1.0 ページ切り替え付きサムネイルのためのヘルパーを追加
* 1.0.0	InitialRelease

## 概要
Web製作者向けのギャラリープラグインです。  
[デモ](http://mgzl.jp/jsg-demo/)

## 必要なライブラリ
[jQuery 1.8+](http://jquery.com/)
## 動作環境
Internet Explorer 8-10(Win)  
Chrome最新版
Firefox最新版
Safari最新版


## 使用するファイル
*	jquery-supergallery-plugin2.js
*	jquery-supergallery-plugin2.min.js

minがついているファイルはminify済みのファイルです。通常はこちらを利用して下さい。

## 使用方法

**目次**
*	[主な使用方法](#main)
	*	[サムネイルのページ切り替え機能**なし**の場合](#main_1)
	*	[サムネイルのページ切り替え機能**あり**の場合](#main_2)
*	[その他の使用方法](#sub)
	1. [外部からの操作](#sub_1)
	2. [イベント](#sub_2)
	3. [ページ切り替え付きサムネイルのヘルパー関数](#sub_3)

### <a name="main"></a>主な使用方法

#### <a name="main_1"></a>サムネイルのページ切り替え機能**なし**の場合

##### HTMLの記述例

	<div id="gallery" class="gallery">
		<ul class="main">
			<li><img src="http://lorempixel.com/g/300/300/city/1/" alt=""></li>
			<li><img src="http://lorempixel.com/g/300/300/city/2/" alt=""></li>
			<li><img src="http://lorempixel.com/g/300/300/city/3/" alt=""></li>
			<li><img src="http://lorempixel.com/g/300/300/city/4/" alt=""></li>
			<li><img src="http://lorempixel.com/g/300/300/city/5/" alt=""></li>
			<li><img src="http://lorempixel.com/g/300/300/city/6/" alt=""></li>
			<li><img src="http://lorempixel.com/g/300/300/city/7/" alt=""></li>
			<li><img src="http://lorempixel.com/g/300/300/city/8/" alt=""></li>
			<li><img src="http://lorempixel.com/g/300/300/city/9/" alt=""></li>
			<li><img src="http://lorempixel.com/g/300/300/city/10/" alt=""></li>
		</ul>
		<nav>
			<div class="prevBtn">PREV</div>
			<div class="nextBtn">NEXT</div>
		</nav>
		<ul class="indicator">
			<li>●</li>
			<li>●</li>
			<li>●</li>
			<li>●</li>
			<li>●</li>
			<li>●</li>
			<li>●</li>
			<li>●</li>
			<li>●</li>
			<li>●</li>
		</ul>
		<ul class="thumb">
			<li><img src="http://lorempixel.com/g/100/100/city/1/" alt=""></li>
			<li><img src="http://lorempixel.com/g/100/100/city/2/" alt=""></li>
			<li><img src="http://lorempixel.com/g/100/100/city/3/" alt=""></li>
			<li><img src="http://lorempixel.com/g/100/100/city/4/" alt=""></li>
			<li><img src="http://lorempixel.com/g/100/100/city/5/" alt=""></li>
			<li><img src="http://lorempixel.com/g/100/100/city/6/" alt=""></li>
			<li><img src="http://lorempixel.com/g/100/100/city/7/" alt=""></li>
			<li><img src="http://lorempixel.com/g/100/100/city/8/" alt=""></li>
			<li><img src="http://lorempixel.com/g/100/100/city/9/" alt=""></li>
			<li><img src="http://lorempixel.com/g/100/100/city/10/" alt=""></li>
		</ul>
	</div>

##### Javascriptの記述例

すべてデフォルトで動作させる場合は下記のように選択した要素で`supergallery()`を呼びます。

	$(function(){
		$('#gallery').supergallery();
	});

デフォルトの設定を変更する場合は、引数にオブジェクト形式で渡します。下記で設定されているものはデフォルトで設定されているものと同じです。

	$(function(){
		$('#gallery').supergallery({
			selectors:{
				main:'.main',							//メイン画像が入っている要素のセレクタ
				thumb:'.thumb',							//サムネイルが入っている要素のセレクタ
				nextBtn:'.nextBtn',						//「次へ」ボタン用のセレクタ
				prevBtn:'.prevBtn',						//「前へ」ボタン用のセレクタ
				indicator:'.indicator'					//ページインジケーター用のセレクタ
			},
			animation:{
				type:'fade',							//画像の切替アニメーションの種類 (fade:クロスフェード slide:スライド)
				duration:400,							//画像の切替アニメーションのかかる時間
				easing:'swing'							//画像の切替のイージング（プラグイン等で拡張したものも扱えます。）
			},
			timer:{
				enable:true,							//自動めくり機能を有効にする
				interval:3000,							//自動めくりの間隔
				stopOnHover:true						//マウスオーバー時にタイマーを止める
			},
			nav:{
				autoHideNaviBtn:true,					//最初・最後のページでprev・nextボタンを非表示にするかどうか
				duration:400,							//非表示にするアニメーションのかかる時間
				easing:'swing',							//非表示にするアニメーションのイージング
				hiddenClassName:'hidden'				//非表示にした際に付加するクラス名
			},
			other:{
				initialSelect:0,						//一番はじめに選択しておく要素のインデックス
				selectedClassName:'selected',			//選択時につけておくサムネイル・ページインジケーター用のクラス
				loop:true								//最後の要素まで行ったら最初に戻るかどうか
				disablePageChangeStartEvent:false,		//pageChangeStartEventを発生させない
				disablePageChangeEndEvent:false,		//disablePageChangeEndEventを発生させない
				disableCss3Transition:false,			//利用可能な場合でもcss3Transitionを利用しない
				changePageEvent:'click'					//pageChangeを発生させるイベント（'click'ならクリック 'mouseenter'でホバー）
			}
		});
	});

#### <a name="main_2"></a>サムネイルのページ切り替え機能**あり**の場合

##### HTMLの記述例

	<div id="gallery2" class="gallery">
		<div class="mainHolder">
			<ul class="main">
				<li><img src="http://lorempixel.com/g/300/300/city/1/" alt=""></li>
				<li><img src="http://lorempixel.com/g/300/300/city/2/" alt=""></li>
				<li><img src="http://lorempixel.com/g/300/300/city/3/" alt=""></li>
				<li><img src="http://lorempixel.com/g/300/300/city/4/" alt=""></li>
				<li><img src="http://lorempixel.com/g/300/300/city/5/" alt=""></li>
				<li><img src="http://lorempixel.com/g/300/300/city/6/" alt=""></li>
				<li><img src="http://lorempixel.com/g/300/300/city/7/" alt=""></li>
				<li><img src="http://lorempixel.com/g/300/300/city/8/" alt=""></li>
				<li><img src="http://lorempixel.com/g/300/300/city/9/" alt=""></li>
				<li><img src="http://lorempixel.com/g/300/300/city/10/" alt=""></li>
			</ul>
			<nav>
				<div class="prevBtn">PREV</div>
				<div class="nextBtn">NEXT</div>
			</nav>
			<ul class="indicator">
				<li>●</li>
				<li>●</li>
				<li>●</li>
				<li>●</li>
				<li>●</li>
				<li>●</li>
				<li>●</li>
				<li>●</li>
				<li>●</li>
				<li>●</li>
			</ul>
		</div>
		<div class="thumbHolder">
			<ul class="thumbPages">
				<li>
					<ul class="thumb">
						<li class="thumbBtn"><img src="http://lorempixel.com/g/100/100/city/1/" alt=""></li>
						<li class="thumbBtn"><img src="http://lorempixel.com/g/100/100/city/2/" alt=""></li>
						<li class="thumbBtn"><img src="http://lorempixel.com/g/100/100/city/3/" alt=""></li>
						<li class="thumbBtn"><img src="http://lorempixel.com/g/100/100/city/4/" alt=""></li>
						<li class="thumbBtn"><img src="http://lorempixel.com/g/100/100/city/5/" alt=""></li>
					</ul>
				</li>
				<li>
					<ul class="thumb">
						<li class="thumbBtn"><img src="http://lorempixel.com/g/100/100/city/6/" alt=""></li>
						<li class="thumbBtn"><img src="http://lorempixel.com/g/100/100/city/7/" alt=""></li>
						<li class="thumbBtn"><img src="http://lorempixel.com/g/100/100/city/8/" alt=""></li>
						<li class="thumbBtn"><img src="http://lorempixel.com/g/100/100/city/9/" alt=""></li>
						<li class="thumbBtn"><img src="http://lorempixel.com/g/100/100/city/10/" alt=""></li>
					</ul>
				</li>
			</ul>
		</div>
	</div>

##### Javascriptの記述例

すべてデフォルトで動作させる場合は下記のように`$.superThumbGallery()`を呼びます。  
この場合では`$().superThumbGallery()`で呼び出すことは出来ないので注意して下さい。

	$(function(){
		var gallery2 = $.superThumbGallery('#gallery2');
	});

デフォルトの設定を変更する場合は、第二引数にオブジェクト形式で渡します。  
mainとthumbのそれぞれの設定については、timer以外は上記のsupergalleryと同じオプションを指定可能です。  

	$(function(){
		$.superThumbGallery('#gallery2',{
			selectors:{
				main:'.mainHolder',// メイン画像全体のセレクタ
				thumbPages:'.thumbHolder', // サムネイルのページ全体のセレクタ
				thumbBtns:'.thumbBtn' // サムネイル自体のセレクタ
			},
			thumbNum:5, //サムネイルの1ページあたりの個数
			timer:{ //タイマー関係の設定
				enable:true,					//自動めくり機能を有効にする
				interval:3000,					//自動めくりの間隔
				stopOnHover:true				//マウスオーバー時にタイマーを止める
			},
			main:{
				selectors:{
					main:'.main',							//メイン画像が入っている要素のセレクタ
					nextBtn:'.nextBtn',						//「次へ」ボタン用のセレクタ
					prevBtn:'.prevBtn',						//「前へ」ボタン用のセレクタ
					indicator:'.indicator'					//ページインジケーター用のセレクタ
				},
				animation:{
					type:'fade',							//画像の切替アニメーションの種類 (fade:クロスフェード slide:スライド)
					duration:400,							//画像の切替アニメーションのかかる時間
					easing:'swing'							//画像の切替のイージング（プラグイン等で拡張したものも扱えます。）
				},
				nav:{
					autoHideNaviBtn:true,					//最初・最後のページでprev・nextボタンを非表示にするかどうか
					duration:400,							//非表示にするアニメーションのかかる時間
					easing:'swing',							//非表示にするアニメーションのイージング
					hiddenClassName:'hidden'				//非表示にした際に付加するクラス名
				},
				other:{
					initialSelect:0,						//一番はじめに選択しておく要素のインデックス
					selectedClassName:'selected',			//選択時につけておくサムネイル・ページインジケーター用のクラス
					loop:true								//最後の要素まで行ったら最初に戻るかどうか
					disableCss3Transition:false,			//利用可能な場合でもcss3Transitionを利用しない
				}
			},
			thumb:{
				selectors:{
					main:'.thumbPages',							//サムネイル画像のページが入っている要素のセレクタ
				},
				animation:{
					type:'slide',							//画像の切替アニメーションの種類 (fade:クロスフェード slide:スライド)
					duration:400,							//画像の切替アニメーションのかかる時間
					easing:'swing'							//画像の切替のイージング（プラグイン等で拡張したものも扱えます。）
				}
			}
	});

### <a name="sub"></a>その他の使用方法

#### <a name="sub_1"></a>外部からの操作（APIからの操作）
外部からギャラリーを操作することも可能です。その場合は、jQueryのメソッドチェーンではなく、`$.supergallery()`を利用して下さい。  
第一引数に対象となる要素のセレクタ、第二引数にオプションを渡して下さい。

	var gallery = $.supergallery('#gallery',{
		//オプションの指定
	});

##### gallery.changeTo(pageNum);
pageNumにページ番号を渡すと該当ページにページを切り替えます

	gallery.changeTo(3);	//3ページ目へ変更

##### gallery.changeToNext();
次のページへに切り替えます。

	var result = gallery.changeToNext();
	// 次のページがある場合 result は true
	// 次のページがない場合 result は false

##### gallery.changeToPrev();
前のページへに切り替えます。

	var result = gallery.changeToPrev();
	// 前のページがある場合 result は true
	// 前のページがない場合 result は false

##### gallery.setTimer();
現在の自動めくり用タイマーを破棄して、新たにタイマーを設定します。

##### gallery.clearTimer();
現在の自動めくり用タイマーを破棄します。

##### gallery.destroy(removeStyle);
各種イベントを破棄し初期化前の状態に戻します。引数にtrueを渡すと、styles属性も消去します。

#### <a name="sub_2"></a>イベント
対象の要素にて、`pageChangeStart` `pageChangeEnd`イベントが発生します。`pageChangeStart`はアニメーション開始時に、`pageChangeEnd`はアニメーション終了時に発生します。
	$('#gallery')
		.supergallery()
		.on('pageChangeStart',function(e,pageNum){
			//e : jQueryイベントオブジェクト
			//pageNum : ページ番号
		})
		.on('pageChangeEnd',function(e,pageNum){
			//e : jQueryイベントオブジェクト
			//pageNum : ページ番号
		})


## ライセンス
The MIT License
(C) Otto Kamiya (MegazalRock)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

以下に定める条件に従い、本ソフトウェアおよび関連文書のファイル（以下「ソフトウェア」）の複製を取得するすべての人に対し、ソフトウェアを無制限に扱うことを無償で許可します。これには、ソフトウェアの複製を使用、複写、変更、結合、掲載、頒布、サブライセンス、および/または販売する権利、およびソフトウェアを提供する相手に同じことを許可する権利も無制限に含まれます。

上記の著作権表示および本許諾表示を、ソフトウェアのすべての複製または重要な部分に記載するものとします。

ソフトウェアは「現状のまま」で、明示であるか暗黙であるかを問わず、何らの保証もなく提供されます。ここでいう保証とは、商品性、特定の目的への適合性、および権利非侵害についての保証も含みますが、それに限定されるものではありません。 作者または著作権者は、契約行為、不法行為、またはそれ以外であろうと、ソフトウェアに起因または関連し、あるいはソフトウェアの使用またはその他の扱いによって生じる一切の請求、損害、その他の義務について何らの責任も負わないものとします。
