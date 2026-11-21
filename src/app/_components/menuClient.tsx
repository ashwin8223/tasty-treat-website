"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MenuCard } from "./menu-card";
import type { MenuItem } from "../_lib/data-service";

const cuisines = [
  "All",
  "American",
  "Italian",
  "Mexican",
  "Japanese",
  "Indian",
];

const dietaryOptions = ["All", "Veg", "Non-veg"] as const;

type DietaryFilter = (typeof dietaryOptions)[number];

const ITEMS_PER_PAGE = 12;

export function MenuClient({ menuItems }: { menuItems: MenuItem[] }) {
  const [cuisine, setCuisine] = useState("All");
  const [category, setCategory] = useState("All");
  const [dietaryType, setDietaryType] = useState<DietaryFilter>("All");
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

  // Get unique category names and place Desserts and Beverages at the end
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        menuItems
          .map((item) => item.categories?.name)
          .filter((name): name is string => Boolean(name)),
      ),
    );

    const sortedCategories = uniqueCategories.sort((a, b) =>
      a.localeCompare(b),
    );

    const desserts = sortedCategories.filter(
      (name) => name.toLowerCase() === "desserts",
    );

    const beverages = sortedCategories.filter(
      (name) => name.toLowerCase() === "beverages",
    );

    const mainCategories = sortedCategories.filter(
      (name) =>
        name.toLowerCase() !== "desserts" && name.toLowerCase() !== "beverages",
    );

    return ["All", ...mainCategories, ...desserts, ...beverages];
  }, [menuItems]);

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
          (dietaryType === "All" || item.dietaryType === dietaryType) &&
          `${item.name} ${item.description ?? ""} ${itemCategory}`
            .toLowerCase()
            .includes(query.toLowerCase())
        );
      }),
    [menuItems, cuisine, category, dietaryType, query],
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

  const getPaginationButtonClasses = (isActive = false) =>
    `inline-flex h-9.5 min-w-9.5 cursor-pointer items-center justify-center rounded-full border px-3.25 text-[12px] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-35 max-[600px]:h-9 max-[600px]:min-w-8.5 max-[600px]:px-2.25 max-[600px]:text-[11px] ${
      isActive
        ? "border-accent bg-accent font-semibold text-white"
        : "border-accent/25 bg-transparent font-medium text-[#b8b8b8] hover:enabled:border-accent hover:enabled:bg-accent/8 hover:enabled:text-accent"
    }`;

  return (
    <section className="mx-auto w-[min(1160px,calc(100%-48px))] py-25 max-[700px]:w-[min(calc(100%-32px),560px)] max-[700px]:py-12">
      <div className="mb-7.5 flex items-center justify-between gap-4.5 max-[950px]:flex-wrap max-[700px]:mb-4 max-[700px]:grid max-[700px]:grid-cols-1 max-[700px]:gap-3">
        {/* Cuisine filters */}
        <div
          className="flex flex-wrap gap-2 max-[950px]:flex-[1_1_100%] max-[700px]:flex-none max-[700px]:gap-1.5"
          aria-label="Filter by cuisine"
        >
          {cuisines.map((item) => (
            <button
              key={item}
              onClick={() => {
                setCuisine(item);
                setCurrentPage(1);
              }}
              className={`rounded-[30px] border px-3.25 py-2.25 text-[10px] max-[700px]:px-2.75 max-[700px]:py-1.75 ${
                cuisine === item
                  ? "border-accent bg-accent font-[750] text-[#1b1713]"
                  : "border-line bg-transparent text-[#b6bbb3]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Dietary filters */}
        <div
          className="flex flex-wrap items-center gap-2 max-[950px]:flex-[1_1_100%] max-[700px]:flex-none max-[700px]:gap-1.5"
          aria-label="Filter by dietary preference"
        >
          {dietaryOptions.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={dietaryType === option}
              onClick={() => {
                setDietaryType(option);
                setCurrentPage(1);
              }}
              className={`inline-flex items-center gap-1.5 rounded-[30px] border px-3.25 py-2.25 text-[10px] transition-colors max-[700px]:px-2.75 max-[700px]:py-1.75 ${
                dietaryType === option
                  ? "border-accent bg-accent font-[750] text-[#1b1713]"
                  : "border-line bg-transparent text-[#b6bbb3]"
              }`}
            >
              {option === "Veg" && (
                <span
                  className="h-2 w-2 rounded-full bg-[#69b76b]"
                  aria-hidden="true"
                />
              )}

              {option === "Non-veg" && (
                <span
                  className="h-2 w-2 rounded-full bg-[#d96b67]"
                  aria-hidden="true"
                />
              )}

              {option === "All" ? "All dishes" : option}
            </button>
          ))}
        </div>

        {/* Custom category dropdown */}
        <div
          className="relative z-10 w-45 flex-[0_0_180px] max-md:w-40 max-md:basis-40 max-[600px]:w-full max-[600px]:flex-[1_1_100%] max-[700px]:flex-none"
          ref={categoryRef}
        >
          <button
            type="button"
            className={`flex min-h-10.5 w-full cursor-pointer items-center justify-between gap-2.5 rounded-[7px] border bg-surface px-3.25 text-left text-[11px] text-foreground transition-colors duration-200 hover:border-accent/60 max-[600px]:min-h-10 ${
              categoryOpen ? "border-accent/60" : "border-line"
            }`}
            onClick={() => setCategoryOpen((open) => !open)}
            aria-expanded={categoryOpen}
            aria-haspopup="listbox"
            aria-label="Filter by category"
          >
            <span className="truncate">
              {category === "All" ? "All categories" : category}
            </span>

            <svg
              className={`shrink-0 text-accent transition-transform duration-200 ${
                categoryOpen ? "rotate-180" : ""
              }`}
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
            <div
              className="scrollbar-tasty animate-dropdown-appear absolute top-[calc(100%+7px)] left-0 max-h-55 w-full overflow-x-hidden overflow-y-auto rounded-lg border border-accent/20 bg-surface p-1.25 shadow-[0_12px_30px_rgba(0,0,0,0.4)] max-md:max-h-47.5 max-[600px]:max-h-45 max-[700px]:top-auto max-[700px]:bottom-[calc(100%+7px)] max-[700px]:max-h-44"
              role="listbox"
            >
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="option"
                  aria-selected={category === item}
                  className={`flex min-h-8.5 w-full cursor-pointer items-center justify-between gap-2 rounded-[5px] border-0 px-2.5 py-1.75 text-left text-[11px] transition-colors duration-150 ${
                    category === item
                      ? "bg-accent/13 font-bold text-accent"
                      : "bg-transparent text-[#b8bbb5] hover:bg-accent/10 hover:text-foreground"
                  }`}
                  onClick={() => {
                    setCategory(item);
                    setCurrentPage(1);
                    setCategoryOpen(false);
                  }}
                >
                  <span>{item === "All" ? "All categories" : item}</span>

                  {category === item && (
                    <span className="text-[12px] font-bold text-accent">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <input
          className="w-55 rounded-[7px] border border-line bg-input-bg px-3.5 py-3.25 text-[12px] text-foreground outline-none placeholder:text-[#737a71] focus:border-accent max-[950px]:w-47.5 max-[950px]:flex-[0_0_190px] max-[700px]:h-8.5 max-[700px]:min-h-8.5 max-[700px]:w-full max-[700px]:flex-none max-[700px]:px-2.5 max-[700px]:py-0 max-[700px]:text-[11px] max-[700px]:leading-normal"
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
          <div className="grid grid-cols-4 gap-5 max-[950px]:grid-cols-2 max-[700px]:gap-x-3.25 max-[700px]:gap-y-6">
            {currentItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2 max-[600px]:mt-8 max-[600px]:flex-nowrap max-[600px]:gap-1.25">
              <button
                className={getPaginationButtonClasses()}
                onClick={() => setCurrentPage((page) => page - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {/* Desktop pagination */}
              <div className="flex items-center justify-center gap-2 max-[600px]:hidden">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    key={page}
                    className={getPaginationButtonClasses(currentPage === page)}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Mobile compact pagination */}
              <div className="hidden items-center justify-center gap-1 max-[600px]:flex">
                {compactPages.map((page, index) =>
                  page === "ellipsis" ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="flex min-w-5 items-center justify-center text-[12px] text-[#888888]"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      className={getPaginationButtonClasses(
                        currentPage === page,
                      )}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                className={getPaginationButtonClasses()}
                onClick={() => setCurrentPage((page) => page + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex min-h-72.5 flex-col items-center justify-center rounded-xl border border-dashed border-line px-5 py-10 text-center">
          <h3 className="my-2.5 text-[24px] tracking-[-0.04em]">
            No dishes found
          </h3>
          <p className="mb-5 max-w-115 text-[12px] leading-[1.8] text-muted">
            Try another search, cuisine, category or dietary preference.
          </p>
        </div>
      )}
    </section>
  );
}
