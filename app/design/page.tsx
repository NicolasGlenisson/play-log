import { Button } from "@/components/custom/buttons";
import { Input } from "@/components/custom/input";
import { CopyableCode } from "@/components/design/copyable-code";

export default function DesignSystemPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-[#5E5034] mb-4">
          Play Log Design System
        </h1>
        <p className="text-[#7A6C48] mb-8">
          A reference guide for colors, components, and styles used throughout
          the Play Log application.
        </p>
      </div>

      {/* Color Palette Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#6B5E40] mb-6">
          Color Palette
        </h2>

        {/* Main Colors */}
        <div className="mb-10">
          <h3 className="text-xl font-medium text-[#6B5E40] mb-4">
            Primary Colors
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { bg: "#FDFAE0", text: "#5E5034", name: "Cream (Background)" },
              { bg: "#FAEDCD", text: "#5E5034", name: "Beige (Card)" },
              { bg: "#E9EDCA", text: "#5E5034", name: "Light Green" },
              { bg: "#CCD5AE", text: "#5E5034", name: "Moss Green" },
              { bg: "#949F6E", text: "#FFFFFF", name: "Olive Green" },
              { bg: "#6B5E40", text: "#FFFFFF", name: "Brown (Text)" },
            ].map((color) => (
              <ColorCard
                key={color.bg}
                bgColor={color.bg}
                textColor={color.text}
                name={color.name}
              />
            ))}
          </div>
        </div>

        {/* Secondary Colors */}
        <div className="mb-10">
          <h3 className="text-xl font-medium text-[#6B5E40] mb-4">
            Secondary Colors
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { bg: "#F8E8B8", text: "#6B5E40", name: "Light Gold" },
              { bg: "#E9DCC3", text: "#5E5034", name: "Beige Border" },
              { bg: "#9B7E55", text: "#FFFFFF", name: "Bronze (Accent)" },
              { bg: "#7A6C48", text: "#FFFFFF", name: "Medium Brown (Text)" },
              { bg: "#A89669", text: "#FFFFFF", name: "Soft Gold" },
              { bg: "#C9B98B", text: "#5E5034", name: "Wheat" },
            ].map((color) => (
              <ColorCard
                key={color.bg}
                bgColor={color.bg}
                textColor={color.text}
                name={color.name}
              />
            ))}
          </div>
        </div>

        {/* UI State Colors */}
        <div className="mb-10">
          <h3 className="text-xl font-medium text-[#6B5E40] mb-4">
            UI State Colors
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { bg: "#F0E2CA", text: "#5E5034", name: "Hover State" },
              { bg: "#EDD78A", text: "#5E5034", name: "Active State" },
              { bg: "#BFA68A", text: "#FFFFFF", name: "Focus Ring" },
              { bg: "#5C6246", text: "#FFFFFF", name: "Dark Green" },
              { bg: "#8A6E44", text: "#FFFFFF", name: "Dark Gold" },
              { bg: "#6B705C", text: "#FFFFFF", name: "Muted Text" },
            ].map((color) => (
              <ColorCard
                key={color.bg}
                bgColor={color.bg}
                textColor={color.text}
                name={color.name}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Components Preview Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#6B5E40] mb-6">
          Component Examples
        </h2>

        <div className="bg-[#FAEDCD] p-6 rounded-xl border border-[#E9DCC3] mb-8">
          <h3 className="text-xl font-medium text-[#6B5E40] mb-4">Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <Button>Default Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>

        <div className="bg-[#FAEDCD] p-6 rounded-xl border border-[#E9DCC3]">
          <h3 className="text-xl font-medium text-[#6B5E40] mb-4">Inputs</h3>
          <div className="space-y-4 max-w-md">
            <Input placeholder="Standard input" />
            <Input placeholder="Disabled input" disabled />
            <Input placeholder="Full width input" fullWidth />
          </div>
        </div>
      </section>

      {/* Common Utility Classes */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#6B5E40] mb-6">
          Common Utility Classes
        </h2>

        <div className="bg-[#FAEDCD] p-6 rounded-xl border border-[#E9DCC3]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UtilityClassCard
              title="Background Colors"
              classes={[
                "bg-[#FDFAE0]",
                "bg-[#FAEDCD]",
                "bg-[#E9EDCA]",
                "bg-[#CCD5AE]",
                "bg-[#949F6E]",
                "bg-[#F8E8B8]",
              ]}
            />

            <UtilityClassCard
              title="Text Colors"
              classes={[
                "text-[#5E5034]",
                "text-[#6B5E40]",
                "text-[#7A6C48]",
                "text-[#9B7E55]",
                "text-[#A89669]",
                "text-[#6B705C]",
              ]}
            />

            <UtilityClassCard
              title="Border Colors"
              classes={[
                "border-[#E9DCC3]",
                "border-[#CCD5AE]",
                "border-[#EDD78A]",
                "border-[#949F6E]",
                "border-[#BFA68A]",
                "border-[#C9B98B]",
              ]}
            />

            <UtilityClassCard
              title="Opacity Variants"
              classes={[
                "bg-[#FAEDCD]/50",
                "bg-[#CCD5AE]/60",
                "bg-[#949F6E]/30",
                "text-[#9B7E55]/80",
                "border-[#E9DCC3]/80",
                "bg-[#F8E8B8]/50",
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ColorCard({
  bgColor,
  textColor,
  name,
}: {
  bgColor: string;
  textColor: string;
  name: string;
}) {
  return (
    <div className="flex flex-col h-full">
      <div
        className="h-28 rounded-t-lg flex items-end p-3"
        style={{ backgroundColor: bgColor }}
      >
        <span className="font-mono text-sm" style={{ color: textColor }}>
          {bgColor}
        </span>
      </div>
      <div className="bg-white border border-t-0 border-[#E9DCC3] rounded-b-lg p-3 flex-grow">
        <p className="text-[#5E5034] font-medium mb-1">{name}</p>
        <CopyableCode text={`bg-[${bgColor}]`} />
        <CopyableCode text={`text-[${textColor}]`} className="mt-1" />
      </div>
    </div>
  );
}

function UtilityClassCard({
  title,
  classes,
}: {
  title: string;
  classes: string[];
}) {
  return (
    <div>
      <h4 className="font-medium text-[#6B5E40] mb-2">{title}</h4>
      <div className="space-y-2">
        {classes.map((cls) => (
          <CopyableCode key={cls} text={cls} />
        ))}
      </div>
    </div>
  );
}
