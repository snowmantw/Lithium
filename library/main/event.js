(function()
{
window.Event = 
{
     trie: new Trie({})

    // EventName (string) -> Object -> {name: EventName, data: Object}
    ,genEvent: function(name, data)
    {
        return {'name': name, 'data': data}
    }
    
    // Generate simple ID.
    ,newid: function()
    {
        return 0
    }

    // EventName -> Event -> Number ( event binding ID )
    ,bind: function(ename, cb)
    {
        var id = Event.newid()
        Event.newid = function(){ return id+1 } // Update the function.
        Event.trie.update(ename+String(id), cb)
        return id
    }

    // ID is optional.
    // If it's omited, will unbind all callbacks under the event.
    ,unbind: function(ename, id)
    {
        if( undefined == id )
        {
            var binds = Event.trie.query(ename)
            for( var id in binds )
            {
                // Default value is "".
                Event.trie.update(ename+String(id), "")
            }
        }       
        else
        {
            // Default value is "".
            Event.trie.update(ename+String(id), "")
        }
    }

    ,trigger: function(e)
    {
        var binds = Event.trie.query(e['name'])
        for( var id in binds )
        {
            // Find all bound callbacks in the event.
            if( "" != id )
            { 
            cb = binds[id][""]
            if("function" === typeof cb)
            {
            try{
                cb(e)
            } catch(err){
                throw "ERROR while handle event: "+e['name']+" with callback#"+id+", exception: "+err
            }
            }}
        }
    }
}
})()

