Engine = new function(){

    this.Scenario = new Array();

    // 对与剧情分支有关的全局/局部变量的存储
    this.Vars = new function() {
        // 在任何分支/周目都通用的变量(一般是某些设置等)
        this.Global = {};
        // 会随着save操作保存进档案的对剧情有影响的变量
        this.Local = {};
        // 每次load操作/重启之后会清空
        this.Temp = {};
    }

    // 对程序流程(剧情)进行控制
    // 一般存放在./scenario.js里
    this.Proc = new function() {
        // 对流程的初始化工作, 比如确定每个label等
        // 需要在Engine对象创建完成之后调用一遍
        this.init = function(){
            var length = Engine.Scenario.length;
            for (let i = 0; i < length; i++) {
                let t = Engine.Scenario[i];
                if (typeof(t) == "object" && t.label != undefined) {
                    Engine.Proc.scenarios[i] = {label:t.label, index:i};     // func什么都不做
                    if (Engine.Proc.labels[t.label] == undefined)       // 避免重复的label
                        Engine.Proc.labels[t.label] = i;
                    else
                        throw new SyntaxError("Label is duplicated");
                }else {
                    Engine.Proc.scenarios[i] = {index:i, func:t};
                }
            }
        };
        // 存储分析后的Scenario:{[label:"xx",] index:5, func:callable}
        this.scenarios = Array();
        // {"Label1":5, "Label4":88}
        this.labels = Array();
        this.read = Array();
        // 不需要返回的跳转
        this.goto = function(label, setRead) {
            setRead = setRead || false;
            if (Engine.Proc.labels[label] == undefined)
                throw new SyntaxError("The label cannot found");
            let dest = Engine.Proc.labels[label];
            // 将跳转范围内的文本标记为已读
            if (setRead && (dest > Engine.Proc.pc))
                for (let i = Engine.Proc.pc; i < dest; i++)
                    Engine.Proc.read[i] = true;
            Engine.Proc.pc = dest;
        };

        /* 
        可能不需要这个功能
        -------------------
        // 调用栈,call之后需要返回
        this.callStack = new Array();
        this.call = function(label) {

        };
        */

        this.pc = 0;    // 执行到哪一步
        this.next = function() {
            if (Engine.Proc.scenarios[Engine.Proc.pc] == undefined)
                return true;    
            if (Engine.Control.recordRead)
                Engine.Proc.read[Engine.Proc.pc] = true;
            if (Engine.Proc.scenarios[Engine.Proc.pc].func != undefined)    // 表示这是函数不是label
                // 调用对应function
                Engine.Proc.scenarios[Engine.Proc.pc].func();
            else{
                Engine.Proc.pc ++;
                return Engine.Proc.next();
            }
            Engine.Proc.pc ++;
            return false;
        };
    };

    // 所有渲染相关
    this.Draw = new function() {
        this.MessageLayers = new Array();
        this.PictureLayers = new Array();
        this.MessageLayer = function() {
            // 立即更新显示
            this.update = function(){
                // do something
                for (let i in this.TextAreas) {
                    i.update();
                }
            };

            // 内部的TextArea
            this._TextAreas = new Array();

            
            this._div = document.createElement('div');
            document.body.appendChild(this._div);
            this._top = this._left = this._bottom = this._right = this._width = this._height = 0;

            // 自动居中
            this._autoMargin = false;

            this._alpha = 0.8;
            this._zIndex = 1000;
            this._bgimage = false;
            this._bgcolor = "#000";
            this._visible = false;
            Object.defineProperties(this, {
                TextAreas: {
                    get: function() {return this._TextAreas;},
                    set: function(v) {this._TextAreas = v; this.update();}
                },
                div: {
                    get: function() {return this._div;},
                    set: function(v) {this._div = v; this.update();}
                },
                top: {
                    get: function() {return this._top;},
                    set: function(v) {this._top = v; this.update();}
                },
                left: {
                    get: function() {return this._left;},
                    set: function(v) {this._left = v; this.update();}
                },
                right: {
                    get: function() {return this._right;},
                    set: function(v) {this._right = v; this.update();}
                },
                bottom: {
                    get: function() {return this._bottom;},
                    set: function(v) {this._bottom = v; this.update();}
                },
                width: {
                    get: function() {return this._width;},
                    set: function(v) {this._width = v; this.update();}
                },
                height: {
                    get: function() {return this._height;},
                    set: function(v) {this._height = v; this.update();}
                },
                autoMargin: {
                    get: function() {return this._autoMargin;},
                    set: function(v) {this._autoMargin = v; this.update();}
                },
                alpha: {
                    get: function() {return this._alpha;},
                    set: function(v) {this._alpha = v; this.update();}
                },
                bgimage: {
                    get: function() {return this._bgimage;},
                    set: function(v) {this._bgimage = v; this.update();}
                },
                bgcolor: {
                    get: function() {return this._bgcolor;},
                    set: function(v) {this._bgcolor = v; this.update();}
                },
                visible: {
                    get: function() {return this._visible;},
                    set: function(v) {this._visible = v; this.update();}
                },
                zIndex: {
                    get: function() {return this._zIndex;},
                    set: function(v) {this._zIndex = v; this.update();}
                }
            });


            // 这个time不仅设置动画的时间,也告诉Control有延时任务
            this.show = function(animation, time, interrupt, callable){
                time = time || 0;
                interrupt = interrupt || true;

                // amination(time);

                if (!interrupt)
                    Engine.Control.wait(time);
            };

            this.disappear = function(animation, time, interrupt, callable) {

            };

        };

        this.TextArea = function(MessageLayer) {
            // 立即更新显示
            this.update = function(){};

            var divElem = document.createElement('div');
            MessageLayer.div.appendChild(divElem);
            this._div = divElem;
            this._text = "";
            this._font = {"font-family":"Microsoft YaHei", "font-size":"14px", "font-weight":"700",
                        "line-height":"16px", "text-shadow":"2px 2px 4px orange",
                        "-webkit-text-stroke":"1px green"};
                        // 查阅text-shadow(阴影)和-webkit-text-stroke(描边)相关资料

            // 阻止修改font属性(但可以修改其值)
            Object.seal(this._font);
            this._top = this._left = this._bottom = this._right = 0;

            Object.defineProperties(this, {
                div: {
                    get: function() {return this._div;},
                    set: function(v) {this._div = v; this.update();}
                },
                text: {
                    get: function() {return this._text;},
                    set: function(v) {this._text = v; this.update();}
                },
                font: {
                    get: function() {return this._font;},
                    set: function(v) {this._font = v; this.update();}
                },
                top: {
                    get: function() {return this._top;},
                    set: function(v) {this._top = v; this.update();}
                },
                left: {
                    get: function() {return this._left;},
                    set: function(v) {this._left = v; this.update();}
                },
                right: {
                    get: function() {return this._right;},
                    set: function(v) {this._right = v; this.update();}
                },
                bottom: {
                    get: function() {return this._bottom;},
                    set: function(v) {this._bottom = v; this.update();}
                }
            });

            // 不执行一个字一个字显示的动画
            this.noAnime = false;
            // 此函数将会清除该TextArea上的文字和设定回默认样式(不清除位置设定).
            this.clear = function() {
                this.font = {"font-family":"Microsoft YaHei", "font-size":"14px", "font-weight":"700",
                        "line-height":"16px", "text-shadow":"2px 2px 4px orange",
                        "-webkit-text-stroke":"1px green"};
                Object.seal(this._font);
                this.text = "";         // 自动update
            }
        };

        this.PictureLayer = function() {
            // 一般来说会根据canvas的渲染频率(60Hz)进行update
            // 所以不需要 setter 和 getter(在更新之后下一帧的时候就会把更新后的渲染)
            this.update = function(){

            };

            // 每个图像一层canvas
            this.src = "";

            this.canvas = document.createElement("canvas");
            document.body.appendChild(this.canvas);

            this.visible = false;
            this.alpha = 1;

            // 对图像进行矩形裁剪
            this.clip = {left:0, top:0, width:0, height:0, enable:false};
            Object.seal(this.clip);

            // 缩放, 大于1是放大;小于1是缩小
            this.scale = 1;
            // 上下翻转
            this.reversVertical = false;
            this.reversHorizontal = false;
            // 在画布层的遮罩顺序, zIndex值较大者会覆盖住较小者
            /*
             * 此处的zIndex和MessageLayer中的zIndex互不相干!
             * 这个zIndex只和所有PictureLayer的zIndex比较.
             * 同理MessageLayer里的zIndex也只跟MessageLayer比较.
             * *** 不建议将两个PictureLayer设置一样的zIndex!(遮罩顺序无法预料) ***
             * MessageLayer永远在PictureLayer之上!
             */
            this.zIndex = 1000;
            this.top = this.left = this.bottom = this.right = 0;
            // 画布永远是分辨率的长宽,充满整个屏幕, top,left这些属性设置的是图片填充的位置

            // 清除画布上的图片和设定的位置,src等参数.
            this.clear = function() {

            };
            this.show = function(animation, time, interrupt) {

            };
            this.disappear = function(animation, time, interrupt) {

            };
        };
    }

    this.Control = new function() {
        this.rClickEnabled = true;
        this.lClickEnabled = true;
        this.mScrollEnabled = true;
        this.keyEnterEnabled = true;
        this.keyCtrlEnabled = true;

        this.onRClick = function() {};

        // 自动阅读模式开启
        this.auto = false;
        // 快进模式开启
        this.skip = false;
        // 未读部分也快进
        this.skipNoRead = false;

        // 设置接下来的过程是否记录"已读"
        this.recordRead = true;

        this.save = function() {

        };
        this.load = function() {

        };

        this.waitQueue = 0;
        // 需要在wait过程中暂存的操作设置项名
        const NEED_TEMP_ENABLEDS = ["rClickEnabled", "lClickEnabled", "mScrollEnabled", "keyEnterEnabled", "keyCtrlEnabled"];
        this.tempEnableds = {};  // 暂存lClickEnable,keyEnterEnabled等操作设置
        this.wait = function(time, callable) {
            if (Engine.Control.waitQueue == 0) {    // 暂存操作设置
                for (let x in NEED_TEMP_ENABLEDS) {
                    Engine.Control.tempEnableds[NEED_TEMP_ENABLEDS[x]] = Engine.Control[NEED_TEMP_ENABLEDS[x]];
                }
            }
            for (let x in NEED_TEMP_ENABLEDS) {
                // 禁止用户操作
                Engine.Control[NEED_TEMP_ENABLEDS[x]] = false;
            }
            Engine.Control.waitQueue ++;
            setTimeout(function(){
                if (callable != undefined) callable();
                Engine.Control.waitQueue --;
                if (Engine.Control.waitQueue <= 0) {
                    for (let x in NEED_TEMP_ENABLEDS)
                    Engine.Control[NEED_TEMP_ENABLEDS[x]] = Engine.Control.tempEnableds[NEED_TEMP_ENABLEDS[x]];
                    Engine.Control.waitQueue = 0;
                }
            }, time);
        };

    };
}

function ud(){
        // 每16ms更新画布
        setInterval(function(){
            var arr = Engine.Draw.PictureLayers.concat();
            arr.sort(function(a, b){
                return a.zIndex - b.zIndex;
            });
            for(let i in arr) {
                i.update();
            }
        }, 16);
    }