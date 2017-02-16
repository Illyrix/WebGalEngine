function Init() {
    setInterval(function(){
        for(let i in window.Engine.Draw.PictureLayers) {
            window.Engine.Draw.PictureLayers[i].update();
        }
    }, 16);
}

export {Init};
