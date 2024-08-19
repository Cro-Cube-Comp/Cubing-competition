# Scripts

This is folder containing scripts ( `.js`) which contain files which are used in all pages

## Markdown.js

Exports: `markdownToHtml` and `escapeHtmlCharacters`

How to import: 

```js
import { markdownToHtml, escapeHtmlCharacters } from "relative path to markdown.js" 
```

### Markdown to html

Syntax: `markdownToHtml(markdown)`

First parameter is a `string`

It returns markdown converted to html. It also escapes html charscters for xss protection.

### Escape html characters

Syntax: `escapeHtmlCharacters(content)`

First parameter is a `string`

It returns text where some html characters such as `<` and `>` are escaped which means that it protects against xss attacks. 

## Credentials.js

Exports: `getUsername`, `getRole`, `getId`, `getToken`, `logOut`, `tokenValid`, `loggedIn`, `isUser`, `isAdmin` and `addToken`,

### Get username

Syntax: `getUsername(action)`

Param `action`: boolean, default is false

If `action` is `true` and username is not defined, alert user to login and redirect to `../Login` after alert is confirmed

Returns: `null` if `action` is `true` OR `username` of the user if `action` is `false`

### Get Id

Syntax: `getId()`

If `action` is `true` and id is not defined, alert user to login and redirect to `../Login` after alert is confirmed

Returns: `null` if `action` is `true` OR `id` of the user if `action` is `false`

## Solvetime.js

Todo

## Text.js

Todo