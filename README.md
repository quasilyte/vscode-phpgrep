# phpgrep for [Visual Studio Code](https://code.visualstudio.com/)

Search for PHP code using AST patterns. Uses [github.com/quasilyte/phpgrep](https://github.com/quasilyte/phpgrep) tool under the hood.

## Overview

This extension exposes `phpgrep` search commands.

![](/docs/commands.jpg "Ctrl+Shift+P phpgrep")

Every command creates a [search pattern](https://github.com/quasilyte/phpgrep/blob/master/pattern_language.md) prompt.

![](/docs/pattern.jpg "search pattern prompt")
  
Search results are printed to the **output channel** named `phpgrep`.

![](/docs/output.jpg "phpgrep output channel")

If you're familiar with [structural search and replace (SSR)](https://www.jetbrains.com/help/idea/structural-search-and-replace.html) from
the JetBrains IDEs, you can feel yourself at home. phpgrep patterns are slightly different, but the idea is the same.

## Demo

Running `$x ? $x : $y` pattern that finds all candidates for `?:` refactoring:

![](/docs/demo1.gif)

Running `if ($cond) $x; else $x` pattern that finds all if statements with duplicated then/else bodies:

![](/docs/demo2.gif)

## Extension Settings

* `phpgrep.binary`: [phpgrep](https://github.com/quasilyte/phpgrep) binary path (default `"phpgrep"`)
* `phpgrep.singleline`: print multiline results without line breaks (default `false`)

## Requirements

* [phpgrep](https://github.com/quasilyte/phpgrep) binary

Optional/recommended:
* [Output Colorizer](https://marketplace.visualstudio.com/items?itemName=IBM.output-colorizer) to make the output colorized
