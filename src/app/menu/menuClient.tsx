"use client";

import { useMemo, useState } from "react";
import { MenuCard } from "../_components/menu-card";
import type { MenuItem } from "../_lib/data-service";

const cuisines = [
  "All",
  "American",
  "Italian",
  "Mexican",
  "Japanese",
  "Indian",
];

const ITEMS_PER_PAGE = 12;

export function MenuClient({ menuItems }: { menuItems: MenuItem[] }) {
  const [cuisine, setCuisine] = useState("All");
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(
    () =>
      menuItems.filter((item) => {
        const itemCuisine = item.categories?.cuisines?.name ?? "";
        const itemCategory = item.categories?.name ?? "";

        return (
          (cuisine === "All" ||
            itemCuisine === cuisine ||
            itemCuisine === "Shared") &&
          `${item.name} ${item.description ?? ""} ${itemCategory}`
            .toLowerCase()
            .includes(query.toLowerCase())
        );
      }),
    [menuItems, cuisine, query],
  );

  // Calculate pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  // Get menu items for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Generate compact page numbers for mobile
  const compactPages: (number | "ellipsis")[] = [];

  for (let page = 1; page <= totalPages; page++) {
    if (
      page === 1 ||
      page === totalPages ||
      Math.abs(page - currentPage) <= 1
    ) {
      const previous = compactPages[compactPages.length - 1];

      if (typeof previous === "number" && page - previous > 1) {
        compactPages.push("ellipsis");
      }

      compactPages.push(page);
    }
  }

  return (
    <section className="container section-block">
      <div className="menu-toolbar">
        <div className="filter-pills">
          {cuisines.map((item) => (
            <button
              key={item}
              onClick={() => {
                setCuisine(item);
                setCurrentPage(1);
              }}
              className={
                cuisine === item ? "filter-pill selected" : "filter-pill"
              }
            >
              {item}
            </button>
          ))}
        </div>

        <input
          className="search-input"
          placeholder="Search dishes..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {currentItems.length ? (
        <>
          <div className="menu-grid">
            {currentItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-button"
                onClick={() => setCurrentPage((page) => page - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {/* Desktop pagination */}
              <div className="pagination-pages">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    key={page}
                    className={
                      currentPage === page
                        ? "pagination-button active"
                        : "pagination-button"
                    }
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Mobile compact pagination */}
              <div className="pagination-compact">
                {compactPages.map((page, index) =>
                  page === "ellipsis" ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="pagination-ellipsis"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      className={
                        currentPage === page
                          ? "pagination-button active"
                          : "pagination-button"
                      }
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                className="pagination-button"
                onClick={() => setCurrentPage((page) => page + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <h3>No dishes found</h3>
          <p>Try another search or cuisine.</p>
        </div>
      )}
    </section>
  );
}
