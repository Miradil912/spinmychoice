#!/usr/bin/env python3
"""
Life Spin — Optional Python Backend (Flask)
Run: pip install flask flask-cors && python api.py
Endpoint: GET /api/random-message?lang=en&category=health
"""

import json
import random
import os
from datetime import datetime, timezone
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load messages once at startup
DATA_FILE = os.path.join(os.path.dirname(__file__), '..', 'data', 'messages.json')

try:
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        MESSAGES = json.load(f)
    print(f"✅ Loaded messages: {sum(len(v) for v in MESSAGES.values())} total")
except FileNotFoundError:
    print("⚠️  messages.json not found. Using empty dataset.")
    MESSAGES = {"decision": [], "health": [], "personal": [], "inspire": []}

CATEGORIES = list(MESSAGES.keys())


@app.route('/api/random-message', methods=['GET'])
def random_message():
    """Return a random message, optionally filtered by category."""
    category = request.args.get('category', '').lower()
    lang = request.args.get('lang', 'en')

    if category and category in MESSAGES:
        pool = MESSAGES[category]
        chosen_cat = category
    else:
        # Pick a random category
        chosen_cat = random.choice(CATEGORIES)
        pool = MESSAGES[chosen_cat]

    if not pool:
        return jsonify({'error': 'No messages found'}), 404

    text = random.choice(pool)

    return jsonify({
        'category': chosen_cat,
        'text': text,
        'lang': lang,
        'timestamp': datetime.now(timezone.utc).isoformat(),
    }), 200, {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
    }


@app.route('/api/stats', methods=['GET'])
def stats():
    """Return message count statistics."""
    return jsonify({
        'categories': {cat: len(msgs) for cat, msgs in MESSAGES.items()},
        'total': sum(len(v) for v in MESSAGES.values())
    })


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV', 'production') == 'development'
    print(f"🌀 Life Spin API running on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
