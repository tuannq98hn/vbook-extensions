load('config.js');
// Pagination is rendered client-side, so keep paging until a page is empty.
function execute(query, page) {
    query = query || "";
    page = page || "1";

    let url;
    if (query.indexOf("/") === 0 || query.indexOf("http") === 0) {
        url = query.indexOf("http") === 0 ? normalizeUrl(query) : BASE_URL + query;
    } else {
        url = BASE_URL + "/search?q=" + encodeURIComponent(query);
    }
    url += (url.indexOf("?") === -1 ? "?" : "&") + "page=" + page;

    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    // Listing cards and search rows use different markup; both are links to
    // /manhwa-18/<slug> wrapping a cover image.
    let items = doc.select("a[href^=/manhwa-18/]:has(img)").map(function (el) {
        let img = el.select("img").first();
        return {
            name: el.select("h2, h3").text() || img.attr("alt"),
            cover: img.attr("src"),
            link: absUrl(el.attr("href")),
            description: el.select("p[title]").text() || el.select("p").last().text(),
            tag: ""
        };
    });

    return Response.success(items, items.length > 0 ? (parseInt(page) + 1).toString() : "");
}
