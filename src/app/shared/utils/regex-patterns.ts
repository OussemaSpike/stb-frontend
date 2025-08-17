/* Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters */
export const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;

/* Must contain only numbers */
export const phonePattern = /^\d*$/;

// The `urlPattern` regular expression is designed to match URLs.
export const urlPattern = /^https?:\/\/(?:www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
export const youtubeVideoPattern = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]{11}$/;
export const dailyMotionVideoPattern = /^https?:\/\/(?:www\.)?dailymotion\.com\/video\/[\w-]+$/;
