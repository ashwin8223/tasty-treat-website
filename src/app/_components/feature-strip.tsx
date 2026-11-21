import { Leaf, ChefHat, Clock3, Heart } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Fresh ingredients",
    text: "Quality ingredients, thoughtfully sourced.",
  },
  {
    icon: ChefHat,
    title: "Made to order",
    text: "Prepared fresh when you place your order.",
  },
  {
    icon: Clock3,
    title: "Right on time",
    text: "A smooth experience from kitchen to table.",
  },
  {
    icon: Heart,
    title: "Made with care",
    text: "A little extra love in every detail.",
  },
];

export function FeatureStrip() {
  return (
    <div className="grid grid-cols-4 gap-5 border-y border-line py-7 max-[950px]:grid-cols-2 max-[700px]:gap-x-3 max-[700px]:gap-y-5.5">
      {features.map(({ icon: Icon, title, text }) => (
        <div
          className="flex items-start gap-3.25 max-[700px]:gap-2.25"
          key={title}
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-accent/10 text-accent max-[700px]:h-8.5 max-[700px]:w-8.5">
            <Icon size={20} />
          </span>
          <div>
            <h3 className="mt-0.5 mb-1.25 text-[12px] max-[700px]:text-[11px]">
              {title}
            </h3>
            <p className="m-0 text-[10px] leading-[1.6] text-muted max-[700px]:text-[9px]">
              {text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
