/**
 * Shared Mermaid instance manager to prevent conflicts between components
 */

export interface MermaidThemeConfig {
  theme?: 'default' | 'base' | 'dark' | 'forest' | 'neutral';
  look?: 'classic' | 'handDrawn';
  darkMode?: boolean;
  fontFamily?: string;
  altFontFamily?: string;
  fontSize?: number;
}

let mermaidInstance: any = null;
let initializationPromise: Promise<any> | null = null;
let isInitialized = false;
let currentConfig: MermaidThemeConfig = {};

// Track if we've already attempted to clear registrations
let hasAttemptedReset = false;

export async function getMermaidInstance(config?: MermaidThemeConfig): Promise<any> {
  if (typeof window === "undefined") {
    return null;
  }

  // If config changed, force re-initialization for theme changes
  if (mermaidInstance && config && hasConfigChanged(config)) {
    // Reset initialization state to force re-init
    mermaidInstance = null;
    isInitialized = false;
    initializationPromise = null;
    currentConfig = { ...config };
  }

  // If already initialized, return the instance
  if (mermaidInstance) {
    return mermaidInstance;
  }

  // If initialization is in progress, wait for it
  if (initializationPromise) {
    return initializationPromise;
  }

  // Start initialization with config
  initializationPromise = initializeMermaid(config);
  return initializationPromise;
}

function hasConfigChanged(newConfig: MermaidThemeConfig): boolean {
    return JSON.stringify(currentConfig) !== JSON.stringify(newConfig);
}



function buildMermaidConfig(config: MermaidThemeConfig = {}) {
  const mermaidConfig: any = {
    startOnLoad: false,
    logLevel: "fatal",
    suppressErrorRendering: true,
    securityLevel: "loose",
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
    },

  };

  // Apply theme configuration
  if (config.theme) {
    mermaidConfig.theme = config.theme;
  }

  if (config.look) {
    mermaidConfig.look = config.look;
  }



  // Dark mode override - this overrides the theme
  if (config.darkMode !== undefined && config.darkMode) {
    mermaidConfig.theme = 'dark';
  }

  // Font configuration - apply to theme variables
  const themeVariables: any = {};
  
  if (config.fontFamily) {
    mermaidConfig.fontFamily = config.fontFamily;
    // Also set in theme variables for better support
    themeVariables.fontFamily = config.fontFamily;
    themeVariables.primaryTextColor = config.darkMode ? '#ffffff' : '#000000';
  }

  if (config.fontSize) {
    // Apply font size through theme variables and CSS
    themeVariables.primaryTextSize = `${config.fontSize}px`;
    mermaidConfig.fontSize = config.fontSize;
  }

  // Apply theme variables if any were set
  if (Object.keys(themeVariables).length > 0) {
    mermaidConfig.themeVariables = themeVariables;
  }

  return mermaidConfig;
}

async function initializeMermaid(config?: MermaidThemeConfig): Promise<any> {
  try {
    const mermaid = (await import("mermaid")).default;

    // Only attempt reset once to avoid repeated errors
    if (!hasAttemptedReset) {
      try {
        // Clear any existing diagram registrations
        if ((mermaid as any).diagrams) {
          (mermaid as any).diagrams.clear();
        }

        // Reset mermaid API
        if (mermaid.mermaidAPI?.reset) {
          mermaid.mermaidAPI.reset();
        }

        // Clear internal registry if accessible
        if ((mermaid as any).getDiagramFromText) {
          try {
            // Force clear internal state
            (mermaid as any).mermaidAPI.globalReset?.();
          } catch (e) {
            // Ignore if method doesn't exist
          }
        }

        hasAttemptedReset = true;
      } catch (resetError) {
        console.warn("Could not reset Mermaid state:", resetError);
        hasAttemptedReset = true; // Don't try again
      }
    }

    // Only initialize if not already done
    if (!isInitialized) {
      try {
        const mermaidConfig = buildMermaidConfig(config);
        mermaid.initialize(mermaidConfig);
        isInitialized = true;
        currentConfig = config ? { ...config } : {};
      } catch (initError) {
        // If initialization fails due to "already registered", try to continue anyway
        if (
          initError instanceof Error &&
          initError.message.includes("already registered")
        ) {
          console.warn(
            "Mermaid diagrams already registered, continuing with existing instance"
          );
          isInitialized = true;
        } else {
          throw initError;
        }
      }
    }

    mermaidInstance = mermaid;
    return mermaidInstance;
  } catch (error) {
    console.error("Failed to initialize Mermaid:", error);
    initializationPromise = null; // Reset so we can try again
    throw error;
  }
}
