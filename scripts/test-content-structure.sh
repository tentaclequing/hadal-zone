#!/bin/bash
# Test script for hadal-zone content structure validation
# Validates front matter, Hugo build, and generated HTML

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PASS=0
FAIL=0
ERRORS=""

pass() {
  echo "  [PASS] $1"
  PASS=$((PASS + 1))
}

fail() {
  echo "  [FAIL] $1"
  FAIL=$((FAIL + 1))
  ERRORS="$ERRORS\n  - $1"
}

echo "============================================"
echo "hadal-zone content structure tests"
echo "============================================"
echo ""

# -------------------------------------------------------------------
# 1. Validate archetype has required fields
# -------------------------------------------------------------------
echo "--- Archetype validation ---"
ARCHETYPE="$PROJECT_ROOT/archetypes/default.md"
if [ -f "$ARCHETYPE" ]; then
  for field in title author tldr categories tags date lastmod language country translationKey files adapted adaptation_note; do
    if grep -q "^${field}:" "$ARCHETYPE" || grep -q "^${field} =" "$ARCHETYPE"; then
      pass "Archetype has field: $field"
    else
      fail "Archetype missing field: $field"
    fi
  done
else
  fail "Archetype file not found at $ARCHETYPE"
fi

echo ""

# -------------------------------------------------------------------
# 2. Validate all category _index.md files have required front matter
# -------------------------------------------------------------------
echo "--- Category _index.md validation ---"
CATEGORIES="skillsharing protest-safety movement mutual-aid legal digital-security wellbeing accessibility"

for lang in en de; do
  for cat in $CATEGORIES; do
    INDEX="$PROJECT_ROOT/content/$lang/$cat/_index.md"
    if [ ! -f "$INDEX" ]; then
      fail "Missing: $INDEX"
      continue
    fi
    # Check for title field
    if grep -q "^title:" "$INDEX"; then
      pass "$lang/$cat/_index.md has title"
    else
      fail "$lang/$cat/_index.md missing title"
    fi
    # Check for description field
    if grep -q "^description:" "$INDEX"; then
      pass "$lang/$cat/_index.md has description"
    else
      fail "$lang/$cat/_index.md missing description"
    fi
    # Check title is human-readable (not slug format)
    TITLE=$(grep "^title:" "$INDEX" | head -1 | sed 's/^title: *//' | tr -d '"')
    if echo "$TITLE" | grep -q "-"; then
      fail "$lang/$cat/_index.md title looks like a slug: $TITLE"
    else
      pass "$lang/$cat/_index.md title is human-readable: $TITLE"
    fi
  done
done

echo ""

# -------------------------------------------------------------------
# 3. Validate test document has all required front matter
# -------------------------------------------------------------------
echo "--- Test document front matter validation ---"
TEST_DOC="$PROJECT_ROOT/content/en/protest-safety/test-doc/index.md"
if [ -f "$TEST_DOC" ]; then
  for field in title author tldr categories tags date lastmod language country translationKey files adapted adaptation_note; do
    if grep -q "^${field}:" "$TEST_DOC"; then
      pass "Test doc has field: $field"
    else
      fail "Test doc missing field: $field"
    fi
  done
  # Check author defaults
  AUTHOR=$(grep "^author:" "$TEST_DOC" | head -1 | sed 's/^author: *//' | tr -d '"')
  if [ -n "$AUTHOR" ]; then
    pass "Test doc has author value: $AUTHOR"
  else
    fail "Test doc has empty author"
  fi
else
  fail "Test document not found at $TEST_DOC"
fi

echo ""

# -------------------------------------------------------------------
# 4. Hugo build test
# -------------------------------------------------------------------
echo "--- Hugo build validation ---"
BUILD_DIR="$PROJECT_ROOT/public_test"
rm -rf "$BUILD_DIR"

if hugo --source "$PROJECT_ROOT" --destination "$BUILD_DIR" --quiet 2>&1; then
  pass "Hugo builds without errors"
else
  fail "Hugo build failed"
fi

echo ""

# -------------------------------------------------------------------
# 5. Validate generated HTML contains expected elements
# -------------------------------------------------------------------
echo "--- Generated HTML validation ---"

if [ -d "$BUILD_DIR" ]; then
  # Find the test document HTML
  TEST_HTML=$(find "$BUILD_DIR" -path "*/protest-safety/test-doc/index.html" 2>/dev/null | head -1)
  if [ -n "$TEST_HTML" ] && [ -f "$TEST_HTML" ]; then
    pass "Test document HTML was generated"

    # Check for TL;DR display
    if grep -qi "tl;dr\|tldr\|kurzfassung" "$TEST_HTML"; then
      pass "Document page contains TL;DR label"
    else
      fail "Document page missing TL;DR label"
    fi

    # Check for author display
    if grep -qi "author\|verfasser" "$TEST_HTML"; then
      pass "Document page contains author label"
    else
      fail "Document page missing author label"
    fi

    # Check for download button
    if grep -qi "download\|herunterladen" "$TEST_HTML"; then
      pass "Document page contains download button"
    else
      fail "Document page missing download button"
    fi

    # Check for view button
    if grep -qi 'btn.view\|"view"\|>view<\|ansehen' "$TEST_HTML"; then
      pass "Document page contains view button"
    else
      fail "Document page missing view button"
    fi

    # Check for translation links section
    if grep -qi "available.*in\|verfügbar\|translations" "$TEST_HTML"; then
      pass "Document page contains translation links section"
    else
      fail "Document page missing translation links section"
    fi

    # Check for accessible text version link
    if grep -qi "accessible\|barrierefrei" "$TEST_HTML"; then
      pass "Document page contains accessible text link"
    else
      fail "Document page missing accessible text link"
    fi
  else
    fail "Test document HTML not found in build output"
  fi

  # Find the protest-safety section HTML
  SECTION_HTML=$(find "$BUILD_DIR" -path "*/protest-safety/index.html" 2>/dev/null | head -1)
  if [ -n "$SECTION_HTML" ] && [ -f "$SECTION_HTML" ]; then
    pass "Category listing HTML was generated"

    # Check listing shows document titles
    if grep -qi "test-doc\|test doc\|protest safety test" "$SECTION_HTML"; then
      pass "Category listing contains test document"
    else
      fail "Category listing missing test document"
    fi
  else
    fail "Category listing HTML not found"
  fi
else
  fail "Build directory not found, skipping HTML validation"
fi

# Clean up test build
rm -rf "$BUILD_DIR"

echo ""
echo "============================================"
echo "Results: $PASS passed, $FAIL failed"
echo "============================================"

if [ $FAIL -gt 0 ]; then
  echo ""
  echo "Failures:"
  echo -e "$ERRORS"
  exit 1
fi

exit 0
