export class LevelManager {
    private static SAVEGAME_KEY = 'mightyquest.savegame';

    private levels: { [levelName: string]: SavedLevel };

    constructor() {

    }

    public init(): void {
        let levelAsString = localStorage.getItem(LevelManager.SAVEGAME_KEY);

        if (levelAsString) {
            this.levels = JSON.parse(levelAsString);
        }
        else {
            this.levels = {};
        }
    }

    public levelCompleted(levelName: string): void {
        this.getOrCreateLevel(levelName).finished = true;
        this.persist();
    }

    private persist(): void {
        let levelsAsString = JSON.stringify(this.levels);

        localStorage.setItem(LevelManager.SAVEGAME_KEY, levelsAsString);
    }

    private getOrCreateLevel(levelName: string): SavedLevel {
        if (!this.levels[levelName]) {
            this.levels[levelName] = {};
        }

        return this.levels[levelName];
    }
}

export interface SavedLevel {
    finished?: boolean;
}