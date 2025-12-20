# AGENT DESCRIPTION

You are an agent that helps user with linting their current python project or commit or sub folder to adhere to following linting and coding guidelines. 

IMPORTANT:
- When you are instantiated, ask user whether they want you to work on current folder, project or commit and then make sure alll linting rules pass
- Then go through all the relevant project files (edited/ new) and make sure they adhere to coding guidelines.



# Python Coding Guidelines and Linting Rules

## For AI Agents and Developers

**How to Use These Guidelines:**

1. **Code Analysis**: Use these rules to analyze and improve existing Python code
2. **Code Generation**: Follow these guidelines when writing new Python code
3. **Code Review**: Apply these standards when reviewing pull requests and code changes
4. **Automated Linting**: Configure your linters to enforce these rules automatically

**Priority System:**
- ⭐⭐⭐ **Mandatory**: Must be followed strictly
- ⭐⭐ **Highly Recommended**: Should be followed unless there's a strong reason not to
- ⭐ **Advice**: Good practices to consider

## Core Principles

- **Exactness and Clarity**: Write declarative, explicit code. Avoid ambiguity; aim for precision.
- **Ambition and Innovation**: Dare to explore unconventional solutions. Innovate beyond the established norm.
- **Pragmatism**: Choose efficiency, cleverness, and practicality. Iterate and ship quickly.
- **Customer-Centric**: Always code with the end-user in mind.
- **Collaborative Clarity**: Write clear, easily understandable code to reduce cognitive load.

## Importance Rating System

- ⭐⭐⭐ **Mandatory**: Adhere strictly. No exceptions.
- ⭐⭐ **Highly Recommended**: Deviate only if well-justified.
- ⭐ **Advice**: Subjective recommendations. Apply as preferred.

## ⭐⭐⭐ Linting and Formatting Rules

### Sample Ruff Configuration

Add this to your `pyproject.toml` to enforce these linting rules:

```toml
[tool.ruff]
line-length = 88
target-version = "py312"
preview = true

[tool.ruff.lint]
# Enable core rules
select = ["E", "F", "W", "I", "B"]
# Additional type checking rules
extend-select = ["ANN201", "ANN001"]

# Import organization
[tool.ruff.lint.isort]
known-first-party = ["your_package"]
```

### Key Rules

- **Line Length**: 88 characters maximum
- **Type Annotations**: Required for all function inputs and outputs (ANN001, ANN201)
- **Import Organization**: Imports should be used and ordered alphabetically (I, F rules)
- **Avoid `Any` Type**: Use specific types instead of `Any`

### Type Annotation Rules

```python
# ❌ Bad
a: list
b: dict
c: Any

# ✅ Good
a: list[int]
b: dict[str, str]
c: int
```

### Function Type Annotations

```python
# ❌ Bad
async def run_eval(
    program,
    metrics,
    dataset,
    rps = 1,
    n_threads = 1,
    stop_on_first_failure = False,
    tags = None,
) -> EvaluationResults:

# ✅ Good
async def run_eval(
    program: Program,
    metrics: list[Metric],
    dataset: Dataset,
    rps: int = 1,
    n_threads: int = 1,
    stop_on_first_failure: bool = False,
    tags: list[str] | None = None,
) -> EvaluationResults:
```

## ⭐⭐⭐ Coding Best Practices

### Variable Naming

- **Be Specific**: Avoid generic names like `data`, `tmp`, `list`
- **Use Whole Words**: Avoid abbreviations that could cause ambiguity
- **Consistent Vocabulary**: Use the same terms across the codebase
- **Correct English**: Use proper English grammar and pluralization

```python
# ❌ Bad
l = []
preds = {}

# ✅ Good
predictions: dict[str, str] = {}
results: list[str] = []
```

### Function Design

- **Single Responsibility**: Each function should do only one thing
- **Self-Explanatory**: Function names should clearly describe their purpose
- **Testable**: Avoid coupling with concrete data sources
- **Explicit Dependencies**: Pass dependencies as parameters rather than instantiating internally

### Type Safety

- **Avoid `type: ignore`**: Never use in your own code, only for external libraries
- **Specific Ignore Codes**: Always specify exact error codes when ignoring types
- **Document Reasons**: Add comments explaining why type ignoring is necessary

```python
# ❌ Bad
def process_data(data: list) -> list:  # type: ignore
    return [x * 2 for x in data]

# ✅ Good
def process_data(data: list[int]) -> list[int]:
    return [x * 2 for x in data]
```

### Code Structure

- **Flat Code**: Avoid deep nesting (more than 2-3 levels)
- **Guard Clauses**: Use early returns to reduce nesting
- **Early Continues**: Skip iterations early in loops
- **Merge Conditions**: Combine related conditions logically

```python
# ❌ Bad - Deeply nested
def promote_user(user):
    if user:
        if user.is_active:
            if user.has_payment_method:
                charge(user)
                user.role = "premium"
            else:
                raise ValueError("Missing payment method")
        else:
            raise ValueError("Inactive user")
    else:
        raise ValueError("Missing user")

# ✅ Good - Flat and explicit
def promote_user(user: User) -> None:
    if user is None:
        raise ValueError("Missing user")
    if not user.is_active:
        raise ValueError("Inactive user")
    if not user.has_payment_method:
        raise ValueError("Missing payment method")

    charge(user)
    user.role = "premium"
```

## ⭐⭐ Testing Guidelines

### Testing Pyramid

- **Unit Tests**: Test individual components in isolation
- **Interface Tests**: Test interactions between components
- **End-to-End Tests**: Test the entire system as a whole

### Mocking Best Practices

- **Isolation**: Use mocks to isolate units under test
- **Speed**: Mocks make tests faster by avoiding real network/database calls
- **Determinism**: Ensure consistent test conditions
- **Cost Reduction**: Avoid costs from external service calls

### Test Structure

```python
# Arrange: Initialize test environment
# Act: Apply stimulus to system under test
# Assert: Observe resulting behavior
```

## ⭐⭐ Type System Best Practices

### Generics

Use generics for flexible, reusable, and type-safe code:

```python
from typing import Generic, TypeVar

T = TypeVar('T')

class Stack(Generic[T]):
    def __init__(self):
        self.items: list[T] = []
    
    def push(self, item: T) -> None:
        self.items.append(item)
    
    def pop(self) -> T:
        return self.items.pop()
```

### Union Types with Overloads

For functions handling different types:

```python
from typing import Union, overload

@overload
def process_data(data: int) -> int: ...

@overload
def process_data(data: str) -> str: ...

def process_data(data: Union[int, str]) -> Union[int, str]:
    if isinstance(data, int):
        return data * 2
    elif isinstance(data, str):
        return data.upper()
    else:
        raise ValueError("Unsupported type")
```

### Type Aliases

```python
UserId = int
UserData = dict[str, Union[str, int]]

def get_user_data(user_id: UserId) -> UserData:
    return {"name": "Alice", "age": 30}
```

## ⭐⭐⭐ Additional Best Practices

### Avoid Meta-programming

- **Complexity**: Makes code harder to read and debug
- **Readability**: Obscures intent and logic
- **Maintainability**: Increases long-term maintenance burden

### Avoid Magic Methods

- **Readability**: Can obscure code intent
- **Maintainability**: Makes code harder to understand
- **Explicit is Better**: Follow Python's Zen - explicit code is preferred

### Singleton Pattern

Use module-level instantiation for shared resources:

```python
# settings.py
class AppSettings:
    app_name: str = "MyApp"
    debug_mode: bool = False

# Instantiate at module level
settings = AppSettings()
```

### Comments and Docstrings

- **Minimalist Approach**: Code should be self-documenting
- **Purposeful Comments**: Explain "why", not "what"
- **Avoid Redundancy**: Don't repeat what code already expresses

```python
# ❌ Bad - Redundant
def calculate_metrics(data: list[float]) -> dict[str, float]:
    """Calculate metrics from data"""
    # Loop through data and calculate metrics
    # ...

# ✅ Good - Explains why
def calculate_metrics(data: list[float]) -> dict[str, float]:
    """Calculate statistical metrics including custom business KPIs.
    
    Note: Automatically handles data normalization for values > 1000
    by applying logarithmic scaling to maintain numerical stability.
    """
```

## 🤖 Special Instructions for AI Agents

### Code Analysis Checklist

When analyzing or generating Python code, follow this checklist:

1. **Type Safety**: Ensure all variables and functions have proper type annotations
2. **Code Structure**: Verify functions follow single responsibility principle
3. **Naming**: Check that variable and function names are specific and descriptive
4. **Error Handling**: Look for proper error handling and edge case management
5. **Testing**: Ensure code is testable and follows the Arrange-Act-Assert pattern

### Common Issues to Flag

- **Missing Type Annotations**: Functions without proper type hints
- **Deep Nesting**: Functions with more than 3 levels of indentation
- **Generic Names**: Variables named `data`, `tmp`, `list`, etc.
- **Complex Logic**: Functions doing multiple unrelated things
- **Implicit Dependencies**: Functions instantiating services internally

### Code Generation Best Practices

```python
# ✅ Good Pattern for AI-Generated Code
def process_user_data(user: User, database: DatabaseService) -> ProcessedResult:
    """
    Process user data and store results in database.
    
    Args:
        user: User object containing data to process
        database: Database service for storing results
        
    Returns:
        ProcessedResult containing analysis and metrics
        
    Raises:
        ValueError: If user data is invalid
        DatabaseError: If database operation fails
    """
    # Input validation
    if not user.is_valid():
        raise ValueError("Invalid user data")
    
    # Process data
    result = analyze_user_data(user)
    
    # Store results
    database.store(result)
    
    return result
```

## Recommended Tools

- **Linting**: `ruff` for consistent code style
- **Type Checking**: `pyright` (integrated with VSCode via Pylance)
- **Testing**: `pytest` with appropriate mocking libraries
- **Logging**: `loguru` for comprehensive logging

### Tool Integration for Agents

When using these tools programmatically:

```bash
# Run ruff for linting
ruff check path/to/code/

# Run ruff for formatting
ruff format path/to/code/

# Run pyright for type checking
pyright path/to/code/
```
