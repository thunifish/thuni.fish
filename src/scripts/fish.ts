export function initFish(): void {
  const fishButton = document.querySelector<HTMLButtonElement>("[data-fish]");
  const fishEmoji = document.querySelector<HTMLElement>("[data-fish-emoji]");

  if (!fishButton || !fishEmoji) return;

  fishButton.addEventListener("click", () => {
    fishEmoji.removeAttribute("data-spinning");
    void fishEmoji.offsetWidth;
    fishEmoji.dataset.spinning = "true";
  });
}
