const fs = require("fs");
const path = require("path");

// Core files to create with metadata
const files = [
    {
        path: "src/app/page.tsx",
        name: "Home",
        defaultExport: true,
    },
    {
        path: "src/components/blocks/heros/modern-hero-with-gradients.tsx",
        name: "ModernHeroWithGradients",
    },
    {
        path: "src/components/blocks/feature-sections/balanced-features-layout.tsx",
        name: "FeaturesLayout",
    },
    {
        path: "src/components/blocks/demo-section/interactive-demo-video.tsx",
        name: "InteractiveDemoVideo",
        defaultExport: true,
    },
    {
        path: "src/components/blocks/use-cases/key-use-cases.tsx",
        name: "KeyUseCases",
    },
    {
        path: "src/components/blocks/testimonials/modern-testimonials-redesign.tsx",
        name: "TestimonialsSection",
    },
    {
        path: "src/components/blocks/coming-soon/our-team.tsx",
        name: "OurTeam",
    },
    {
        path: "src/components/blocks/coming-soon/email-signup-waitlist.tsx",
        name: "EmailSignupWaitlist",
    },
    {
        path: "src/components/blocks/ctas/simple-centered-with-gradient.tsx",
        name: "SimpleCenteredWithGradient",
        defaultExport: true,
    },
    {
        path: "src/components/blocks/footers/simple-footer-with-four-grids.tsx",
        name: "SimpleFooterWithFourGrids",
    },
    {
        path: "src/components/navigation/sticky-navbar.tsx",
        name: "StickyNavigation",
    },
    {
        path: "src/components/ui/section-navigation.tsx",
        name: "SectionNavigation",
    },
    {
        path: "src/components/ui/scroll-progress-indicator.tsx",
        name: "ScrollProgressIndicator",
    },
    {
        path: "src/components/ui/section-transition.tsx",
        name: "SectionTransition",
    },
    {
        path: "src/components/ui/skeleton.tsx",
        name: "Skeleton",
    },
    {
        path: "src/components/support/live-chat-widget.tsx",
        name: "LiveChatWidget",
    },
    {
        path: "src/lib/utils.ts",
        name: "utils",
        isUtil: true,
    },
    {
        path: "src/data/globe.json",
        isJSON: true,
    },
];

// Utility function to write dummy component
function writeComponent(filePath, componentName, defaultExport = false, isUtil = false, isJSON = false) {
    if (isJSON) {
        fs.writeFileSync(filePath, JSON.stringify({ message: "globe data placeholder" }, null, 2));
        return;
    }

    const content = isUtil
        ? `// Utility functions\nexport function sampleUtil() {\n  return "This is a placeholder utility function.";\n}`
        : `import React from "react";

${defaultExport
            ? `export default function ${componentName}() {
  return (
    <div>
      <h2>${componentName} (Default Export)</h2>
    </div>
  );
}`
            : `export function ${componentName}() {
  return (
    <div>
      <h2>${componentName}</h2>
    </div>
  );
}`}`;

    fs.writeFileSync(filePath, content, "utf8");
}

// Main creator
files.forEach(({ path: filePath, name, defaultExport, isUtil, isJSON }) => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
    }

    if (!fs.existsSync(filePath)) {
        writeComponent(filePath, name, defaultExport, isUtil, isJSON);
        console.log(`📄 Created file: ${filePath}`);
    } else {
        console.log(`⚠️ File already exists: ${filePath}`);
    }
});
