---
title: A survival guide to the Either monad in Scala
date: "2018-12-21T11:37:00.000Z"
description: "The Either monad in Scala can be a though one, let's deal with it together!"
---

I started to work with Scala few months ago. One of the concepts that I had the most difficulties to understand is the `Either` monad. So, I decided to play around with it and better understand its power.

[![Photo by Jon Tyson on Unsplash](img/either_monad.png)](https://unsplash.com/photos/PXB7yEM5LVs?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

In this story I share what I’ve learned, hoping to help coders approaching this beautiful language.

### The Either monad

`Either` is one of the most useful monads in Scala. If you are wondering what a monad is, well… I cannot go into the details here, maybe in a future story!

Imagine `Either` like a box containing a computation. You work inside this box, until you decide to get the result out of it.

In this specific case, our `Either` box can have two “forms”. It can be (`Either`) a `Left` or a `Right`, depending on the result of the computation inside it.

I can hear you asking: “OK, and what is it useful for?”

The usual answer is: error handling.

We can put a computation in the `Either`, and make it a `Left` in case of errors, or a `Right` containing a result in case of success. The use of `Left` for errors, and `Right` for success is a convention. Let’s understand this with some code!

<iframe height="400px" frameborder="0" style="width: 100%" src="https://embed.scalafiddle.io/embed?sfid=BITfhIs/5"></iframe>

In this snippet we are only defining an `Either` variable.

We can define it as a `Right` containing a valid value, or as `Left` containing an error. We also have a computation that return an `Either`, meaning it can be a `Left` or a `Right`. Simple, isn’t it?

### Right and Left projection

Once we have the computation in the box, we may want to get the value out of it. I’m sure you expect to call a `.get` on the `Either` and extract your result.

That’s not so simple.

Think about it: you put your computation in the `Either`, but you don’t know if it resulted in a `Left` or a `Right`. So what should a `.get` call return? The error, or the value?

This is why to get the result you should make an assumption about the outcome of the computation.

Here is where the **projection** comes into play.

Starting from an `Either`, you can get a `RightProjection` or a `LeftProjection`. The former means that you assume the computation resulted in a `Right`, the latter in a `Left`.

I know, I know… this may be a little confusing. It’s better to understand it with some code. After all, **code always tells the truth**.

<iframe height="400px" frameborder="0" style="width: 100%" src="https://embed.scalafiddle.io/embed?sfid=tROJqrN/2"></iframe>

That’s it. Note that when you try to get the result from a `RightProjection`, but it is a `Left`, you get an exception. The same goes for a `LeftProjection` and you have a `Right`.

The cool thing is that you can map on projections. This means you can say: “assume it is a `Right`: do this with it”, leaving the `Left` unchanged (and the other way around).

### From Option to Either

`Option` is another common way to deal with invalid values.

An `Option` can have a value or be empty (it’s value is `Nothing`). I bet you noticed a similarity with `Either`… It’s even better, because we can actually transform an `Option` into an `Either`! Code time!

<iframe height="400px" frameborder="0" style="width: 100%" src="https://embed.scalafiddle.io/embed?sfid=VArGBNn/1"></iframe>

It is possible to transform an `Option` to a `Left` or a `Right`. The resulting side of the `Either` will contain the value of the `Option` if it is defined. Cool. Wait a minute… What if the `Option` is empty? We get the other side, but we need to specify what we expect to find in it.

### Inside out

`Either` is magic, we all agree on that. So we decide to use it for our uncertain computations. A typical scenario when doing functional programming is the mapping a function on a `List` of elements, or on a `Map`. Let’s do it with our fresh new `Either`-powered computation…

<iframe height="400px" frameborder="0" style="width: 100%" src="https://embed.scalafiddle.io/embed?sfid=wPV57BM/0"></iframe>

Huston, we have a “problem” (ok, it’s not a BIG problem, but it is a bit uncomfortable). It would be better to have the collection inside the `Either` than lots of `Either` inside the collection. We can work on that.

#### List

Let’s start with `List`. First we reason about it, then we can play with code.

We have to extract the value from the `Either`, put it in the `List`, and put the list inside an `Either`. Good, I like it.

The point is that we can have a `Left` or a `Right`, so we need to handle both cases. Until we find a `Right`, we can put its value inside a new `List`. We proceed this way accumulating every value in the new `List`.

Eventually we will reach the end of the `List` of `Either`, meaning we have a new `List` containing all the values. We can pack it in a `Right` and we are done. This was the case where our computation didn’t return an `Error` inside a `Left`.

If this happens, it means that something went wrong in our computation, so we can return the `Left` with the `Error`. We have the logic, now we need the code.

<iframe height="400px" frameborder="0" style="width: 100%" src="https://embed.scalafiddle.io/embed?sfid=MMK7iYB/7"></iframe>

#### Map

The work on `Map` is quite simple once we have done the homework for the `List` (despite needing to make it generic):

* Step one: transform the `Map` in a `List` of `Either` containing the tuple `(key, value)`.

* Step two: pass the result to the function we defined on `List`.

* Step three: transform the `List` of tuples inside the `Either` in a `Map`.

Easy Peasy.

<iframe height="400px" frameborder="0" style="width: 100%" src="https://embed.scalafiddle.io/embed?sfid=qDxJXJI/2"></iframe>

### Let’s get classy: a useful implicit converter

We introduced `Either` and understood it is useful for error handling. We played a bit with projections. We saw how to pass from an `Option` to an `Either`. We also implemented some useful functions to “extract” `Either` from `List` and `Map`. So far so good.

I would like to conclude our journey in the `Either` monad going a little bit further. The utility functions we defined do their jobs, but I feel like something is missing…

It would be amazing to do our conversion directly on the collection. We would have something like `myList.toEitherList` or `myMap.toEitherMap`. More or less like what we do with `Option.toRight` or `Option.toLeft`.

Good news: we can do it using **implicit classes**!

<iframe height="400px" frameborder="0" style="width: 100%" src="https://embed.scalafiddle.io/embed?sfid=qDxJXJI/2"></iframe>

Using implicit classes in Scala lets us extend the capabilities of another class.

In our case, we extend the capability of `List` and `Map` to automagically “extract” the `Either`. The implementation of the conversion is the same we defined before. The only difference is that now we make it generic. Isn’t Scala awesome?

Since this can be a useful utility class, I prepared for you a gist you can copy and paste with ease.

```scala
object EitherConverter {
  implicit class EitherList[E, A](le: List[Either[E, A]]){
    def toEitherList: Either[E, List[A]] = {
      def helper(list: List[Either[E, A]], acc: List[A]): Either[E, List[A]] = list match {
        case Nil => Right(acc)
        case x::xs => x match {
          case Left(e) => Left(e)
          case Right(v) => helper(xs, acc :+ v)
        }
      }

      helper(le, Nil)
    }
  }

  implicit class EitherMap[K, V, E](me: Map[K, Either[E, V]]) {
    def toEitherMap: Either[E, Map[K, V]] = me.map{
        case (k, Right(v)) => Right(k, v)
        case (_, e) => e
      }.toList.toEitherList.map(l => l.asInstanceOf[List[(K, V)]].toMap)
  }
}
```

### Conclusion

That’s all folks. I hope this short story may help you to better understand the `Either` monad.

Please note that my implementation is quite simple. I bet there are more complex and elegant ways to do the same thing. I’m a newbie in Scala and I like to [KISS](https://en.wikipedia.org/wiki/KISS_principle), so I prefer readability over (elegant) complexity.

If you have a better solution, especially for the utility class, I will be happy to see it and learn something new! 😄

See you! 🚀
