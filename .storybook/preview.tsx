import type { Decorator, Preview } from "@storybook/react-vite";
import { TooltipProvider } from "../packages/withy-ui/src/components/molecules/tooltip";
import { ToastProvider } from "../packages/withy-ui/src/components/molecules/toast";
import { ThemeProvider } from "../packages/withy-ui/src/components/theme/theme-provider";
import "./withy-ui.css";

const withWithyUi: Decorator = (Story, context) => {
  const theme = (context.globals.theme as string | undefined) ?? "light";
  document.documentElement.dataset.theme = theme;

  return (
    <ThemeProvider>
      <TooltipProvider>
        <ToastProvider>
          <div className="bg-background font-sans text-text">
            <Story />
          </div>
        </ToastProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
};

const preview: Preview = {
  decorators: [withWithyUi],
  initialGlobals: {
    theme: "light",
  },
  globalTypes: {
    theme: {
      description: "Withy UI skin",
      toolbar: {
        title: "Skin",
        icon: "paintbrush",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: "padded",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
