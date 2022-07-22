export const REAL_NAME_REGEX = /^[a-zA-Z ]{1,80}$/;
export const DISPLAY_NAME_REGEX = /^[a-z0-9_-]{2,16}$/;
export const SOCIAL_MEDIA_NAME_REGEX = /^$|^[a-zA-Z0-9.,_$;][a-zA-Z0-9.,_$;]+$/;

export const EXTRACT_IMAGE_REGEX = /(?:!\[(.*?)\]\((.*?)\))/g;
export const MENTIONING_REGEX = /@(\S+)(\s|$)/g;

export const DISPLAY_NAME_ERROR_MESSAGE = `Invalid Username. Username harus:
 1. Antara 2-16 karakter 
 2. Hanya memiliki huruf (a-z), nomor (0-9) , _ dan -  
 3. Tidak boleh ada huruf kapital
 `;
