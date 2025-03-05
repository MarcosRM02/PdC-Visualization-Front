#!/bin/bash

# Install dependencies if not already installed in the container of the dockerfile

if [ ! -f .installed ]; then
    npm install
    touch .installed
fi

# Ejecuta el servidor 
npm run dev