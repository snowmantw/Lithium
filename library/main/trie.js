//
// Use a trie-like structure to maintain data.
// This version is more institutive, but it's space inefficient.
// Example:
//
// Use a empty character '' as index of data.
// If this cause trouble, use private use unicode character '\uE001' instead of.
//
// We use object's key as trie's indexes because it's efficient if browser's engine
// like V8, using C++ classes instead of allocating dictionary.
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

Trie = function()
{
    this.__trie = {}
}

Trie.prototype = 
{
    // Name -> ID -> Trie
     set: function(name, id)
    {
        return this
    }

    // Get the trees of the string
    ,query: function(str)
    {
        var cs = str.split("")
        var c  = cs.shift()
        
        // Start from at least 1 char.
        return this.doTraverse(c, cs, this.__trie)
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
