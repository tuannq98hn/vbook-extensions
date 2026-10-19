load('config.js');
// Only the first few pages are rendered as <img>; the full page list lives in
// the inline React Router stream data, so collect the chapter's image URLs
// from the raw HTML.
function execute(url) {
    url = normalizeUrl(url);
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status);
    let html = response.text();

    let first = Html.parse(html).select("img[src*=/manga-images/]").attr("src");
    if (!first) return Response.error("Không tìm thấy ảnh");
    let folder = first.substring(0, first.lastIndexOf("/") + 1);

    let seen = {};
    let images = [];
    let re = /https?:\/\/[^"'\\\s]+\/manga-images\/[^"'\\\s]+/g;
    let m;
    while ((m = re.exec(html)) !== null) {
        let link = m[0];
        if (link.indexOf(folder) !== 0 || seen[link]) continue;
        seen[link] = true;
        images.push(link);
    }

    return Response.success(images);
}
