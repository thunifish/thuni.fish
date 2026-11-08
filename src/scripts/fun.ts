const parts = ["hsif.inuht", "moht"];

function getEmail(): string {
  return parts
    .map((part) => part.split("").reverse().join(""))
    .reverse()
    .join("@");
}

export function initEmail(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>("[data-email]");
  if (buttons.length === 0) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      window.location.href = `mailto:${getEmail()}`;
    });
  });
}
