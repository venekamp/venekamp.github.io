---
layout: post
title: Creating a Tag Page in Jekyll
date: 2016-12-25 14:33:31 +0100
tags: Jekyll Liquid
---
# Finding back a post
Writing a blog post is one thing, finding them back is another. These
blog posts are not just about telling wonderful stories, but also a
place where I put things I have learned. As you can imagine, I would
like to find these pieces of information back. For that purpose I use
tags. So, this means that there should be a page on which the posts are
listed according to the tags it belongs to.

## A bit of background
Before delving deeper into the creating of a tags page, there are number
of things that need to be explained first. The blogs and all related
pages are build using [Jekyll](https://jekyllrb.com). Jekyll creates
static content for you. Writing blog posts is conveniently done with
[markdown](https://daringfireball.net/projects/markdown/). Behind the
scenes, Jekyll makes use of a template engine called
[Liquid](https://shopify.github.io/liquid/). Jekyll allows mixing of
markdown and Liquid. This makes it possible to use to both extract the
tag information using Liquid as creating the
[tags]({{ site.url }}/tags/) page with markdown.

Markdown on its own does not create web pages. It creates the content
that is shown on those pages. In order to create, and style, the web
pages, Jekyll needs to be fed with plain HTML and css. What you do is
create a layout file which describes the page all but the content. This
page, together with the content in markdown, creates the page that will
be published. The Liquid templating can be used in both the markdown
content and page description.

With the above in mind, I will explain how to create a
[tags]({{ site.url }}/tags/) page within Jekyll.

# Putting it all together
I have a preference for clean URLs. Strictly speaking this is no
requirement to get the tags page working. It is just my preference. I
would like my tags page to have to following URL: `{{ site.url }}/tags/`.
This I do, because Jekyll only creates static content and not dynamic.
Inside the `tags` directory there is an `index.html` file. This file
yields html that contains tags and posts belonging to tags. However, it
does not yield a valid html document. The `index.html` has front matter
that specifies a layout page. It is this page that defines the web page,
but lacks content. It is the `index.html` that provides the content for
the layout page.

## The layout page
The page that defines the layout of the tags page is placed in the
`_layout/` directory. Let's call this `tags-page.html`. Now let us
define a minimal html page for it. That would look like this:

<div class="blog-figure">
{% highlight html linenos %}
<!DOCTYPE html>
<html lang="en">
    <head>
        <!-- Required meta tags always come first -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
    </head>
    <head>
        <meta charset=utf-8>
        <title>{{ "{{ page.title " }}}}</title>
    </head>
    <body>
        {{ "{{ content " }}}}
    </body>
</html>
{% endhighlight %}
<span class="blog-figure-caption">
<span class="blog-figure-number">Figure 1:</span>
<span class="blog-figure-text">
  Example of a minimal layout page that generates a valid HTML document.
</span>
</span>
</div>
As can be seen it is void of any markup or other structure of an html
page. Two things should be noticed. There are two places where Liquid is
being used:

1. At line 11, the title of the page is set by `{{ "{{ page.title "}}}}`;
2. More importantly, the content is set at line 14 by
   `{{ "{{ content "}}}}`.

That all that there is to the `tags-page.html` file. If you want to add
styling, you can do so by adding `class=...` at the appropriate places,
or if you want things like headers or footers, at the relevant html
code.

## What's in index.html?
Most of the work is done in the `index.html` part. Its content is as
follows:

<div class="blog-figure">
{% highlight markdown linenos %}
---
layout: tags-page
title: Tags
---

{{ "{% assign dateSortedPosts = site.posts | sort: 'date' " }}%}

<div>
    {{ "{% assign sortedTags = site.tags | sort " }}%}
    <ul style="list-style-type: none; padding-left: 0">
        {{ "{% for tag in tags " }}%}
            <li>{{ "{{ tag[0] "}}}} <span>({{ "{{ tag[1] | size "}}}})<span></li>
        {{ "{% endfor "}}%}
    </ul>
</div>

<div>
    {{ "{% for tag in sortedTags " }}%}
        <h1>{{ "{{ tag | first "}}}}</h1>
        <ul style="list-style-type: none; padding-left: 0">
            {{ "{% for post in dateSortedPosts " }}%}
                {{ "{% for postTag in post.tags " }}%}
                    {{ "{% if postTag == tag[0] " }}%}
                        <li>
                            <span>{{ "{{ post.title "}}}}</span></span>
                            <span>{{ "{{ post.date | date: '%Y-%m-%d' "}}}}</span>
                        </li>
                    {{ "{% endif " }}%}
                {{ "{% endfor " }}%}
            {{ "{% endfor " }}%}
        </ul>
    {{ "{% endfor " }}%}
</div>
{% endhighlight %}
<span class="blog-figure-caption">
<span class="blog-figure-number">Figure 2:</span>
<span class="blog-figure-text">
  Liquid code for generating a tags page. 
</span>
</span>
</div>

Let's take a closer look at the contents of `index.html`. Like the
`tags-page.html` layout file, it is void of almost all styling. Feel
free to add your own. For explaining what is happening, I like to stick
to a minimal example.

###### lines 1 -- 4
The first lines are the front matter of Jekyll of course. Here the
layout `tags-page` is specified and a title of the page as well.

###### line 6
The first things done is sorting all the posts according to their dates.
This result will be used later when the post title are match with tags.
This way the post titles appear in chronological order.

###### 8 -- 15
These lines iterate through all the tags defined in the posts. First the
tags are retrieved and sorted alphabetically (line 9). Both the tag name
and the number of occurrences are listed (line 12). An unsigned list is
used, the list-style-type is set to none and the padding removed.

###### 17 -- 33
Here the tag titles are listed for each tag. To do this, we iterate over all
known tags. Each tag will be put inside its own header (line 19) and all
matching posts are listed beneath it (lines 20-31). An unsigned list is
used to hold all the titles and post dates. To find all the posts that
match the current tag, we iterate over all posts (line 21) and see if
the current post holds the current tag. We iterate once again over all
tags that belong to the current post and match this tag to the tag for
which we are creating the post overview (line 23). If a match is found
the post.title and post.date are displayed inside a list item (lines 24
-- 27).

## Adding links
The above example lacks clickable links from the listed tags
(lines 8 -- 15) to the tags section generated in the second half. The
omission is because of keeping the example simple. The reader can add
the necessary code to the example to achieve the desired behaviour.

# There is a plugin for that!
One could use a plugin that does it all for you. Or, one could even
write your one plugin to get the best possible experience. Well, the
latter might not work for you. Depending where you publish your site,
restrictions on execution of plugins might apply. Especially when you
develop your own plugins. GitHub does not allow you to bring your own
plugins for example. By using the Liquid templating you keep control
close to yourself.

# Final thoughts
The above shows how you can create a tags page of your own. The examples
are nicely formatted for readability. However, the html output contains
a lot of white space. This is due to the way Liquid works. Each time a
template is executed, all white space outside the template is copied
over to the resulting html page. This includes any new lines. Thus lines
21 -- 23 produce three empty lines, each containing more white space.
Since these lines are part of a loop, the white space and new lines are
inserted for every loop. Thus the more tags and post you have, the more
of these white spaces are inserted into your html document.

There is a way out of this, if you would like to clean up your html.
Unfortunately it makes the code less readable. By placing each liquid
template on the same line and adjacent of an html tag, the excess white
space and new lines will not be copied over, resulting in a much cleaner
html code.
