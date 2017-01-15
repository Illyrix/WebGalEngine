window.Scenario = function *(){
    yield function(){console.log("rf1");};
    
    yield function(){console.log("rf2");};

    const SWITCH_OTHER_BRANCH = true;
    if (SWITCH_OTHER_BRANCH) 
        yield* branch1();
    else
        yield* branch2();
    
    yield function(){console.log("rf3");};
    
    yield function(){console.log("rf4");};
    
    yield function(){console.log("rf5");};
}

function *branch1() {
    yield function(){console.log("角色线A");};
    yield function(){console.log("do something");};
}

function *branch2() {
    yield function(){console.log("角色线B");};
    yield function(){console.log("do other things");};
}