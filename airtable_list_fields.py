#!/usr/bin/env python3
"""
airtable_list_fields.py

Fetches all records from an Airtable table and prints:
  1) The full JSON response (pretty‑printed)
  2) A list of every unique field name present across those records
"""

import requests
import json
from pprint import pprint
import sys

def prompt_nonempty(prompt_text):
    """Prompt until non-empty input is given."""
    while True:
        try:
            val = input(prompt_text).strip()
        except EOFError:
            # In case stdin isn’t available
            print("\n⚠️  No input available; exiting.")
            sys.exit(1)
        if val:
            return val
        print("⚠️  Please enter a value.")

def main():
    print("\n=== Airtable Field Inspector ===\n")

    # 1. Prompt for credentials & parameters
    api_key    = prompt_nonempty("Enter your Airtable API Key: ")
    base_id    = prompt_nonempty("Enter your Airtable Base ID (e.g. appXXXXXXXXXXXX): ")
    table_name = prompt_nonempty("Enter your Table Name (e.g. Agents): ")
    view_name  = input("Enter your View Name (optional, press Enter to skip): ").strip()

    # 2. Build request URL + headers + params
    url = f"https://api.airtable.com/v0/{base_id}/{table_name}"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type":  "application/json",
    }
    params = {}
    if view_name:
        params["view"] = view_name

    # 3. Display request info
    print(f"\n🔗 Fetching:\n    GET {url}")
    if params:
        print(f"    Params: {params}")
    print()

    # 4. Execute GET
    try:
        resp = requests.get(url, headers=headers, params=params)
        print(f"➡️  Response Status: {resp.status_code}\n")
        resp.raise_for_status()
    except requests.exceptions.HTTPError as e:
        print("❌ HTTP error:", e)
        print("Response body:")
        print(resp.text)
        sys.exit(1)
    except Exception as e:
        print("❌ Request failed:", e)
        sys.exit(1)

    # 5. Parse JSON
    try:
        data = resp.json()
    except json.JSONDecodeError:
        print("❌ Failed to parse JSON:")
        print(resp.text)
        sys.exit(1)

    # 6. Pretty‑print full JSON
    print("📦 Full JSON response:")
    pprint(data)

    # 7. Extract and print unique field names
    records = data.get("records", [])
    if not records:
        print("\n⚠️  No records found.")
        sys.exit(0)

    unique_fields = set()
    for rec in records:
        fields = rec.get("fields", {})
        unique_fields.update(fields.keys())

    print("\n🔑 Unique field names found:")
    for name in sorted(unique_fields):
        print(" -", name)

if __name__ == "__main__":
    main()
