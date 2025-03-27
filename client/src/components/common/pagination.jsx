import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

const PaginationComponent = ({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null; // Nếu chỉ có 1 trang, không cần hiển thị phân trang

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <PaginationItem className="hover:cursor-pointer" key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => handlePageClick(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem className="hover:cursor-pointer">
          <PaginationNext
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
