let Audio = {
    // 存储所有播放器列表
    Players: []
}
Audio.Player = class {
    constructor () {
        let self = this;
        window.Engine.Audio.Players.push(this);
        Object.defineProperty(this, "audioDOM", {enumerable:false, configurable:true, writable:true});
        this.audioDOM =  document.createElement('audio');
        document.getElementById("audioContainer").appendChild(this.audioDOM);
        this.audioDOM.addEventListener("ended", () => {self.callback();});
        Object.defineProperties(this, {
            playing: {
                enumerable: false,
                get: function() {return !this.audioDOM.paused;}
            },
            paused: {
                enumerable: false,
                get: function() {return this.audioDOM.paused;}
            },
            ended: {
                enumerable: false,
                get: function() {return this.audioDOM.ended;}
            },
            src: {
                enumerable: true,
                get: function() {return this.audioDOM.src;},
                set: function(v) {
                    // 设置audio的src, 播放会中断
                    this.audioDOM.src = v;
                }
            },
            loop: {
                enumerable: true,
                get: function() {return this.audioDOM.loop;},
                set: function(v) {
                    // 设置audio的loop, 播放不会中断
                    this.audioDOM.loop = v;
                }
            },
            muted: {
                enumerable: true,
                get: function() {return this.audioDOM.muted;},
                set: function(v) {
                    // 设置是否静音, 通常是和角色语音设置有关
                    this.audioDOM.muted = v;
                }
            },
            volume: {
                enumerable: true,
                get: function() {return this.audioDOM.volume;},
                set: function(v) {
                    // 设置音量
                    this.audioDOM.volume = v;
                }
            }
        });
        this.callback = () => {};
    }

    play () {
        this.audioDOM.play();
    }

    pause () {
        this.audioDOM.pause();
    }
    switch (src, time = window.EngineUser.Default.AudioSwitchTime, step = window.EngineUser.Default.AudioSwitchStep) {
        let i = 0;
        let tempVolume = this.volume;
        let intv1 = setInterval(() => {
            this.volume = tempVolume * (1 - i / step);
            i++;
            if (i >= step) {
                clearInterval(intv1);
                this.src = src;
                this.play();
                let intv2 = setInterval(() => {
                    this.volume = tempVolume * (1 - i / step);
                    i--;
                    if (i < 0) clearInterval(intv2);
                }, time / (2 * step));
            }
        }, time / (2 * step));
    }
}

export {Audio};