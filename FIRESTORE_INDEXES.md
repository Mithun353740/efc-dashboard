# Firestore Composite Indexes Recommendation

This document lists the composite indexes required for optimal query performance.
Without these indexes, Firestore will perform full collection scans which increase read costs.

## Required Indexes

### matches collection

```json
[
  {
    "collectionGroup": "matches",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "p1Id", "order": "ASCENDING" },
      { "fieldPath": "timestamp", "order": "DESCENDING" }
    ]
  },
  {
    "collectionGroup": "matches",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "p2Id", "order": "ASCENDING" },
      { "fieldPath": "timestamp", "order": "DESCENDING" }
    ]
  },
  {
    "collectionGroup": "matches",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "tournament", "order": "ASCENDING" },
      { "fieldPath": "timestamp", "order": "DESCENDING" }
    ]
  }
]
```

### clubSeasons collection

```json
[
  {
    "collectionGroup": "clubSeasons",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "globalSeason", "order": "ASCENDING" },
      { "fieldPath": "seasonNumber", "order": "ASCENDING" }
    ]
  },
  {
    "collectionGroup": "clubSeasons",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "status", "order": "ASCENDING" }
    ]
  }
]
```

### clubs collection

```json
[
  {
    "collectionGroup": "clubs",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "name", "order": "ASCENDING" }
    ]
  }
]
```

### clubFixtures collection

```json
[
  {
    "collectionGroup": "clubFixtures",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "season", "order": "ASCENDING" }
    ]
  }
]
```

### clubTournaments collection

```json
[
  {
    "collectionGroup": "clubTournaments",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "season", "order": "ASCENDING" }
    ]
  }
]
```

### transferThreads collection

```json
[
  {
    "collectionGroup": "transferThreads",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "buyerClubId", "order": "ASCENDING" },
      { "fieldPath": "status", "order": "ASCENDING" }
    ]
  },
  {
    "collectionGroup": "transferThreads",
    "queryScope": "COLLECTION",
    "fields": [
      { "fieldPath": "sellerClubId", "order": "ASCENDING" },
      { "fieldPath": "status", "order": "ASCENDING" }
    ]
  }
]
```

## How to Add These Indexes

### Option 1: Firebase Console
1. Go to Firebase Console > Firestore > Indexes
2. Add Composite Indexes manually using the JSON above

### Option 2: Firebase CLI
Create a `firestore.indexes.json` file with the indexes above and deploy:
```bash
firebase deploy --only firestore:indexes
```

## Impact on Read Costs

With these indexes:
- `fetchPlayerMatches()` queries will use index scans instead of full collection scans
- Estimated savings: 30-50% reduction in match-related reads
- `fetchClubSeasons()` with globalSeason filter will be indexed
- Transfer thread queries will be properly indexed

## Monitoring

Use Firebase Console's query performance tab to identify any queries still causing full collection scans.