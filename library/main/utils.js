
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
                ys.push(fn(e))
            })            

            return ys
        }
        else
        {
            for(var i = 0; i < xs.length; i++)
            {
                ys.push(fn(xs[i]))
            }
        }
        return ys
    }

    // fn: x -> mem -> x'
    ,fold: function(xs, mem, fn)
    {
        // Implementation with slight side-effects.
        Utils.map(xs, function(x)
        {
            mem = fn(mem, x)
        })
        return mem
    }
}

})()
