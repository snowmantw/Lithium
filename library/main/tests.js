
// Unit tests without Jasmine or other libraries and frameworks.

(function()
{

window.Tests = 
{ 
    // Predictors need to return boolean only, so we use curry to generate final function. 
     eqArray: function(l, r)
    {
    return function()
    {
        if( l.length != r.length )
        {
            return false
        }
        for(var i = 0; i < l.length; i++)
        {
            if( l[i] != r[i] )
            {
                return false
            }        
        }
        return true
    }
    }

    // Loose equal, `==`, NOT `===`.
    ,eq: function(l, r)
    {
    return function()
    {
        return l == r
    }
    }

    // Throw error if predicator won't return true.
    ,assert: function(pred, subject)
    {
        if(!subject){ subject = "unknown"}
        if( true != pred() )
        {
            throw "Assertion failed at: "+subject
        }
        else
        {
            console.log("Assertion successed at: "+subject)
        }
    }
}

// For convenience in this scope...
var _ = window.Tests 

window.Tests.Utils = 
{
     testMap: function()
    {
        // Because one testing subject may have multiple tests.
        (function()
        {
            var test   = [1,1,2,3,5,8,13] 
            var assert = [2,2,4,6,10,16,26]
            var result = Utils.map(test, function(e)
            {
                return e * 2
            })
            _.assert(_.eqArray(result, assert), "Utils.map testing ")
        })();

        (function()
        {
            var test   = [1,1,2,3,5,8,13] 
            var assert = [2,2,4,6,10,16,26]
            
            // Disable the `forEach`.
            test.forEach = undefined

            var result = Utils.map(test, function(e)
            {
                return e * 2
            })
            _.assert(_.eqArray(result, assert), "Utils.map testing # forEach disabled")
        })();
    }

    ,testFold: function()
    {
        (function()
        {
            var test   = [4,3,2,1,0,-1,-2,-3,-4]
            var assert = 0
            
            var result = Utils.fold(test, 0, function(mem, e)
            {
                return mem + e
            })

            _.assert(_.eq(result, assert), "Utils.fold testing")
        })();
    }
}

window.Tests.Context = 
{
     testLambda: function()
    {
        (function()
        {
            var assert = 10

            var result = Context(0)
                ._(function(a)
                {
                    return a+6
                })
                ._(function(a)
                {
                    return a+4
                })
            .done()()

            _.assert(_.eq(result, assert), "Context.lambda testing")
        })();
    }

    ,testBind: function()
    {
        (function()
        {
            var assert = 11

            var AddTo5 = Context(0)
                ._(function(a)
                {
                    return a+3
                })
                ._(function(a)
                {
                    return a+2
                })
            .done()

            var AddTo11 = Context(0)
                .bind(function(r){ return AddTo5 })
                ._(function(five){ return five + 6})
            .done()

            var result = AddTo11()
            _.assert(_.eq(result, assert), "Context.bind testing")
        })();

        (function()
        {
            var assert = 11

            var AddTo5 = Context(0)
                ._(function(a)
                {
                    return a+3
                })
                ._(function(a)
                {
                    return a+2
                })
            .idgen()

            var AddTo11 = Context(0)
                .bind(AddTo5)
                ._(function(five){ return five + 6})
            .done()

            var result = AddTo11()
            _.assert(_.eq(result, assert), "Context.bind testing # idgen")
        })();
    }
}
    
})()

