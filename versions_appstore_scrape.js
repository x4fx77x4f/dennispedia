// Go to the app's App Store page, click "Version History", then run this script.
'use strict';
(() => {
	let out = '';
	Array.prototype.forEach.call(document.getElementsByClassName('version-history__items')[0].getElementsByClassName('version-history__item'), li => {
		const version = li.getElementsByClassName('version-history__item__version-number')[0].textContent;
		const releasedate_el = li.getElementsByClassName('version-history__item__release-date')[0];
		const releasedate_datetime = releasedate_el.getAttribute('datetime');
		const releasedate_label = releasedate_el.getAttribute('aria-label');
		out += `<tr>\n\t<td>${version}</td>\n\t<td></td>\n\t<td></td>\n\t<td>${version}</td>\n\t<td><time datetime="${releasedate_datetime}">${releasedate_label}</time></td>\n</tr>\n`;
	});
	console.log(out);
})();
