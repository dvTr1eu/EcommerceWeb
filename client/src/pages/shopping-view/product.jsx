import ChatSupport from "@/components/common/chat-support";
import PaginationComponent from "@/components/common/pagination";
import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ClientProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { sortOptions } from "@/config";
import { useToast } from "@/hooks/use-toast";
import {
  getByCondition,
  getBySearchCondition,
  getProductDetails,
  resetSearchResults,
} from "@/store/clientStore/product-slice";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ArrowUpDownIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";

function ShoppingProduct() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { productList, productDetails, totalItems, productSearchList } =
    useSelector((state) => state.clientProduct);
  const { user } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const [sort, setSort] = useState("default");
  const sortOrder = searchParams.get("sortOrder") || "default";
  const categoryId = searchParams.get("categoryId");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();
  const [searchInput, setSearchInput] = useState("");
  const displayProducts =
    productSearchList && productSearchList.length > 0
      ? productSearchList
      : productList;

  useEffect(() => {
    setSort(sortOrder);
  }, [sortOrder]);

  const handleSort = (value) => {
    setSort(value);
    searchParams.set("sortOrder", value);
    setSearchParams(searchParams);
  };

  // const handleSearchInput = () => {
  //   if (searchInput && searchInput.trim() !== "") {
  //     setSearchParams(new URLSearchParams(`?searchKey=${searchInput}`));
  //     dispatch(
  //       getBySearchCondition({
  //         searchKey: searchInput,
  //         pageNumber: currentPage,
  //         pageSize,
  //       })
  //     );
  //   } else {
  //     setSearchParams(new URLSearchParams());
  //     dispatch(resetSearchResults());
  //   }
  // };

  useEffect(() => {
    dispatch(
      getBySearchCondition({
        searchKey: searchInput,
        sortOrder: sort,
        pageNumber: currentPage,
        pageSize,
      })
    );
  }, [sort, searchInput]);

  useEffect(() => {
    dispatch(
      getByCondition({
        categoryId,
        sortOrder: sort,
        pageNumber: currentPage,
        pageSize,
      })
    );
  }, [categoryId, sort, currentPage, dispatch]);

  useEffect(() => {
    if (currentPage > Math.ceil(totalItems / pageSize)) {
      setCurrentPage(1);
    }
  }, [totalItems]);

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(getProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
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
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {displayProducts?.length}/{totalItems} sản phẩm
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sắp xếp theo</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {displayProducts && displayProducts.length > 0 ? (
            displayProducts.map((productItem) => (
              <ClientProductTile
                key={productItem.id}
                handleGetProductDetails={handleGetProductDetails}
                product={productItem}
              />
            ))
          ) : (
            <Label>Hiện danh mục chưa có sản phẩm</Label>
          )}
        </div>
        <PaginationComponent
          totalItems={totalItems}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={(newPage) => {
            setCurrentPage(newPage);
          }}
        />
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
      {user ? <ChatSupport /> : null}
    </div>
  );
}

export default ShoppingProduct;
