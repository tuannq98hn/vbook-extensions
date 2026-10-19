load('config.js');
function execute() {
    let response = fetch(BASE_URL + "/the-loai");
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let seen = {};
    let genres = [];
    doc.select("a[href^=/the-loai/]").forEach(function (el) {
        let href = el.attr("href");
        let title = (el.attr("title") || el.select("div div").first().text() || el.text()).trim();
        if (!title || seen[href]) return;
        seen[href] = true;
        genres.push({ title: title, input: absUrl(href), script: "search.js" });
    });

    return Response.success(genres);
}
