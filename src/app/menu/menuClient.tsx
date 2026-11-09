"use client";

import { useMemo, useState } from "react";
import { MenuCard } from "../_components/menu-card";
import { MenuItem } from "../_lib/data-service";

const cuisines = [
  "All",
  "American",
  "Italian",
  "Mexican",
  "Japanese",
  "Indian",
];

export function MenuClient({ menuItems }: { menuItems: MenuItem[] }) {
  const [cuisine, setCuisine] = useState("All");
  const [query, setQuery] = useState("");

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

  return (
    <section className="container section-block">
      <div className="menu-toolbar">
        <div className="filter-pills">
          {cuisines.map((item) => (
            <button
              key={item}
              onClick={() => setCuisine(item)}
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
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length ? (
        <div className="menu-grid">
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No dishes found</h3>
          <p>Try another search or cuisine.</p>
        </div>
      )}
    </section>
  );
}
