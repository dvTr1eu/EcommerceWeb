import { Fragment, useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategory } from "@/store/admin/category-slice";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getByCondition } from "@/store/clientStore/product-slice";

function ProductFilter() {
  const dispatch = useDispatch();
  const { categoryList } = useSelector((state) => state.category);
  const [searchParams, setSearchParams] = useSearchParams();
  const [checkedCatId, setCheckedCatId] = useState(
    searchParams.get("categoryId")
  );

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);

  useEffect(() => {
    setCheckedCatId(searchParams.get("categoryId"));
  }, [searchParams]);

  const handleFilter = (catId) => {
    if (checkedCatId == catId) {
      searchParams.delete("categoryId");
      setCheckedCatId(null);

      dispatch(
        getByCondition({
          categoryId: null,
          sortOrder: searchParams.get("sortOrder") || "default",
        })
      );
    } else {
      searchParams.set("categoryId", catId);
      setCheckedCatId(catId);

      dispatch(
        getByCondition({
          categoryId: catId,
          sortOrder: searchParams.get("sortOrder") || "default",
        })
      );
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Lọc</h2>
      </div>
      <div className="p-4 space-y-4">
        {categoryList
          .filter((category) => category.parentID == null)
          .map((parentCategory) => (
            <Fragment key={parentCategory.id}>
              <div>
                <h3 className="text-base font-bold">
                  {parentCategory.categoryName}
                </h3>
                <div className="grid gap-2 mt-2">
                  {categoryList
                    .filter(
                      (category) => category.parentID == parentCategory.id
                    )
                    .map((childCategory) => (
                      <Label
                        key={childCategory.id}
                        className="flex font-medium items-center gap-2"
                      >
                        <Checkbox
                          checked={checkedCatId == childCategory.id}
                          onCheckedChange={() => handleFilter(childCategory.id)}
                        />
                        {childCategory.categoryName}
                      </Label>
                    ))}
                </div>
              </div>
              <Separator />
            </Fragment>
          ))}
      </div>
    </div>
  );
}

export default ProductFilter;
