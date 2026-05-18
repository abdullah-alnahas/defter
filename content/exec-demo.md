+++
title = "Executable code block"
lang = "en"
dir = "ltr"
date = "2026-05-15"
tldr = "Fenced code blocks with the `exec` info-string render as sandboxed iframes that actually run. `print(...)` writes a line to the output area; thrown errors render in red."
+++

A fenced code block with the `exec` info-string is rendered as a sandboxed iframe instead of a static `<pre>`. The iframe runs `allow-scripts` only — no same-origin, no top navigation, no forms — so it can't reach the parent page or the network in any meaningful way.

The runtime exposes a single helper `print(...)` that appends each argument to the output area. Thrown errors render in red.

```exec
print('hello from a sandboxed frame');
print(2 + 2);
print({ ok: true, n: [1, 2, 3] });
```

You can write any JS expression. The output area updates synchronously on iframe load.

```exec
const fib = (n) => n < 2 ? n : fib(n-1) + fib(n-2);
for (let i = 0; i < 8; i++) print(`fib(${i}) = ${fib(i)}`);
```

If your code throws, the message lands in the output instead of taking the parent page down with it.

```exec
throw new Error('demonstrating the error path');
```
