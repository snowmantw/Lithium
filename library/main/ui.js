
// Main library provide all UI computations.

(function()
{

window.UI = function(val)
{   
    return new window.UI.o(val)
}

// Static & pure functions

// Element ID from entry ID
UI.IDfromEID = function(id)
{
    return "entry-"+id
}

// entry ID from element Id
UI.EIDfromID = function(eid)
{
    var m = eid.match(/.*-(.*)/)
    var r = m ? m[1] : m    // null ? ID : null
    return r
}

// An entry: [ li#<id>,  ]
UI.renderEntry = function(name, id)
{
    var $li   = document.createElement('li')
    $li.setAttribute('id', UI.IDfromEID(id))
    $li.textContent = name

    return $li
}

// <id>, [{name: String, id: String}]
UI.renderList = function(id, es)
{
    var $ul = document.createElement('ul')
    $ul.setAttribute('id', id)

    var buf = document.createDocumentFragment()
    var es = Utils.map(es, function(e,i)
    {
        buf.appendChild(UI.renderEntry(e['name'], e['id']))
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
            return _this.__process[_this.__pc](document.querySelectorAll.apply(document,slcs))
        })
        return this
    }
})

    
})()
