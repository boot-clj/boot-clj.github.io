---
layout: home
class: home
logo: /assets/images/logos/boot-logo-3.png
h1: Boot
h2: Build tooling for Clojure
actions:
- title: Get Started
  href: https://github.com/boot-clj/boot#install
---

<div class="promo">
  <div class="promo-graphic">
    <img src="/assets/images/graphics/clojure-3.png"/>
  </div>
  <div class="promo-text">
    <h2>Builds are programs.  Let's start treating them that way.</h2>
    <p>Most build tools are <a href="http://en.wikipedia.org/wiki/Declarative_programming">declarative</a>, and for a long time they worked well for us.  The problem is that the increasing number of platform, framework, and library combinations have made it impossible for these tools to be both declarative and comprehensive.  Instead of a special-purpose <a href="http://en.wikipedia.org/wiki/Domain-specific_language">DSL</a>, Boot supplies abstractions and libraries you can use to automate nearly any build scenario with the full power of the <a href="http://clojure.org/">Clojure</a> language.  It's not a build tool - it's build tooling.
    </p>
  </div>
</div>

<div class="features">
  <ul>
    <li>
      <img src="/assets/images/graphics/exe.png"/>
      <strong>Write quick Clojure scripts</strong>
      <span>without a project context using <a href="https://github.com/boot-clj/boot/wiki/Scripts">shebang support</a></span>
    </li>
    <li>
      <img src="/assets/images/graphics/tree.png"/>
      <strong>Managed filesystem tree</strong>
      <span>provides a scoped, immutable, append-only <a href="https://github.com/boot-clj/boot/wiki/Filesets">interface</a>.</span>
    </li>
    <li>
      <img src="/assets/images/graphics/classloader.png"/>
      <strong>Easy classpath isolation</strong>
      <span>with <a href="https://github.com/boot-clj/boot/wiki/Pods">pods</a> lets you run separate Clojure runtimes without separate JVMs.</span>
    </li>
    <li>
      <img src="/assets/images/graphics/uncoupled.png"/>
      <strong>Tasks are not coupled</strong>
      <span>via hardcoded file paths or magical keys in a global configuration map.</span>
    </li>
    <li>
      <img src="/assets/images/graphics/pipeline.png"/>
      <strong>Compose build pipelines</strong>
      <span>in the project, in the build script, in the REPL, or on the command line.</span>
    </li>
    <li>
      <img src="/assets/images/graphics/fresh.png"/>
      <strong>Artifacts can never be stale.</strong>
      <span>There is no need for a <code>clean</code> task.</span>
    </li>
  </ul>
</div>
