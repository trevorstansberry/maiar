#!/bin/bash
# Maiar nightly backup
# Add to cron: 0 2 * * * /path/to/maiar-server/scripts/backup.sh

set -e

MAIAR_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DEST="${BACKUP_DEST:-$HOME/Library/Mobile Documents/com~apple~CloudDocs/maiar-backup}"
TIMESTAMP=$(date +%Y-%m-%d)
LOG="$MAIAR_ROOT/scripts/backup.log"

echo "[$TIMESTAMP] Starting Maiar backup..." | tee -a "$LOG"

# Ensure backup destination exists
mkdir -p "$BACKUP_DEST"

# Backup client workspaces
rsync -av --delete "$MAIAR_ROOT/clients/" "$BACKUP_DEST/clients/" >> "$LOG" 2>&1
echo "[$TIMESTAMP] ✓ clients/ backed up" | tee -a "$LOG"

# Backup database
cp "$MAIAR_ROOT/db/maiar.db" "$BACKUP_DEST/maiar-$TIMESTAMP.db" 2>/dev/null || true
# Keep only last 30 daily db snapshots
ls -t "$BACKUP_DEST"/maiar-*.db 2>/dev/null | tail -n +31 | xargs rm -f
echo "[$TIMESTAMP] ✓ database backed up" | tee -a "$LOG"

echo "[$TIMESTAMP] Backup complete." | tee -a "$LOG"
