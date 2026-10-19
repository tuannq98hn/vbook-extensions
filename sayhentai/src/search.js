load('config.js');
// Listing pages and keyword search share the same Halim grid markup.
function execute(query, page) {
    query = query || "";
    page = page || "1";

    let url;
    if (query.indexOf("/") === 0 || query.indexOf("http") === 0) {
        let base = query.indexOf("http") === 0 ? normalizeUrl(query) : BASE_URL + query;
        url = base + (base.indexOf("?") === -1 ? "?" : "&") + "page=" + page;
    } else {
        url = BASE_URL + "/search?q=" + encodeURIComponent(query) + "&page=" + page;
    }
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let items = doc.select("#main-contents .halim_box article.thumb").map(function (el) {
        let img = el.select("figure img");
        // Search results link to detail pages without the ".html" suffix.
        let link = el.select("a.halim-thumb").attr("href");
        if (link && !/\.html$/.test(link)) link += ".html";
        return {
            name: el.select(".entry-title").text(),
            cover: img.attr("data-src") || img.attr("src"),
            link: link,
            description: el.select(".episode").text(),
            tag: el.select(".status").text()
        };
    });

    let hasNext = !doc.select(".pagination .fa-angle-right").isEmpty();
    return Response.success(items, hasNext ? (parseInt(page) + 1).toString() : "");
}
