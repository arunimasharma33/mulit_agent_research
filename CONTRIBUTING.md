# Contributing to Multi-Agent Research System

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome diverse perspectives
- Give credit where it's due
- Report issues responsibly

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/project_multiagent.git
cd project_multiagent

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/project_multiagent.git
```

### 2. Create a Feature Branch

```bash
# Update from upstream
git fetch upstream
git checkout upstream/main
git checkout -b feature/your-feature-name
```

### 3. Set Up Development Environment

```bash
# Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows

# Install dependencies
pip install -r req.txt
cd frontend && npm install && cd ..

# Create .env file
cp .env.example .env
# Add your API keys to .env
```

## Development Process

### Before You Start

- Check existing [issues](../../issues) and [pull requests](../../pulls)
- Discuss major changes in an issue first
- Review [ARCHITECTURE.md](./docs/ARCHITECTURE.md) to understand the codebase

### Making Changes

1. **Write Code**
   - Follow project conventions (see [DEVELOPMENT.md](./docs/DEVELOPMENT.md))
   - Keep functions small and focused
   - Add comments for complex logic
   - Use meaningful variable names

2. **Test Your Changes**
   - Test locally in development environment
   - Test with multiple scenarios
   - Check for console errors/warnings
   - Verify API endpoints work correctly

3. **Update Documentation**
   - Add docstrings to functions/classes
   - Update README if adding features
   - Update API docs if changing endpoints
   - Add examples if introducing new patterns

### Commit Guidelines

**Commit Message Format**:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without feature/fix
- `perf`: Performance improvements
- `test`: Test additions/changes
- `chore`: Build, dependencies, tooling

**Examples**:
```
feat(auth): add email verification
fix(pipeline): handle missing search results
docs(api): add endpoint examples
refactor(frontend): extract component logic
```

**Body Guidelines**:
- Explain WHY the change, not WHAT (what is in code)
- Reference related issues: `Fixes #123`, `Related to #456`
- Keep lines under 72 characters

### Pull Request Process

1. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Fill out PR template completely
   - Reference related issues
   - Add description of changes
   - Include before/after if UI changes

3. **PR Checklist**
   - [ ] Code follows project conventions
   - [ ] All tests pass (if applicable)
   - [ ] Documentation is updated
   - [ ] No console errors/warnings
   - [ ] No sensitive data committed
   - [ ] Commits are well-organized
   - [ ] Branch is up-to-date with `main`

4. **Respond to Reviews**
   - Address all feedback
   - Explain decisions if needed
   - Ask questions if unclear
   - Re-request review when ready

5. **Merge**
   - Ensure all checks pass
   - Squash or keep commits organized
   - Delete branch after merge

## Contribution Types

### 🐛 Bug Reports

**File a bug report** if you find something not working:
1. Check if bug is already reported
2. Create issue with title: `[BUG] Brief description`
3. Include:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment (OS, Python version, etc.)
   - Screenshots if applicable

### ✨ Feature Requests

**Suggest features** to improve the project:
1. Check if feature is already requested
2. Create issue with title: `[FEATURE] Brief description`
3. Describe:
   - Use case and motivation
   - Proposed solution
   - Alternatives considered
   - Potential drawbacks

### 📚 Documentation

**Improve documentation**:
- Fix typos and clarity
- Add examples
- Clarify complex sections
- Improve formatting
- No need to open issue for doc updates

### 🎨 Code Quality

**Improve code without changing functionality**:
- Refactoring for clarity
- Performance improvements
- Test coverage
- Type hints
- Error handling

## Project Structure Reference

```
project_multiagent/
├── README.md                 # Main documentation
├── docs/
│   ├── ARCHITECTURE.md      # System architecture
│   ├── DEVELOPMENT.md       # Development guide
│   ├── API.md               # API reference
│   └── images/              # Screenshots (add here)
├── backend/                 # FastAPI application
│   ├── main.py
│   ├── auth.py
│   ├── models.py
│   ├── schemas.py
│   └── database.py
├── frontend/                # React application
│   └── src/
│       ├── components/
│       ├── api/
│       └── context/
├── agents.py                # Agent definitions
├── pipeline.py              # Pipeline orchestration
└── tools.py                 # Specialized tools
```

## Common Contribution Scenarios

### Adding a New Feature to Backend

1. Create endpoint in `backend/main.py`
2. Add schema in `backend/schemas.py`
3. Update models if needed in `backend/models.py`
4. Add to [API.md](./docs/API.md) documentation
5. Test with Swagger UI
6. Commit with `feat(backend): your feature`

### Adding a Component to Frontend

1. Create component in `frontend/src/components/`
2. Create API functions in `frontend/src/api/` if needed
3. Add to parent component
4. Test in development
5. Ensure TypeScript types are correct
6. Commit with `feat(frontend): your component`

### Improving Agent Pipeline

1. Update `agents.py` with new agent definition
2. Integrate in `pipeline.py`
3. Update progress events
4. Test with sample topics
5. Update [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
6. Commit with `feat(agents): your improvement`

### Fixing a Bug

1. Reproduce the bug
2. Identify root cause
3. Implement fix (minimal, focused)
4. Add test if applicable
5. Verify fix works
6. Commit with `fix(scope): brief description`

## Testing

### Manual Testing Checklist

- [ ] Feature works in development
- [ ] No console errors/warnings
- [ ] Works on different browsers (for frontend)
- [ ] API returns correct data
- [ ] Error cases handled properly
- [ ] Database changes persist
- [ ] Authentication still works
- [ ] No performance degradation

### Testing Tools

**Backend**:
```bash
# Run tests (if configured)
pytest tests/

# Manual API testing
# Visit http://localhost:8765/docs
```

**Frontend**:
```bash
# Check for TypeScript errors
npm run type-check  # if configured

# Manual testing
npm run dev
# Test in browser
```

## Code Review Tips

### As an Author

- Keep PRs focused and reasonably sized
- Provide context and rationale
- Respond professionally to feedback
- Ask for clarification if needed
- Thank reviewers

### As a Reviewer

- Review code, not person
- Ask questions instead of criticizing
- Suggest improvements
- Acknowledge good work
- Approve when satisfied

## Reporting Security Issues

**Do not** open public issues for security vulnerabilities.

Instead:
1. Email security team with details
2. Include steps to reproduce
3. Allow time for patch before disclosure
4. Reference CVE if applicable

## FAQ

**Q: How long until my PR is reviewed?**
A: Reviews typically happen within 2-5 business days. Comment if it's urgent.

**Q: Can I work on something not in the issues?**
A: Open an issue first to discuss. We want to avoid duplicate efforts.

**Q: What if my code is rejected?**
A: Don't take it personally! We want the best code. Learn from feedback and try again.

**Q: Do I need to sign a CLA?**
A: Not currently, but may be required for large contributions.

**Q: How do I become a maintainer?**
A: Show consistent, high-quality contributions over time. We'll reach out!

## Resources

- [DEVELOPMENT.md](./docs/DEVELOPMENT.md) - Development setup and workflow
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - System architecture
- [API.md](./docs/API.md) - API documentation
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [LangChain Docs](https://python.langchain.com/)

## Need Help?

- Check [DEVELOPMENT.md](./docs/DEVELOPMENT.md) for setup help
- Review similar existing code
- Ask in issue comments
- Check documentation
- Reach out to maintainers

---

Thank you for contributing! 🎉

**Happy coding!** 🚀
