/* Conservative, lazy syntax highlighting for post code blocks.
 *
 * highlight.js auto-detection (highlightAll) guesses a language for every
 * <pre><code>, which mis-colors the console dumps, Splunk SPL, and log
 * output that fill these writeups — confidently-wrong coloring is worse
 * than none. Instead we classify each block by a strong signature and only
 * highlight the ones we can identify; everything else stays plain mono.
 *
 * highlight.js itself (~120KB) is loaded from the CDN only if at least one
 * block qualifies, so posts that are all console/SPL pay nothing.
 */
(function () {
  var HLJS_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
  var HLJS_SRI = 'sha512-D9gUyxqja7hBtkWpPWGt9wfbfaMGVt9gnyCvYa+jojwwPHLCzUm5i8rpk7vD7wNee9bA35eYIjobYPaQuKS1MQ==';
  var LANGS = ['bash', 'powershell', 'python', 'json', 'sql', 'xml', 'dockerfile'];

  // Strong, line-anchored signatures so an embedded keyword (e.g. a SELECT
  // inside a quoted CLI arg) doesn't trigger a match. First match wins.
  var SIGNATURES = [
    ['python',     /(^|\n)\s*(import\s+\w|from\s+[\w.]+\s+import\s|def\s+\w+\s*\(|class\s+\w+[\s(:])/],
    ['json',       /^\s*[{[][\s\S]*[}\]]\s*$/],
    ['sql',        /(^|\n)\s*(SELECT\s|INSERT\s+INTO\s|UPDATE\s+\w+\s+SET\s|CREATE\s+(TABLE|DATABASE)\s|ALTER\s+TABLE\s)/i],
    ['xml',        /^\s*<\?xml|^\s*<[a-zA-Z][\w:-]*(\s|>|\/)/],
    ['powershell', /(^|\n)\s*(Get|Set|New|Remove|Import|Export|Invoke|Start|Stop|Enable|Disable|Add|Test)-[A-Z]\w+/],
    ['dockerfile', /(^|\n)\s*(FROM|RUN|CMD|ENTRYPOINT|COPY|WORKDIR)\s+\S/],
  ];
  // YAML is deliberately omitted: a bare "key: value" line matches far too
  // much console/search output to classify safely. Genuine YAML renders plain.

  // Blocks we must NOT highlight: console/log output, and Splunk SPL (which
  // hljs can't parse and would force-fit to the nearest supported grammar).
  // The last clause catches "user@host:~/path$ cmd" and "root# cmd" prompts.
  var CONSOLE = /(^|\n)\s*(\$\s|#\s|>\s|PS[ >]|[A-Za-z]:\\|\d{4}-\d{2}-\d{2}[ T]\d|\[\*\]|\[\+\]|\[-\])|(^|\n)\s*[\w.-]+@[\w.-]+:[^\n]*[$#]\s/;
  var SPL = /(^|\n)\s*index\s*=|\bsourcetype\s*=|(^|\n)\s*\|\s*(search|stats|eval|table|rex|timechart|where|tstats|dedup|rename|fields|sort|top)\b/;

  function classify(text) {
    if (CONSOLE.test(text) || SPL.test(text)) return null;
    for (var i = 0; i < SIGNATURES.length; i++) {
      if (SIGNATURES[i][1].test(text)) return SIGNATURES[i][0];
    }
    return null;
  }

  var targets = [];
  document.querySelectorAll('.post-article pre > code').forEach(function (block) {
    var lang = classify(block.textContent || '');
    if (!lang) return; // leave plain
    block.classList.add('language-' + lang);
    targets.push(block);
  });
  if (!targets.length) return; // nothing to highlight — don't fetch hljs

  var s = document.createElement('script');
  s.src = HLJS_SRC;
  s.integrity = HLJS_SRI;
  s.crossOrigin = 'anonymous';
  s.referrerPolicy = 'no-referrer';
  s.onload = function () {
    if (!window.hljs) return;
    try { hljs.configure({ languages: LANGS }); } catch (e) { /* shape drift */ }
    targets.forEach(function (block) {
      try { hljs.highlightElement(block); } catch (e) { /* leave plain on error */ }
    });
  };
  document.head.appendChild(s);
})();
