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

        Engine.Proc.init();
        Engine.Control.init();
        Engine.Draw.init();
        Engine.Setting.init();
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
            Engine.Proc.callStack.push(label);
            Engine.Proc.goto(label, setRead);
        };
        this.back = function() {
            var label = Engine.Proc.callStack.push();
            Engine.Proc.goto(label, false);
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
        this.MessageLayer = function() {
            // 内部的TextArea
            this._TextAreas = new Array();

            
            this._div = document.createElement('div');
            document.getElementById("divContainer").appendChild(this._div);
            this._top = EngineUser.Default.MessageLayerTop;
            this._left = EngineUser.Default.MessageLayerLeft;
            this._bottom = EngineUser.Default.MessageLayerBottom;
            this._right = EngineUser.Default.MessageLayerRight;
            this._width = EngineUser.Default.MessageLayerWidth;
            this._height = EngineUser.Default.MessageLayerHeight;

            // 自动居中
            this._autoMargin = EngineUser.Default.MessageLayerAutoMargin;

            this._alpha = EngineUser.Default.MessageLayerAlpha;
            this._zIndex = EngineUser.Default.MessageLayerZIndex;
            this._bgimage = EngineUser.Default.MessageLayerBgImage;
            this._bgcolor = EngineUser.Default.MessageLayerBgColor;
            this._visible = EngineUser.Default.MessageLayerVisible;
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
        };

        // 立即更新显示
        this.MessageLayer.prototype.update = function(){
            // do something
            for (let i in this.TextAreas) {
                i.update();
            }
        };
        // 这个time不仅设置动画的时间,也告诉Control有延时任务
        this.MessageLayer.prototype.show = function(animation, time, interrupt, callable){
            time = time || 0;
            interrupt = interrupt || true;

            // amination(time);

            if (!interrupt)
                Engine.Control.wait(time, callable);
        };

        this.MessageLayer.prototype.disappear = function(animation, time, interrupt, callable) {
            time = time || 0;
            interrupt = interrupt || true;

            // amination(time);

            if (!interrupt)
                Engine.Control.wait(time, callable);
        };


        this.TextArea = function(MessageLayer) {
            this._div = document.createElement('div');
            MessageLayer.div.appendChild(this._div);

            this._div.style.position = "absolute";      // 修改为绝对定位
            this._div.style.backgroundPosition = "top left";
            this._div.style.backgroundAttachment = "fixed";
            this._div.style.backgroundRepeat = "no-repeat";


            this._text = EngineUser.Default.TextAreaText;
            this._font = EngineUser.Default.TextAreaFont;
                        // 查阅text-shadow(阴影)和-webkit-text-stroke(描边)相关资料

            // 阻止修改font属性(但可以修改其值)
            Object.seal(this._font);
            this._top = EngineUser.Default.TextAreaTop;
            this._left = EngineUser.Default.TextAreaLeft;
            this._bottom = EngineUser.Default.TextAreaBottom;
            this._right = EngineUser.Default.TextAreaRight;
            // 删除某个位置设定即设置为"" eg: this.top = "";

            this._bgcolor = "rgba(255, 255, 255, 0)";
            this._bgimage = false;

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
                }
            });

            // 不执行一个字一个字显示的动画
            this.noAnime = EngineUser.Default.TextAreaNoAnime;

            // 显示在区域内的字符串.用于动画的中间过程
            this.strShown = "";
        };

        // 立即更新显示
        this.TextArea.prototype.update = function(){
            this.div.innerHTML = this.strShown;     // 注意这里不是this.text
            this.div.style.left = this.left;
            this.div.style.right = this.right;
            this.div.style.top = this.top;
            this.div.style.bottom = this.bottom;
            this.div.style.backgroundColor = (this.bgcolor)?this.bgcolor:"";
            this.div.style.backgroundImage = (this.bgimage)?this.bgimage:"";
            this.div.style.fontFamily = this.font["font-family"];
            this.div.style.fontSize = this.font["font-size"];
            this.div.style.fontWeight = this.font["font-weight"];
            this.div.style.lineHeight = this.font["line-height"];
            this.div.style.textShadow = this.font["text-shadow"];
            this.div.style.WebkitTextStroke = this.font["-webkit-text-stroke"];
        };

        this.TextArea.prototype.show = function() {

        };

        // 此函数将会清除该TextArea上的文字和设定回默认样式(不清除位置设定).
        this.TextArea.prototype.clear = function() {
            this.font = EngineUser.Default.TextAreaFont;
            Object.seal(this._font);
            this.text = EngineUser.Default.TextAreaText;         // 自动update
        };

        this.PictureLayer = function() {

            // 每个图像一层canvas
            this.src = EngineUser.Default.PictureLayerSrc;

            this.canvas = document.createElement("canvas");
            document.getElementById("canvasContainer").appendChild(this.canvas);

            this.visible = EngineUser.Default.PictureLayerVisible;
            this.alpha = EngineUser.Default.PictureLayerAlpha;

            // 对图像进行矩形裁剪
            this.clip = EngineUser.Default.PictureLayerClip;
            Object.seal(this.clip);

            // 缩放, 大于1是放大;小于1是缩小
            this.scale = EngineUser.Default.PictureLayerScale;
            // 上下翻转
            this.reversVertical = EngineUser.Default.PictureLayerReversVertical;
            this.reversHorizontal = EngineUser.Default.PictureLayerReversHorizontal;
            // 在画布层的遮罩顺序, zIndex值较大者会覆盖住较小者
            /*
             * 此处的zIndex和MessageLayer中的zIndex互不相干!
             * 这个zIndex只和所有PictureLayer的zIndex比较.
             * 同理MessageLayer里的zIndex也只跟MessageLayer比较.
             * *** 不建议将两个PictureLayer设置一样的zIndex!(遮罩顺序无法预料) ***
             * MessageLayer永远在PictureLayer之上!
             */
            this.zIndex = EngineUser.Default.PictureLayerZIndex;
            this.top = EngineUser.Default.PictureLayerTop;
            this.left = EngineUser.Default.PictureLayerLeft;
            this.bottom = EngineUser.Default.PictureLayerRight;
            this.right = EngineUser.Default.PictureLayerBottom;
            // 画布永远是分辨率的长宽,充满整个屏幕, top,left这些属性设置的是图片填充的位置
        };

        // 一般来说会根据canvas的渲染频率(60Hz)进行update
        // 所以不需要 setter 和 getter(在更新之后下一帧的时候就会把更新后的渲染)
        this.PictureLayer.prototype.update = function(){

        };
        // 清除画布上的图片和设定的位置,src等参数.
        this.PictureLayer.prototype.clear = function() {

        };
        this.PictureLayer.prototype.show = function(animation, time, interrupt, callable) {
            time = time || 0;
            interrupt = interrupt || true;

            // amination(time);

            if (!interrupt)
                Engine.Control.wait(time, callable);
        };
        this.PictureLayer.prototype.disappear = function(animation, time, interrupt, callable) {
            time = time || 0;
            interrupt = interrupt || true;

            // amination(time);

            if (!interrupt)
                Engine.Control.wait(time, callable);
        };
    }

    function Control() {
        this.init = function() {
            // 初始化工作
        };
        this.rClickEnabled = EngineUser.Default.ControlrClickEnabled;
        this.lClickEnabled = EngineUser.Default.ControllClickEnabled;
        this.mScrollEnabled = EngineUser.Default.ControlmScrollEnabled;
        this.keyEnterEnabled = EngineUser.Default.ControlKeyEnterEnabled;
        this.keyCtrlEnabled = EngineUser.Default.ControlKeyCtrlEnabled;

        this.onRClick = function() {};

        // 自动阅读模式开启
        this.auto = EngineUser.Default.ContorlAuto;
        // 快进模式开启
        this.skip = EngineUser.Default.ContorlSkip;

        // 设置接下来的过程是否记录"已读"
        this.recordRead = EngineUser.Default.ContorlRecordRead;

        this.listSaves = function() {

        };
        // save 和 load 的时候还需要保存和载入Layers的状态
        this.save = function(id) {

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