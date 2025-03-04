import { useTranslation } from "react-i18next"

export const TypeHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full items-center">
      <span className="truncate">{t("fields.type")}</span>
    </div>
  )
}
