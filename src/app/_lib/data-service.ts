import { supabase } from "./supabase";

export type MenuItem = {
  id: number;
  name: string;
  price: number;
  ingredients: string | null;
  description: string | null;
  image: string | null;
  dietaryType: string;
  isFeatured: boolean;
  isAvailable: boolean;
  categories: {
    name: string;
    cuisines: {
      name: string;
    };
  } | null;
};

export async function getMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu")
    .select(
      `
      id,
      name,
      price,
      ingredients,
      description,
      image,
      dietaryType,
      isFeatured,
      isAvailable,
      categories (
        name,
        cuisines (
          name
        )
      )
    `,
    )
    .order("name");

  if (error) {
    console.error(error);
    throw new Error("Menu items could not be loaded");
  }

  return data as unknown as MenuItem[];
}
