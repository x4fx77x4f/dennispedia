'use strict';

let main = document.getElementById('docs-main');
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
const as = document.getElementById('docs-nav').getElementsByTagName('a');
Array.prototype.forEach.call(as, a => {
	a.addEventListener('click', event => {
		die(null, "Loading...");
		fetch(a.href)
			.then(response => {
				if (!response.ok) {
					throw `Bad response code ${response.status}.`;
				}
				return response.text();
			})
			.then(text => {
				const parser = new DOMParser();
				const subdoc = parser.parseFromString(text, 'text/html');
				const submain = subdoc.getElementById('docs-main');
				main.replaceWith(submain);
				main.remove();
				main = submain;
			})
			.catch(error => {
				die(a.href, error);
			})
		;
		event.preventDefault();
	});
});

const unhide = collection => {
	Array.prototype.forEach.call(collection, el => {
		el.classList.remove('docs-hidden');
	});
};
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
