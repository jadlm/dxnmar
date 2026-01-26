const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Normalise une URL d'image pour l'affichage
 * - Convertit les backslashes Windows en slashes
 * - Encode les espaces et caractères spéciaux dans les noms de fichiers
 * - Gère les chemins relatifs et absolus
 */
export const normalizeImageUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  
  // Convertir les backslashes Windows en slashes
  let normalized = url.replace(/\\/g, "/").trim();
  
  // Si c'est déjà une URL absolue (http/https), la retourner telle quelle
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }
  
  // Si ça commence par /uploads/, c'est un fichier uploadé via le backend
  if (normalized.startsWith("/uploads/")) {
    return `${API_URL}${normalized}`;
  }
  
  // S'assurer que les chemins relatifs commencent par /
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }
  
  // Si ça commence par /images/, c'est un fichier dans public/images
  // Encoder les espaces et caractères spéciaux dans le nom de fichier
  if (normalized.startsWith("/images/")) {
    try {
      const parts = normalized.split("/");
      const filename = parts[parts.length - 1];
      const path = parts.slice(0, -1).join("/");
      
      if (!filename) return normalized;
      
      // Essayer de décoder d'abord si c'est déjà encodé
      let decodedFilename = filename;
      try {
        if (filename.includes("%")) {
          decodedFilename = decodeURIComponent(filename);
        }
      } catch (e) {
        // Si le décodage échoue, utiliser le nom original
        decodedFilename = filename;
      }
      
      // Si le nom de fichier décodé contient des caractères spéciaux, l'encoder
      if (decodedFilename.includes(" ") || decodedFilename.includes("&") || decodedFilename.includes("#") || decodedFilename.includes("+")) {
        // Encoder uniquement le nom de fichier, pas le chemin
        const encodedFilename = encodeURIComponent(decodedFilename);
        return `${path}/${encodedFilename}`;
      }
      
      // Si pas de caractères spéciaux, retourner tel quel (même si déjà encodé)
      return normalized;
    } catch (e) {
      // En cas d'erreur, retourner le chemin original
      return normalized;
    }
  }
  
  // Par défaut, traiter comme un chemin relatif
  return normalized;
};
