### Node-Coroutine-Js

Node实现协程的模块。

example:

	const co = require("../index");
    var arr = [];
    function sleep(time) {
        var now = Date.now();
        while (now + time * 200 > Date.now()) {}
    }

    var coustomer = co(function*() {
        while (1) {
            var i = arr.pop();
            console.log("coustomer:" + i);
            sleep(1);
            yield producer;
        }
    });

    var producer = co(function*() {
        var i = 0;
        while (1) {
            console.log("producer:" + i);
            arr.push(i++);
            sleep(1);
            yield coustomer;
        }
    });

    producer();
    
一个经典的生产者消费者的例子，producer和costomer中的循环并不会影响主线程的运行，并且可以通过yield决定调用的先后顺序，如果yeild后面没有值，则会在协程方法的池中找出最久一个没执行过的方法来执行。

ps:之前在完成了这个模块后，也了解到了腾讯的开源协程框架[libco](https://github.com/Tencent/libco)，在研读了这个框架的代码后,对其中[coctx_swap.S](https://github.com/Tencent/libco/blob/master/coctx_swap.S)的代码更是拍案叫绝，之前看Linux内核的时候看到线程创建，线程创建时的新SP就是通过ecx传入的，而这里这个示范更是具体，通过将esp寄存器的值指向堆上分配的内存区域，来为协程方法创建一个执行栈区域来执行协程方法和Linux内核创建和执行线程方法有异曲同工之妙，不过这里省去了内核繁琐的调度规则，也是协程精妙之处吧。在研究了libco以后，不由心痒想通过libco的方式来实现node的协程模块[node-co](https://github.com/peze/Node-Coroutine),当然这个项目目前为止还是没成功，有兴趣可以看看。