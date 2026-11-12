"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);

  // Close category dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setCategoryOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCategoryOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Get unique category names from the menu items
  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          menuItems
            .map((item) => item.categories?.name)
            .filter((name): name is string => Boolean(name)),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    ],
    [menuItems],
  );

  // Filter menu items
  const filtered = useMemo(
    () =>
      menuItems.filter((item) => {
        const itemCuisine = item.categories?.cuisines?.name ?? "";
        const itemCategory = item.categories?.name ?? "";

        return (
          (cuisine === "All" ||
            itemCuisine === cuisine ||
            itemCuisine === "Shared") &&
          (category === "All" || itemCategory === category) &&
          `${item.name} ${item.description ?? ""} ${itemCategory}`
            .toLowerCase()
            .includes(query.toLowerCase())
        );
      }),
    [menuItems, cuisine, category, query],
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
        {/* Cuisine filters */}
        <div className="filter-pills" aria-label="Filter by cuisine">
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

        {/* Custom category dropdown */}
        <div className="category-dropdown" ref={categoryRef}>
          <button
            type="button"
            className={`category-dropdown-trigger ${
              categoryOpen ? "open" : ""
            }`}
            onClick={() => setCategoryOpen((open) => !open)}
            aria-expanded={categoryOpen}
            aria-haspopup="listbox"
            aria-label="Filter by category"
          >
            <span>{category === "All" ? "All categories" : category}</span>

            <svg
              className="category-dropdown-arrow"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {categoryOpen && (
            <div className="category-dropdown-menu" role="listbox">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="option"
                  aria-selected={category === item}
                  className={`category-dropdown-option ${
                    category === item ? "selected" : ""
                  }`}
                  onClick={() => {
                    setCategory(item);
                    setCurrentPage(1);
                    setCategoryOpen(false);
                  }}
                >
                  <span>{item === "All" ? "All categories" : item}</span>

                  {category === item && (
                    <span className="category-dropdown-check">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
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

      {/* Menu items and pagination */}
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
          <p>Try another search, cuisine or category.</p>
        </div>
      )}
    </section>
  );
}
