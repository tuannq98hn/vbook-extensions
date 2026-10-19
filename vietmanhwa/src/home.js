function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: "/danh-sach", script: "search.js" },
        { title: "Xem nhiều", input: "/danh-sach?sort=views", script: "search.js" },
        { title: "Hoàn thành", input: "/danh-sach?status=completed", script: "search.js" },
        { title: "Full màu", input: "/the-loai/full-color", script: "search.js" }
    ]);
}
