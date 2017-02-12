var temp_var = true;
let scenarios = new Array(
        {label:"start"},
        function(){
            Engine.Draw.MessageLayers[0].TextAreas[0].show("step0:测试测试测试TestTestTest123123123\
测试测试测试TestTestTest123123123测试测试测试TestT\
estTest123123123");
            Engine.Draw.PictureLayers[1].anime(Engine.Animation.fideIn, {time:1500, direction:"up"});
        },
        function(){
            Engine.Proc.goto("CH1");
            Engine.Draw.MessageLayers[0].TextAreas[0].show("step1:TestTestTest测试测试测试123123123");
            Engine.Draw.PictureLayers[1].anime(Engine.Animation.fideOut, {time:1500, direction:"right"});
        },
        {label:"CH0"},  // 设置标签CH0
        function(){
            temp_var = false;
            Engine.Draw.MessageLayers[0].TextAreas[0].show("step2:123123123测试测试测试TestTestTest");
            Engine.Proc.goto("CH2");
        },
        {label:"CH1"},
        function(){Engine.Draw.MessageLayers[0].TextAreas[0].show("step3:Test123测试测试TestTest测试123123");},
        function(){
            temp_var = true;
            Engine.Draw.MessageLayers[0].TextAreas[0].show("step4:测试123测试Test测试Test123Test123");
        },
        {label:"CH2"},
        function(){
            Engine.Draw.MessageLayers[0].TextAreas[0].show("step5:321测试123123测试TestTest测试Test123");
            if (temp_var) Engine.Proc.goto("CH0");
        },
        function(){Engine.Draw.MessageLayers[0].TextAreas[0].show("step6:Test987测试123测试Test546Test123");Engine.Proc.goto("start");}
    );

export {scenarios};

/* 
注意引入的顺序
*/