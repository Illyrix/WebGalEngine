// 对EngineUser进行初始化
(function(){
    EngineUser = {};
    EngineUser.Scenario = [];
}());

Engine = new function(){

    this.init = function (){
        Engine.Proc = new Proc();
        Engine.Control = new Control();
        Engine.Draw = new Draw();
        Engine.Setting = new Setting();
        Engine.Audio = new Audio();

        Engine.Proc.init();
        Engine.Control.init();
        Engine.Draw.init();
        Engine.Setting.init();
        Engine.Audio.init();
    };

    // 对与剧情分支有关的全局/局部变量的存储
    this.Vars = function() {
        // 在任何分支/周目都通用的变量(系统设置在Engine.Setting)
        this.Global = {};
        // 会随着save操作保存进档案的对剧情有影响的变量
        this.Local = {};
        // 每次load操作/重启之后会清空
        this.Temp = {};
    }

    // 对程序流程(剧情)进行控制
    // 一般存放在./scenario.js里
    function Proc() {
        // 对流程的初始化工作, 比如确定每个label等
        // 需要在Engine对象创建完成之后调用一遍
        this.init = function() {
            var length = EngineUser.Scenario.length;
            for (let i = 0; i < length; i++) {
                let t = EngineUser.Scenario[i];
                if (typeof(t) == "object" && t.label != undefined) {
                    Engine.Proc.scenarios[i] = {label:t.label, index:i};     // func什么都不做
                    if (Engine.Proc.labels[t.label] == undefined)       // 避免重复的label
                        Engine.Proc.labels[t.label] = i;
                    else
                        throw new SyntaxError("Label:\""+t.label+"\" is duplicated");
                }else {
                    Engine.Proc.scenarios[i] = {index:i, func:t};
                }
            }
        }
        
        // 存储分析后的Scenario:{[label:"xx", ]index:5[, func:callable]}
        this.scenarios = Array();
        // {"Label1":5, "Label4":88}
        this.labels = Array();
        this.read = Array();
        // 不需要返回的跳转
        this.goto = function(label, setRead) {
            setRead = setRead || false;
            if (Engine.Proc.labels[label] == undefined)
                throw new SyntaxError("The label:\""+label+"\" cannot found");
            let dest = Engine.Proc.labels[label];
            // 将跳转范围内的文本标记为已读
            if (setRead && (dest > Engine.Proc.pc))
                for (let i = Engine.Proc.pc; i < dest; i++)
                    Engine.Proc.read[i] = true;
            Engine.Proc.pc = dest;
        };

        // 调用栈,call之后需要返回
        this.callStack = new Array();
        this.call = function(label, setRead) {
            Engine.Proc.callStack.push(this.pc);
            Engine.Proc.goto(label, setRead);
        };
        this.back = function() {
            if (Engine.Proc.callStack.length == 0) {
                throw new Error("Call's nums donot match back's");
                return;
            }
            var pc = Engine.Proc.callStack.pop();
            Engine.Proc.pc = pc;
        };

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
    function Draw() {
        this.init = function() {
            // 初始化操作
        };
        this.MessageLayers = new Array();
        this.PictureLayers = new Array();
        // 每16ms更新画布
        setInterval(function(){
            for(let i in Engine.Draw.PictureLayers) {
                Engine.Draw.PictureLayers[i].update();
            }
        }, 16);
        this.MessageLayer = function() {
            var that = this;
            Engine.Draw.MessageLayers.push(this);   // 将自己添加到messagelayers

            // 内部的TextArea
            this._TextAreas = new Array();

            
            this._div = document.createElement('div');
            document.getElementById("divContainer").appendChild(this._div);

            this._div.style.position = "absolute";      // 修改为绝对定位
            this._div.style.backgroundPosition = "top left";
            this._div.style.backgroundAttachment = "fixed";
            this._div.style.backgroundRepeat = "no-repeat";
            this._div.style.overflow = "hidden";
            this._div.onmouseenter = function() {
                var tBgColor = that._bgcolor; that.bgcolor = that.hoverBgColor;
                var tBgImage = that._bgimage; that.bgimage = that.hoverBgImage;
                that._div.onmouseleave = function () {
                    that.bgcolor = tBgColor;
                    that.bgimage = tBgImage;
                };
            };

            this._top = EngineUser.Default.MessageLayerTop;
            this._left = EngineUser.Default.MessageLayerLeft;
            this._bottom = EngineUser.Default.MessageLayerBottom;
            this._right = EngineUser.Default.MessageLayerRight;
            this._width = EngineUser.Default.MessageLayerWidth;
            this._height = EngineUser.Default.MessageLayerHeight;

            // 自动左右居中
            this._autoMargin = EngineUser.Default.MessageLayerAutoMargin;

            // 这里的alpha会影响上面的TextAreas,若要字的显示不受影响
            // 请使用bgcolor=rgba(255,255,255,0.5)
            // 或者带有透明度的图片作为背景
            this._alpha = EngineUser.Default.MessageLayerAlpha;
            this._zIndex = EngineUser.Default.MessageLayerZIndex;
            this._bgimage = EngineUser.Default.MessageLayerBgImage;
            this._bgcolor = EngineUser.Default.MessageLayerBgColor;
            this._visible = EngineUser.Default.MessageLayerVisible;

            this.hoverBgColor = EngineUser.Default.MessageLayerBgColor;
            this.hoverBgImage = EngineUser.Default.MessageLayerBgImage;

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
                bgcolor: {
                    get: function() {return this._bgcolor;},
                    set: function(v) {this._bgcolor = v; this.update();}
                },
                bgimage: {
                    get: function() {return this._bgimage;},
                    set: function(v) {
                        if (typeof v == "string" && v.search(/url\(.*\)/i) == -1) {
                            this._bgimage = "url(" + v +")";
                        }else
                            this._bgimage = v;
                        this.update();}
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
            this.onLClick = EngineUser.Default.MessageLayerOnLeftClick;
            this.onRClick = EngineUser.Default.MessageLayerOnRightClick;
            // 只有左右键单击的事件监听, 中键滚轮是全局的
            this._div.onclick = function(e) {
                if (e.button == 0 && Engine.Control.lClickEnabled)      // 左键摁下
                    that.onLClick(e);
                    // 如果要屏蔽其他元素对单击事件的处理, 阻止事件冒泡即可:
                    /*
                    that.onLClick = function(e){
                        //do something
                        e.stopPropagation();
                    }
                    */
            };
            this._div.oncontextmenu = function(e) {
                if (e.button == 2 && Engine.Control.rClickEnabled)      // 右键摁下
                    that.onRClick(e);
                return true;
            };
        };

        // 立即更新显示
        this.MessageLayer.prototype.update = function(){
            this.div.style.left = (typeof this.left == "number")?(this.left+"px"):this.left;
            this.div.style.right = (typeof this.right == "number")?(this.right+"px"):this.right;
            this.div.style.top = (typeof this.top == "number")?(this.top+"px"):this.top;
            this.div.style.bottom = (typeof this.bottom == "number")?(this.bottom+"px"):this.bottom;
            this.div.style.backgroundColor = (this.bgcolor)?this.bgcolor:"";
            this.div.style.backgroundImage = (this.bgimage)?this.bgimage:"";
            this.div.style.width = (typeof this.width == "number")?(this.width+"px"):this.width;
            this.div.style.height = (typeof this.height == "number")?(this.height+"px"):this.height;
            this.div.style.zIndex = (this.zIndex)?this.zIndex:"";
            this.div.style.display = (this.visible)?"block":"none";
            this.div.style.opacity = this.alpha;
            // 设置autoMargin的时候会自动无视left和right的设定值
            if (this.autoMargin && this.width) {
                var pNwidth = this.div.parentNode.offsetWidth;
                var margin = (pNwidth - parseInt(this.width))/2;
                this.div.style.left = margin + "px";
                this.div.style.right = "auto";
            }

            for (let i in this.TextAreas) {
                this.TextAreas[i].update();
            }
        };
        // 这个time不仅设置动画的时间,也告诉Control有延时任务
        this.MessageLayer.prototype.show = function(animation, time, interrupt, callable){
            time = time || 0;
            interrupt = interrupt || true;

            animation(this, time);

            if (!interrupt)
                Engine.Control.wait(time, callable);
        };

        this.MessageLayer.prototype.disappear = function(animation, time, interrupt, callable) {
            time = time || 0;
            interrupt = interrupt || true;

            animation(this, time);

            if (!interrupt)
                Engine.Control.wait(time, callable);
        };


        this.TextArea = function(MessageLayer) {
            var that = this;
            this._div = document.createElement('div');
            MessageLayer.div.appendChild(this._div);
            MessageLayer.TextAreas.push(this);

            this._div.style.position = "absolute";      // 修改为绝对定位
            this._div.style.backgroundPosition = "top left";
            this._div.style.backgroundAttachment = "fixed";
            this._div.style.backgroundRepeat = "no-repeat";
            this._div.style.overflow = "hidden";
            this._div.onmouseenter = function() {
                var tFont = that._font; that._font = that.hoverFont;
                var tBorder = that._border; that._border = that.hoverBorder;
                var tBorderRadius = that._borderRadius;
                that._borderRadius = that.hoverBorderRadius;
                var tBgColor = that._bgcolor; that._bgcolor = that.hoverBgColor;
                var tBgImage = that.bgimage; that.bgimage = that.hoverBgImage;
                that._div.onmouseleave = function () {
                    that._font = tFont;
                    that._border = tBorder;
                    that._borderRadius = tBorderRadius;
                    that._bgcolor = tBgColor;
                    that.bgimage = tBgImage;
                };
            };


            this._text = EngineUser.Default.TextAreaText;
            this._font = EngineUser.Default.TextAreaFont;
                        // 查阅text-shadow(阴影)和-webkit-text-stroke(描边)相关资料

            // 阻止修改font属性(但可以修改其值)
            Object.seal(this._font);

            this._color = EngineUser.Default.TextAreaColor;
            this._top = EngineUser.Default.TextAreaTop;
            this._left = EngineUser.Default.TextAreaLeft;
            this._bottom = EngineUser.Default.TextAreaBottom;
            this._right = EngineUser.Default.TextAreaRight;
            this._width = EngineUser.Default.TextAreaWidth;
            this._height = EngineUser.Default.TextAreaHeight;
            // 删除某个位置设定即设置为"" eg: this.top = "";

            this._border = EngineUser.Default.TextAreaBorder;
            Object.seal(this._border);
            this._borderRadius = EngineUser.Default.TextAreaBorderRadius;


            // 自动居中
            this._autoMargin = EngineUser.Default.TextAreaAutoMargin;

            this._bgcolor = EngineUser.Default.TextAreaBgColor;
            this._bgimage = EngineUser.Default.TextAreaBgImage;

            // 自定义:hover效果的css代码
            this.hoverFont = EngineUser.Default.TextAreaFont;
            Object.seal(this.hoverFont);
            this.hoverBorder = EngineUser.Default.TextAreaBorder;
            Object.seal(this.hoverBorder);
            this.hoverBorderRadius = EngineUser.Default.TextAreaBorderRadius;
            this.hoverBgColor = EngineUser.Default.TextAreaBgColor;
            this.hoverBgImage = EngineUser.Default.TextAreaBgImage;

            Object.defineProperties(this, {
                div: {
                    get: function() {return this._div;},
                    set: function(v) {this._div = v; this.update();}
                },
                text: {
                    get: function() {return this._text;},
                    set: function(v) {this._text = v; this.show();}
                },
                font: {
                    get: function() {return this._font;},
                    set: function(v) {this._font = v; this.update();}
                },
                color: {
                    get: function() {return this._color;},
                    set: function(v) {this._color = v; this.update();}
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
                border: {
                    get: function() {return this._border;},
                    set: function(v) {this._border = v; this.update();}
                },
                borderRadius: {
                    get: function() {return this._borderRadius;},
                    set: function(v) {this._borderRadius = v; this.update();}
                },
                autoMargin: {
                    get: function() {return this._autoMargin;},
                    set: function(v) {this._autoMargin = v; this.update();}
                },
                bgcolor: {
                    get: function() {return this._bgcolor;},
                    set: function(v) {this._bgcolor = v; this.update();}
                },
                stopDraw: {
                    get: function() {return this._stopDraw;},
                    set: function(v) {
                        if (v) {
                            for(let i in this._stopDraw) {
                                this._stopDraw[i] = true;
                            }
                        }
                        this.update();
                    }
                },
                bgimage: {
                    get: function() {return this._bgimage;},
                    set: function(v) {
                        if (typeof v == "string" && v.search(/url\(.*\)/i) == -1) {
                            this._bgimage = "url(" + v +")";
                        }else
                            this._bgimage = v;
                        this.update();}
                }
            });

            // 不执行一个字一个字显示的动画
            this.noAnime = EngineUser.Default.TextAreaNoAnime;

            this.onLClick = EngineUser.Default.TextAreaOnLeftClick;
            this.onRClick = EngineUser.Default.TextAreaOnRightClick;
            // 只有左右键单击的事件监听, 中键滚轮是全局的
            this._div.onclick = function(e) {
                if (e.button == 0 && Engine.Control.lClickEnabled)      // 左键摁下
                    that.onLClick(e);
            };
            this._div.oncontextmenu = function(e) {
                if (e.button == 2 && Engine.Control.rClickEnabled)      // 右键摁下
                    that.onRClick(e);
                return true;
            };

            // 显示在区域内的字符串.用于动画的中间过程
            this.strShown = "";
            this._stopDraw  = [];      // 用于中断绘制动画, 外部只能设置为 true
        };

        // 立即更新显示
        this.TextArea.prototype.update = function(){
            this.div.innerHTML = this.strShown;     // 注意这里不是this.text
            this.div.style.left = (typeof this.left == "number")?(this.left+"px"):this.left;
            this.div.style.right = (typeof this.right == "number")?(this.right+"px"):this.right;
            this.div.style.top = (typeof this.top == "number")?(this.top+"px"):this.top;
            this.div.style.bottom = (typeof this.bottom == "number")?(this.bottom+"px"):this.bottom;
            this.div.style.width = (typeof this.width == "number")?(this.width+"px"):this.width;
            this.div.style.height = (typeof this.height == "number")?(this.height+"px"):this.height;
            this.div.style.color = this.color;
            this.div.style.borderWidth = this.border["border-width"];
            this.div.style.borderStyle = this.border["border-style"];
            this.div.style.borderColor = this.border["border-color"];
            this.div.style.borderRadius = (typeof this.borderRadius == "number")?(this.borderRadius+"px"):this.borderRadius;
            this.div.style.backgroundColor = (this.bgcolor)?this.bgcolor:"";
            this.div.style.backgroundImage = (this.bgimage)?this.bgimage:"";
            this.div.style.fontFamily = this.font["font-family"];
            this.div.style.fontSize = this.font["font-size"];
            this.div.style.fontWeight = this.font["font-weight"];
            this.div.style.lineHeight = this.font["line-height"];
            this.div.style.textShadow = this.font["text-shadow"];
            this.div.style.WebkitTextStroke = this.font["-webkit-text-stroke"];
            this.div.style.WebkitTextFillColor = this.color;
            // 设置autoMargin的时候会自动无视left和right的设定值
            if (this.autoMargin && this.width) {
                var pNwidth = this.div.parentNode.offsetWidth;
                var margin = (pNwidth - parseInt(this.width))/2;
                this.div.style.left = margin + "px";
                this.div.style.right = "auto";
            }
        };

        // time 传入undefined或者false就是使用Setting里的设置动画速度
        this.TextArea.prototype.show = function(text, time, interrupt, callable){
            if (this.noAnime) {
                this.strShown = this.text;
                this.update();
                return;
            }
            text = text || this.text;
            this._text = text;
            time = time || Engine.Setting.readTxtSpd;
            interrupt = interrupt || true;

            this.stopDraw = true;
            let stopInt = this._stopDraw.push(false) - 1;
            //console.log(stopInt);

            var that = this;
            var count = 0;
            var cpyText = this.text;        // 复制一份text以防止text在动画未完成时修改
            (function interval() {
                if (that._stopDraw[stopInt]) {
                    let newArr = [];
                    for (let i in that._stopDraw) {
                        if (parseInt(i) != stopInt) newArr[i] = that._stopDraw[i];
                    }
                    that._stopDraw = newArr;
                    if (that._stopDraw.length == 0)
                        that.strShown = that.text;
                    that.update();
                    if (typeof callable == "function") callable();                         // callable 在动画被中断的时候执行么?
                    return;
                }else{
                    if (count == cpyText.length) {
                        if (typeof callable == "function") callable();
                        return;
                    }
                    that.strShown = cpyText.slice(0, count+1);
                    that.update();
                    count++;
                    if (!interrupt)
                        Engine.Control.wait(time);
                    setTimeout(function(){interval();}, time);
                }
            }())
        };

        // 此函数将会清除该TextArea上的文字和设定回默认样式(不清除位置设定).
        this.TextArea.prototype.clear = function() {
            this.font = EngineUser.Default.TextAreaFont;
            Object.seal(this._font);
            this.text = EngineUser.Default.TextAreaText;         // 自动update
        };

        this.PictureLayer = function() {
            Engine.Draw.PictureLayers.push(this);

            // 每个图像一层canvas
            this.src = EngineUser.Default.PictureLayerSrc;
            this._image = new Image();

            this.canvas = document.createElement("canvas");
            this.canvas.height = document.getElementById("canvasContainer").offsetHeight;
            this.canvas.width = document.getElementById("canvasContainer").offsetWidth;
            this.canvas.style.position = "absolute";
            this.canvas.style.zIndex = EngineUser.Default.PictureLayerZIndex;
            document.getElementById("canvasContainer").appendChild(this.canvas);
            this._context = this.canvas.getContext("2d");

            this.visible = EngineUser.Default.PictureLayerVisible;
            this.alpha = EngineUser.Default.PictureLayerAlpha;

            // 对图像进行矩形裁剪
            this.clip = EngineUser.Default.PictureLayerClip;
            Object.seal(this.clip);
            /**************************** 弃用 **********************
            // 缩放, 大于1是放大;小于1是缩小
            this.scale = EngineUser.Default.PictureLayerScale;
            *********************************************************/
            this.width = EngineUser.Default.PictureLayerWidth;
            this.height = EngineUser.Default.PictureLayerHeight;
            // 上下翻转
            //this.reversVertical = EngineUser.Default.PictureLayerReversVertical;
            //this.reversHorizontal = EngineUser.Default.PictureLayerReversHorizontal;
            // 在画布层的遮罩顺序, zIndex值较大者会覆盖住较小者
            /*
             * 此处的zIndex和MessageLayer中的zIndex相互影响!
             * 这里默认值为0, MessageLayer的默认值是1000
             */
            this.zIndex = EngineUser.Default.PictureLayerZIndex;
            this.top = EngineUser.Default.PictureLayerTop;
            this.left = EngineUser.Default.PictureLayerLeft;
            // 画布永远是分辨率的长宽,充满整个屏幕, top,left这些属性设置的是图片填充的位置
        };

        // 一般来说会根据canvas的渲染频率(60Hz)进行update
        // 所以不需要 setter 和 getter(在更新之后下一帧的时候就会把更新后的渲染)
        this.PictureLayer.prototype.update = function(){
            // 清空画布
            this.canvas.style.zIndex = this.zIndex;
            this._context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.canvas.style.opacity = this.alpha;
            if (! this.visible) this.canvas.style.opacity = 0.0;
            this._image.src = this.src;
            this._context.drawImage(this._image, 
                this.clip.enable?this.clip.left:0,
                this.clip.enable?this.clip.top:0,
                this.clip.enable?this.clip.width:this._image.width,
                this.clip.enable?this.clip.height:this._image.height,
                this.left,
                this.top,
                this.width?this.width:this._image.width,
                this.height?this.height:this._image.height);
        };
        // 清除画布上的图片和设定的位置,src等参数.
        this.PictureLayer.prototype.clear = function() {
            this.clip = EngineUser.Default.PictureLayerClip;
            Object.seal(this.clip);
            this.width = EngineUser.Default.PictureLayerWidth;
            this.height = EngineUser.Default.PictureLayerHeight;
            this.zIndex = EngineUser.Default.PictureLayerZIndex;
            this.top = EngineUser.Default.PictureLayerTop;
            this.left = EngineUser.Default.PictureLayerLeft;
            this.src = EngineUser.Default.PictureLayerSrc;
        };
        this.PictureLayer.prototype.show = function(animation, time, interrupt, callable) {
            time = time || 0;
            interrupt = interrupt || true;

            animation(this, time);

            if (!interrupt)
                Engine.Control.wait(time, callable);
        };
        this.PictureLayer.prototype.disappear = function(animation, time, interrupt, callable) {
            time = time || 0;
            interrupt = interrupt || true;

            animation(this, time);

            if (!interrupt)
                Engine.Control.wait(time, callable);
        };
    }

    // 暂时4种动画效果
    this.Animation = {
        fideInLeft: function(Layer, time, distance){Engine.Animation.fideIn(Layer, time, "left", distance);},
        fideInRight: function(Layer, time, distance){Engine.Animation.fideIn(Layer, time, "right", distance);},
        fideInUp: function(Layer, time, distance){Engine.Animation.fideIn(Layer, time, "up", distance);},
        fideInDown: function(Layer, time, distance){Engine.Animation.fideIn(Layer, time, "down", distance);},
        fideOutLeft: function(Layer, time, distance){Engine.Animation.fideOut(Layer, time, "left", distance);},
        fideOutRight: function(Layer, time, distance){Engine.Animation.fideOut(Layer, time, "right", distance);},
        fideOutUp: function(Layer, time, distance){Engine.Animation.fideOut(Layer, time, "up", distance);},
        fideOutDown: function(Layer, time, distance){Engine.Animation.fideOut(Layer, time, "down", distance);},
        // Layer必须要有left,top,alpha属性
        fideIn: function(Layer, time, direction, distance){
            var steps =  EngineUser.Default.AnimationFideInSteps;   // 动画的补间个数
            direction = direction || "left";
            distance = distance || EngineUser.Default.AnimationFideInDistance;              // 动画路径长度
            var i = 0;
            var tmpAlpha = Layer.alpha;
            Layer.alpha = 0.0;
            Layer.visible = true;
            switch(direction.toLowerCase()){
                case "left":
                    if (Layer.autoMargin) {                                         // 通过autoMargin控制位置, 一定是 MessageLayer
                        var left = parseInt(Layer.div.style.left.slice(0, -2));
                        left = left - distance;
                        Layer.div.style.left = left + "px";
                        var inter = setInterval(function(){
                            Layer._alpha = Layer.div.style.opacity = Layer._alpha + parseFloat(tmpAlpha/steps);
                            Layer.div.style.left = left+distance/steps*i;                    // 每次更新避免 update(), 防止autoMargin的干扰
                            i++;
                            if (i>=steps) clearInterval(inter);
                        }, time/steps);
                    }else if (Layer.left === undefined || Layer.left === "") {      // 通过right控制左右位置
                        var tmpRight = Layer.right = Layer.right + distance;
                        var inter = setInterval(function(){
                            Layer.alpha = Layer.alpha + parseFloat(tmpAlpha/steps);
                            Layer.right = tmpRight-distance/steps*i;
                            i++;
                            if (i>=steps) clearInterval(inter);
                        }, time/steps);
                    }else{                                                          // 通过left控制位置
                        var tmpLeft = Layer.left = Layer.left - distance;
                        var inter = setInterval(function(){
                            Layer.alpha = Layer.alpha + parseFloat(tmpAlpha/steps);
                            Layer.left = tmpLeft+distance/steps*i;
                            i++;
                            if (i>=steps) clearInterval(inter);
                        }, time/steps);
                        }
                    break;
                case "right":
                    if (Layer.autoMargin) {                                         // 通过autoMargin控制位置, 一定是 MessageLayer
                        var left = parseInt(Layer.div.style.left.slice(0, -2));
                        left = left + distance;
                        Layer.div.style.left = left + "px";
                        var inter = setInterval(function(){
                            Layer._alpha = Layer.div.style.opacity = Layer._alpha + parseFloat(tmpAlpha/steps);
                            Layer.div.style.left = left-distance/steps*i;                    // 每次更新避免 update(), 防止autoMargin的干扰
                            i++;
                            if (i>=steps) clearInterval(inter);
                        }, time/steps);
                    }else if (Layer.left === undefined || Layer.left === "") {      // 通过right控制左右位置
                        var tmpRight = Layer.right = Layer.right - distance;
                        var inter = setInterval(function(){
                            Layer.alpha = Layer.alpha + parseFloat(tmpAlpha/steps);
                            Layer.right = tmpRight+distance/steps*i;
                            i++;
                            if (i>=steps) clearInterval(inter);
                        }, time/steps);
                    }else{                                                          // 通过left控制位置
                        var tmpLeft = Layer.left = Layer.left + distance;
                        var inter = setInterval(function(){
                            Layer.alpha = Layer.alpha + parseFloat(tmpAlpha/steps);
                            Layer.left = tmpLeft-distance/steps*i;
                            i++;
                            if (i>=steps) clearInterval(inter);
                        }, time/steps);
                    }
                    break;
                case "down":
                    if (Layer.top === undefined || Layer.top === "") {
                        var tmpBottom = Layer.bottom = Layer.bottom + distance;
                        var inter = setInterval(function(){
                            Layer.alpha = Layer.alpha + parseFloat(tmpAlpha/steps);
                            Layer.bottom = tmpBottom-distance/steps*i;
                            i++;
                            if (i>=steps) clearInterval(inter);
                        }, time/steps);
                    }else{
                        var tmpTop = Layer.top = Layer.top - distance;
                        var inter = setInterval(function(){
                            Layer.alpha = Layer.alpha + parseFloat(tmpAlpha/steps);
                            Layer.top = tmpTop+distance/steps*i;
                            i++;
                            if (i>=steps) clearInterval(inter);
                        }, time/steps);
                    }
                    break;
                case "up":
                    if (Layer.top === undefined || Layer.top === "") {
                        var tmpBottom = Layer.bottom = Layer.bottom - distance;
                        var inter = setInterval(function(){
                            Layer.alpha = Layer.alpha + parseFloat(tmpAlpha/steps);
                            Layer.bottom = tmpBottom+distance/steps*i;
                            i++;
                            if (i>=steps) clearInterval(inter);
                        }, time/steps);
                    }else{
                        var tmpTop = Layer.top = Layer.top + distance;
                        var inter = setInterval(function(){
                            Layer.alpha = Layer.alpha + parseFloat(tmpAlpha/steps);
                            Layer.top = tmpTop-distance/steps*i;
                            i++;
                            if (i>=steps) clearInterval(inter);
                        }, time/steps);
                    }
                    break;
                default:
                    throw new Error("Error direction input: "+direction);
            }
        },
        fideOut: function(Layer, time, direction, distance){
            var steps =  EngineUser.Default.AnimationFideInSteps;   // 动画的补间个数
            direction = direction || "left";
            distance = distance || EngineUser.Default.AnimationFideInDistance;              // 动画路径长度
            var i = 0;
            var tmpAlpha = Layer.alpha;
            switch(direction.toLowerCase()){
                case "left":
                    if (Layer.autoMargin) {                                         // 通过autoMargin控制位置, 一定是 MessageLayer
                        var left = parseInt(Layer.div.style.left.slice(0, -2));
                        var inter = setInterval(function(){
                            Layer._alpha = Layer.div.style.opacity = Layer._alpha - parseFloat(tmpAlpha/steps);
                            Layer.div.style.left = left-distance/steps*i;                    // 每次更新避免 update(), 防止autoMargin的干扰
                            i++;
                            if (i>=steps) {
                                Layer.visible = false;
                                clearInterval(inter);
                            }
                        }, time/steps);
                    }else if (Layer.left === undefined || Layer.left === "") {      // 通过right控制左右位置
                        var tmpRight = Layer.right;
                        var inter = setInterval(function(){
                            Layer.alpha = Layer.alpha - parseFloat(tmpAlpha/steps);
                            Layer.right = tmpRight+distance/steps*i;
                            i++;
                            if (i>=steps) {
                                Layer.visible = false;
                                clearInterval(inter);
                            }
                        }, time/steps);
                    }else{                                                          // 通过left控制位置
                        var tmpLeft = Layer.left;
                        var inter = setInterval(function(){
                            Layer.alpha = Layer.alpha - parseFloat(tmpAlpha/steps);
                            Layer.left = tmpLeft-distance/steps*i;
                            i++;
                            if (i>=steps) {
                                Layer.visible = false;
                                clearInterval(inter);
                            }
                        }, time/steps);
                        }
                    break;
                case "right":
                    if (Layer.autoMargin) {                                         // 通过autoMargin控制位置, 一定是 MessageLayer
                        var left = parseInt(Layer.div.style.left.slice(0, -2));
                        var inter = setInterval(function(){
                            Layer._alpha = Layer.div.style.opacity = Layer._alpha - parseFloat(tmpAlpha/steps);
                            Layer.div.style.left = left+distance/steps*i;                    // 每次更新避免 update(), 防止autoMargin的干扰
                            i++;
                            if (i>=steps) {
                                Layer.visible = false;
                                clearInterval(inter);
                            }
                        }, time/steps);
                    }else if (Layer.left === undefined || Layer.left === "") {      // 通过right控制左右位置
                        var tmpRight = Layer.right;
                        var inter = setInterval(function(){
                            Layer.alpha = Layer.alpha - parseFloat(tmpAlpha/steps);
                            Layer.right = tmpRight+distance/steps*i;
                            i++;
                            if (i>=steps) {
                                Layer.visible = false;
                                clearInterval(inter);
                            }
                        }, time/steps);
                    }else{                                                          // 通过left控制位置
                        var tmpLeft = Layer.left;
                        var inter = setInterval(function(){
                            Layer.alpha = Layer.alpha - parseFloat(tmpAlpha/steps);
                            Layer.left = tmpLeft+distance/steps*i;
                            i++;
                            if (i>=steps) {
                                Layer.visible = false;
                                clearInterval(inter);
                            }
                        }, time/steps);
                    }
                    break;
                case "down":
                    if (Layer.top === undefined || Layer.top === "") {
                        var tmpBottom = Layer.bottom;
                        var inter = setInterval(function(){
                            Layer.alpha = Layer.alpha - parseFloat(tmpAlpha/steps);
                            Layer.bottom = tmpBottom-distance/steps*i;
                            i++;
                            if (i>=steps) {
                                Layer.visible = false;
                                clearInterval(inter);
                            }
                        }, time/steps);
                    }else{
                        var tmpTop = Layer.top;
                        var inter = setInterval(function(){
                            Layer.alpha = Layer.alpha - parseFloat(tmpAlpha/steps);
                            Layer.top = tmpTop+distance/steps*i;
                            i++;
                            if (i>=steps) {
                                Layer.visible = false;
                                clearInterval(inter);
                            }
                        }, time/steps);
                    }
                    break;
                case "up":
                    if (Layer.top === undefined || Layer.top === "") {
                        var tmpBottom = Layer.bottom;
                        var inter = setInterval(function(){
                            Layer.alpha = Layer.alpha - parseFloat(tmpAlpha/steps);
                            Layer.bottom = tmpBottom+distance/steps*i;
                            i++;
                            if (i>=steps) {
                                Layer.visible = false;
                                clearInterval(inter);
                            }
                        }, time/steps);
                    }else{
                        var tmpTop = Layer.top;
                        var inter = setInterval(function(){
                            Layer.alpha = Layer.alpha - parseFloat(tmpAlpha/steps);
                            Layer.top = tmpTop-distance/steps*i;
                            i++;
                            if (i>=steps) {
                                Layer.visible = false;
                                clearInterval(inter);
                            }
                        }, time/steps);
                    }
                    break;
                default:
                    throw new Error("Error direction input: "+direction);
            }
        },
        hide: function(Layer){
            Layer.visible = false;
        },
        show: function(Layer){
            Layer.visible = true;
        }
    };

    // 所有操作控制(如右键单击,左键单击,enter键等)
    function Control() {
        var that = this;
        this.init = function() {
            // 初始化工作
        };
        this.rClickEnabled = EngineUser.Default.ControlrClickEnabled;
        this.lClickEnabled = EngineUser.Default.ControllClickEnabled;
        this.mScrollEnabled = EngineUser.Default.ControlmScrollEnabled;
        this.keyEnterEnabled = EngineUser.Default.ControlKeyEnterEnabled;
        this.keyCtrlEnabled = EngineUser.Default.ControlKeyCtrlEnabled;

        this.onKeyEnter = function(){};
        this.onKeyCtrl = function(){};
        this.onMScroll = function(){};

        document.onmousewheel = function(e) {
            if (e.deltaY < 0)
                console.log("向上滚动滚轮:"+(-e.deltaY));
            else
                console.log("向下滚动滚轮:"+e.deltaY);
        };
        document.onkeydown = function(e) {
            if (e) {
                switch (e.keyCode) {
                    case 13: 
                        console.log("enter键被按下");       // 注意长按会反复调用
                        if (that.keyEnterEnabled && typeof that.onKeyEnter == "function")
                            that.onKeyEnter();
                        break;
                    case 17:
                        console.log("ctrl键被摁下");        // 反复调用
                        if (that.keyCtrlEnabled && typeof that.onKeyCtrl == "function")
                            that.onKeyCtrl();
                        break;
                    case 27:
                        console.log("esc被摁下");
                }
            }
        }

        // 自动阅读模式开启
        this._auto = EngineUser.Default.ContorlAuto;
        // 快进模式开启
        this._skip = EngineUser.Default.ContorlSkip;
        Object.defineProperties(this, {
                auto: {
                    get: function() {return this._auto;},
                    set: function(v) {
                        // auto开启或关闭
                        this._auto = v;
                    }
                },
                skip: {
                    get: function() {return this._skip;},
                    set: function(v) {
                        // skip开启或关闭
                        this._skip = v;
                    }
                }
            });

        // 设置接下来的过程是否记录"已读"
        this.recordRead = EngineUser.Default.ContorlRecordRead;

        /*
         * saveMainfest 存储: 
         [
            {
                title: "12月11日 剧情文字等等等",
                saveTime: "1484908068203"            // <------时间戳
                saveFile: "./save/sav1.json",
                thumbFile: "./save/sav1.thumb"       // <------缩略图片
            },
            {
                title: "12月28日 剧情文字等等等",
                saveTime: "1484908130215"            // <------时间戳
                saveFile: "./save/sav2.json",
                thumbFile: "./save/sav2.thumb"       // <------缩略图片
            }
        ]
         */
        this.listSaves = function() {
            if (EngineObject.existsFile(EngineUser.Config.saveMainfest)) {
                var mainfest = EngineObject.readFile(EngineUser.Config.saveMainfest);
                return JSON.parse(mainfest);
            }else{
                EngineObject.writeFile(EngineUser.Config.saveMainfest, "[]");
                return [];
            }
        };
        // save 和 load 的时候还需要保存和载入Layers的状态
        /*
         * 档save结构:
         
         */
        this.save = function(id) {
            if (this.listSaves()[id] == undefined) {return false;}

        };
        this.load = function(id) {

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

    function Setting() {
        this.init = function() {
            Engine.Setting.loadFromDefault();
            Engine.Setting.loadFromFile();
        };

        this.saveToFile = function() {
            EngineObject.writeFile(EngineUser.Config.settingPath, JSON.stringify(Engine.Setting), false);
        };
        this.loadFromFile = function() {
            if (EngineObject.existsFile(EngineUser.Config.settingPath)) {
                var str = EngineObject.readFile(EngineUser.Config.settingPath);
                var obj = JSON.parse(str);
                for (let i in obj)
                    Engine.Setting[i] = obj[i];
            }
        };
        this.loadFromDefault = function() {
            Engine.Setting.bgmVolumn = EngineUser.Default.SettingBgmVolumn;
            Engine.Setting.spkVolumn = EngineUser.Default.SettingSpkVolumn;
            Engine.Setting.effVolumn = EngineUser.Default.SettingEffVolumn;
            Engine.Setting.readTxtSpd = EngineUser.Default.SettingReadTxtSpd;
            Engine.Setting.noReadTxtSpd = EngineUser.Default.SettingNoReadTxtSpd;
            Engine.Setting.autoModeSpd = EngineUser.Default.SettingAutoModeSpd;
            Engine.Setting.textNoDelay = EngineUser.Default.SettingTextNoDelay;
            Engine.Setting.isWindowed = EngineUser.Default.SettingIsWindowed; 
            Engine.Setting.skipNoRead = EngineUser.Default.SettingSkipNoRead;
        }
    };

    function Audio() {
        this.init = function() {
        };

        // 存储所有播放器列表
        this.Players = new Array();

        this.Player = function() {
            var that = this;
            Engine.Audio.Players.push(this);
            this.audioDOM =  document.createElement('audio');
            document.getElementById("audioContainer").appendChild(this.audioDOM);
            this.audioDOM.addEventListener("ended", function(){that.callback();});

            Object.defineProperties(this, {
                src: {
                    get: function() {return this.audioDOM.src;},
                    set: function(v) {
                        // 设置audio的src, 播放会中断
                        this.audioDOM.src = v;
                    }
                },
                loop: {
                    get: function() {return this.audioDOM.loop;},
                    set: function(v) {
                        // 设置audio的loop, 播放不会中断
                        this.audioDOM.loop = v;
                    }
                },
                muted: {
                    get: function() {return this.audioDOM.muted;},
                    set: function(v) {
                        // 设置是否静音, 通常是和角色语音设置有关
                        this.audioDOM.muted = v;
                    }
                },
                volume: {
                    get: function() {return this.audioDOM.volume;},
                    set: function(v) {
                        // 设置音量
                        this.audioDOM.volume = v;
                    }
                }
            });
            this.callback = function(){};   // 播放完成的回调(loop=true时循环过程中不会触发)
        };
        this.Player.prototype.play = function() {
            this.audioDOM.play();
        };
        this.Player.prototype.pause = function() {
            this.audioDOM.pause();
        };
        this.Player.prototype.switch = function(src, time, step) {
            var that = this;
            time = time || EngineUser.Default.AudioSwitchTime;
            step = step || EngineUser.Default.AudioSwitchStep;
            var i = 0;
            var tempVolume = that.volume;
            var intv1 = setInterval(function(){
                that.volume = tempVolume * (1 - i / step);
                i++;
                if (i >= step) {
                    clearInterval(intv1);
                    that.src = src;
                    that.play();
                    var intv2 = setInterval(function(){
                        that.volume = tempVolume * (1 - i / step);
                        i--;
                        if (i < 0) clearInterval(intv2);
                    }, time / (2 * step));
                }
            }, time / (2 * step));
        }


    }
}

window.onload = function() {
    Engine.init();
    window.M = new Engine.Draw.MessageLayer();
    N = new Engine.Draw.TextArea(M);
    window.O = new Engine.Draw.TextArea(M);
    M.visible = true;
    //M.bgcolor = "rgba(102, 204, 255, 0.5)";
    M.bottom = 0;
    M.top = "";
    M.width = 1600;
    M.height = 300;
    O.autoMargin = true;
    O.width = 1000;
    O.top = 30;
    //document.body.background = "http://localhost/test2/08.jpg";
    //document.body.style.backgroundSize = "cover";
    window.Q = new Engine.Draw.PictureLayer();
    Q.src = "http://localhost/test2/09.jpg";
    Q.visible = true;
    Q.width = 1600;
    Q.height = 900;
    Q.zIndex = 0;

    window.R = new Engine.Draw.PictureLayer();
    R.src = "http://localhost/test2/lh.png";
    R.top = 100;
    R.left = 50;
    R.visible = false;
    R.zIndex = 5;

    document.onclick = function(e) {
        if (e.button == 0 && Engine.Control.lClickEnabled) {
            if (O.text == O.strShown) {
                Engine.Control.wait(100);
                Engine.Proc.next();
            }else{
                Engine.Control.wait(20);
                O.stopDraw = true;
            }
        }
    };

    P = new Engine.Audio.Player();
    P.src = "http://localhost/test2/explosion.ogg";
    P.callback = function(){
        if (Engine.Control.auto)
            Engine.Proc.next();
    }
}