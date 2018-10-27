```
> var object = { 'a': 'apple', 'b': 'banana' }
> object
{ a: 'apple', b: 'banana' }
> object.a
'apple'
> object['a']
'apple'
> object[a]
undefined
> var test = 'a'
> object[test]
'apple'
> object.test
undefined
```


`// jshint esversion:6, asi:true`

Please format your code:  
\```  
Code goes here, backticks go on their own line.  Previous posts can be edited.  `control + shift + m` for detailed Markdown Help.  
\```

https://mdn.io/working_with_objects

Functions, Parameters, Arguments, and `arguments`:
```
function interpolate(param1, param2){
   return param1 + ' ' + param2 + ' ' + arguments[2]
}
interpolate('tic', 'tac', 'toe') // 'tic tac toe'
```


Almost useless:
```
function print(str){
    console.log(str)
}
```
More useful:
```
function interpolate(param1, param2){
   return param1 + ' ' + param2 + ' ' + arguments[2]
}
interpolate('tic', 'tac', 'toe') // 'tic tac toe'
```

Even better using ES6/Template Literals:
```
const interpolate = (param1, param2, ...rest) => `${param1}, ${param2}, ${rest}`
interpolate('run', 'run', 'as fast as you can!') // 'run, run, as fast as you can!'
```


Thank you for your contribution.  At this time we have decided not to merge your pull request.  We welcome future pull requests from you.

Happy Coding!

Looks good to me, and congratulations on your first Pull Request!  🎉🎉🎉
We look forward to future contributions!

This looks great to me.  Thank you for your contribution!



 > ### Quality Standards
 > In line with Hacktoberfest value #2 (Quantity is fun, Quality is key), we have provided examples of the quality standards we encourage. This applies mainly to beginners.
 > 
 > * PRs that are automated e.g. scripted opening PRs to remove white space / optimize images.
 > * PRs that are disruptive e.g. taking someone else's branch/commits and making a PR.
 > * PRs that are regarded by a project maintainer as a hindrance vs. helping.
 > * Something that's clearly an attempt to simply +1 your PR count for October.

 Learn more at https://hacktoberfest.digitalocean.com/details