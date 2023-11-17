// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT License
"use strict";
const dst_href_article = location.href;
const dst_pathname_article = location.pathname;
const load_text_article = text => {
	const dst_text = document.doctype+document.documentElement.outerHTML;
	const parser = new DOMParser();
	const domdoc = parser.parseFromString(text, "text/html");
	const dommain = domdoc.getElementById("docs-main");
	const submain = document.getElementById("docs-main") ?? document.body;
	history.replaceState(null, "", ".");
	const title = document.title;
	document.head.replaceWith(domdoc.head);
	document.body.replaceWith(domdoc.body);
	document.title = title;
	while (dommain.firstChild) {
		dommain.lastChild.remove();
	}
	document.getElementById("docs-script").remove();
	const style = document.createElement("link");
	style.rel = "stylesheet";
	style.href = "docs.css";
	style.href = style.href;
	document.head.append(style);
	const script = document.createElement("script");
	script.dataset.noStyle = "true";
	script.dataset.srcHost = location.host;
	script.dataset.srcPathname = location.pathname;
	script.src = "docs.js";
	script.src = script.src;
	history.replaceState({
		src_pathname: location.pathname,
		dst_pathname_article: dst_pathname_article,
		dst_text: dst_text,
	}, document.title, dst_href_article);
	document.head.append(script);
};
(async () => {
	const response = await fetch(".");
	if (!response.ok) {
		throw new Error(`Bad response code ${response.status}.`);
	}
	const text = await response.text();
	if (document.readyState === "complete") {
		load_text_article(text);
	} else {
		addEventListener("load", event => load_text_article(text));
	}
})();
// @license-end
