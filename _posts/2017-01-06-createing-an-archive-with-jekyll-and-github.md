---
layout: post
title: Creating an Archive with Jekyll and GitHub
date: 2017-01-06 17:51:38 +0100
tags:
    - Jekyll
    - GitHub
    - Liquid
    - workaround
---
# Introduction
There are a number of plugins available for Jekyll, which aid in
creating archives. For example
[jekyll-archives](https://github.com/jekyll/jekyll-archives/). This
plugins enables you to generate content at permalinks, i.e.
`https://www.example.com/2017/`. Unfortunately, this plugin is not on
the endorsed plugin [list](https://pages.github.com/versions/) at
GitHub. This means that this plugin is not usable when you publish on
GitHub.

Not having the plugin does not mean that archives are out of the
question, it means you need to do a bit more work to get it working.
There are several workarounds. One is of those is described at
[mrlog.se](http://mrloh.se/2015/06/automatic-archives-for-jekyll-on-github-pages/).
In brief, you write your own plugin that runs on a local build only to
collect the data you need to create an archive and write those data to a
file. When GitHub builds your site, obviously the plugin does not run.
That is fine, as you already have collected the necessary data. With this
data and a corresponding layout file, the archives page can be created
at GitHub.

Although the above works fine, there is one drawback and that is the
data file. The generation will be done automatically, but the file
needs to be committed by Git and pushed to GitHub. This can be done by a
script of course to further automate the process. However, it still
requires to be run each time the data file is updated.

My preference is to have the jekyll-archives plugin enabled for GitHub
and if not possible, I'd like to have the process as automated as
possible. This can almost be achieved by adding a number of archives files at
the proper places and having a corresponding layout file for generating the
content. This is almost the same as the just mentioned workaround, but not
quite.

With this last method, there is no need to generate a data file locally
and get it into the remote git repository. However, we still need a
method to create the archives files. This is now done by adding them
beforehand and filling those with the correct content when the site is
build. One could add a new archive page each time a new one is needed.
This does not sound very appealing. In fact we are not mitigating the
issue we had with the getting the updated data file in the remote
repository. Adding a large number of archive pages solves the issue of
adding them at a regular basis. One could add archive pages for the next
thirty years. If you add a bit of humor to it for archives that cannot
exist yet and you have a workaround that is rather usable.

# Implementation
In order to get the proposed method working, we need to solve two parts
of the puzzle. First is the starting point of the archive page, i.e. the
file that triggers the loading of a layout page and subsequent generation of a
page. Then of course is the layout page itself. For clarity the below examples
contain as little styling as possible to keep them as readable as possible.

## The archive generator page
Blog posts have a peramlink and this can be changed in the `_config.yml`
file if you wish. For the discussion it is assumed that blogs are posted
at: `/:year/:month/:post`. We only need the `year` part as, so any other
permalink starting with `'/:year/` will be fine. The goal is to get an
archive page for each year, listing the post for that year. Since we
know where the posts will end up after being generated, we could make
use of this knowledge. We'll add an archive file for each year we would
like to have an archive for. I like to create archives for a good number
of years to come. Let's say until 2050. I think my bloggng days will be
over by then. This is achieved by adding directories and placing an
`index.html` in each of them.

{% highlight bash linenos %}
mkdir 2017

cat << EOF > 2017/index.html
---
layout: archive-year
title: Archive - 2017
---
EOF

for i in $(seq 2018 2050); do mkdir $i && cat 2017/index.html | sed "s/2017/$i/" >> $i/index.html; done

git add 20[1-5][0-9]

git commit -m 'Adding archive pages 2017-2050'

git push

{% endhighlight %}

Lines 3--8 fill the `index.html` with the appropriate content. It is
necessary to specify the layout file and optionally a title. The
layout file is responsible for generating the archive content. Once the
first archive page has been created, the next thirty or so need to be
created as well in line 10. First the directory is created and the
`index.html` file copied with the year substituted by `sed`. Finally,
the newly created content is committed and pushed to the remote
repository in the remaining lines.

## The layout file
The real work is done in the layout file. It is responsible for
collecting all the posts belonging to a particular year. Below is the
Liquid code that does just that. The layout file also contains a bit of
`html` to display the posts.

{% highlight html linenos %}
{% raw %}
<html lang="en">
    {% include head.html %}
    <body>
        {% assign posts = site.emptyArray %}

        {% assign pageYear = page.dir | split: '/' %}
        {% assign pageYear = pageYear[1] %}

        {% for post in site.posts %}
            {% assign postYear = post.date | date: '%Y' %}
            {% if postYear == pageYear %}
                {% assign posts = posts | push: post %}
            {% endif %}
        {% endfor %}

        <h1>Posts from {{ pageYear }}</h1>
        <ul>
            {% for post in posts %}
            <li>
                {{ post.date | date: "%b %-d, %Y" }}
                <a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
            </li>
            {% endfor %}
        </ul>
    </bodoy>
</html>
{% endraw %}
{% endhighlight %}

The `{% raw %}{% include head.html %}{% endraw %}` on the second line is
there to create a valid `<head>` section. The important part is on
lines 4--14. A number of variables are automatically included when the
page is being generated. These variables can be used during the liquid
templating execution. The `page` variable contains a `dir`, which tells
us the path of the page being generated. In our case this will be
`/2017/` for the first directory. Lines 6 and 7 extract the year from
the `page.dir` variable. This information is then used to gather all
posts of that year in lines 9--14. We iterate over all posts and only
collect those that match the given year. That is in lines 11--13.

The `posts` variables is used to store all the corresponding posts and
is initialized at line 4. The configuration file contain the value of an
empty array as there is no way to initialize an array in Liquid. Lines
16--24 are used to display the `posts` array in a list, thus rendering a
valid html page containing the posts of 2017, which works nicely with
GitHub pages. You can see the [results]({{ site.url }}{{ site.baseurl }}/2017)
for yourself.

# Final Thoughts
You'll end up with a considerable amount of directories at the root
level. If this bothers you, you could add the directories to `archive`
instead, or any other location you wish. You will need to change line 5
in the section code example to adjust to the new location.
