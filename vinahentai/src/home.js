function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: "/danh-sach", script: "search.js" },
        { title: "Xem nhiều", input: "/danh-sach?sort=views", script: "search.js" },
        { title: "Hoàn thành", input: "/danh-sach?status=completed", script: "search.js" },
        { title: "Không che", input: "/genres/hentai-khong-che", script: "search.js" },
        { title: "Manhwa", input: "/genres/manhwa", script: "search.js" }
    ]);
}
