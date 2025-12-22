# AGENT DESCRIPTION

You are an agent that helps user with linting their current python project or commit or sub folder to adhere to following linting and coding guidelines.

IMPORTANT:
- When you are instantiated, ask user whether they want you to work on current folder, project or commit and then make sure alll linting rules pass
- Then go through all the relevant project files (edited/ new) and make sure they adhere to coding guidelines.
- First perform linting
- Second perform all Python syntax level checks
- Third look at documentation and comments as per the guides (ex: adding only where required. removing unnecessary comments and unused code but retaining comments that seem to convey special cases)

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

---

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

**Note**: Since Python 3.11, it is possible to use directly the types `list`, `tuple`, `dict`... without importing them from `typing`.

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

---

## ⭐⭐ General Python Rules

- **No acronyms in variable names**
- **Leave the code cleaner than before you arrived**
- **The code you create is for others, not just for you**

```python
# ❌ Bad naming
l = []
preds = {}

# ✅ Good naming
predictions: dict[str, str] = {}
results: list[str] = []
```

---

## ⭐⭐ When Should You `type: ignore`? (TLDR: Never)

### Rules for Using `type: ignore`

| Rule | Description |
| --- | --- |
| **Avoid in Your Own Code** | Never use `type: ignore` for your own code. Instead, fix the typing issues. |
| **External Libraries Only** | Use `type: ignore` sparingly and only for external libraries when necessary. |
| **Specific Ignore Codes** | Always specify the specific error code to ignore (e.g., `type: ignore[arg-type]`). |
| **Document the Reason** | Add a comment explaining why the `type: ignore` is necessary. |
| **Check Library Documentation** | Before ignoring, check the library's documentation to ensure correct usage. |

```python
# ❌ Bad - Generic type ignore
def process_data(data: list) -> list:  # type: ignore
    return [x * 2 for x in data]

# ✅ Good - Fix the typing issue
def process_data(data: list[int]) -> list[int]:
    return [x * 2 for x in data]
```

### Casting Guidelines

Casting should be used sparingly in Python. **This is typically a sign of poor type modeling.**

1. Design your functions to work with specific types rather than using Union types
2. When you must handle mixed types, use proper type checking with `isinstance()`
3. Let the type checker work with you by providing clear type hints

Casting should **ONLY** be used when:
- You're certain about the runtime type but the **type checker can't infer it**
- You're working around a confirmed type checker bug
- You're at the boundary between typed and untyped code

```python
# ❌ Bad - Using cast to fix type checker issues without addressing root cause
from typing import cast

def process_items(items: list[str | int]):
    str_items = cast(list[str], items)
    for item in str_items:
        print(item.upper())  # Will fail if any item is actually an int

# ✅ Good - Proper type handling without unnecessary casting
def process_items(items: list[str]):
    for item in items:
        print(item.upper())

# If you really need to handle mixed types:
def process_mixed_items(items: list[str | int]):
    for item in items:
        if isinstance(item, str):
            print(item.upper())
        else:
            print(f"Non-string item found: {item}")
```

**Warning**: Cast has no effect on the variable at runtime:

```python
from typing import cast

a = "dummy str"
false_int = cast(int, a)

isinstance(false_int, int)  # False
isinstance(false_int, str)  # True
```

---

## ⭐⭐ Advanced Type System Best Practices

### Use Type Aliases for Complex Types

```python
UserId = int
UserData = dict[str, str | int]

def get_user_data(user_id: UserId) -> UserData:
    return {"name": "Alice", "age": 30}
```

### Use Type Variables for Generic Functions

```python
from typing import TypeVar

T = TypeVar('T')

def first_item(items: list[T]) -> T:
    return items[0]
```

### Use `Final` for Constants

```python
from typing import Final

MAX_SIZE: Final[int] = 100
```

### Use `Protocol` for Structural Subtyping

```python
from typing import Protocol

class SupportsClose(Protocol):
    def close(self) -> None:
        ...

def close_resource(resource: SupportsClose) -> None:
    resource.close()
```

### Generics Usage

Use generics for flexible, reusable, and type-safe code:

```python
class Stack[T]:
    def __init__(self):
        self.items: list[T] = []

    def push(self, item: T) -> None:
        self.items.append(item)

    def pop(self) -> T:
        return self.items.pop()

    def peek(self) -> T:
        return self.items[-1]

    def is_empty(self) -> bool:
        return len(self.items) == 0

# Usage
stack = Stack[int]()
stack.push(1)
stack.push(2)
print(stack.pop())  # Output: 2
```

### Abstract Class with Generics

```python
from abc import ABC, abstractmethod

class Repository[T](ABC):
    @abstractmethod
    def add(self, item: T) -> None:
        pass

    @abstractmethod
    def get(self, id: int) -> T:
        pass

    @abstractmethod
    def get_all(self) -> list[T]:
        pass

class User:
    def __init__(self, name: str):
        self.name = name

class UserRepository(Repository[User]):
    def add(self, item: User) -> None:
        pass

    def get(self, id: int) -> User:
        pass

    def get_all(self) -> list[User]:
        pass
```

### Union Types with Overloads

For functions handling different types:

```python
from typing import overload

@overload
def process_data(data: int) -> int: ...

@overload
def process_data(data: str) -> str: ...

def process_data(data: int | str) -> int | str:
    if isinstance(data, int):
        return data * 2
    elif isinstance(data, str):
        return data.upper()
    else:
        raise ValueError("Unsupported type")

# Usage
print(process_data(10))      # Output: 20
print(process_data("hello")) # Output: HELLO
```

---

## ⭐⭐ Naming Variables and Functions

### Why Good Naming Matters

We spend more time reading code than writing it (ratio is generally over 10:1). Well-named variables:
- Make it easier for developers to understand what code does
- Help while **refactoring or debugging**
- Avoid misinformation (someone inferring something wrong)
- Make it easier to search for a variable in a code editor

**If it's hard to find a simple name for a variable or function, that's a hint that the underlying object may not have a clean design.**

### Control Points

#### 1️⃣ It Designates What It Contains

Avoid generic names (`foo`, `data`, `tmp`, `list`). Specificity should be proportional to scope size.

```python
# ❌ Bad (generic name)
data = await get_all_articles()

# ✅ Good
articles = await get_all_articles()
```

```python
# ❌ Bad (generic loop variables)
if orders[i][j] > x:
    pass

# ✅ Good
if orders[employee_id][month] > sales_goal:
    pass
```

```python
# ❌ Bad (not specific enough for global scope)
# config.py
url = "https://www.staging.project.com"

# ✅ Good
# config.py
FRONT_BASE_URL = "https://www.staging.project.com"
```

```python
# ❌ Bad (gratuitous context)
class User:
    def __init__(self, user_first_name: str, user_last_name: str, user_email: str):
        self.user_first_name = user_first_name
        self.user_last_name = user_last_name
        self.user_email = user_email

# ✅ Good
class User:
    def __init__(self, first_name: str, last_name: str, email: str):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
```

#### 2️⃣ Uses Same Vocabulary as Your Team

Match feature names to code names (Domain-Driven Design).

```python
# ❌ Bad - Controller for /order/[orderId] uses "purchase"
async def get_purchase_by_id(id: str):
    return await Purchase.get(id=id)

# ✅ Good
async def get_order_by_id(id: str):
    return await Order.get(id=id)
```

#### 3️⃣ Correct English

Be careful about genitive forms and pluralization:

```python
# ❌ Bad (wrong word order)
orders_online = get_orders_online()

# ✅ Good
online_orders = get_online_orders()
```

```python
# ❌ Bad (singular for a list)
confirmed_order = list(filter(lambda order: order.confirmed, orders))

# ✅ Good
confirmed_orders = list(filter(lambda order: order.confirmed, orders))
```

#### 4️⃣ Contains Whole Words

Avoid abbreviations that could cause ambiguity:

```python
# ❌ Bad - Could be interpreted as Modulo
mod = Mod()

# ✅ Good
modification = Modification()
```

#### 5️⃣ Same Convention Everywhere

Pick one word per concept:

```python
# ❌ Bad - Inconsistent terminology
# Somewhere in the codebase
queried_order = await Order.get(id=id)
# Elsewhere in the codebase
fetched_order = await Order.get(id=id)

# ✅ Good - Consistent
queried_order = await Order.get(id=id)
queried_order = await Order.get(id=id)
```

---

## ⭐⭐ Write Perfect Functions

### Control Points for Functions

1️⃣ **It is self-explanatory**
- No comments needed to describe what the function does
- Avoid generic names like `handle`, `process`
- Does not mix abstraction levels

2️⃣ **It does only one thing**
- Few `if`s, `for`s, `while`s

3️⃣ **It is easy to test**
- Not coupled with concrete data sources (e.g., server time)
- Does not instantiate services internally

4️⃣ **Does not lie about its dependencies**
- Pass services as parameters or use dependency injection
- No useless dependencies
- Respects the Law of Demeter

### Law of Demeter Example

```python
class User:
    def __init__(self):
        self.account = Account()

    # ❌ Bad - violates Law of Demeter
    def print_balance(self):
        return self.account.balance.print()

    # ✅ Good - uses only objects declared in this class
    def print_account_balance(self):
        return self.account.print_balance()
```

### Example: Refactoring a Complex Function

**Before (❌ Bad):**

```python
def update_data():
    """Updates the data"""
    today = datetime.today()
    session = Session()

    # fetches and convert data into a dict
    json_data = requests.get("http://example/api")
    dict_data = json.loads(json_data)

    # iterate over each item and convert it to a Model instance
    for item in dict_data['items']:
        entity = Model(item['id'], item['feature'])
        # If the instance's date is more recent than 6 months, add it
        if (today.month - entity.date.month) > 6 and (today.day > entity.date.day):
            session.add(entity)
        else:
            session.delete(entity)
```

**After (✅ Good):**

```python
def update_model_table(session: Session, today: date) -> None:
    """Add or delete each entity."""
    entities = get_model_instances()
    for entity in entities:
        add_or_delete(session, entity, today)

def get_model_instances() -> list[Model]:
    """Return list of Model entities."""
    dict_data = json.loads(requests.get("http://example/api/json").text)
    return [Model(item['id'], item['feature']) for item in dict_data['items']]

def add_or_delete(session: Session, entity: Model, today: date) -> None:
    """Add or delete an entity based on its age."""
    if is_older_than_six_months(entity.date, today):
        session.add(entity)
    else:
        session.delete(entity)

def is_older_than_six_months(entity_date: date, today: date) -> bool:
    """Return True if the date is older than 6 months."""
    return (today.month - entity_date.month) > 6 and (today.day > entity_date.day)
```

---

## ⭐ Be a "No-Nester" - Write Flat, Readable Python

Deep nesting (more than 2-3 indentation levels) obscures intent, increases cyclomatic complexity, and slows peer review.

### 1. Guard Clauses: Exit Early

```python
# ❌ Bad - deeply nested, intent buried
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

# ✅ Good - flat, explicit
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

### 2. Early `continue` to Flatten Loops

```python
# ❌ Bad - business logic nested two levels deep
for record in records:
    if not record.error:
        if record.is_recent:
            process(record)

# ✅ Good - skip early, main path flush-left
for record in records:
    if record.error or not record.is_recent:
        continue
    process(record)
```

### 3. Merge Conditions

```python
# ❌ Bad - condition ladder
if is_weekday:
    if 9 <= hour < 18:
        send_reminder()

# ✅ Good - compound expression
if is_weekday and 9 <= hour < 18:
    send_reminder()

# ✅ Even better - more declarative
is_working_time = is_weekday and 9 <= hour < 18
if is_working_time:
    send_reminder()

# 🥷 Ninja level - walrus operator
if (is_working_time := is_weekday and 9 <= hour < 18):
    send_reminder()
```

### 4. Use Comprehensions When Chaining Loops

```python
# ❌ Bad - Multiple nested loops and conditions
error_lines = []
for f in Path("/var/log").glob("*.log"):
    for line in f.read_text().splitlines():
        if "ERROR" in line:
            error_lines.append(line.strip())

# ✅ Good - Comprehension, readable and concise
error_lines = [
    line.strip()
    for log_file in Path("/var/log").glob("*.log")
    for line in log_file.read_text().splitlines()
    if "ERROR" in line
]
```

**Note**: Exercise caution not to be too zealous - overly complex list comprehensions can become difficult to read.

---

## ⭐⭐ When and How to Write Comments (and Docstrings)

### Core Principles

1. **Minimalist Approach**: Code should be self-documenting whenever possible
2. **Purposeful Comments**: Comments exist to explain the "why," not the "what"
3. **Avoid Redundancy**: Never repeat what the code already clearly expresses

### When to Write Comments

| Situation | Good Comment | Bad Comment |
| --- | --- | --- |
| **Complex Logic** | `# Using quadratic probing to reduce collision clustering` | `# Loop through the array` |
| **Workarounds** | `# TODO: Remove when library fixes issue #1234` | `# This fixes the bug` |
| **Non-obvious Decisions** | `# We reverse the list first for O(1) pop operations` | `# Reverse the list` |
| **Error Handling** | `# API returns 200 even on errors, check response.body.error` | `# Check for errors` |

### Docstring Guidelines

Include behavior not evident from signature:

```python
def calculate_metrics(data: list[float]) -> dict[str, float]:
    """Calculate statistical metrics including custom business KPIs.

    Note: Automatically handles data normalization for values > 1000
    by applying logarithmic scaling to maintain numerical stability.
    """
```

---

## ⭐⭐ Pragmatic Approach to Testing

### Testing Pyramid

| Level | Description | Scope |
| --- | --- | --- |
| **Unit Tests** | Test individual components in isolation | Functions, Methods, Classes |
| **Interface Tests** | Test interactions between components | Modules, APIs |
| **End-to-End Tests** | Test the entire system as a whole | Full application, User flows |

### Why Use Mocks?

| Reason | Description |
| --- | --- |
| **Isolation** | Mocks allow you to isolate the unit under test |
| **Speed** | Mocks make tests faster by avoiding real network calls or database queries |
| **Determinism** | Mocks ensure tests are deterministic by providing consistent responses |
| **Cost** | Mocks reduce costs associated with external services |
| **Reliability** | Mocks eliminate flakiness from external factors |

### Test Structure (Arrange-Act-Assert)

```python
def test_function():
    # Arrange: Initialize test environment
    user = User(name="Test")

    # Act: Apply stimulus to system under test
    result = process_user(user)

    # Assert: Observe resulting behavior
    assert result.success is True
```

### Unit Test Example

```python
# math_operations.py
def add(a: int, b: int) -> int:
    return a + b

# test_math_operations.py
def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
    assert add(0, 0) == 0
```

### Mocking External API Calls

```python
import pytest
from unittest.mock import AsyncMock, patch
from mistralai import OCRResponse

@pytest.mark.asyncio
async def test_ocr_with_image_url() -> None:
    # Arrange - Create a mock response
    mock_response = OCRResponse(
        pages=[{"markdown": "What's the status of my payment"}]
    )

    # Use patch to mock the make_ocr_request function
    with patch('your_module.make_ocr_request', new_callable=AsyncMock) as mock_ocr_request:
        mock_ocr_request.return_value = mock_response

        # Act
        ocr_call = OCRCall(api_key="dummy_api_key")
        image_url = "https://docs.mistral.ai/img/guides/functioncalling1.png"
        response = await ocr_call(document_url=image_url, document_type="image_url")

        # Assert
        assert isinstance(response, OCRResponse)
        assert "What's the status of my payment" in response.pages[0]["markdown"]
        mock_ocr_request.assert_called_once()
```

### Testing Functions with Dependencies

```python
def test_update_model_table():
    """Should update each entity."""
    # Arrange
    get_entities_mock = Mock(get_entities, return_value=[a, b, c])
    add_or_delete_mock = Mock(add_or_delete, return_value=[a, b, c])
    session = Session()
    today = date(2000, 10, 27)

    # Act
    update_model_table(session, today)

    # Assert
    add_or_delete_mock.assert_called_with(session, a, today)
    add_or_delete_mock.assert_called_with(session, b, today)
    add_or_delete_mock.assert_called_with(session, c, today)
```

### Using Fixtures

```python
# conftest.py
import pytest
from selenium import webdriver

@pytest.fixture
def browser():
    driver = webdriver.Chrome()
    yield driver
    driver.quit()

# test_with_fixture.py
def test_with_browser(browser):
    browser.get("http://example.com")
    assert "Example Domain" in browser.title
```

### Best Practices

| Practice | Description |
| --- | --- |
| **Isolate Tests** | Ensure tests are independent and do not rely on state from other tests |
| **Use Fixtures** | Use `pytest` fixtures to set up and tear down test environments |
| **Mock External Dependencies** | Use mocking to isolate the unit under test |
| **Test Edge Cases** | Include tests for edge cases and error conditions |
| **Continuous Integration** | Integrate testing into your CI/CD pipeline |

---

## ⭐⭐ Don't Do Meta-programming (But Here's How It Works)

### What Is Meta-programming?

Meta-programming is a technique where programs manipulate or generate other programs as data. In Python, this includes dynamically modifying class attributes, generating functions on the fly, or altering behavior at runtime.

### Why Avoid Meta-programming?

1. **Complexity**: Introduces significant complexity, making code difficult to understand
2. **Readability**: Less readable and more abstract code
3. **Debugging**: Challenging to debug due to dynamic runtime behavior
4. **Performance**: Can lead to performance overhead

### Common Meta-programming Techniques

| Technique | Description |
| --- | --- |
| **Decorators** | Functions that modify behavior of other functions |
| **Metaclasses** | Classes that define behavior of other classes |
| **Dynamic Attribute Access** | `getattr`, `setattr`, `hasattr` |
| **Monkey Patching** | Dynamically modifying classes or modules at runtime |

### Examples (for understanding, not recommendation)

**Decorators:**
```python
def my_decorator(func):
    def wrapper():
        print("Before function call")
        func()
        print("After function call")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")
```

**Dynamic Attribute Access:**
```python
class MyClass:
    def __init__(self):
        self.my_attribute = "Hello, World!"

obj = MyClass()
print(getattr(obj, 'my_attribute'))  # Output: Hello, World!
setattr(obj, 'my_attribute', 'Goodbye, World!')
print(hasattr(obj, 'my_attribute'))  # Output: True
```

---

## ⭐⭐ You Shouldn't Write Magic Methods (But Here's How They Work)

### What Are Magic Methods?

Magic methods have double underscores at the beginning and end (e.g., `__init__`, `__str__`). They are automatically invoked by Python in response to certain operations.

### Why Avoid Magic Methods?

1. **Readability**: Can obscure code intent
2. **Maintainability**: Harder to maintain and debug
3. **Explicit is Better Than Implicit**: Following the Zen of Python

### Common Magic Methods

| Magic Method | Purpose |
| --- | --- |
| `__init__` | Initializes a newly created object |
| `__str__` | Returns string representation |
| `__repr__` | Returns official string representation |
| `__len__` | Returns the length of the object |
| `__getitem__` | Allows indexing into an object |
| `__add__` | Implements addition behavior |
| `__eq__` | Implements equality comparison |

### Example Usage

```python
class Book:
    def __init__(self, title: str, author: str, pages: int):
        self.title = title
        self.author = author
        self.pages = pages

    def __str__(self) -> str:
        return f"Book: {self.title} by {self.author}"

    def __len__(self) -> int:
        return self.pages

    def __add__(self, other: "Book") -> "Book":
        return Book(
            f"{self.title} & {other.title}",
            f"{self.author} & {other.author}",
            self.pages + other.pages
        )

# Usage
book1 = Book("The Great Gatsby", "F. Scott Fitzgerald", 180)
book2 = Book("1984", "George Orwell", 328)

print(book1)           # Book: The Great Gatsby by F. Scott Fitzgerald
print(len(book1))      # 180
print(book1 + book2)   # Book: The Great Gatsby & 1984 by...
```

### Best Practices If You Must Use Them

1. **Document Thoroughly**: Explain their behavior clearly
2. **Use Explicit Methods When Possible**: Instead of `__add__`, consider `add_to()`
3. **Limit Usage**: Only use when they significantly improve usability

---

## ⭐ The Singleton Pattern

### What Is the Singleton Pattern?

The Singleton pattern ensures a class has only one instance and provides a global point of access to it. Commonly used for configuration settings, logging, or database connections.

### Benefits

1. **Controlled Access**: Restricts instantiation to a single object
2. **Resource Efficiency**: Avoids unnecessary memory usage
3. **Global Access**: Provides a well-known access point

### Implementation in Python

```python
# settings.py
from pydantic import BaseSettings

class AppSettings(BaseSettings):
    app_name: str = "MyApp"
    debug_mode: bool = False
    database_url: str = "sqlite:///app.db"

    class Config:
        env_file = ".env"

# Instantiate at the module level
settings = AppSettings()
```

Usage:

```python
# main.py
from settings import settings

print(settings.app_name)  # Output: "MyApp"

# Another module
from settings import settings

print(settings is settings)  # Output: True (same instance)
```

---

## 🤖 Special Instructions for AI Agents

### Code Analysis Checklist

When analyzing or generating Python code, follow this checklist:

1. **Type Safety**: Ensure all variables and functions have proper type annotations
2. **Code Structure**: Verify functions follow single responsibility principle
3. **Naming**: Check that variable and function names are specific and descriptive
4. **Error Handling**: Look for proper error handling and edge case management
5. **Testing**: Ensure code is testable and follows the Arrange-Act-Assert pattern
6. **Nesting Depth**: Verify code doesn't exceed 2-3 levels of indentation

### Common Issues to Flag

- **Missing Type Annotations**: Functions without proper type hints
- **Deep Nesting**: Functions with more than 3 levels of indentation
- **Generic Names**: Variables named `data`, `tmp`, `list`, `l`, `preds`, etc.
- **Complex Logic**: Functions doing multiple unrelated things
- **Implicit Dependencies**: Functions instantiating services internally
- **Redundant Comments**: Comments that describe "what" instead of "why"
- **Inconsistent Naming**: Different terms for the same concept
- **Using `Any` Type**: Should use specific types
- **Blanket `type: ignore`**: Should specify error codes

### Code Generation Best Practices

```python
# ✅ Good Pattern for AI-Generated Code
def process_user_data(user: User, database: DatabaseService) -> ProcessedResult:
    """
    Process user data and store results in database.

    Note: Applies rate limiting for users with > 1000 requests/hour
    to prevent service degradation.
    """
    if not user.is_valid():
        raise ValueError("Invalid user data")

    result = analyze_user_data(user)
    database.store(result)

    return result
```

---

## Recommended Tools

- **Linting**: `ruff` for consistent code style
- **Type Checking**: `pyright` (integrated with VSCode via Pylance)
- **Testing**: `pytest` with appropriate mocking libraries
- **Logging**: `loguru` for comprehensive logging

### Tool Commands

```bash
# Run ruff for linting
ruff check path/to/code/

# Run ruff for formatting
ruff format path/to/code/

# Run pyright for type checking
pyright path/to/code/
```

### Pyright Configuration

```toml
[tool.pyright]
reportMissingTypeStubs = false
reportPrivateImportUsage = false
```

### Pre-commit Configuration

```yaml
repos:
- repo: https://github.com/pre-commit/pre-commit-hooks
  rev: v4.3.0
  hooks:
  - id: trailing-whitespace
  - id: end-of-file-fixer
  - id: check-yaml
  - id: check-added-large-files

- repo: https://github.com/pre-commit/mirrors-mypy
  rev: v1.15.0
  hooks:
  - id: mypy

- repo: https://github.com/astral-sh/ruff-pre-commit
  rev: v0.11.13
  hooks:
  - id: ruff
    types_or: [python, pyi]
    args: [--fix, --exit-non-zero-on-fix]
  - id: ruff-format
```
