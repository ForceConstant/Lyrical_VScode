# Lyrical

This VS Code extension provides powerful linguistic tools to enhance your writing and creative processes, offering real-time syllable counting and a comprehensive rhyming dictionary.

## Features

### Syllable Counter

The Syllable Counter feature helps you analyze the rhythmic structure of your text by displaying the syllable count for each line.

*   **Real-time Syllable Count:** Shows the syllable count directly on each line of an open file.
*   **Line Decorations:** Syllable counts are displayed as subtle decorations on the lines, integrating seamlessly with your editing experience.
*   **English Language Support:** Utilizes a robust English language syllable counter library for accurate results.
*   **Dynamic Updates:** Syllable counts automatically update as you modify lines, ensuring you always have the most current information.
*   **Comment Exclusion:** Lines starting with '#' are ignored, allowing you to focus on your content without interference from comments or metadata.

### Rhymes Finder

The Rhymes Finder feature assists poets, lyricists, and writers in finding perfect rhymes quickly and efficiently.

*   **On-Demand Rhyme Suggestions:** Highlight any word in your editor, activate the "Lyrical: Show Rhymes" command, and get instant rhyming suggestions.
*   **Categorized Results:** Rhyming words are presented in a new window, categorized by syllable count (1, 2, and 3 syllables) for easy browsing.
*   **Comprehensive Rhyme Dictionary:** Leverages a standard library for finding a wide range of rhyming words.

## Requirements

This extension has no specific runtime requirements beyond a standard VS Code installation.

## Extension Settings

This extension does not contribute any VS Code settings.

## Known Issues

No known issues at this time. If you encounter any problems, please report them on the [GitHub repository](https://github.com/ForceConstant/Lyrical_VScode).

## Release Notes

### 0.0.1

Initial release of Lyrical, introducing:
*   Real-time syllable counting with line decorations.
*   On-demand rhyme finding for selected words.

## Packaging the Extension

To package this VS Code extension into a `.vsix` file for distribution, run the following command in your terminal:

```bash
npm run package
```

This command utilizes `vsce` (Visual Studio Code Extension Manager) to create the `.vsix` file.

## Libraries Used

This extension utilizes the following third-party libraries for its core functionalities:

*   **`syllable`**: A JavaScript library for counting syllables in English words.
*   **`rhymes`**: A JavaScript library for finding rhyming words.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

*   [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

*   Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
*   Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
*   Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

*   [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
*   [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
