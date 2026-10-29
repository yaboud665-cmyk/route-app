/**
 * يحوّل أي error راجع من الـ API لرسالة نصية مناسبة للعرض.
 * شكل الخطأ في الـ API: { success: false, message: "...", errors: ["..."] | "..." }
 */
export const getErrorMessage = (error) => {
  const data = error?.response?.data

  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors.join(', ')
  }

  if (typeof data?.errors === 'string' && data.errors) {
    return data.errors
  }

  if (data?.message) return data.message

  return error?.message || 'حدث خطأ غير متوقع، حاول مرة أخرى'
}
