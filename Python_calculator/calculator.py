import ast
import operator


# Supported operators
OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.USub: operator.neg,
    ast.UAdd: operator.pos,
}


def calculate_expression(expression):
    """Evaluate a mathematical expression safely."""

    try:
        tree = ast.parse(expression, mode="eval")
        return evaluate_node(tree.body)

    except ZeroDivisionError:
        raise ValueError("Cannot divide by zero.")

    except (SyntaxError, ValueError):
        raise ValueError("Invalid mathematical expression.")


def evaluate_node(node):
    """Recursively evaluate the expression."""

    # Number
    if isinstance(node, ast.Constant):
        if isinstance(node.value, (int, float)) and not isinstance(node.value, bool):
            return node.value

        raise ValueError("Only numbers are allowed.")

    # Unary + or -
    if isinstance(node, ast.UnaryOp):
        operation = OPERATORS.get(type(node.op))

        if operation is None:
            raise ValueError("Unsupported operator.")

        return operation(evaluate_node(node.operand))

    # Binary operations
    if isinstance(node, ast.BinOp):
        operation = OPERATORS.get(type(node.op))

        if operation is None:
            raise ValueError("Unsupported operator.")

        left = evaluate_node(node.left)
        right = evaluate_node(node.right)

        return operation(left, right)

    raise ValueError("Invalid expression.")


def format_result(result):
    """Make results cleaner for display."""

    if isinstance(result, float) and result.is_integer():
        return int(result)

    return result


def main():
    print("=" * 45)
    print("       PYTHON EXPRESSION CALCULATOR")
    print("=" * 45)

    print("\nExamples:")
    print("  2 + 3 - 5 / 5 * 8")
    print("  (10 + 5) * 2")
    print("  25 / 5 + 3")
    print("\nType 'exit' to close the calculator.")

    while True:
        print("\n" + "-" * 45)

        expression = input("Enter expression: ").strip()

        if expression.lower() == "exit":
            print("\nCalculator closed. Goodbye!")
            break

        if not expression:
            print("Please enter an expression.")
            continue

        try:
            result = calculate_expression(expression)
            result = format_result(result)

            print(f"Result: {result}")

        except ValueError as error:
            print(f"Error: {error}")


if __name__ == "__main__":
    main()