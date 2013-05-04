
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

    // Ex: Context(10).bind( function(val){ return Context(val).act().done} ).done()
    // Or: Context(10).bind( Context(val).act().idgen ).done()
    ,bind: function(gen_fn)
    {
        var _this = this
        this.__process.push(function(val)
        {
            // Generate the binding context with previous value.
            var ctx = gen_fn(val)

            // Embedded this step as the context's continuing function.
            // We can't receive the result of context because asynchronous steps.
            return ctx(function(res)
            {   
                _this.__pc++
                return _this.__process[_this.__pc].call(_this, res)
            })
        })

        return this
    }

    // Start to run the process.
    // Can pass a continuing function to receive the value and continue.
    //
    // End a context: 
    //      Context(10).act().done()
    // End a context and extract the result:
    //      Context(10).act().done()()
    //
    ,done: function(cfn)
    {
        // We must ensure the `this` be bound by previous steps,
        // so we can't provide this:
        //
        //    Add = Context(1)._(function(a){return a+1}).done
        //    var two = Add()  // WRONG: done() will receive "window" as its "this"
        //
        // So the `done` function must return another function to run and extract the result ( see below ).
        //
        var _this = this
        this.__process.push(function(val)
        {
            // Last step, to return the result of this context, 
            // or it's result of next context.
            return _this.__cfn(val)
        })

        // Run the context and extract it if needed.
        // Wrapper for bind the "this".
        return function(cfn){ return _this.run(cfn) }
    }

    // A hidden function. Usually return by `done`.
    //
    ,run: function(cfn)
    {
        if(cfn)
        {
            this.__cfn = cfn
        }
        return this.__process[0].call(this)
    }

    // For convenience: bound context can use this instead of anonymous generator functions.
    //
    // Ex: Context(10).bind( function(val){ return Context(val).act().done() } ).done()
    // To: Context(10).bind( Context(val).act().idgen() ).done()
    ,idgen: function()
    {
        var _this = this

    // This is the anonymous generator which usually appears as the binding argument.
    return function()
    {
        return _this.done() 
    }
    }
}

})()
