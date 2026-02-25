import { getTranslations } from "next-intl/server";
import TransformationsSlider from "./TransformationsSlider";
import type { Transformation } from "@prisma/client";

export default async function TransformationSection({
  transformations,
}: {
  transformations: Transformation[];
}) {
  const t = await getTranslations("transformation");
  const hasItems = transformations.length > 0;

  return (
    <section className="relative py-20 md:py-24 px-6 bg-muted/10" id="transformation">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
        <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
      </div>
      {hasItems ? (
        <TransformationsSlider transformations={transformations} />
      ) : (
        <div className="max-w-3xl mx-auto text-center text-muted-foreground">
          <p>{t("subtitle")}</p>
        </div>
      )}
    </section>
  );
}
