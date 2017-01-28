(function(){
    var temp_var = true;
    EngineUser.Scenario = EngineUser.Scenario.concat(
        new Array(
            function(){
                window.O.show("step0:测试测试测试TestTestTest123123123\
测试测试测试TestTestTest123123123测试测试测试TestT\
estTest123123123");
                window.R.show(Engine.Animation.fideInDown, 1500);
            },
            function(){
                Engine.Proc.goto("CH1");
                window.O.show("step1:TestTestTest测试测试测试123123123");
                window.R.disappear(Engine.Animation.fideOutDown, 1500);
            },
            {label:"CH0"},  // 设置标签CH0
            function(){
                temp_var = false;
                window.O.show("step2:123123123测试测试测试TestTestTest");
                Engine.Proc.goto("CH2");
            },
            {label:"CH1"},
            function(){O.show("step3:Test123测试测试TestTest测试123123");},
            function(){
                temp_var = true;
                window.O.show("step4:测试123测试Test测试Test123Test123");
            },
            {label:"CH2"},
            function(){
                window.O.show("step5:321测试123123测试TestTest测试Test123");
                if (temp_var) Engine.Proc.goto("CH0");
            },
            function(){window.O.show("step6:Test987测试123测试Test546Test123");}
        )
    );
}())
/* 
在其他文件引入的时候也是这种格式:
Engine.Scenario = Engine.Scenario.concat(
    new Array(
    //..其他文件中的场景流程..
    )
);
*/