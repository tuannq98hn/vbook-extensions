load('config.js');
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let images = [];
    doc.select(".contentimg img.simg").forEach(function (el) {
        let link = el.attr("data-sv1") || el.attr("src");
        if (!link) return;
        let fallback = [];
        ["data-sv2", "data-sv3"].forEach(function (key) {
            let alt = el.attr(key);
            if (alt) fallback.push(alt);
        });
        images.push({ link: link, fallback: fallback });
    });

    if (images.length === 0) return Response.error("Không tìm thấy ảnh");
    return Response.success(images);
}
