import PagePlaceholder from "../components/pagePlaceholder";

export default function Analytics() {
  return (
    <PagePlaceholder
      eyebrow="Insights"
      title="Business Analytics"
      description="Review demand trends, order volume, top products, and revenue signals for grocery operations."
      actionLabel="Export Report"
      stats={[
        { label: "Revenue", value: "$8.4k", helper: "Month to date" },
        { label: "Orders", value: "312", helper: "Completed sales" },
        { label: "Avg Basket", value: "$27", helper: "Per order" },
        { label: "Growth", value: "18%", helper: "Compared to last month" },
      ]}
    />
  );
}
