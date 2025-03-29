import Link from "next/link";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

type PriceType = {
  name: string;
  price: number;
  items: string[];
  paymentLink: string;
  priceId: string;
  description?: string;
  id: string;
};

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 10,
    items: ["5 PDF summaries per month", "1000 credits"],
    paymentLink: "",
    priceId: "",
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    description: "For teams and businesses",
    items: ["Unlimited PDF summaries", "Priority support"],
    paymentLink: "",
    priceId: "",
  },
];

const PricingCard = ({
  name,
  price,
  items,
  paymentLink,
  description,
  id,
}: PriceType) => {
  return (
    <div className="relative w-full max-w-lg">
      <div
        className={cn(
          "flex flex-col gap-4 h-full lg:gap-8 z-10 p-8 rounded-xl border-[1px] border-gray-500/20 rounded-2xl",
          id == "pro" && "border-rose-500 gap-8"
        )}
      >
        <div className="flex justify-between items-center gap-4">
          <div>
            <p className="text-lg lg:text-xl font-bold capitalize">{name}</p>
            <p className="text-base-content/80 mt-2">{description}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <p className="text-5xl tracking-tight font-extrabold">
            ${price}
            <div className="flex flex-col justify-end mb-[4px]">
              <p className="text-xs uppercase font-semibold">USD</p>
              <p className="text-xs">month</p>
            </div>
          </p>
        </div>
        <div className="space-y-2.5 leading-relaxed text-base flex-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <CheckIcon size={18} />
              <span>{item}</span>
            </li>
          ))}
        </div>
        <div className="space-y-2 flex justify-center w-full">
          <Link
            href={paymentLink}
            className="w-full rounded-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-800 to-rose-500 hover:from-rose-500 hover:to-rose-800 transition-all duration-300 text-white border-2 py-2"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function PricingSection() {
  return (
    <section>
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <div>
          <h2>Pricing</h2>
        </div>
        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {plans.map((plan) => (
            <PricingCard key={plan.id} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
