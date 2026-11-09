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
    <div className="feature-strip">
      {features.map(({ icon: Icon, title, text }) => (
        <div className="feature" key={title}>
          <span className="feature-icon">
            <Icon size={20} />
          </span>
          <div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
