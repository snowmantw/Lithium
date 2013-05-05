
(function()
{

// Export utils functions, which are pure functions.
// It's suited for extending other context ( impure functions ) with this module
// because they're away from side-effects. 
window.Utils = 
{
    // I can't work in a world without high-order functions.
     map: function(xs, fn)
    {
        var ys = []

        // For compatibility.
        if(xs.forEach)
        {
            xs.forEach(function(e, i, a)
            {
                ys.push(fn(e, i))
            })            

            return ys
        }
        else
        {
            for(var i = 0; i < xs.length; i++)
            {
                ys.push(fn(xs[i], i))
            }
        }
        return ys
    }

    // Side-effect map.
    ,each: function(xs, fn)
    {
        return Utils.map(xs, fn)
    }

    // fn: x -> mem -> x'
    ,fold: function(xs, mem, fn)
    {
        if( xs.reduce )
        {
            return xs.reduce(function(pre, e, i, a)
            {
                return fn(e,pre)
            })
        }
        else
        {
            // Implementation with slight side-effects.
            Utils.map(xs, function(x)
            {
                mem = fn(mem, x)
            })
            return mem
        }
    }

    // Copy one object.
    ,copy: function(from, to)
    {
        for( var key in from )
        {
            to[key] = from[key]
        }
        return to
    }

    // Object -> [String]
    ,keys: function(obj)
    {
        var r = []
        for( var i in obj )
        {
            r.push(i)
        }
        return r
    }
}

})()
