
// Use a trie-like structure to maintain data.
// Example:
//
// { 'a': { 'pple': { '\uE001': <id-entry> }, 'cademy': { '\uE001': <id-entry> }, '\uE001': <id-entry>}, 
//   'b': { 'ase': 
//          { 'ball': { '\uE001': <id-entry>},
//            'ment': { '\uE001':<id-entry>}
//            '\uE001': <id-entry>
//          } 
//          '\uE001': <id-entry>
//        }
// }
//
// Use a private use unicode character '\uE001' as index of data.
//
// User behavior specification:
// 
// 'a': {'pple',... }, update screen
// 'app': None, keep data already on screen
// 'apple': {'apply',...}, update screen
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

        // Start from at least 0 char.
        return this.doQuery([], cs, this.__trie)
    } 

    // Character(s), other characters and current tree.
    ,doQuery: function(cstr, cs, ctree)
    {
        var match = ctree[cstr.join("")]

        // a | pple -> ap | ple -> ... apple { ... }
        while( undefined === match && 0 != cs.length )
        {
            cstr.push(cs.shift())
            match = ctree[cstr.join("")]
        }

        if(0 == cs.length)
        {
            return match   // Can't find will be {}; successful result also can use this condition.
        }

        // Already match out cstr, discard them and continue.
        return this.doQuery([], cs, match)
    }
}
