'use client';

import { Pagination } from '@mantine/core';

interface TodoPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export default function TodoPagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: TodoPaginationProps) {
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex justify-center mt-6">
      <Pagination 
        total={totalPages} 
        value={currentPage}
        onChange={onPageChange}
        withEdges
        size="sm"
      />
    </div>
  );
} 