function Tours() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Tour</h1>
          <p className="text-gray-500 mt-1">Thêm mới, sửa và xóa các tour du lịch</p>
        </div>
        <Link to="/tours/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Thêm Tour mới
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Tour ({tours.length})</TabsTrigger>
              <TabsTrigger value="trash">Thùng rác ({deletedTours.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-4">
              <div className="mb-4">
                <Input
                  placeholder="Tìm kiếm tour..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Hình ảnh</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tên Tour</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Danh mục</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Giá</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Trạng thái</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Ngày tạo</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredTours.map((tour) => (
                  <tr key={tour.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <img
                        src={tour.image}
                        alt={tour.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{tour.name}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{tour.category}</td>
                    <td className="py-3 px-4 text-sm font-medium">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(tour.price)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={tour.status === 'active' ? 'default' : 'secondary'}>
                        {tour.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{tour.createdAt}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Link to={`/tours/${tour.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(tour.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="trash" className="mt-4">
          <div className="mb-4">
            <Input
              placeholder="Tìm kiếm trong thùng rác..."
              value={trashSearchTerm}
              onChange={(e) => setTrashSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Hình ảnh</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tên Tour</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Người xóa</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Thời gian xóa</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeletedTours.map((tour) => (
                  <tr key={tour.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <img
                        src={tour.image}
                        alt={tour.name}
                        className="w-16 h-16 rounded-lg object-cover opacity-50"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-500">{tour.name}</div>
                    </td>
                    <td className="py-3 px-4 text-sm">{tour.deletedBy}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{tour.deletedAt}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setRestoreId(tour.id)}
                          title="Khôi phục"
                        >
                          <RotateCcw className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPermanentDeleteId(tour.id)}
                          title="Xóa vĩnh viễn"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
        </CardContent>
      </Card>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa tour</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tour này? Tour sẽ được chuyển vào thùng rác và có thể khôi phục sau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={restoreId !== null} onOpenChange={() => setRestoreId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận khôi phục</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn khôi phục tour này? Tour sẽ được đưa trở lại danh sách hoạt động.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => restoreId && handleRestore(restoreId)}
              className="bg-green-600 hover:bg-green-700"
            >
              Khôi phục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={permanentDeleteId !== null} onOpenChange={() => setPermanentDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa vĩnh viễn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa vĩnh viễn tour này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => permanentDeleteId && handlePermanentDelete(permanentDeleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa vĩnh viễn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Tours;
