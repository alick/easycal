function timeExtraction(my_selection) {
    // ================= time extraction =======================
    var patt1 = /(\d+)年(\d+)月(\d+)日*/;
    var patt2 = /(\d\d\d\d)-(\d+)-(\d+)/;
    var patt3 = /(\d+)月(\d+)日*/;
    var patt4 = /(\d+)-(\d+)/;
    var patt5 = /(\d+)日/;
    var patt6 = /([今明])[天晚]/;
    
    var patt_t = /([上中下]午|晚上*)(\d+)[:：](\d+)/;
    var patt_t_0 = /(\d+)[:：](\d+)/;
    var patt_t_1 = /([上中下]午|晚上*)(\d+)[时点](\d+)[分]*/;
    var patt_t_2 = /(\d+)[时点](\d+)[分]*/
    var patt_t_3 = /([上中下]午|晚上*)(\d+)[时点]/;
    var patt_t_4 = /(\d+)[时点]/
    var patt_t_5 = /([上中下]午|晚上*)/;
    
    var results1 = patt1.exec(my_selection);
    var results2 = patt2.exec(my_selection);
    var results3 = patt3.exec(my_selection);
    var results4 = patt4.exec(my_selection);
    var results5 = patt5.exec(my_selection);
    var results6 = patt6.exec(my_selection);
    
    var results_t = patt_t.exec(my_selection);
    var results_t_0 = patt_t_0.exec(my_selection);
    var results_t_1 = patt_t_1.exec(my_selection);
    var results_t_2 = patt_t_2.exec(my_selection);
    var results_t_3 = patt_t_3.exec(my_selection);
    var results_t_4 = patt_t_4.exec(my_selection);
    var results_t_5 = patt_t_5.exec(my_selection);
    
    var now_time = new Date();
    
    // day
    if (results1) {
        now_time.setFullYear(Number(results1[1]), Number(results1[2])-1, Number(results1[3]));
        now_time.setHours(0, 0, 0, 0);
    }
    else if (results2) {
        now_time.setFullYear(Number(results2[1]), Number(results2[2])-1, Number(results2[3]));
        now_time.setHours(0, 0, 0, 0);
    }
    else if (results3) {
        now_time.setMonth(Number(results3[1])-1, Number(results3[2]));
        now_time.setHours(0, 0, 0, 0);
    }
    else if (results4) {
        now_time.setMonth(Number(results4[1])-1, Number(results4[2]));
        now_time.setHours(0, 0, 0, 0);
    }
    else if (results5) {
        now_time.setDate(Number(results5[1]));
        now_time.setHours(0, 0, 0, 0);
    }
    else if (results6) {
        now_time.setHours(0, 0, 0, 0);
        if (results6[1] == "明") {
            now_time.setTime(now_time.getTime()+1000*60*60*24);
        }
    }

    // time
    if (results_t) {
        if (results_t[1] == "中午" && Number(results_t[2])<=2 
           || results_t[1] == "下午" && Number(results_t[2])<=11 
           || results_t[1] == "晚上" && Number(results_t[2])<=11 && Number(results_t[2])>4
           || results_t[1] == "晚" && Number(results_t[2])<=11 && Number(results_t[2])>4) {
            now_time.setHours(Number(results_t[2])+12, Number(results_t[3]), 0, 0);
        }
        else {
            now_time.setHours(Number(results_t[2]), Number(results_t[3]), 0, 0);
        }
    }
    else if (results_t_0) {
        now_time.setHours(Number(results_t_0[1]), Number(results_t_0[2]), 0, 0);
    }
    else if (results_t_1) {
        if (results_t_1[1] == "中午" && Number(results_t_1[2])<=2 
           || results_t_1[1] == "下午" && Number(results_t_1[2])<=11 
           || results_t_1[1] == "晚上" && Number(results_t_1[2])<=11 && Number(results_t_1[2])>4
           || results_t_1[1] == "晚" && Number(results_t_1[2])<=11 && Number(results_t_1[2])>4) {
            now_time.setHours(Number(results_t_1[2])+12, Number(results_t_1[3]), 0, 0);
        }
        else {
            now_time.setHours(Number(results_t_1[2]), Number(results_t_1[3]), 0, 0);
        }
    }
    else if (results_t_2) {
        now_time.setHours(Number(results_t_2[1]), Number(results_t_2[2]), 0, 0);
    }
    else if (results_t_3) {
        if (results_t_3[1] == "中午" && Number(results_t_3[2])<=2 
           || results_t_3[1] == "下午" && Number(results_t_3[2])<=11 
           || results_t_3[1] == "晚上" && Number(results_t_3[2])<=11 && Number(results_t_3[2])>4
           || results_t_3[1] == "晚" && Number(results_t_3[2])<=11 && Number(results_t_3[2])>4) {
            now_time.setHours(Number(results_t_3[2])+12, 0, 0, 0);
        }
        else {
            now_time.setHours(Number(results_t_3[2]), 0, 0, 0);
        }
    }
    else if (results_t_4) {
        now_time.setHours(Number(results_t_4[1]), 0, 0, 0);
    }
    else if (results_t_5) {
        if (results_t_5[1] == "上午") {
            now_time.setHours(8, 0, 0, 0);
        }
        else if (results_t_5[1] == "中午") {
            now_time.setHours(12, 0, 0, 0);
        }
        else if (results_t_5[1] == "下午") {
            now_time.setHours(14, 0, 0, 0);
        }
        else if (results_t_5[1] == "晚" || results_t_5[1] == "晚上") {
            now_time.setHours(19, 0, 0, 0);
        }
    }
    console.log('time detected: '+now_time.toLocaleString());
    return now_time;
    
    // =========================================================
}

function locExtraction(my_selection) {
    // ================= location extraction =======================
    var patt_loc = /地点[:：](\S+)/;
    var results_loc = patt_loc.exec(my_selection);
    var sched_loc = '';
    
    if (results_loc) {
        sched_loc = results_loc[1];
        console.log('location detected: '+sched_loc);
    }
    
    // =========================================================
    return sched_loc;
}

