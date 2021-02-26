# Demo-Mostly-Graphql

### ABOUT:

* This demo is mostly about graphql. 


### TODO (trying to figure out):

* `RESTfulExample.js`: The problem is initial queries all fetch using `pageSize` cursor value. Should probably track which page of `googleBooks` to fetch per query (a `ROOT_QUERY` `cursors` object) or define individual field policy for each specified query (input query would require it's own solution).


### TODO (know how to fix):

* Refactor GoogleBookBook: `setBookFavorite` toggle will read and write to the cache


### Comments
