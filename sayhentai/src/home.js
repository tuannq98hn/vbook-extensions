function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: "/danh-sach?order_by=update_time&sort=desc", script: "search.js" },
        { title: "Xem nhiều", input: "/danh-sach?order_by=view&sort=desc", script: "search.js" }
    ]);
}
