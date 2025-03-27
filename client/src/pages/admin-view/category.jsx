import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToastAction } from "@/components/ui/toast";
import { addCategoryForm } from "@/config";
import { toast } from "@/hooks/use-toast";
import {
  addNewCategory,
  deleteCategory,
  editCategory,
  getAllCategory,
} from "@/store/admin/category-slice";
import { Pencil, Trash2 } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const initialFormData = {
  categoryName: "",
  parentId: "",
  orderNumber: "",
  published: null,
};

function AdminCategory() {
  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();
  const { categoryList } = useSelector((state) => state.category);
  const [currentEditId, setCurrentEditId] = useState(null);

  function onSubmit(e) {
    e.preventDefault();

    const newFormData = {
      ...formData,
      published: formData.published === "true",
    };

    currentEditId !== null
      ? dispatch(
          editCategory({ id: currentEditId, formData: newFormData })
        ).then((data) => {
          console.log(data, "edit");
          if (data?.payload?.success) {
            dispatch(getAllCategory());
            setFormData(initialFormData);
            setOpenCreateCategory(false);
            setCurrentEditId(null);
          }
        })
      : dispatch(addNewCategory(newFormData)).then((data) => {
          if (data?.payload?.success) {
            dispatch(getAllCategory());
            setOpenCreateCategory(false);
            setFormData(initialFormData);
            toast({
              title: "Thêm mới danh mục thành công",
            });
          }
        });
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteCategory(getCurrentProductId)).then((data) => {
      if (data?.payload.success) {
        dispatch(getAllCategory());
      }
    });
  }

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);

  const updatedForm = addCategoryForm.map((item) => {
    if (item.name === "parentId") {
      return {
        ...item,
        options: categoryList
          .filter((category) => !category?.parentID)
          .map((category) => ({
            id: category.id,
            label: category.categoryName,
          })),
      };
    }
    return item;
  });

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateCategory(true)}>
          Thêm mới danh mục
        </Button>
      </div>
      <Sheet
        open={openCreateCategory}
        onOpenChange={() => {
          setOpenCreateCategory(false);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditId !== null
                ? "Chỉnh sửa thông tin sản phẩm"
                : "Thêm mới sản phẩm"}
            </SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditId !== null ? "Lưu" : "Thêm"}
              formControls={updatedForm}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
      <Table className="w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">STT</TableHead>
            <TableHead>Tên danh mục</TableHead>
            <TableHead>Phân cấp</TableHead>
            <TableHead>Thứ tự</TableHead>
            <TableHead>Published</TableHead>
            <TableHead className="text-right">Chức năng</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categoryList.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell>{item.categoryName}</TableCell>
              <TableCell>{item.parentID}</TableCell>
              <TableCell>{item.orderNumber}</TableCell>
              <TableCell>{item.published.toString()}</TableCell>
              <TableCell className="text-right">
                <Button
                  onClick={() => {
                    setOpenCreateCategory(true);
                    setFormData({
                      ...item,
                    });
                    setCurrentEditId(item?.id);
                  }}
                  className="mr-2"
                >
                  <Pencil />
                  Sửa
                </Button>
                <Button
                  onClick={() =>
                    toast({
                      title: "Bạn có chắn muốn xóa sản phấm?",
                      description:
                        "Sản phẩm của bạn sẽ bị xóa vĩnh viễn và không khôi phục lại được",
                      action: (
                        <div className="flex flex-col gap-2 items-center">
                          <ToastAction
                            altText="confirm"
                            variant="destructive"
                            onClick={() => {
                              handleDelete(item?.id);
                            }}
                          >
                            Xác nhận
                          </ToastAction>
                          <ToastAction altText="cancel">Hủy</ToastAction>
                        </div>
                      ),
                      duration: 2000,
                    })
                  }
                  className="bg-red-500 hover:bg-red-600"
                >
                  <Trash2 />
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Fragment>
  );
}

export default AdminCategory;
