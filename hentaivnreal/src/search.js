load('config.js');
function execute(query, page) {
    query = query || "";
    page = page || "1";

    let url;
    if (query.indexOf("/") === 0 || query.indexOf("http") === 0) {
        url = query.indexOf("http") === 0 ? normalizeUrl(query) : BASE_URL + query;
    } else {
        url = BASE_URL + "/tim-kiem?q=" + encodeURIComponent(query);
    }
    url += (url.indexOf("?") === -1 ? "?" : "&") + "page=" + page;

    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let items = doc.select("ul.item-list > li.item").map(function (el) {
        let a = el.select(".box-description p a").first();
        let title = el.select(".box-description p").first();
        return {
            name: a.text(),
            cover: el.select(".box-cover img").attr("src"),
            link: absUrl(a.attr("href")),
            description: title.text().replace(a.text(), "").replace(/^\s*-\s*/, ""),
            tag: ""
        };
    });

    let hasNext = false;
    doc.select("ul.pagination a").forEach(function (el) {
        if (el.text().indexOf("Next") !== -1) hasNext = true;
    });
    return Response.success(items, hasNext ? (parseInt(page) + 1).toString() : "");
}
