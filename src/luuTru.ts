/** Đọc / ghi localStorage, bỏ qua lỗi khi trình duyệt chặn lưu trữ. */
export function doc(k: string): string | null {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}

export function ghi(k: string, v: string) {
  try {
    localStorage.setItem(k, v)
  } catch {
    /* trình duyệt chặn lưu trữ – bỏ qua */
  }
}
