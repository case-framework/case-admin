rm -rf .next
pnpm remove survey-engine
pnpm add file:../../libs/survey-engine/build
pnpm dev -p 3001
