export const LOCAL_STORAGE_FILTERS_KEY = "LOCAL_STORAGE_FILTERS_KEY"
/** @type import("@tanstack/react-table").ColumnDef<any> */
export const columns = [
  {
    header: "Имя",
    accessorKey: "firstName",
    footer: "Имя",
  },
  {
    header: "Дата заявки",
    accessorKey: "dateRequest",
    footer: "Дата заявки"
  },
  {
    header: "Снилс",
    accessorKey: "snils",
    footer: "Снилс"
  },
  {
    header: "Оригинал",
    accessorKey: "sertificateOriginal",
    footer: "Оригинал"
  },
  {
    header: "Фамилия",
    accessorKey: "lastName",
    footer: "Фамилия"
  },
  {
    header: "Дата заведения дела",
    accessorKey: "dateFormed",
    footer: "Дата заведения дела"
  },
  {
    header: "Номер дела",
    accessorKey: "caseNumber",
    footer: "Номер дела"
  },
  {
    header: "Подписка",
    accessorKey: "subscribe",
    footer: "Подписка"
  }
]