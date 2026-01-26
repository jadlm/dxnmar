const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Normalise une URL d'image pour l'affichage
 * - Convertit les backslashes Windows en slashes
 * - Encode les espaces et caractères spéciaux dans les noms de fichiers
 * - Gère les chemins relatifs et absolus
 */
export const normalizeImageUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  
  // Convertir les backslashes Windows en slashes (gérer aussi les doubles backslashes)
  let normalized = url.replace(/\\\\/g, "/").replace(/\\/g, "/").trim();
  
  // Nettoyer les doubles slashes (sauf après http:// ou https://)
  normalized = normalized.replace(/([^:])\/\//g, "$1/");
  
  // Si c'est déjà une URL absolue (http/https), la retourner telle quelle
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }
  
  // Si ça commence par /uploads/, c'est un fichier uploadé via le backend
  if (normalized.startsWith("/uploads/")) {
    return `${API_URL}${normalized}`;
  }
  
  // Si ça commence par "images/" (sans slash), ajouter le slash
  if (normalized.startsWith("images/") && !normalized.startsWith("/images/")) {
    normalized = `/${normalized}`;
  }
  
  // S'assurer que les chemins relatifs commencent par /
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }
  
  // Si ça commence par /images/, c'est un fichier dans public/images
  // Encoder les espaces et caractères spéciaux dans le nom de fichier
  if (normalized.startsWith("/images/")) {
    try {
      const parts = normalized.split("/").filter(p => p); // Filtrer les parties vides
      const filename = parts[parts.length - 1];
      const path = "/" + parts.slice(0, -1).join("/");
      
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
      
      // TOUJOURS encoder le nom de fichier pour éviter les problèmes avec les espaces et caractères spéciaux
      // Next.js peut gérer les espaces, mais il vaut mieux encoder pour être sûr
      const encodedFilename = encodeURIComponent(decodedFilename);
      const result = `${path}/${encodedFilename}`;
      
      // Log pour debug (toujours actif pour diagnostiquer les problèmes)
      console.log("🖼️ normalizeImageUrl:", {
        original: url,
        normalized: result,
        filename: decodedFilename,
        encoded: encodedFilename
      });
      
      return result;
    } catch (e) {
      console.error("Error in normalizeImageUrl:", e, { original: url, normalized });
      // En cas d'erreur, retourner le chemin original normalisé
      return normalized;
    }
  }
  
  // Par défaut, traiter comme un chemin relatif
  return normalized;
};
