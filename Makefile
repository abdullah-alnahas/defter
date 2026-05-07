.PHONY: install dev build run release clean

install:
	cd frontend && bun install

dev:
	cd frontend && bun run dev

build:
	cd frontend && bun run build

run: build
	cd backend && cargo run

release: build
	cd backend && cargo run --release

clean:
	rm -rf frontend/dist frontend/node_modules backend/target
