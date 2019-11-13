---
title: "Passing JavaScript functions as parameters &mdash; and the C# equivalent"
date: 2019-10-26
---

Recently, I was helping a collegue with some JavaScript frontend code. He had a method that accepted a callback, which was defined inline, something like:

``` js
document.querySelector("#someSelector").addEventListener("mousedown", function(event){
  // process event
});
```

The callback wasn't particularly long, but it was still a few dozen lines, so I suggested extracting it into its own function and passing that function as the parameter:

``` js
function mouseDownHandler(event){
  // process event
}

document.querySelector(".mouseEventsSurface").addEventListener("mousedown", mouseDownHandler);
```

My collegue didn't know about this. I made a comment about how it's very similar to what you can do in C#, and how it comes into use in particular with LINQ, but he wasn't familiar with that either.

Think of a simple method:

``` js
public bool IsEvenNumber(int value)
{
    return value % 2 == 0;
}
```

When using LINQ, I can use this method the following way:

``` csharp
Enumerable.Range(1, 10).Where(x => IsEvenNumber(x));
```

But I can also use it like this:

``` csharp
Enumerable.Range(1, 10).Where(IsEvenNumber);
```

How does this work? This is the signature of `Where`:

``` csharp
public static IEnumerable<TSource> Where<TSource> (this IEnumerable<TSource> source, Func<TSource,bool> predicate);
```

As an extension method, it takes one parameter, `Func<TSource,bool>`. What is `Func<TSource,bool>`? It's a delegate:

``` csharp
public delegate TResult Func<in T,out TResult>(T arg);
```

This means that it's possible to utilise method group conversions by passing a method with a matching signature as the delegate and use it as the predicate. The compiler will take care of overload resolution to pick the appropriate method if the method has overloads.
