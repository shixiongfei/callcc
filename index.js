const Fiber = require("fibers");

//call/cc实现
const call_cc = func => {     //接受一个用户函数作为参数
  let fiber = Fiber.current;  //当前堆栈
  func((...args) => {         //执行用户函数并将cc函数作为参数
    fiber.run(args);          //args将作为yield的返回值
  });
  return Fiber.yield();       //挂起当前fiber并等待run执行
};

//阻塞式sleep实现
const sleep = millisec => {   //接受参数单位毫秒
  return call_cc(cc => {      //执行call/cc
    let start = new Date;     //记录开始时间
    setTimeout(() => {
      cc(new Date - start);   //执行cc延续fiber之前的状态
    }, millisec);
  });
};

//受node-fibers限制，只能运行在fiber环境中
Fiber(() => {
  console.log("This is step 1");
  console.log("Sleep", sleep(1000));
  console.log("This is Step 2");
}).run();
