import { Pagination } from "@heroui/react";
import Link from "next/link";

interface PizzaPaginationProps {
  page: number;
  totalPages: number;
  paramsStr?: string;
  link?: string;
}

export default function PizzaPagination({
  page,
  totalPages,
  paramsStr = "",
  link = "/",
}: PizzaPaginationProps) {
  
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const window = 1;
    for (let p = 1; p <= totalPages; p++) {
      const isEdge = p === 1 || p === totalPages;
      const isNearCurrent = Math.abs(p - page) <= window;
      if (isEdge || isNearCurrent) {
        pages.push(p);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  // Dynamically page query check kore clean url generator 
  const getHref = (targetPage: number) => {
    const sp = new URLSearchParams(paramsStr);
    if (targetPage === 1) {
      sp.delete("page");
    } else {
      sp.set("page", targetPage.toString());
    }
    const queryStr = sp.toString();
    return queryStr ? `${link}?${queryStr}` : link;
  };

  return (
    <div className="mt-10 flex items-center justify-center">
      <Pagination className="gap-1.5">
        <Pagination.Content className="flex items-center gap-1.5">
          
          {/* Previous Button */}
          <Pagination.Item>
            {page > 1 ? (
              <Link href={getHref(page - 1)}>
                <Pagination.Previous className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-content2">
                  <Pagination.PreviousIcon />
                  <span className="hidden sm:inline">Previous</span>
                </Pagination.Previous>
              </Link>
            ) : (
              <Pagination.Previous
                isDisabled
                className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium text-text-muted opacity-50"
              >
                <Pagination.PreviousIcon />
                <span className="hidden sm:inline">Previous</span>
              </Pagination.Previous>
            )}
          </Pagination.Item>

          {/* Page Numbers */}
          {pageNumbers.map((p, i) =>
            p === "..." ? (
              <Pagination.Item key={`ellipsis-${i}`}>
                <span className="flex h-9 w-9 items-center justify-center text-sm text-text-muted">
                  …
                </span>
              </Pagination.Item>
            ) : (
              <Pagination.Item key={p}>
                <Link href={getHref(p as number)}>
                  <Pagination.Link
                    isActive={p === page}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-[#E85D3D] text-white"
                        : "text-text hover:bg-content2"
                    }`}
                  >
                    {p}
                  </Pagination.Link>
                </Link>
              </Pagination.Item>
            )
          )}

          {/* Next Button */}
          <Pagination.Item>
            {page < totalPages ? (
              <Link href={getHref(Number(page) + 1)}>
                <Pagination.Next className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-content2">
                  <span className="hidden sm:inline">Next</span>
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Link>
            ) : (
              <Pagination.Next
                isDisabled
                className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium text-text-muted opacity-50"
              >
                <span className="hidden sm:inline">Next</span>
                <Pagination.NextIcon />
              </Pagination.Next>
            )}
          </Pagination.Item>

        </Pagination.Content>
      </Pagination>
    </div>
  );
}