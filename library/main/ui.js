
// Main library provide all UI computations.

(function()
{

window.UI = function(val)
{   
    return new window.UI.o(val)
}

// Static & pure functions

// Element ID ( selector for convenience ) from entry ID
UI.IDfromEID = function(id)
{
    return "#autocomplete li.entry-"+id
}

UI.EIDfromClass = function(clz)
{
    var m = clz.match(/.*-(.*)/)
    var r = m ? m[1] : m    // null ? ID : null
    return r
}

// entry ID from element Id
UI.EIDfromID = function(eid)
{
    var m = eid.match(/.*-(.*)/)
    var r = m ? m[1] : m    // null ? ID : null
    return r
}

UI.ClassFromEID = function(id)
{
    return "entry-"+id
}

UI.EIDFromClass = function(clz)
{
    var m = clz.match(/.*-(.*)/)
    var r = m ? m[1] : m    // null ? ID : null
    return r
}

// An entry: [ li.<clz>,  ]
UI.renderEntry = function(word, clz)
{
    var $li   = document.createElement('li')
    $li.classList.add(clz)
    $li.textContent = word

    return $li
}

// <id>, [{name: String, id: String}]; 
UI.renderList = function(id, es)
{
    var $ul = document.createElement('ul')
    $ul.setAttribute('id', id)

    var buf = document.createDocumentFragment()
    var es = Utils.map(es, function(e,i)
    {
        buf.appendChild(UI.renderEntry(e['name'], e['id'] ))
    })

    $ul.appendChild(buf)
    return $ul
}

UI.o = function(val)
{ 
    Context.o.call(this,val)
}

UI.o.prototype = Utils.copy(Context.o.prototype, 
{
    // Use new `querySelectorAll` API if it is implemented.
    // Note: Check before use it.
    //
    // :: UI [selector] -> UI NodeList 
     query: function()
    {
        var _this = this

        _this.__process.push( function(slcs)
        {
            _this.__pc++
            if( 0 != slcs.length )
            {
                var doms = document.querySelectorAll(slcs)
            }
            else
            {
                var doms = []
            }
            return _this.__process[_this.__pc](doms)
        })
        return this
    }

    // Choose #n nodes, if previous result is an array.
    // :: UI [a] -> Number -> UI a
    ,n: function(n)
    {
        var _this = this
        _this.__process.push( function(xs)
        {
            _this.__pc++
            return _this.__process[_this.__pc](xs[n])
        })
        return this
    }

    // Can get value if it exists.
    //
    // :: UI DOM -> UI String
    ,val: function()
    {
        var _this = this

        _this.__process.push( function(dom)
        {
            _this.__pc++
            return _this.__process[_this.__pc](dom.value)
        })
        return this
    }

    // :: UI DOM -> ClassName -> UI DOM
    ,addClass: function(clz)
    {
        var _this = this

        _this.__process.push( function(doms)
        {
            // HTML5 classList API, which is standard and be implemented by major browsers.
            Utils.each(doms, function(dom)
            {
                dom.classList.add(clz)
            })

            _this.__pc++
            return _this.__process[_this.__pc](doms)
        })
        return this
    }

    // :: UI [DOM] -> ClassName -> UI [DOM]
    ,removeClass: function(clz)
    {
        var _this = this

        _this.__process.push( function(doms)
        {
            // HTML5 classList API, which is standard and be implemented by major browsers.
            Utils.each(doms, function(dom)
            {
                dom.classList.remove(clz)
            })

            _this.__pc++
            return _this.__process[_this.__pc](doms)
        })
        return this
    }

    // Gesetter.
    //
    // :: UI DOM -> AttributeName -> String -> UI DOM
    // :: UI DOM -> AttributeName -> UI String | UI Undefined
    ,attr: function(name, value)
    {
        var _this = this

        var setter = function()
        {
        _this.__process.push( function(dom)
        {
            dom.setAttribute(name, value)
            _this.__pc++
            return _this.__process[_this.__pc](dom)
        })}

        var getter = function()
        {
        _this.__process.push( function(dom)
        {
            _this.__pc++
            return _this.__process[_this.__pc](dom.getAttribute(name))
        })}

        if( undefined != value ){ setter() }
        else{ getter() }

        return this
    }

    // Append multiple DOMs to the DOM.
    //
    // :: UI DOM -> [DOM] -> UI DOM
    ,appends: function(doms)
    {
        var _this = this
        _this.__process.push( function(target)
        {
            var buf = document.createDocumentFragment()
            Utils.each(doms, function(dom,i)
            {
                buf.appendChild(dom)
            })

            target.appendChild(buf)
            _this.__pc++
            return _this.__process[_this.__pc](target)
        })
        return this
    }

    // Forward native event to application events.
    // Will treat native event object as the 'data' property in application event.
    //
    // :: UI DOM -> NativeName -> ( NativeEvent -> Event ) -> UI DOM
    ,forward: function(nname, fn)
    {
        var _this = this
        _this.__process.push( function($dom)
        {
            $dom.addEventListener(nname, function(e)
            {
                var newevent = fn(e)
                Event.trigger(newevent)
            })
            _this.__pc++
            return _this.__process[_this.__pc]($dom)    // Will do nothing but pass the $dom to next step.
        })
        return this
    }
})

    
})()
