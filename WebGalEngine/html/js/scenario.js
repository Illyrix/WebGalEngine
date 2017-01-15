(function(){
    var temp_var = true;
    Engine.Scenario = Engine.Scenario.concat(
        new Array(
            function(){console.log("step0"); Engine.Control.wait(1500, function(){console.log(Engine.Control);Engine.Control.wait(1500,function(){console.log(Engine.Control);});});},
            function(){Engine.Proc.goto("CH1");console.log("step1");},
            {label:"CH0"},  // 设置标签CH0
            function(){
                temp_var = false;
                console.log("step2");
                Engine.Proc.goto("CH2");
            },
            {label:"CH1"},
            function(){console.log("step3")},
            function(){
                temp_var = true;
                console.log("step4");
            },
            {label:"CH2"},
            function(){
                console.log("step5");
                if (temp_var) Engine.Proc.goto("CH0");
            },
            function(){console.log("step6");}
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