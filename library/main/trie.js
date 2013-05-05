//
// Use a trie-like structure to maintain data.
// This version is more institutive, but it's space inefficient.
// Example:
//
//      {'a': {'p':{'p': {'l':{'e': <id-apple>}}}}}
//
// Use a empty character '' as index of data.
// If this cause trouble, use private use unicode character '\uE001' instead of.
//
// We use object's key as trie's indexes because it's efficient if browser's engine
// like V8, using C++ classes instead of allocating dictionary.
//
// ---
// A possible cure for space wasting is change the splitting with of letters.
// User can declare the trie with width variable, and the trie will separated character each <width>, not 1.
// Example:
//
//     t = new Trie(2)
//     t == {'ap': {'pl':{'e ': {"": <id-apple>}}}}
//
// But this require us to handle issues of alignment, like a word with 11 characters but the width is 2,
// then the last character need to be handled with special functions.
//
// ---
// Better way to implement trie is compact words without those empty entries.
// Example:
//
// { 'a': { 'pple': { '': <id-entry> }, 'cademy': { '': <id-entry> }, '': <id-entry>}, 
//   'b': { 'ase': 
//          { 'ball': { '': <id-entry>},
//            'ment': { '':<id-entry>}
//            '': <id-entry>
//          } 
//          '': <id-entry>
//        }
// }
//
// But it will cause user-inserted data can't be split easily, and need do compcat, ex:
//
//    {'a': {'': <id>, 'pple': {'': <id>} }}
//
//    // After user insert "appze"
//    {'a': {'': <id>, 'pple': {'': <id>},'ppze': {'': <id>}}}
//
// In ordinary trie we should split the "pple" to "pp" and "le", then insert the "ze" into the "pp" tree.
// But this involves implementing longest match algorithm and I don't have enough time to do that.
// Example:
// 
//    {'pple': ...,'b': ..., 'ze': ... }
//    
//    // Match: "ppze"
//
//

// Ex: {'a': 'id-a', 'z': 'id-z','ab': 'id-ab'}
// {key:String, value:Object} -> Trie
Trie = function(init_values)
{
    this.__trie = {}
    for( var k in init_values )
    {
        var v = init_values[k]
        this.update(k, v)
    }
}

Trie.prototype = 
{
    // Get the trees of the string, or the leaf of result, or not found.
    // 
    // String -> Tree | Object |Undefined  
    query: function(str)
    {
        var cs = str.split("")
        
        // Start from 0 char.
        return this.doTraverse("", cs, this.__trie)
    } 

    // Extract values from tree. Useful if user only care about values, not sub-trees
    // Filter should check and return false if user don't want the value.
    //
    // `filter` is optional.
    // :: (a -> Boolean) -> [a]
    ,values: function(filter)
    {
        if( undefined === filter ){ filter = function(v){ return true} } 
    
        // Trie will started with "", and it'll be like this: {"": {"a":....}}
        return this.doValues([], this.__trie[""], filter)
    }

    // :: [a] -> Tree -> (a -> Boolean) -> [a]
    ,doValues: function(mem, tree, filter)
    {
        var _this = this

        // Get all key/value pairs in this level of the tree
        var ks = Utils.keys(tree)
        Utils.each(ks, function(k)
        {
            var v = tree[k]
            if( "" == k )
            { 
                if( filter(v) ){ mem.push(v) }
            }
            else
            {
                // `v` == tree, not value.
                mem = mem.concat(_this.doValues([], v, filter))
            }
        })
        return mem
    }

    // Update key's value.
    // If the key isn't in the trie, will create it with its parents.
    //
    // Ex: key 'apple' against an empty trie, then this function will create ""-a-p-p-l-e nodes.
    //
    // String -> Object -> this
    ,update: function(key, val)
    {
        var cs = key.split("")
        
        // Start from 0 char.
        this.doTraverse("", cs, this.__trie, val)
        return this
    }

    // Nonpublic function.
    // Character(s), other characters, current tree and insert value ( if any ).
    // EX:
    //      // Will insert the "appple"'s ID into the trie. 
    //      doTraverse([], ["a","p","p","l","e"], {"a": .... }, "id-of-apple-new-insert" )
    //    
    //      // Will query the value.
    //      doTraverse([], ["a","p","p","l","e"], {"a": .... } )
    //
    // With    `insert`: return "this"
    // Without `insert`: return the match result, may be undefined.
    ,doTraverse: function(c, cs, ctree, insert)
    {
        if( 0 != cs.length )
        {
            var match = ctree[c]
            newc = (cs.shift())
            if( undefined == match )
            {
                // Find nothing before endpoint.
                // So we need to create a path to there.
                //
                // This will actually do a part of work of insertion.
                //
                ctree[c] = {"": ""} 

                // Note `newc` move one step deeper than `ctree[c]`.
                return this.doTraverse(newc, cs, ctree[c], insert)
            }
            else
            {
                return this.doTraverse(newc, cs, match, insert)
            }
        }
        else
        {
            // At the endpoint. 
            // Do insertion or return sub-trees.
            if( undefined != insert )
            {
                // We're at the endpoint and left one current character to handle.
                if( undefined === ctree[c] ){ ctree[c] = {"":insert} }
                else{ ctree[c][""] = insert}
                return this
            }
            else
            {
                return ctree[c]
            }
        }
    }
}
