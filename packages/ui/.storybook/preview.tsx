import type { Preview } from '@storybook/react'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
    decorators: [
        // 👇 Defining the decorator in the preview file applies it to all stories
        (Story, { parameters }) => {
            return (
                <>
                    <div className="root">
                        <Story {...parameters} />
                    </div>
                    <style>{`
                        .root {
                            isolation: isolate;
                        }
                        `}
                    </style>
                </>
            );
        },
    ],
};

export default preview;
