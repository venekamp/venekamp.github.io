---
layout: post
title: Adding Captions to Figures in Jekyll
date: 2017-01-11 22:07:45 +0100
tags:
    - Jekyll
    - Workaround
---

# Can my Figures have Captions?
Jekyll does not support adding caption to figures. Judging from
[this](https://github.com/jekyll/jekyll/issues/5020) post, it doesn't
look like it will. Does this mean we cannot have captions? Fortunately
no, it doesn't. It means a bit of extra work to workaround the this
limitation.

Putting a little bit of html code after a `{% raw %}{% highlight
%}{% endraw %}` section together with styling, you can achieve the
desired effect. In markdown you are allowed to use html. The workaround
consists out of two parts. The first part is the html with added
classes for addition styling as shown in Figure 1. Then Figure 2 shows
the stylesheet that positions and styles the caption.

{% highlight markdown linenos %}
{% raw %}
{% highlight markdown linenos %}
# This is an example figure

This figure is used to demonstrate how to add a caption to your {%
highlight %} sections.

{% endhighlight %}
<div class="figure-caption">
    <span class="label">Figure 1:</span>
    <span class="text">
        Captions are added by creating additional html tags and subsequent
        styling to put the elements at their proper place and shape.
   </span>
</div>
{% endraw %}
{% endhighlight %}
<div class="figure-caption">
    <span class="label">Figure 1:</span>
    <span class="text">
        Captions are added by creating additional html tags and subsequent
        styling to put the elements at their proper place and shape.
    </span>
</div>

{% highlight css linenos %}
.figure-caption {
    position: relative;
    font-size: .9rem;
    color: #655650;
    top: -0.5rem;
    margin-bottom: 1rem
}

.figure-caption .figure-label {
    font-weight: 400
}

.figure-caption .figure-text {
    font-weight: 300
}
{% endhighlight %}
<div class="figure-caption">
    <span class="label">Figure 2:</span>
    <span class="text">
        Stylesheet for positioning and styling captions.
    </span>
</div>
