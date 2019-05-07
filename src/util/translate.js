---
---
{%   if site.language == "es"
%}{%   assign lang="es"
%}{% else
%}{%   assign lang="en"
%}{% endif %}
const translation = {{ site.data.translate[lang] | jsonify }};
export default translation;