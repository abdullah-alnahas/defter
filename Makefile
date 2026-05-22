.PHONY: install dev build preview run clean

install:
	cd frontend && bun install

dev:
	cd frontend && bun run dev

build:
	cd frontend && bun run build

preview: build
	cd frontend && bun run preview

run: preview

clean:
	rm -rf frontend/build frontend/node_modules frontend/.svelte-kit
