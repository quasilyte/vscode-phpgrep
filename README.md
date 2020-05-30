[![Version](https://vsmarketplacebadge.apphb.com/version-short/quasilyte.phpgrep.svg)](https://marketplace.visualstudio.com/items?itemName=quasilyte.phpgrep)
[![Installs](https://vsmarketplacebadge.apphb.com/downloads-short/quasilyte.phpgrep.svg)](https://marketplace.visualstudio.com/items?itemName=quasilyte.phpgrep)

# phpgrep for [Visual Studio Code](https://code.visualstudio.com/)

Search for PHP code using AST patterns. Uses [github.com/quasilyte/phpgrep](https://github.com/quasilyte/phpgrep) tool under the hood.

## Features

* Search PHP code using smart matching instead of regexps
* Find similar code fragments
* AST-based replace for quick and precise refactoring (**to be implemented**)
* Advanced search filters (**to be implemented**)

## Overview

This extension exposes `phpgrep` search commands.

![](/docs/commands.jpg "Ctrl+Shift+P phpgrep")

Every command creates a [search pattern](https://github.com/quasilyte/phpgrep/blob/master/pattern_language.md) prompt.

![](/docs/pattern.jpg "search pattern prompt")
  
Search results are printed to the **output channel** named `phpgrep`.

![](/docs/output.jpg "phpgrep output channel")

The pattern language is syntactically identical to PHP. Only variable nodes meaning is slightly different.

Instead of matching a literal variable, every `$<expr>` matches a certain class of AST nodes. A simple variable, like `$x` would match any expression (or statement). If a single variable used more than once in a pattern, all occurences must match identical nodes. So, `$x=$x` finds all self-assignments. Use `$_` if you don't want to name a variable (repeated `$_` variables do not cause submatch comparison).

Advanced queries may include special variable nodes: `foo(null, ${"*"})` finds all `foo` function calls where the first argument is `null` and all other arguments are ignored. Read [docs](https://github.com/quasilyte/phpgrep/blob/master/pattern_language.md) to learn all phpgrep tricks.

> Reminder: `${"varname"}` is a valid PHP variable syntax and is identical to `$varname` with the exception that it allows chars that are not permitted in conventional syntax.

Some example search patterns:

* `@$_` - find all usages of error supress operator
* `in_array($x, [$y])` - find `in_array` calls that can be replaced with `$x == $y`
* `$x ? true : false` - find all ternary expressions that could be replaced by just `$x`
* `$_ ? $x : $x` - find ternary expressions with identical then/else expressions
* `$_ == null` - find all `==` (non-strict) comparisons with `null`
* `$x != $_ || $x != $y` - find || operators where comparison with `$y` may be redundant
* `[${"*"}, $k => $_, ${"*"}, $k => $_, ${"*"}]` - find array literals with at least 1 duplicated key
* `for ($_ == $_; $_; $_) $_` - find `for` loops where `==` is used instead of `=` inside init clause
* `foo($_, ${"int"})` - find `foo` calls where the second argument is integer literal
* `array_map($_, ${"func"})` - find potentially incorect arguments order for `array_map` calls

To run "find similar" query, run any main search command (e.g. `phpgrep.searchFile`) with non-empty selection. Selected text will be used as a search pattern. Note that multi-statement search is not implemented yet.

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
* `phpgrep.limit`: limit to this many search results per query (default `100`)

## Requirements

* [phpgrep](https://github.com/quasilyte/phpgrep/releases/tag/v0.7.0) binary

Optional/recommended:
* [Output Colorizer](https://marketplace.visualstudio.com/items?itemName=IBM.output-colorizer) to make the output colorized
