load('config.js');
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let doc = response.html();

    let images = [];
    doc.select("#image img[data-idx]").forEach(function (el) {
        let link = el.attr("data-src") || el.attr("src");
        if (link) images.push(link);
    });

    if (images.length === 0) return Response.error("Không tìm thấy ảnh");
    return Response.success(images);
}
