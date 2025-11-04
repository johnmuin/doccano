#!/bin/bash

echo "🔍 运行代码质量检查..."

echo "1. 类型检查 (mypy)..."
mypy --namespace-packages --explicit-package-bases .

echo "2. 代码风格检查 (flake8)..."
flake8 --filename "*.py" --extend-exclude "*/migrations"

echo "3. 格式化检查 (black)..."
black --check .

echo "4. Import 排序检查 (isort)..."
isort . -c --skip migrations

echo "✅ 所有代码检查完成！"
