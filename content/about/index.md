---
title: "About"
author: "Yann Daout"
date: "2019-08-01"
eleventyNavigation:
  key: About
  order: 5
layout: layouts/page.njk
---

This blog explores the topics of skill acquisition and movement education. It is targeted to coaches, teachers, practitioners and sport science students.

The blog co-creators were brought together by a common background in both sport sciences and parkour.

    {%- for author in authors %}
    <img src="{{ author.photo }}" class="author-photo" alt="Picture of {{ author.name }}">
    <p><a href="/authors/{{ author.key | slugify }}/">{{ author.name }}</a> {{ author.bio }}</p>
    {% endfor -%}


Unless stated otherwise, all our content is released under a [CC BY-NC-SA 4.0 Deed](https://creativecommons.org/licenses/by-nc-sa/4.0/). You may share and modify our articles, as long as you credit us !