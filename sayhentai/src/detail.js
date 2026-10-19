load('config.js');
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let info = doc.select(".movie-detail .thong-tin");
    let genreLinks = info.select("a[href*=/the-loai/]");
    let status = info.text();

    // .thong-tin is a flat run of label/value <span> pairs; skip the genre pair.
    let spans = info.select("> span");
    let lines = [];
    for (let i = 0; i + 1 < spans.size(); i += 2) {
        let label = spans.get(i).text().replace(/:\s*$/, "").trim();
        if (label.indexOf("Thể loại") !== -1) continue;
        lines.push(label + ": " + spans.get(i + 1).text());
    }

    let genres = [];
    let first = genreLinks.first();
    if (first) genres.push({ title: "Cùng thể loại", input: first.attr("href"), script: "search.js" });

    return Response.success({
        name: doc.select(".movie-detail h1.entry-title").text(),
        author: "",
        cover: doc.select("img.movie-thumb").attr("src"),
        description: doc.select("article.item-content > p").html(),
        detail: lines.join("<br>"),
        url: url,
        type: "comic",
        format: "comic",
        ongoing: status.toLowerCase().indexOf("hoàn thành") === -1,
        nsfw: true,
        tags: genreLinks.map(function (el) {
            return { title: el.text(), input: el.attr("href"), script: "search.js" };
        }),
        genres: genres
    });
}
