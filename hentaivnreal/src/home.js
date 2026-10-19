function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: "/danh-sach", script: "search.js" },
        { title: "Xem nhiều", input: "/danh-sach?sort=most-viewed", script: "search.js" },
        { title: "Top tuần", input: "/danh-sach?sort=viewed-week", script: "search.js" },
        { title: "Full màu", input: "/the-loai/full-color", script: "search.js" },
        { title: "Không che", input: "/the-loai/khong-che", script: "search.js" }
    ]);
}
