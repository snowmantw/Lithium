// Time related event forwarding and other features.
// Implement this because most native events are related to UI, not timer, which is actually also a native events provider.
//

(function()
{

Timer = 
{
    // {type: [callback]}
    timers_id: {}

    // After <ms>, <type> generator <egen> will generate the forwarding event and then trigger the generated event.
    // Yes, it's just setTimeout.
    //
    // The <egen> can receive TimeStamp and [HandlerID], the later contains all handler
    // registered previously, and sorted in the ascending order.
    //
    //
    // ::  TimeMS -> TypeName -> ( TimeStamp -> [HandlerID] -> Event ) -> [HandlerID]
    ,after: function(ms, type, egen)
    {
        if( undefined === Timer.timers_id[type] )
        {
            Timer.timers_id[type] = []
        }

        var id = setTimeout(function()
        {  
            Event.trigger( egen(Date.now(), Timer.timers_id[type]) ) 
        }, ms)
        Timer.timers_id[type].push(id)
        return Timer.timers_id[type]
    }

    // Kill one registered timer.
    ,kill: function(type, id)
    {
        clearTimeout(id)
        Timer.timers_id[type].splice(Timer.timers_id[type].indexOf(id), 1)
    }
}

})()

