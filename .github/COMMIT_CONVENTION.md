# Git Commit Message Convention

To maintain a clean, readable, and structured Git history, this project adopts the **Conventional Commits 1.0.0** specification.

---

## 1. Commit Message Structure

Every commit message must follow this format:

```text
<type>(<scope>): <description>

[body]

[footer]
```

- **Type (`<type>`)**: **Required.** Indicates the category of the change (see below).
- **Scope (`<scope>`)**: *Optional.* Indicates the specific module, feature, or area of change (e.g., `stopwatch`, `lap-list`, `ci`).
- **Description (`<description>`)**: **Required.** A short, concise summary of the changes.
  - Written in lowercase.
  - Written in the imperative, present tense ("add" instead of "added" or "adds").
  - Maximum 50 characters.
  - Do NOT end with a period.
- **Body (`[body]`)**: *Optional.* Detailed explanation of the change. Use bullet points if necessary. Max 72 characters per line.
- **Footer (`[footer]`)**: *Optional.* References to issue tracking, pull requests, or breaking changes (e.g., `Closes #12` or `BREAKING CHANGE: ...`).

---

## 2. Commit Types

Choose the type that best fits the changes you are introducing:

| Type | Description | Example |
| :--- | :--- | :--- |
| **`feat`** | A new feature or component | `feat(stopwatch): add lap triggering` |
| **`fix`** | A bug fix | `fix(stopwatch): correct millisecond drift` |
| **`docs`** | Documentation changes only | `docs: update README with installation steps` |
| **`style`** | Changes that do not affect code logic (formatting, whitespace, missing semi-colons) | `style: re-align CSS properties` |
| **`refactor`** | A code change that neither fixes a bug nor adds a feature | `refactor(lap-list): simplify HTML rendering` |
| **`perf`** | Code changes that improve runtime performance | `perf: throttle state update frequency` |
| **`test`** | Adding missing tests or correcting existing tests | `test: add unit tests for reset function` |
| **`build`** | Changes affecting build configuration, compiler, or packages | `build: upgrade typescript package` |
| **`ci`** | Changes to CI/CD workflows and scripts | `ci: optimize node_modules caching` |
| **`chore`** | Routine tasks, configs, or maintenance tasks (e.g., `.gitignore`) | `chore: update gitignore exclusions` |

---

## 3. Best Practices

1. **Be Concise but Informative:** The subject line should explain *what* the commit does, while the body can explain *why* and *how*.
2. **One Purpose per Commit:** Avoid grouping unrelated changes (e.g., refactoring code and fixing a bug) in a single commit. Split them into separate commits.
3. **Reference Issues:** If the commit resolves an issue, link it in the footer using the `Closes #<id>` keyword.
