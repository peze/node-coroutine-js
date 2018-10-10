const co = require("../index");
function sleep(time) {
    var now = Date.now();
    while (now + time * 100 > Date.now()) {}
}

circle = co(function*() {
    for (var i = 1; ; i++) {
        if (i % 10 == 0) {
            yield;
        }
        console.log(i);
        sleep(1);
    }
});

tigger = co(function*() {
    console.log("trigger");
    sleep(10);
    yield;
    console.log("trigger1");
    sleep(10);
    yield;
    console.log("trigger2");
    sleep(10);
    yield;
    console.log("trigger3");
    sleep(10);
    yield;
    console.log("trigger4");
    sleep(10);
    return;
});

circle();

setTimeout(function() {
    console.log("timer!!");
    tigger();
}, 2000);
