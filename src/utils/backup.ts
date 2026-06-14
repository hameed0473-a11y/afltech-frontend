// Backup all app data to a JSON file
export function createBackup(): void {
  const backupData = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    cm_staff: localStorage.getItem('cm_staff'),
    cm_contributors: localStorage.getItem('cm_contributors'),
    cm_targets: localStorage.getItem('cm_targets'),
    cm_contributions: localStorage.getItem('cm_contributions'),
    cm_pledges: localStorage.getItem('cm_pledges'),
    cm_theme: localStorage.getItem('cm_theme'),
    cm_is_purged: localStorage.getItem('cm_is_purged'),
  };

  const blob = new Blob(
    [JSON.stringify(backupData, null, 2)], 
    { type: 'application/json' }
  );
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `contributions-manager-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Restore app data from a backup JSON file
export function restoreBackup(file: File): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.cm_staff) localStorage.setItem('cm_staff', data.cm_staff);
        if (data.cm_contributors) localStorage.setItem('cm_contributors', data.cm_contributors);
        if (data.cm_targets) localStorage.setItem('cm_targets', data.cm_targets);
        if (data.cm_contributions) localStorage.setItem('cm_contributions', data.cm_contributions);
        if (data.cm_pledges) localStorage.setItem('cm_pledges', data.cm_pledges);
        if (data.cm_theme) localStorage.setItem('cm_theme', data.cm_theme);
        if (data.cm_is_purged) localStorage.setItem('cm_is_purged', data.cm_is_purged);
        
        resolve(true);
      } catch (error) {
        reject(new Error('Invalid backup file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}