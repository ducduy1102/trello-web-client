import { useState } from "react";
import { useColorScheme } from "@mui/material/styles";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import EditNoteIcon from "@mui/icons-material/EditNote";

const markdownValueExample = `
  *\`Markdown Content Example:\`*

  **Hello world | DucDuyDev - Welcome To Trello App Fake**
  [![](https://avatars.githubusercontent.com/u/14128099?v=4&s=80)](https://avatars.githubusercontent.com/u/14128099?v=4)
  \`\`\`javascript
  import React from "react"
  import ReactDOM from "react-dom"
  import MDEditor from '@uiw/react-md-editor'
  \`\`\`
`;
/**
 * Example:
 * https://codesandbox.io/embed/markdown-editor-for-react-izdd6?fontsize=14&hidenavigation=1&theme=dark
 */
function CardDescriptionMdEditor() {
  // Get the 'dark', 'light' or 'system' mode value from MUI to support the Markdown below: data-color-mode={mode}
  // https://www.npmjs.com/package/@uiw/react-md-editor#support-dark-modenight-mode
  const { mode } = useColorScheme();

  // State handles Edit mode and View mode
  const [markdownEditMode, setMarkdownEditMode] = useState(false);
  // State handles markdown values ​​when editing
  const [cardDescription, setCardDescription] = useState(markdownValueExample);

  const updateCardDescription = () => {
    setMarkdownEditMode(false);
    console.log("cardDescription: ", cardDescription);
  };

  return (
    <Box sx={{ mt: -4 }}>
      {markdownEditMode ? (
        <Box sx={{ mt: 5, display: "flex", flexDirection: "column", gap: 1 }}>
          <Box data-color-mode={mode}>
            <MDEditor
              value={cardDescription}
              onChange={setCardDescription}
              // Prevent XSS
              previewOptions={{ rehypePlugins: [[rehypeSanitize]] }} // https://www.npmjs.com/package/@uiw/react-md-editor#security
              height={400}
              preview='edit' // There are 3 values ​​to set depending on your needs ['edit', 'live', 'preview']
              // hideToolbar={true}
            />
          </Box>
          <Button
            sx={{ alignSelf: "flex-end" }}
            onClick={updateCardDescription}
            className='interceptor-loading'
            type='button'
            variant='contained'
            size='small'
            color='info'
          >
            Save
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            sx={{ alignSelf: "flex-end" }}
            onClick={() => setMarkdownEditMode(true)}
            type='button'
            variant='contained'
            color='info'
            size='small'
            startIcon={<EditNoteIcon />}
          >
            Edit
          </Button>
          <Box data-color-mode={mode}>
            <MDEditor.Markdown
              source={cardDescription}
              style={{
                whiteSpace: "pre-wrap",
                padding: cardDescription ? "10px" : "0px",
                border: cardDescription
                  ? "0.5px solid rgba(0, 0, 0, 0.2)"
                  : "none",
                borderRadius: "8px",
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default CardDescriptionMdEditor;
