---
layout: main-page
title: blog.venekamp.eu
---

<div class="container-fluid">
    <div class="row">
        <div class="col-sm-12 preliminary">
			{{ site.tagline | markdownify }}
        </div>
    </div>
</div>

<div class="content">
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-8 posts-column">
                {% for post in site.posts %}
                <div class="post">
                    <div class="post-creation">
                        <span class="post-year">{{ post.date | date: "%Y" }}</span>
                        <span class="post-date">{{ post.date | date: "%a, %b %d" }}</span>
                        <span class="post-time">{{ post.date | date: "%H:%M" }}</span>
                    </div>
                    <h1><a class="post-title" href="{{ post.url }}">{{ post.title }}</a></h1>
                    <div style="font-size: 0.85em; margin-bottom: 1em">
                        {% assign num_of_posts = post.tags | size %}
                        {% if num_of_posts > 0 %}
                        <span><i class="fa fa-tags"></i></span>
                        {% endif %}
                        <ul style="display: inline; color: #aaa; font-weight: 300; list-style-type: none; padding: 0; margin: 0">
                            {% for tag in post.tags %}
                            {% assign last = post.tags | last %}
                            {% if tag == last %}
                            <li style="display: inline-block"><a href="{{ site.url }}/tags/index.html#{{ tag }}-link">{{ tag }}</a></li>
                            {% else %}
                            <li style="display: inline-block"><a href="{{ site.url }}/tags/index.html#{{ tag }}-link">{{ tag }}, </a></li>
                            {% endif %}
                            {% endfor %}
                        </ul>
                    </div>
                    {% if forloop.index0 < 5 %}
                        <div class="post-body">{{ post.excerpt }}</div>
                    {% endif %}
                </div>
                {% endfor %}
            </div>
        </div>
    </div>
</div>
