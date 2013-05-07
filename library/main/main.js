
(function()
{
window.Session = 
{
    // delay MS before perform a lookup.
    'delay_lookup': 200,
}
    var getList = function()
    {
        // Default is English words.
        return ELIST
    }

    // :: [String] -> Trie
    var initUITrie = function(list)
    {
        var id = 0
        var buf = document.createDocumentFragment() 
        var pairs = Utils.fold(list, {}, function(word, mem)
        {
            mem[word] = UI.IDfromEID(id)

            // Also append the LI into the UL.
            var li = UI.renderEntry(word, UI.ClassFromEID(id))
            buf.appendChild(li)

            // If user click on the entry, put in it in the input element.
            UI(li).forward('click',function(ne)
            {
                return {'name': 'user-select-entry', 'data': {'text': li.textContent}}
            }).done()()

            id++            // slight side-effect
            return mem
        })
        UI(['#autocomplete']).query().n(0).done()().appendChild(buf)

        return new Trie(pairs)
    }

    var initUIList = function(list)
    {
        return UI(ul)
            ._(function(ul)
            {
                var wrapper = document.getElementById('autocomplete-wrapper')
                wrapper.appendChild(ul)
            })
            .done()
    }

    // Idempotent init function.
    var reinit = function()
    {
        Main.lockSubmit()
        Session.trie = Main.initUITrie(Main.getList())

        // Do setup and testing input.
        Main.bindTypeEvents()
        Main.bindClickEvents()
    }

    var setupSwitcher = function()
    {
        UI('#switch-cname').query().n(0).forward('click',function()
        {
            return {'name': 'switch-cname'}
        }).done()()

        UI('#switch-words').query().n(0).forward('click',function()
        {
            return {'name': 'switch-words'}
        }).done()()

        Event.bind('switch-cname', function(){ Main.switchCList() })
        Event.bind('switch-words', function(){ Main.switchEList() })
    }

    var bindClickEvents = function()
    {
        Event.bind('user-select-entry', handleSelectEntry)
    }

    var setupInput = function()
    {
        // Can't use keypress because it doesn't detect backspace key.
        return UI(['#user-input'])
            .query().n(0)
            .forward('keyup', function(e)
            {
                return {'name': 'user-keypress', 'data': e}
            })
            .done()()
    }

    var bindTypeEvents = function()
    {
        Event.bind('user-keypress', handleKeypress)
        Event.bind('user-input-done', handleInputDone)
        Event.bind('user-input-match', handleInputMatch)
    }

    var handleKeypress = function(e)
    {
        // Any change should lock the submit
        Main.lockSubmit()

        // Fist character toggle the class, to hide inactivated entries.
        UI('#autocomplete.uninit').query().removeClass('uninit').done()()

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
            // Update autocomplete.
            var text = UI(['#user-input']).query().n(0).val().done()() 
            return {'name':"user-input-done", 'data': text}
        })
        // Show the loading GIF.
        UI('#loading').query().addClass('activated').done()()
    }

    var handleSelectEntry = function(e)
    {
        var text = e.data.text
        UI('#user-input').query().n(0).val(e.data.text).done()()
        Event.trigger({'name':"user-input-done", 'data': text})
    }

    // Match string to autocomplete IDs. Exactly matching will output exactly one element in an array,
    // otherwise, multiple possible results will got outputted.
    //
    // And of course, empty array means no possible or exact result.
    //
    // :: String -> [{'match': ID, 'exactly': Boolean}]
    var getMatchIDs = function(str)
    {
        // All results.
        // Because our trie started with an empty entry contains all entries.
        // It's different from other entries inside the trie.
        if( "" == str )
        {
            return Session.trie.values(function(v)
            {
                // Omit {"":""}
                if( "" != v )
                {
                    return {'match': v, 'exactly': false}
                }
                else
                {
                    return false
                }
            })
        }


        // {"": <id>} | {"": "", <subc>: {"": <sid>, ...}}
        var match = Session.trie.query(str)

        var ids = []
        for(var k in match)
        {
            if("" == k)
            {   
            if("" != match[k])  // Omit {"":""}
            {                   
                ids.push({'match': match[k], 'exactly': true})
            }}
            else
            {
                ids = ids.concat(Session.trie.doValues([], match, 
                    function(v)
                    { 
                        if( "" === v ){ return false }
                        return {'match':v, 'exactly': false}
                    }))
            }
        }
        return ids
    }

    var handleInputDone = function(e)
    {
        var str = e['data']
        var mids = getMatchIDs(str)
        
        // Remove all activated classes.
        UI('#autocomplete li.activated').query()
            .removeClass('activated').done()()

        UI('#autocomplete li.matched').query()
            .removeClass('matched').done()()

        // Then add them to matched LIs.
        Utils.each(mids, function(mid)
        {
            var id = mid['match']
            var exactly = mid['exactly']

            if( exactly )
            {
                Event.trigger({'name':'user-input-match', 'data': {'success':true} })
                UI(id).query().addClass('matched').done()()
            }
            UI(id).query().addClass('activated').done()()
        })
        // Hide the loading GIF.
        UI('#loading').query().removeClass('activated').done()()
    }

    var handleInputMatch = function(e)
    {
        if(true == e['data'].success)
        {
            Main.unlockSubmit()
        }
    }

    var lockSubmit = function()
    {
        UI('#submit').query().n(0).property('disabled',true).done()()
    }

    var unlockSubmit = function()
    {
        UI('#submit').query().n(0).property('disabled',false).done()()
    }

    var switchCList = function()
    {
        Main.getList = function(){ return CLIST }
        Main.finalize()
        Main.reinit()
    }

    var switchEList = function()
    {
        Main.getList = function(){ return ELIST }
        Main.finalize()
        Main.reinit()
    }

    var finalize = function()
    {
        // Clear input and lock submit.
        Main.lockSubmit()
        UI('#user-input').query().val('').done()()

        // Clear all nodes in the list.
        var ul = UI('#autocomplete').query().n(0).done()()
        while (ul.hasChildNodes()) 
        {
            ul.removeChild(ul.lastChild)
        }

        // Because Trie only store ID, not DOM, so no memory leaks.
        Session.trie = null

        // Restore the state of UL.
        // Fist character toggle the class, to hide inactivated entries.
        UI('#autocomplete').query().addClass('uninit').done()()
    }

window.Main = {}
Main.initUITrie = initUITrie
Main.handleInputDone = handleInputDone
Main.handleKeypress = handleKeypress
Main.getMatchIDs = getMatchIDs
Main.setupInput = setupInput
Main.bindTypeEvents = bindTypeEvents
Main.bindClickEvents = bindClickEvents
Main.lockSubmit = lockSubmit
Main.unlockSubmit = unlockSubmit
Main.getList = getList
Main.switchEList = switchEList
Main.switchCList = switchCList
Main.finalize = finalize
Main.setupSwitcher = setupSwitcher

Main.reinit = reinit

document.addEventListener("DOMContentLoaded", function()
{
    Main.setupInput()
    Main.setupSwitcher()
    Main.reinit()

})

})()
