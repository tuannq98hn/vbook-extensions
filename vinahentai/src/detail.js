load('config.js');
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    // The info grid is a flat run of label/value divs ("Tình trạng:", value, ...).
    let status = "";
    let author = "";
    let lines = [];
    let cells = doc.select("div:has(> div.w-28) > *");
    for (let i = 0; i + 1 < cells.size(); i += 2) {
        let label = cells.get(i).text().trim();
        let valueEl = cells.get(i + 1);
        if (label.indexOf("Thể loại") !== -1 || label.indexOf("Tổng quan") !== -1) continue;
        let links = valueEl.select("a");
        let value = links.size() > 0
            ? links.map(function (a) { return a.attr("title"); }).join(", ")
            : valueEl.text().trim();
        if (label.indexOf("Tình trạng") !== -1) status = value;
        if (label.indexOf("Tác giả") !== -1) author = value;
        lines.push(label + " " + value);
    }

    let genreLinks = doc.select("div:has(> div.w-28) a[href^=/genres/]");
    let genres = [];
    let first = genreLinks.first();
    if (first) genres.push({ title: "Cùng thể loại", input: absUrl(first.attr("href")), script: "search.js" });

    return Response.success({
        name: doc.select("h1").text(),
        author: author,
        cover: doc.select("img[alt^=Bìa truyện]").attr("src"),
        description: doc.select("div[class*=whitespace-pre][class*=text-base]").text() || doc.select("meta[name=description]").attr("content"),
        detail: lines.join("<br>"),
        url: url,
        type: "comic",
        format: "comic",
        ongoing: status.toLowerCase().indexOf("hoàn thành") === -1,
        nsfw: true,
        tags: genreLinks.map(function (el) {
            return { title: el.attr("title"), input: absUrl(el.attr("href")), script: "search.js" };
        }),
        genres: genres
    });
}
