# Billetterie — Frontend

Interface web de la billetterie événementielle. Consomme l'API REST [billetterie-api](https://github.com/A-Fevre/billetterie-api).

## Stack technique

| Outil                | Version | Justification                                                                         |
| -------------------- | ------- | ------------------------------------------------------------------------------------- |
| Next.js (App Router) | 16      | Framework React avec routing file-system, SSR natif, `output: standalone` pour Docker |
| TypeScript           | 5       | Typage strict, cohérence avec les types de l'API                                      |
| Tailwind CSS         | 4       | Utility-first, zéro CSS custom à maintenir                                            |
| shadcn/ui            | latest  | Composants accessibles construits sur Radix UI, entièrement contrôlables              |
| pnpm                 | 10      | Plus rapide que npm, store centralisé, lockfile déterministe                          |

## Choix d'architecture

### Fetch natif — pas d'axios

Le projet utilise uniquement l'API `fetch` native encapsulée dans `src/lib/api.ts`. Axios n'apporte ici aucune valeur ajoutée : les navigateurs modernes supportent `fetch` nativement, la gestion des erreurs HTTP est triviale, et cela évite une dépendance superflue.

### Authentification

L'authentification repose sur les tokens Sanctum de l'API. Le mécanisme de stockage et de transmission du token est géré côté serveur ; le frontend se contente d'envoyer les credentials avec chaque requête via `credentials: 'include'`.

### AuthContext

L'état de l'utilisateur connecté est géré via un React Context (`src/context/AuthContext.tsx`) plutôt qu'en store global (Zustand, Redux). Pour une application de cette taille, un context suffit — il évite une dépendance supplémentaire et reste lisible.

### Composants shadcn/ui

Les composants UI (Button, Card, Badge, etc.) sont copiés dans `src/components/ui/` plutôt qu'importés depuis un package. Cela permet de les modifier librement sans patcher une dépendance.

## Structure

```
src/
├── app/                   # Pages (App Router)
│   ├── auth/login/        # Formulaire de connexion
│   ├── auth/register/     # Formulaire d'inscription
│   ├── dashboard/         # Liste des événements (authentifié)
│   ├── events/[id]/       # Détail événement + achat de billet
│   └── tickets/[id]/      # Détail billet + annulation
├── context/
│   └── AuthContext.tsx    # State utilisateur + login/register/logout
├── components/ui/         # Composants shadcn/ui
├── hooks/
│   └── useEvents.ts       # Hooks de chargement des événements
├── lib/
│   ├── api.ts             # Wrapper fetch
│   └── utils.ts           # cn(), formatPrice(), formatDate()
└── types/
    └── index.ts           # Types TypeScript (User, Event, Ticket, ApiError)
```

## Lancer en local

```bash
# Pré-requis : billetterie-api en cours d'exécution sur localhost:80

cp .env.example .env.local
pnpm install
pnpm dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

## Docker

```bash
docker compose up --build
```

Le Dockerfile utilise un build multi-stage :

1. **deps** — installation des dépendances avec pnpm
2. **builder** — build Next.js (`output: standalone`)
3. **runner** — image finale allégée, utilisateur non-root

## Qualité

```bash
pnpm lint          # ESLint
pnpm format:check  # Prettier
pnpm type-check    # TypeScript strict
pnpm build         # Vérification du build complet
```

Un hook pre-commit Husky via `lint-staged` applique automatiquement ESLint + Prettier sur les fichiers modifiés avant chaque commit.

## CI

Le pipeline GitHub Actions exécute dans l'ordre :

```
lint + type-check → build → docker build → trivy scan
```

Lint et type-check tournent en parallèle. Le docker build et le scan Trivy ne s'exécutent que si le build Next.js passe.
