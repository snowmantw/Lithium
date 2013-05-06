
(function()
{
window.Session = 
{
    // delay MS before perform a lookup.
    'delay_lookup': 400 
}

    // :: [String] -> Trie
    var initTrie = function(list)
    {
        var id = 0
        var pairs = Utils.fold(list, {}, function(word, mem)
        {
            mem[word] = UI.IDfromEID(id)
            id++            // slight side-effect
            return mem
        })

        return new Trie(pairs)
    }

    var init = function()
    {
        document.addEventListener("DOMContentLoaded", function()
        {
            // Do setup and testing input.
            Main.setupInput()()
            Main.bindTypeEvents()
        })
    }

    var setupInput = function()
    {
        return UI(['#user-input'])
            .query().n(0)
            .forward('keypress', function(e)
            {
                return {'name': 'user-keypress', 'data': e}
            })
            .done()
    }

    var bindTypeEvents = function()
    {
        Event.bind('user-keypress', handleKeypress)
        Event.bind('user-input-done', handleInputDone)
    }

    var handleKeypress = function(e)
    {
        var ne  = e['data']
        var key = ne.keyCode || ne.which
        var c = String.fromCharCode(key)

        var timers = Timer.timers_id["delay_lookup"]
        if( undefined != timers )
        {
            // Kill last one and setup a new delay timer.
            Timer.kill("delay_lookup", timers[timers.length - 1])
        }
        Timer.after(Session['delay_lookup'], "delay_lookup", function(ts, timers)
        {
            //Update autocomplete.
            var text = UI(['#user-input']).query().n(0).val().done()() 
            return {'name':"user-input-done", 'data': text}
        })
    }

    // Match string to autocomplete IDs. Exactly matching will output exactly one element in an array,
    // otherwise, multiple possible results will got outputted.
    //
    // And of course, empty array means no possible or exact result.
    //
    // :: String -> [ID]
    var getMatchIDs = function(str)
    {
        // {"": <id>} | {"": "", <subc>: {"": <sid>, ...}}
        var match = Session.trie.query(str)

        var ids = []
        for(var k in match)
        {
            if("" == k)
            {   
            if("" != match[k])  // Omit {"":""}
            {                   
                ids.push(match[k])
            }}
            else
            {
                ids = ids.concat(Session.trie.doValues([], match, function(v){ return v}))
            }
        }
        return ids
    }

    var handleInputDone = function(e)
    {
        var str = e['data']
        var ids = getMatchIDs(str)
    }

window.Main = {}
Main.initTrie = initTrie
Main.handleInputDone = handleInputDone
Main.handleKeypress = handleKeypress
Main.getMatchIDs = getMatchIDs
Main.setupInput = setupInput
Main.bindTypeEvents = bindTypeEvents
Session.trie = Main.initTrie(LIST)
init()

})()
