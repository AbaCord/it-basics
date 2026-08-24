import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <div className="mb-5 text-center">
      <p className="opacity-50">{t("label")}</p>
    </div>
  );
}
