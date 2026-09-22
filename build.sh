#!/bin/bash
# Assemble tous les fichiers en une seule page : officine.html (à côté de ce script)
cd "$(dirname "$0")"
{ cat head.html style.css body.html data.js engine.js art.js ui.js; echo '</script>'; echo '</body></html>'; } > officine.html
sed -n '/^<script>$/,/^<\/script>$/p' officine.html | sed '1d;$d' > /tmp/officine_check.js
node --check /tmp/officine_check.js && echo "OK : officine.html généré"
