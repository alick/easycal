console.debug('This is from content scripts!');

var origin_overflowY = document.body.style.overflowY;
document.body.style.overflowY = 'visible';//some website has not enough height 
                                          //like baidu to display our popup layer,
                                          //so if this is set to 'hidden', part 
                                          //out of body will not be displayed.

// Add our popup layer div.
$('body').append('<div id="easycal-editcal"></div>');
$('body').append('<div id="easycal-mist"></div>');
$('#easycal-editcal').load(chrome.extension.getURL("editcal.html") +
                           ' fieldset');
                           
//some website has not enough height like baidu to display our popup layer,
//so if height is set to body.height, part of popup layer will not be displayed.
//modified this to put the whole window in mist
bodyHeight = $('body').css('height');
myHeight = Math.max(parseInt(bodyHeight.replace('px', '')), window.innerHeight).toString() + 'px';
$('#easycal-mist').css({
    position: "absolute",
    top: 0,
    left: 0,
    width: $('body').css('width'),
    height: myHeight,//$('body').css('height'),
    // I do not think we can come up with a big enough and reasonable
    // z-index value without many many tests!
    'z-index': 10001,
    'background-color': 'rgba(105, 105, 105, 0.6)',
});


// Click on grey out area to cancel.
$('#easycal-mist').click(function(){
    document.body.style.overflowY=origin_overflowY;
    $('#easycal-editcal').remove();
    $('#easycal-mist').remove();
});

$('body').ajaxComplete(function() {
    console.log('Ajax completed.');

    $('#easycal-editcal').css({
        'font' : '13px serif normal',
        'color' : 'rgb(0,0,0)',
        width: '33em', // the appropriate value ?
        'z-index': 10002,
        'background-color': 'white',
    });

    var window_height = window.innerHeight;
    var editcal_height = $('#easycal-editcal').height();
    console.debug(window_height + ', ' + editcal_height);
    var editcal_top = window.pageYOffset +
        ((window_height > editcal_height) ?
         ((window_height - editcal_height) / 2) : 0);

    var window_width = window.innerWidth;
    var editcal_width = $('#easycal-editcal').width();
    console.debug(window_width + ', ' + editcal_width);
    var editcal_left = window.pageXOffset +
        ((window_width > editcal_width) ?
         ((window_width - editcal_width) / 2) : 0);

    $('#easycal-editcal').css({
        position: "absolute",
        top: editcal_top,
        left: editcal_left,
    });
    
    // Show pictures
    $('#easycal-editcal #editcal_logo')[0].src = chrome.extension.getURL("huaci.png");//imgLogo;
    $('#easycal-editcal #easycal-form-submit')[0].src = chrome.extension.getURL("easycal_img/save.png");//imgSave;
    $('#easycal-editcal #easycal-form-cancel')[0].src = chrome.extension.getURL("easycal_img/cancel.png");//imgCancel;

    fillForm();
    $('#easycal-editcal #easycal-form-cancel').bind('click', function(){
        // Remove the form.
        $('#easycal-editcal').remove();
        $('#easycal-mist').remove();
        document.body.style.overflowY=origin_overflowY;
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

        g_schedule.sched_loc = $('#easycal_address').val();
        g_schedule.content = $('#easycal_content').val();
        g_schedule.type = $('input:radio[name=type]:checked').val();
        g_schedule.summary = g_schedule.content;//$('#easycal_summary').val();
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
                // TODO
                // Let user see the info
                
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

function fillForm() {
    console.log("enter fillForm");
    if (g_schedule) {
        console.log('Filling the form...');
        var time = new Date(g_schedule.sched_time);
        $('#easycal-editcal #easycal_year').val(time.getFullYear());
        $('#easycal-editcal #easycal_month').val(time.getMonth() + 1);
        $('#easycal-editcal #easycal_day').val(time.getDate());
        $('#easycal-editcal #easycal_hour').val(time.getHours());
        $('#easycal-editcal #easycal_minute').val(time.getMinutes());

        $('#easycal-editcal #easycal_address').val(g_schedule.sched_loc);
        $('#easycal-editcal #easycal_summary').val(g_schedule.summary);
        $('#easycal-editcal #easycal_content').val(g_schedule.content);
        $('#easycal-editcal input:radio[name=type][value=meeting]')[0].checked = true;
        $('#easycal-editcal #easycal_remindTime').val('15');
    }
}
