import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  Atom,
  HouseIcon,
  LogOutIcon,
  MenuIcon,
  ShoppingCartIcon,
  UserCog,
} from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { AvatarFallback, Avatar } from "../ui/avatar";
import { logout } from "@/store/auth-slice";
// import UserCartWrapper from "./cart-wrapper";
import { Fragment, useEffect, useState } from "react";
// import { getCartItems } from "@/store/clientStore/cart-slice";
import { Label } from "../ui/label";
import { getAllCategory } from "@/store/admin/category-slice";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import UserCartWrapper from "./cart-wrapper";
import { getCartItems } from "@/store/clientStore/cart-slice";

function MenuItems() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openMenuSheet, setOpenMenuSheet] = useState(false);
  const { categoryList } = useSelector((state) => state.category);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);

  const handleItemClick = (categoryId) => {
    setOpenMenuSheet(false);

    searchParams.set("categoryId", categoryId);
    setSearchParams(searchParams);

    navigate(`/shop/product?categoryId=${categoryId}`);
  };

  return (
    <div className="flex flex-row items-center">
      <div className="pr-2">
        <Link to="/shop/home" className="flex items-center gap-2 text-black">
          <HouseIcon className="h-6 w-6 text-black" />
          <span className="font-bold text-primary">Trang chủ</span>
        </Link>
      </div>
      <Sheet
        className="flex flex-row"
        open={openMenuSheet}
        onOpenChange={setOpenMenuSheet}
      >
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full max-w-xs">
          <nav className="flex flex-col mb-3 mt-4">
            {categoryList
              .filter((category) => category.parentID == null)
              .map((parentCategory) => (
                <Accordion key={parentCategory.id} type="multiple" collapsible>
                  <AccordionItem value={`item-${parentCategory.id}`}>
                    <AccordionTrigger>
                      {parentCategory.categoryName}
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-row">
                      {categoryList
                        .filter(
                          (category) => category.parentID == parentCategory.id
                        )
                        .map((childCategory) => (
                          <Label
                            key={childCategory.id}
                            onClick={() => handleItemClick(childCategory.id)}
                            className="text-sm p-3 hover:underline hover:text-current hover:cursor-pointer border-r-2"
                          >
                            {childCategory.categoryName}
                          </Label>
                        ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logout());
    navigate("/shop/home");
  }

  useEffect(() => {
    user != null ? dispatch(getCartItems(user?.id)) : null;
  }, [dispatch, user]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCartIcon className="w-6 h-6" />
          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
            {cartItems?.length || ""}
          </span>
          <span className="sr-only">Giỏ hàng</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems && cartItems.length > 0 ? cartItems : []}
        />
      </Sheet>

      {!isAuthenticated ? (
        <Fragment>
          <Link
            to="/auth/register"
            className="hover:text-current hover:underline"
          >
            Đăng ký
          </Link>
          <Link to="/auth/login" className="hover:text-current hover:underline">
            Đăng nhập
          </Link>
        </Fragment>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-black">
              <AvatarFallback className="bg-black text-white font-extrabold">
                {user?.fullName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-56">
            <DropdownMenuLabel>{user?.username}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/shop/account")}>
              <UserCog className="mr-2 h-4 w-4" />
              Tài khoản
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

function ClientHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>

        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <Link
            to="/shop/product"
            className="flex items-center gap-2 text-black flex-col "
          >
            <Atom className="h-8 w-8 text-black" />
            <span className="font-bold text-primary">DVT Shop</span>
          </Link>
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ClientHeader;
