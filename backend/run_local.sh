#!/usr/bin/env bash
export NODE_ENV=development
cp .env.example .env || true
node src/index.js
