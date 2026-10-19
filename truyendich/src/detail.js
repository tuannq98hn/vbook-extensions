load('config.js');
function execute(url) {
    url = normalizeUrl(url).replace(/\/trang-\d+\/?$/, "");
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    // Info cards: an uppercase <span> label followed by a <p> value.
    let author = "";
    let status = "";
    let lines = [];
    doc.select("main div.p-4:has(span):has(p)").forEach(function (el) {
        let label = el.select("span").first().text().trim();
        let value = el.select("p").first().text().replace(/•.*$/, "").trim();
        if (!label || !value) return;
        if (label.toLowerCase() === "tác giả") author = value;
        if (label.toLowerCase() === "trạng thái") status = value;
        lines.push(label + ": " + value);
    });

    let tags = [];
    let seen = {};
    doc.select("main a[href^=/the-loai/]").forEach(function (el) {
        if (seen[el.attr("href")]) return;
        seen[el.attr("href")] = true;
        tags.push({ title: el.text().trim(), input: absUrl(el.attr("href")), script: "search.js" });
    });

    return Response.success({
        name: doc.select("main h1").first().text(),
        author: author,
        cover: doc.select("meta[property=og:image]").attr("content"),
        description: doc.select("main section .prose").first().html(),
        detail: lines.join("<br>"),
        url: url,
        type: "novel",
        format: "novel",
        ongoing: status.toLowerCase().indexOf("hoàn") === -1 && status.toLowerCase().indexOf("full") === -1,
        tags: tags,
        genres: tags.length > 0 ? [{ title: "Cùng thể loại", input: tags[0].input, script: "search.js" }] : []
    });
}
