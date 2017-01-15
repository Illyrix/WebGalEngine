window.Engine = new function(){

    // 对与剧情分支有关的全局/局部变量的存储
    /*
     * 使用window.Engine.Vars.varName之前需要先将varName设置setter:
     * Usage: window.Engine.Vars.addVar("varName"); window.Engine.Vars.varName = 1;
     */
    this.Vars = new function() {
        this._vars = {};
        this.addVar = function (str){
            Object.defineProperty(this, str, {
                get:function(){
                    // Todo
                    console.log("vars getter: "+this._vars);
                    return this._vars[str];
                },
                set:function(v){
                    // Todo:将对var的更改的新旧值均写入历史数组进行存储
                    console.log("vars setter: "+this._vars+" to "+v);
                    this._vars[str] = v;
                }
            }); 
        }
    }

    // 对程序流程(剧情)进行控制
    // func 是编写有剧情的生成器函数, 默认为 window.Scenario
    // 存放在./scenario.js里
    this.Proc = new function(func) {
        var processGen = function *gen(generator){
            // 步进到某个场景需要的步数
            // Important: 在进行Save/Load之后同一场景对应的i不一定相同
            // 只有在步进的时候将环境变量值还原才一定相同
            let i = 0;
            let now;
            let realfunc = generator();
            var exec = {done:false};

            while(! exec.done) {
                now = yield i;
                exec = realfunc.next();
                if ((!now || now == i) && !exec.done) {
                    exec.value();
                }
                i++;
            }
        }

        // 存储当前场景
        this.ptr = processGen(func);

        // 调用next()即进入下一个场景
        this.next = function(){this.ptr.next()};

        // 快进到某一到过的场景(即Load)
        this.goto = function(position){
            var t = this.ptr.next(position);
            while (t.value != position && t.done == false) {
                //todo: 添加对Vars的更改
                t = this.ptr.next(position);
            }
        };
    }(window.Scenario);

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


            this.show = function(animation){

            };

            this.disappear = function(animation) {

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
            this._src = "";

            this._canvas = document.createElement("canvas");
            document.body.appendChild(this.canvas);

            this._visible = false;
            this._alpha = 1;

            // 对图像进行矩形裁剪
            this._clip = {left:0, top:0, width:0, height:0, enable:false};
            Object.seal(this._clip);

            // 缩放, 大于1是放大;小于1是缩小
            this._scale = 1;
            // 上下翻转
            this._reversVertical = false;
            this._reversHorizontal = false;
            // 在画布层的遮罩顺序, zIndex值较大者会覆盖住较小者
            /*
             * 此处的zIndex和MessageLayer中的zIndex互不相干!
             * 这个zIndex只和所有PictureLayer的zIndex比较.
             * 同理MessageLayer里的zIndex也只跟MessageLayer比较.
             * *** 不建议将两个PictureLayer设置一样的zIndex!(遮罩顺序无法预料) ***
             * MessageLayer永远在PictureLayer之上!
             */
            this._zIndex = 1000;
            this._top = this._left = this._bottom = this._right = 0;
            // 画布永远是分辨率的长宽,充满整个屏幕, top,left这些属性设置的是图片填充的位置

            // 清除画布上的图片和设定的位置,src等参数.
            this.clear = function() {

            };
            this.show = function(animation) {

            };
            this.disappear = function(animation) {

            };
        };
    }

    this.Control = new function()｛
    };
}