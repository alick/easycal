console.debug('This is from editcal.js!');

/*
    // Show pictures
    $('#easycal-editcal #editcal_logo')[0].src = chrome.extension.getURL("huaci.png");//imgLogo;
    $('#easycal-editcal #easycal-form-submit')[0].src = chrome.extension.getURL("easycal_img/save.png");//imgSave;
    $('#easycal-editcal #easycal-form-cancel')[0].src = chrome.extension.getURL("easycal_img/cancel.png");//imgCancel;
    */

/*
    $('#easycal-editcal #easycal-form-cancel').bind('click', function(){
        // Remove the form.
        $('#easycal-editcal').remove();
        $('#easycal-mist').remove();
    });

    $('#easycal-editcal #easycal-form-submit').bind('click', function(){

        var userYear = Number($('#easycal_year').val());
        var userMonth = Number($('#easycal_month').val()-1);
        var userDate = Number($('#easycal_day').val());
        var userHour = Number($('#easycal_hour').val());
        var userMinute = Number($('#easycal_minute').val());
        var userSecond = 0; // Assume second is 0.

        g_schedule.sched_time = new Date(userYear, userMonth, userDate, userHour, userMinute, userSecond);
        // Checking time in the Javascript way.
        if (g_schedule.sched_time.getFullYear() != userYear ||
                g_schedule.sched_time.getMonth() != userMonth ||
                g_schedule.sched_time.getDate() != userDate ||
                g_schedule.sched_time.getHours() != userHour ||
                g_schedule.sched_time.getMinutes() != userMinute ||
                g_schedule.sched_time.getSeconds() != userSecond) {

            var origin_color = $("#easycal-editcal #div_time").css('background');
            for (var i=0; i<1200; i+= 400) {
                setTimeout(function(){$("#easycal-editcal #div_time").css('background', 'red');}, i);
                setTimeout(function(){$("#easycal-editcal #div_time").css('background', origin_color);}, i+200);
            }
            return false;
        }

        g_schedule.loop = $('select[name=easycal_loop]').val();

        g_schedule.content = $('#easycal_content').val();
        g_schedule.type = $('input:radio[name=type]:checked').val();
        //g_schedule.remind = $('select[name=remindUnit]').val();

        g_schedule.timebefore = Number($('#easycal_remindTime').val());
        var timebefore = Number($('#easycal_remindTime').val());
        var timestyle=$('select[name=remindUnit]').val();

        g_schedule.timebefore = timebefore;
        g_schedule.timestyle = timestyle;

        //if(timestyle=="year") g_schedule.sched_remindtime = timebefore*1000*60*60*24*365;
        //if(timestyle=="month") g_schedule.sched_remindtime = timebefore*1000*60*60*24*30;
        
        // g_schedule.sched_remindtime is the timestamp due to remind
        g_schedule.sched_remindtime = new Date();
        if(timestyle=="day") {
            g_schedule.sched_remindtime.setTime(g_schedule.sched_time.getTime() - timebefore*1000*60*60*24);
        }
        if(timestyle=="hour") {
            g_schedule.sched_remindtime.setTime(g_schedule.sched_time.getTime() - timebefore*1000*60*60);
        }
        if(timestyle=="minute") {
            g_schedule.sched_remindtime.setTime(g_schedule.sched_time.getTime() - timebefore*1000*60);
        }
        //if(timestyle=="second") g_schedule.sched_remindtime = timebefore*1000;

        console.log('sched:');
        console.log(g_schedule);

        // store into local storage
        console.log('Sending schedule...');
        var request = {
            newsched: true,
            schedule_str: JSON.stringify(g_schedule),
        };
        chrome.extension.sendRequest(request, function(response) {
            console.log(response.farewell);
            if (response.farewell === "OK. I got it.") {
                console.log("Your schedule has been successfully saved ^_^");
                
                var pic_height = $('#form_fill').css('height');
                var pic_width = $('#form_fill').css('width');
                $('#form_fill').html("<img alt='saving' src='"+chrome.extension.getURL("easycal_img/saving_ok.png")+"' height='"+pic_height+"' style='padding:0;margin:0;border:0;'>");
                $('#form_fill').css("height", pic_height);
                $('#form_fill').css("width", pic_width);
                $('#form_fill').css("text-align", "center");
                $('#fieldset_easycal').css('text-align', 'center');
                                        
                setTimeout(
                    function(){
                        $('#easycal-editcal').remove();
                        $('#easycal-mist').remove();
                        document.body.style.overflowY=origin_overflowY;
                    },
                    1000);
            }
        });

        return false;
    });

    $('#easycal-editcal #easycal-form-submit').bind('mouseenter', function(){
        $('#easycal-editcal #easycal-form-submit')[0].src = chrome.extension.getURL("easycal_img/save_mouseover.png");//imgSave_onmouseover;
    });
    $('#easycal-editcal #easycal-form-cancel').bind('mouseenter', function(){
        $('#easycal-editcal #easycal-form-cancel')[0].src = chrome.extension.getURL("easycal_img/cancel_mouseover.png");//imgCancel_onmouseover;
    });
    $('#easycal-editcal #easycal-form-submit').bind('mouseleave', function(){
        $('#easycal-editcal #easycal-form-submit')[0].src = chrome.extension.getURL("easycal_img/save.png");//imgSave;
    });
    $('#easycal-editcal #easycal-form-cancel').bind('mouseleave', function(){
        $('#easycal-editcal #easycal-form-cancel')[0].src = chrome.extension.getURL("easycal_img/cancel.png");//imgCancel;
    });
});
*/

self.on('message', function(schedule) {
    console.log("begin to fill the form");
    console.log("schedule: " + JSON.stringify(schedule));
    if (schedule) {
        console.log('Filling the form...');
        /*
        var time = new Date(schedule.sched_time);
        $('#easycal-editcal #easycal_year').val(time.getFullYear());
        $('#easycal-editcal #easycal_month').val(time.getMonth() + 1);
        $('#easycal-editcal #easycal_day').val(time.getDate());
        $('#easycal-editcal #easycal_hour').val(time.getHours());
        $('#easycal-editcal #easycal_minute').val(time.getMinutes());

        $('#easycal-editcal #easycal_content').val(schedule.content);
        $('#easycal-editcal #easycal_remindTime').val('15');
        */
    }
});
