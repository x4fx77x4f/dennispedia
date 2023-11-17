// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT License
"use strict";

if (!document.currentScript.dataset.noStyle) {
	const style = document.createElement("link");
	style.rel = "stylesheet";
	style.href = "docs.css";
	document.head.append(style);
}

let main = document.getElementById("docs-main");
const nav = document.getElementById("docs-nav");
main.parentNode.insertBefore(nav, main);
main.parentNode.insertBefore(document.createElement("hr"), main);

const die = (href, message) => {
	console.log(message);
	while (main.firstChild) {
		main.lastChild.remove();
	}
	const p = document.createElement("p");
	if (message) {
		p.textContent = message;
	}
	main.append(p);
	if (href) {
		const alternative = document.createElement("p");
		alternative.append(document.createTextNode("You could try "));
		const a = document.createElement("a");
		a.textContent = "visiting the page directly";
		a.href = href;
		alternative.append(a);
		alternative.append(document.createTextNode("."));
		main.append(alternative);
	}
	return p;
}
const src_host = document.currentScript.dataset.srcHost ?? location.host;
const src_pathname = document.currentScript.dataset.srcPathname ?? location.pathname;
const load_text = text => {
	const parser = new DOMParser();
	const subdoc = parser.parseFromString(text, "text/html");
	const base = subdoc.baseURI.replace(/[^\/]+$/, "");
	let submain = subdoc.getElementById("docs-main");
	if (submain) {
		main.replaceWith(submain);
		main.remove();
		main = submain;
	} else {
		console.warn("No #docs-main! Falling back to moving children of body.");
		submain = subdoc.body;
		while (main.firstChild) {
			main.lastChild.remove();
		}
		const children = submain.childNodes;
		for (let i=children.length-1; i >= 0; --i) {
			const child = children[i];
			if (child.tagName && child.tagName.toUpperCase() === "NAV") continue;
			main.prepend(child);
		}
		submain.remove();
	}
	if (location.hash) {
		location.hash = location.hash;
	}
	for (const a of main.getElementsByTagName("a")) {
		const href = a.getAttribute("href");
		if (href.startsWith("#")) return;
		const url = new URL(href, base);
		if (url.host !== location.host) return;
		a.href = url.href;
		a.addEventListener("click", event => a_click(event, a));
	};
	let title = subdoc.title;
	if (!title) {
		console.warn("No article title. Falling back to first h1.");
		const h1 = document.getElementsByTagName("h1")[0];
		if (h1) {
			title = h1.innerText;
		} else {
			console.warn("No fallback title either?");
		}
	}
	if (title) {
		const name = "Dennispedia";
		document.title = title.endsWith(name) ? title : `${title} — ${name}`;
	}
	return title;
}
const load = async (dst_href, dst_pathname, dst_text) => {
	if (dst_text) {
		return load_text(dst_text);
	}
	die(null, "Loading...");
	try {
		const response = await fetch(dst_href);
		if (!response.ok) {
			throw new Error(`Bad response code ${response.status}.`);
		}
		const text = await response.text();
		const title = load_text(text);
		history.replaceState({
			src_pathname: src_pathname,
			dst_pathname: dst_pathname,
			dst_text: text,
		}, title, dst_href);
	} catch (error) {
		die(dst_href, error);
		throw error;
	}
};
const a_click = (event, a) => {
	if (a.host !== src_host) {
		return;
	}
	const dst_pathname = a.dataset.pathname;
	const dst_href = a.href;
	console.log(`Loading article "${dst_href}"`);
	history.pushState({
		src_pathname: src_pathname,
		dst_pathname: a.dataset.pathname,
	}, "", dst_href);
	load(dst_href, dst_pathname);
	if (event) {
		event.preventDefault();
	}
};
const as = nav.getElementsByTagName("a");
const get_href = dst_pathname => `${location.protocol}//${src_host}${dst_pathname}`;
for (const a of as) {
	if (a.host !== src_host) {
		continue;
	}
	a.dataset.pathname = a.pathname;
	const dst_pathname = `/${src_pathname}/${a.getAttribute("href")}`.replace(/\/+/g, "/");
	a.href = get_href(dst_pathname);
	a.addEventListener("click", event => a_click(event, a));
};
const popstate = state => {
	state = state ?? history.state;
	if (!state) return;
	load(get_href(state.dst_pathname), state.dst_pathname, state.dst_text);
};
window.addEventListener("popstate", () => popstate());
if (history.state && !document.currentScript.dataset.noPopstate) {
	popstate();
} else {
	history.replaceState({
		src_pathname: src_pathname,
		dst_pathname: location.pathname,
		dst_text: main.innerHTML,
	}, document.title, location.href);
}

const search_landmark = document.getElementById("docs-search");
const homepage = document.createElement("a");
homepage.href = src_pathname;
homepage.textContent = "Dennispedia";
search_landmark.parentElement.insertBefore(homepage, search_landmark);
search_landmark.parentElement.insertBefore(document.createElement("br"), search_landmark);
const search = document.createElement("input");
search.type = "search";
const label = document.createElement("label");
label.append(document.createTextNode("Search: "));
label.append(search);
search_landmark.replaceWith(label);
search.addEventListener("input", event => {
	const value = search.value.normalize().toLowerCase();
	if (!value) {
		for (const a of as) {
			a.parentElement.classList.remove("docs-hidden");
		};
		return;
	}
	for (const a of as) {
		if (a.textContent.toLowerCase().includes(value)) {
			a.parentElement.classList.remove("docs-hidden");
		} else {
			a.parentElement.classList.add("docs-hidden");
		}
	};
});

for (const el of [...document.getElementsByClassName("docs-remove")]) {
	el.remove();
}

console.log("Hello, world!");
// @license-end
