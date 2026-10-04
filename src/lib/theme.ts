export const themes = ["light", "dark"] as const;

export type ThemeName = (typeof themes)[number];

export const themeStorageKey = "sprig-theme";

export const themeBootScript = `try{var t=localStorage.getItem("${themeStorageKey}");if(t==="classic"||t==="cool"){t="light";localStorage.setItem("${themeStorageKey}",t)}if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}}catch(e){}`;
