export function updateUrlParams(updates: Record<string, string | null>) {
  const params = new URLSearchParams(window.location.search);

  // 更新或删除指定参数
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null) {
      params.delete(key); // 删除参数
    } else {
      params.set(key, value); // 更新参数
    }
  });

  // 更新 URL
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}?${params.toString()}`
  );
}

export function getUrlParam(param: string): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}
