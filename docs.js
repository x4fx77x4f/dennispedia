'use strict';

const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = 'docs.css';
document.head.append(style);

let main = document.getElementById('docs-main');
const nav = document.getElementById('docs-nav');
main.parentNode.insertBefore(nav, main);

const die = (href, message) => {
	console.log(message);
	while (main.firstChild) {
		main.lastChild.remove();
	}
	const p = document.createElement('p');
	if (message) {
		p.textContent = message;
	}
	main.append(p);
	if (href) {
		const alternative = document.createElement('p');
		alternative.append(document.createTextNode("You could try "));
		const a = document.createElement('a');
		a.textContent = "visiting the page directly";
		a.href = href;
		alternative.append(a);
		alternative.append(document.createTextNode("."));
		main.append(alternative);
	}
	return p;
}
const src_host = location.host;
const src_pathname = location.pathname;
const a_click = (event, a) => {
	if (a.host !== src_host) {
		return;
	}
	const dst_pathname = a.dataset.pathname;
	const dst_href = a.href;
	console.log(`Loading article '${dst_href}'`);
	history.pushState({
		src_pathname: src_pathname,
		dst_pathname: a.dataset.pathname,
	}, '', dst_href);
	die(null, "Loading...");
	fetch(dst_href)
		.then(response => {
			if (!response.ok) {
				throw `Bad response code ${response.status}.`;
			}
			return response.text();
		})
		.then(text => {
			const parser = new DOMParser();
			const subdoc = parser.parseFromString(text, 'text/html');
			let submain = subdoc.getElementById('docs-main');
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
				for (let i=submain.childNodes.length-1; i > 0; --i) {
					main.prepend(submain.childNodes[i]);
				}
				submain.remove();
			}
			Array.prototype.forEach.call(main.getElementsByTagName('a'), a => {
				a.addEventListener('click', event => a_click(event, a));
			});
			let title = subdoc.title;
			if (!title) {
				console.warn("No article title. Falling back to first h1.");
				const h1 = document.getElementsByTagName('h1')[0];
				if (h1) {
					title = h1.innerText;
				} else {
					console.warn("No fallback title either?");
				}
			}
			history.replaceState({
				src_pathname: src_pathname,
				dst_pathname: dst_pathname,
				dst_text: text,
			}, title, dst_href);
		})
		.catch(error => {
			die(a.href, error);
		})
	;
	if (event) {
		event.preventDefault();
	}
};
const as = nav.getElementsByTagName('a');
Array.prototype.forEach.call(as, a => {
	if (a.host !== src_host) {
		return;
	}
	a.dataset.pathname = a.pathname;
	const dst_pathname = `/${src_pathname}/${a.getAttribute('href')}`.replace(/\/+/, '/');
	a.href = `${location.protocol}//${src_host}${dst_pathname}`;
	a.addEventListener('click', event => a_click(event, a));
});

const search = document.getElementById('docs-search');
search.addEventListener('input', event => {
	const value = search.value.normalize().toLowerCase();
	if (!value) {
		Array.prototype.forEach.call(as, a => {
			a.parentElement.classList.remove('docs-hidden');
		});
		return;
	}
	Array.prototype.forEach.call(as, a => {
		if (a.textContent.toLowerCase().includes(value)) {
			a.parentElement.classList.remove('docs-hidden');
		} else {
			a.parentElement.classList.add('docs-hidden');
		}
	});
});

Array.prototype.forEach.call(document.getElementsByClassName('docs-hidden'), el => {
	el.classList.remove('docs-hidden');
});

console.log("Hello, world!");
