var debug = function (msg) {
    console.log(msg);
}

var http = {
    ajax : function(url, params, method) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        return fetch(url, {
            method: method,
            headers: myHeaders,
            credentials: "same-origin"
        });
    },
    get : function(url) {
        return this.ajax(url, {}, 'get');
    },
    post : function(url, params) {
        return this.ajax(url, params, 'post');
    },
    json : function(url, params, $type) {
        return this.ajax(url, params, $type)
            .then(function(response){
                return response.json();
            })
    }
}


var JobManager = {
    jobs: {},
    // 获取任务
    getJob: function (jobId) {
        var job = this.jobs[jobId];
        return job;
    },
    // 是否正在运行中
    isRunning: function (jobId) {
        var job = this.jobs[jobId];
        if (job && job.running) {
            debug(jobId + ': isRunning');
            return true;
        }
        return false;
    },
    // 开始任务
    start: function(job) {
        if (this.isRunning(job.id)) {
            debug(jobId + ': 任务正在运行中');
            return;
        }
        this.jobs[job.id] = job;
        this.execute(job);
    },
    pause : function (job) {
        delete this.jobs[job.id];
    },
    // 抛出事件
    fire : function(message) {
        postMessage(message);
    },
    execute: function(job) {
        var job = this.getJob(job.id)
        if (!job) {
            return; // 任务暂停就不执行了
        }
        if (job.runing) {
            return;
        }
        job.runing = true;
        try {
            var that = this;
            http.json(job.relUrl + '?c=system&a=job&do=execute&id=' + job.id, '', 'get')
                .then(function (data) {
                    if (data.message.errno == 0) {
                        that.fire(data.message.message);
                        if (!data.message.message.finished) {
                            setTimeout(function () {
                                that.execute(job);
                            }, 1000);
                        }
                    }
                });
            job.runing = false;
        } catch (e) {
            job.runing = false;

        }
        return true;
    }

}
// 接收任务处理事件
onmessage = function (ev) {
    var job = ev.data;
    if (job.start) {
        JobManager.start(job);
    } else {
        JobManager.pause(job);
    }
}