
// Can't live without flow-control and side-effects management.

(function()
{

// Ex: Context(3).action1().action2(3,4).done()
// It's just for convenience.
window.Context = function(val)
{
    return new Context.o(val)
}

window.Context.o = function(val)
{
    var _this = this

    // Default continuing function will only keep the result of this context.
    this.__cfn     = function(result){return result}
    this.__result  = null
    this.__pc      = 0
    this.__process = []

    // Initialization step.
    // Just pass initial value to next step.
    this.__process.push(function()
    {
        _this.__pc++

        // Return every step's result for the end of this context.
        return _this.__process[_this.__pc].call(_this, val)
    })

    return this
}

window.Context.o.prototype = 
{
     _: function(fn)
    {
        var _this = this
        this.__process.push(function(val)
        {
            _this.__pc++
            return _this.__process[_this.__pc].call(_this, fn(val))
        })
        return this
    }

    // Start to run the process.
    // Can pass a continuing function to receive the value and continue.
    ,done: function(cfn)
    {
        var _this = this
        this.__process.push(function(val)
        {
            // Last step, to return the result of this context, 
            // or it's result of next context.
            return _this.__cfn(val)
        })

        if(cfn)
        {
            this.__cfn = cfn
        }
        return _this.__process[0].call(_this)
    }
}

})()
