// Application event manager.
// Independent from native events.

(function()
{
window.Event = 
{
    // {type: {id: cb}}
    callbacks: {}

    // EventName (string) -> Object -> {name: EventName, data: Object}
    ,genEvent: function(name, data)
    {
        return {'name': name, 'data': data}
    }
    
    // Generate simple ID.
    ,newid: function()
    {
        return "0"
    }

    // EventName -> Event -> Callback -> Number ( event binding ID )
    ,bind: function(ename, cb)
    {
        if( undefined === Event.callbacks[ename] )
        {
            Event.callbacks[ename] = {}
        }
        var id = Event.newid()
        Event.newid = function(){ return String(Number(id)+1) } // Update the function.
        Event.callbacks[ename][id] = cb
        return id
    }

    // ID is optional.
    // If it's omited, will unbind all callbacks under the event.
    // Will return unbound callbacks.
    ,unbind: function(ename, id)
    {
        var cbs   =  [] 
        var sid   = id
        if( undefined == id )
        {
            var binds = Event.callbacks[ename]
            for( var id in binds )
            {
                cbs.push(binds[id])
                delete Event.callbacks[ename][id]
            }
        }       
        else
        {
            cbs.push( Event.callbacks[ename][id] )
            delete Event.callbacks[ename][id]
        }
        return cbs
    }

    ,trigger: function(e)
    {
        var binds = Event.callbacks[e['name']]
        for( var id in binds )
        {
            // Find all bound callbacks in the event.
            cb = binds[id]
            if("function" === typeof cb)
            {
            try{
                cb(e)
            } catch(err){
                throw "ERROR while handle event: "+e['name']+" with callback#"+id+", exception: "+err
            }
            }
        }
    }
}
})()

