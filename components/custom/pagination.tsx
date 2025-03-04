"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationCustomProps {
  totalPages?: number;
  currentPage: number;
}

export default function PaginationCustom(props: PaginationCustomProps) {
  const { totalPages, currentPage } = props;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // If one page is enough to display content, no pagination
  if (totalPages && totalPages <= 1) {
    return <></>;
  }

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const previousButton = currentPage !== 1 && (
    <PaginationItem>
      <PaginationPrevious
        href={createPageURL(currentPage - 1)}
        className="bg-[#E9EDCA]  hover:bg-[#dfe4b5]"
      />
    </PaginationItem>
  );

  const nextButton = currentPage !== totalPages && (
    <PaginationItem>
      <PaginationNext
        href={createPageURL(currentPage + 1)}
        className="bg-[#E9EDCA]  hover:bg-[#dfe4b5]"
      />
    </PaginationItem>
  );

  const middlePagination: React.ReactNode[] = [];
  const pageLinkToDisplay: (number | null)[] = [];
  // If there's a few page, we display all of them
  if (!totalPages) {
    // We  only display current page and prev/next button if we don't know total page
    pageLinkToDisplay.push(currentPage);
  } else if (totalPages < 5) {
    for (let i = 1; i <= totalPages; i++) {
      pageLinkToDisplay.push(i);
    }
    // If there is many pages
  } else {
    // First 3 pages
    if (currentPage < 3) {
      pageLinkToDisplay.push(1, 2, 3, null, totalPages);
      // Last 3 pages
    } else if (totalPages - currentPage < 3) {
      pageLinkToDisplay.push(
        1,
        null,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
      // Other pages: display first, last and +1/-1
    } else {
      pageLinkToDisplay.push(
        1,
        null,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        null,
        totalPages
      );
    }
  }
  console.log(pageLinkToDisplay);
  pageLinkToDisplay.forEach((page, index) => {
    middlePagination.push(
      <PaginationItem key={index}>
        {page === null ? (
          <PaginationEllipsis />
        ) : (
          <PaginationLink
            href={createPageURL(page)}
            isActive={currentPage === page}
            className={`${
              currentPage === page ? "bg-[#dfe4b5]" : "bg-[#E9EDCA]"
            } hover:bg-[#949F6E]`}
          >
            {page}
          </PaginationLink>
        )}
      </PaginationItem>
    );
  });
  return (
    <Pagination>
      <PaginationContent>
        {previousButton}
        {middlePagination}
        {nextButton}
      </PaginationContent>
    </Pagination>
  );
}
