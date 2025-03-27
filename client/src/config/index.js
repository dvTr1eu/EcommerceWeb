import { getAllCategory } from "@/store/admin/category-slice";
import {
  CircleUserIcon,
  History,
  HistoryIcon,
  KeyRound,
  ListOrderedIcon,
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

export const registerForm = [
  {
    name: "fullName",
    label: "Họ tên",
    placeholder: "Nhập họ tên",
    componentType: "input",
    type: "text",
  },
  {
    name: "phone",
    label: "Số điện thoại",
    placeholder: "Nhập số điện thoại",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Nhập email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Mật khẩu",
    placeholder: "Nhập mật khẩu",
    componentType: "input",
    type: "password",
  },
];

export const loginForm = [
  {
    name: "email",
    label: "Email",
    placeholder: "Nhập email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Mật khẩu",
    placeholder: "Nhập mật khẩu",
    componentType: "input",
    type: "password",
  },
];

export const addCategoryForm = [
  {
    label: "Tên danh mục sản phẩm",
    name: "categoryName",
    componentType: "input",
    type: "text",
    placeholder: "Nhập tên danh mục sản phẩm",
  },
  {
    label: "Danh mục cha",
    name: "parentId",
    componentType: "select",
    placeholder: "Chọn danh mục cha",
  },
  {
    label: "Thứ tự sắp xếp",
    name: "orderNumber",
    componentType: "input",
    type: "text",
    placeholder: "Nhập thứ tự sắp xếp",
  },
  {
    label: "Published",
    name: "published",
    componentType: "select",
    options: [
      {
        id: true,
        label: "True",
      },
      {
        id: false,
        label: "False",
      },
    ],
  },
];

export const addProductFormElement = [
  {
    label: "Tên sản phẩm",
    name: "productName",
    componentType: "input",
    type: "text",
    placeholder: "Nhập tên sản phẩm",
  },
  {
    label: "Mô tả",
    name: "description",
    componentType: "textarea",
    placeholder: "Nhập mô tả",
  },
  {
    label: "Danh mục",
    name: "categoryId",
    componentType: "select",
    placeholder: "Chọn danh mục",
  },
  {
    label: "Kích thước và Số lượng",
    name: "size",
    componentType: "checkboxInput",
    options: [
      {
        sizeName: "M",
        quantity: 0,
      },
      {
        sizeName: "L",
        quantity: 0,
      },
      {
        sizeName: "XL",
        quantity: 0,
      },
    ],
  },
  {
    label: "Giá",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Nhập giá sản phẩm",
  },
  {
    label: "Nhập giá giảm",
    name: "discountPrice",
    componentType: "input",
    type: "number",
    placeholder: "Nhập giá giảm(nếu có)",
  },
  {
    label: "Sản phẩm bán chạy",
    name: "bestSeller",
    componentType: "checkbox",
  },
  {
    label: "Hiển thị trang chủ",
    name: "homeFlag",
    componentType: "checkbox",
  },
];

export const sortOptions = [
  { id: "default", label: "Mặc định" },
  { id: "lowToHigh", label: "Giá: Tăng dẫn" },
  { id: "highToLow", label: "Giá: Giảm dần" },
];

export const addressForm = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];

export const menuAccount = [
  {
    label: "overview",
    title: "Thông tin",
    icon: CircleUserIcon,
  },
  {
    label: "changePassword",
    title: "Đổi mật khẩu",
    icon: KeyRound,
  },
  {
    label: "orderList",
    title: "Đơn hàng",
    icon: ListOrderedIcon,
  },
  {
    label: "orderHistory",
    title: "Lịch sử mua hàng",
    icon: HistoryIcon,
  },
];

export const changePasswordForm = [
  {
    label: "Mật khẩu cũ",
    name: "oldPassword",
    componentType: "input",
    type: "text",
    placeholder: "Nhập mật khẩu cũ",
  },
  {
    label: "Mật khẩu mới",
    name: "newPassword",
    componentType: "input",
    type: "text",
    placeholder: "Nhập mật khẩu mới",
  },
  {
    label: "Nhập lại mật khẩu",
    name: "confirmPassword",
    componentType: "input",
    type: "text",
    placeholder: "Nhập lại mật khẩu mới",
  },
];
