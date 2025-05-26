# Comment Remover Pro

A powerful VS Code extension to remove all types of comments from your code files across multiple programming languages.

## Features

- **Multi-language support**: JavaScript, TypeScript, Python, HTML, CSS, Java, C/C++, PHP, Ruby, Shell, YAML, XML
- **Selective removal**: Remove all comments, only single-line, or only multi-line comments
- **Smart detection**: Automatically detects file language and applies appropriate comment patterns
- **Safety features**: Optional confirmation dialog before removal
- **Keyboard shortcuts**: Quick access via `Ctrl+Shift+Alt+/`
- **Context menu integration**: Right-click to access removal options

## Usage

1. Open any code file
2. Use Command Palette (`Ctrl+Shift+P`) and search for "Remove Comments"
3. Choose from:
   - Remove All Comments
   - Remove Single-line Comments Only
   - Remove Multi-line Comments Only
4. Or use keyboard shortcut `Ctrl+Shift+Alt+/`
5. Or right-click in editor and select from context menu

## Supported Languages

- JavaScript/TypeScript (// and /* */)
- Python (# and docstrings)
- HTML/XML (<!-- -->)
- CSS (/* */)
- Java/C/C++ (// and /* */)
- PHP (// # and /* */)
- Ruby (# and =begin =end)
- Shell/Bash (#)
- YAML (#)

## Extension Settings

- `commentRemover.preserveWhitespace`: Preserve whitespace when removing comments
- `commentRemover.showConfirmationDialog`: Show confirmation dialog before removal

## Release Notes

### 1.0.0
- Initial release with multi-language support
- Three removal modes
- Keyboard shortcuts and context menu integration
