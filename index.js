/**
 * 将数字转换成字符串并进行补全操作
 * 
 * @param {number} number 需要进行处理的数字
 * @param {number} length 期望转换成的字符串的长度
 * @param {string} character 补全字符串时使用的字符
 * @param {string} direction 追加字符的时候追加的位置
 * @returns {string} 做好处理的字符串
 */
function repair(number, length, character = "0", direction = "front") {
    let string = number.toString();
 
    if (direction == "front") {
        return string.padStart(length, character);
    } else if (direction == "behind") {
        return string.padEnd(length, character);
    }

    return string;
}

/**
 * 获取当前的时间戳
 * 
 * @returns {number} 当前的时间戳
 */
function get_now_timestamp() {
    return new Date().getTime()
}

/**
 * 获取当前的时间
 * 
 * @returns {string} 当前的时间
 */
function get_now_time() {
    let date = new Date();
    
    return `${repair(date.getHours(), 2)}:${repair(date.getMinutes(), 2)}:${repair(date.getSeconds(), 2)}`
}

/**
 * 将毫秒数格式化成 HH:MM:SS:sss 的形式
 * 
 * @param {number} milliseconds 毫秒数毫秒
 * @returns {string} 格式化之后的字符串
 */
function format(milliseconds) {
    let rate = {
        days: 24 * 60 * 60 * 1000,
        hours: 60 * 60 * 1000,
        minutes: 60 * 1000,
        seconds: 1000
    }
    let days = Math.floor(milliseconds / rate.days);
    milliseconds -= days * rate.days;
    let hours = Math.floor(milliseconds / rate.hours % 24);
    milliseconds -= hours * rate.hours;
    let minutes = Math.floor(milliseconds / rate.minutes % 60);
    milliseconds -= minutes * rate.minutes;
    let seconds = Math.floor(milliseconds / rate.seconds % 60);
    
    return `${days !== 0 ? repair(days, 4) + ":" : ""}${repair(hours, 2)}:${repair(minutes, 2)}:${repair(seconds, 2)}.${repair(parseInt(milliseconds % 1000), 3)}`
}

let tiemr_status = "pause";
let timer_element = document.getElementById("timer");
let start_timestamp = get_now_timestamp();
let last_pause = get_now_timestamp();
let timer_offest = 0, timer_reset = false;
let disable_alert = true, sequence = 0;
let timeline = document.querySelector(".timeline");
let controller = document.getElementById("controller");

// 处理用户点击“开始计时”按钮
function start() {
    if (tiemr_status == "running") {
        disable_alert || alert("计时器已处于运行状态")
    } else {
        if (timer_reset) { 
            timer_offest = 0;
            timer_reset = false;
            start_timestamp = get_now_timestamp();
        } else {
            timer_offest += last_pause - get_now_timestamp();
        }

        tiemr_status = "running";
    }
}

// 处理用户点击“暂停计时”按钮
function pause() {
    if (tiemr_status == "paused") {
        disable_alert || alert("计时器已处于暂停状态")
    } else {
        last_pause = get_now_timestamp();
        tiemr_status = "paused";
    }
}

// 处理用户点击“重置计时”按钮
function reset() {
    timer_reset = true;
    tiemr_status = "paused";
    timer_element.innerText = format(0);
}

// 处理用户点击“记录时间”按钮
function record() {
    sequence++;

    timeline.innerHTML += `<div class="record" onclick="this.remove()">
        <span class="sequence">#${repair(sequence, 6)}</span>
        <span class="date">${get_now_time()}</span>
        <span class="time">${timer_element.innerText}</span>
    </div>`;

    timeline.scrollTo({
        "top": timeline.scrollHeight,
        "behavior": "smooth"
    });
}

// 处理用户点击“清空记录”按钮
function clear() {
    timeline.innerText = "";
    sequence = 0;
}

// 为元素添加监听事件
document.getElementById("start").addEventListener("click", start);
document.getElementById("pause").addEventListener("click", pause);
document.getElementById("reset").addEventListener("click", reset);
document.getElementById("record").addEventListener("click", record);
document.getElementById("clear").addEventListener("click", clear);

// 监听键盘的按键点击事件
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        if (tiemr_status == "running") {
            pause();
        } else {
            start();
        }

        record();
    }

    if (event.key == "v") {
        if (controller.style.display == "none") {
            controller.style.display = "grid";
        } else {
            controller.style.display = "none";
        }
    }

    if (event.key == "d") {
        disable_alert = !disable_alert;
    }
})

// 用户离开当前页面
document.addEventListener("visibilitychange", pause);

setInterval(() => {
    if (tiemr_status == "running") {
        let milliseconds = get_now_timestamp() - start_timestamp + timer_offest;

        timer_element.innerText = format(milliseconds);
    }
}, 10)