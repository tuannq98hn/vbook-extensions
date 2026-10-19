load('config.js');
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    // The site lists chapters newest first; walk backwards for reading order.
    let links = doc.select("table.listing a");
    let chapters = [];
    for (let i = links.size() - 1; i >= 0; i--) {
        let el = links.get(i);
        chapters.push({
            name: el.text(),
            url: absUrl(el.attr("href")),
            description: "",
            lock: false,
            pay: false
        });
    }

    return Response.success(chapters);
}
