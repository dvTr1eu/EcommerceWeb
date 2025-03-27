import UploadProductImage from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import PaginationComponent from "@/components/common/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElement } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { getAllCategory } from "@/store/admin/category-slice";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  getAllProduct,
  getBySearchCondition,
} from "@/store/admin/product-slice";
import { SearchIcon } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  images: [],
  productName: "",
  description: "",
  categoryId: 0,
  price: 0,
  discountPrice: 0,
  bestSeller: false,
  homeFlag: false,
  sizes: [
    { sizeName: "M", quantity: 0 },
    { sizeName: "L", quantity: 0 },
    { sizeName: "XL", quantity: 0 },
  ],
};

function AdminProducts() {
  const [openCreateProduct, setOpenCreateProduct] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageLoadingStates, setImageLoadingStates] = useState([]);
  const [currentEditId, setCurrentEditId] = useState(null);
  const { categoryList } = useSelector((state) => state.category);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const { productList, totalItems, productSearchList } = useSelector(
    (state) => state.adminProduct
  );
  const [searchInput, setSearchInput] = useState("");

  const dispatch = useDispatch();
  const { toast } = useToast();

  const displayProducts = (
    productSearchList.length > 0 ? productSearchList : productList
  ).slice((currentPage - 1) * pageSize, currentPage * pageSize);
  console.log(displayProducts);

  const updatedFormElement = addProductFormElement.map((item) => {
    if (item.name === "categoryId") {
      return {
        ...item,
        images: uploadedImages,
        options: categoryList
          .filter((category) => category?.parentID)
          .map((category) => ({
            id: category.id,
            label: category.categoryName,
          })),
      };
    }
    return item;
  });

  useEffect(() => {
    if (currentPage > Math.ceil(totalItems / pageSize)) {
      setCurrentPage(1);
    }
  }, [totalItems, pageSize]);

  function onSubmit(e) {
    e.preventDefault();
    const validSizes = formData.sizes.filter((size) => size.quantity > 0);
    const finalData = {
      ...formData,
      categoryID: parseInt(formData.categoryId, 10),
      sizes: validSizes,
      images: uploadedImages,
    };

    currentEditId !== null
      ? dispatch(editProduct({ id: currentEditId, formData: finalData })).then(
          (data) => {
            if (data?.payload?.success) {
              dispatch(getAllProduct());
              setFormData(initialFormData);
              setOpenCreateProduct(false);
              setCurrentEditId(null);
            }
          }
        )
      : dispatch(addNewProduct(finalData)).then((data) => {
          if (data?.payload?.success) {
            dispatch(getAllProduct());
            setOpenCreateProduct(false);
            setImageFiles(null);
            setFormData(initialFormData);
            toast({
              title: "Thêm mới sản phẩm thành công",
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
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload.success) {
        dispatch(getAllProduct());
      }
    });
  }

  useEffect(() => {
    dispatch(
      getBySearchCondition({
        searchKey: searchInput,
        pageNumber: currentPage,
        pageSize,
      })
    );
  }, [searchInput]);

  useEffect(() => {
    dispatch(getAllProduct());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="flex">
        <div className="flex items-center w-[30%]">
          <Input
            className="mr-3"
            value={searchInput}
            name="searchInput"
            placeholder="Nhập để tìm kiếm"
            onChange={(e) => setSearchInput(e.target.value)}
            // onKeyDown={(e) => {
            //   if (e.key === "Enter") {
            //     handleSearchInput();
            //   }
            // }}
          />
          <div
            className="p-[5px] border-2 border-solid rounded-sm"
            // onClick={handleSearchInput}
          >
            <SearchIcon />
          </div>
        </div>
        <div className="mb-5 w-full flex justify-end">
          <Button onClick={() => setOpenCreateProduct(true)}>
            Thêm mới sản phẩm
          </Button>
        </div>
      </div>
      <div className="grid gap-12 pr-7 md:grid-cols-3 lg:grid-cols-4 pb-2">
        {displayProducts && displayProducts.length > 0 ? (
          displayProducts.map((productItem) => (
            <AdminProductTile
              setFormData={setFormData}
              setOpenCreateProduct={setOpenCreateProduct}
              setCurrentEditId={setCurrentEditId}
              product={productItem}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <p>Không có sản phẩm</p>
        )}
      </div>
      {displayProducts.length > 0 && (
        <PaginationComponent
          totalItems={
            productSearchList.length > 0
              ? productSearchList.length
              : productList.length
          }
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={(newPage) => {
            setCurrentPage(newPage);
          }}
        />
      )}

      <Sheet
        open={openCreateProduct}
        onOpenChange={() => {
          setOpenCreateProduct(false);
          setCurrentEditId(null);
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
          <UploadProductImage
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
            setImageLoadingStates={setImageLoadingStates}
            imageLoadingStates={imageLoadingStates}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditId !== null ? "Lưu" : "Thêm"}
              formControls={updatedFormElement}
              isBtnDisabled={
                !isFormValid() ||
                formData.price <= 0 ||
                !formData.sizes.some((size) => size.quantity > 0)
              }
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
