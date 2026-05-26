/** Document `<head>` meta for a route (title + description). */
export const createPageHead = (title: string, description: string) => ({
  meta: [
    {
      title,
    },
    {
      name: "description",
      content: description,
    },
  ],
})
