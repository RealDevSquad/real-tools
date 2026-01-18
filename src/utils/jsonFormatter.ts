/**
 * Format/beautify JSON string
 */
export function formatJSON(jsonString: string, indent: number = 2): string {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, indent);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Minify JSON string
 */
export function minifyJSON(jsonString: string): string {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate JSON string
 */
export function validateJSON(jsonString: string): { valid: boolean; error?: string } {
  try {
    JSON.parse(jsonString);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get JSON statistics
 */
export function getJSONStats(jsonString: string): {
  size: number;
  lines: number;
  keys: number;
  depth: number;
} {
  try {
    const parsed = JSON.parse(jsonString);
    const formatted = JSON.stringify(parsed, null, 2);
    
    const countKeys = (obj: any, depth: number = 0): { keys: number; maxDepth: number } => {
      if (typeof obj !== 'object' || obj === null) {
        return { keys: 0, maxDepth: depth };
      }
      
      if (Array.isArray(obj)) {
        let maxDepth = depth;
        let totalKeys = 0;
        obj.forEach(item => {
          const result = countKeys(item, depth + 1);
          totalKeys += result.keys;
          maxDepth = Math.max(maxDepth, result.maxDepth);
        });
        return { keys: totalKeys, maxDepth };
      }
      
      let maxDepth = depth;
      let totalKeys = Object.keys(obj).length;
      
      for (const value of Object.values(obj)) {
        const result = countKeys(value, depth + 1);
        totalKeys += result.keys;
        maxDepth = Math.max(maxDepth, result.maxDepth);
      }
      
      return { keys: totalKeys, maxDepth };
    };
    
    const { keys, maxDepth } = countKeys(parsed);
    
    return {
      size: new Blob([jsonString]).size,
      lines: formatted.split('\n').length,
      keys,
      depth: maxDepth
    };
  } catch {
    return {
      size: new Blob([jsonString]).size,
      lines: jsonString.split('\n').length,
      keys: 0,
      depth: 0
    };
  }
}
