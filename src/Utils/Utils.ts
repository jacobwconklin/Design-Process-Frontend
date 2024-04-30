// Tells other parts of the application if we are in dev mode, could allow for speedier procession through game (such as no min char for reasoning)
export const inDevMode = () => {
    return process.env.NODE_ENV !== 'production';
}

// get suffix for ordinal numbers ie 1st 2nd 3rd 4th
// credit: https://stackoverflow.com/a/13627586
export const ordinal_suffix = (i: number) => {
    let j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}

// Saves an object to browser storage. Saves it to both local and session storage under the same key given.
// This is useful so that if a player refreshes their information can be preserved. Session storage is specific
// to each tab, so checking session storage first allows a player to run the game with multiple tabs open. (good for dev and testing)
// local storage persists even after the browser is closed, so if a player closes the browser and reopens it, their information will still be there
// and they can continue in their session even if they accidentally close a tab or their browser. 
export const saveObjectToStorage = (key: string, obj: any) => {
    const objString = JSON.stringify(obj);
    localStorage.setItem(key, objString);
    sessionStorage.setItem(key, objString);
}

// Retreives an object from browser storage, first it checks if it exists in session storage and retreives that
// version. If it doesn't exist, it checks local storage and retreives that version. If neither exists it returns null
export const getObjectFromStorage = (key: string) => {
    const sessionItem = sessionStorage.getItem(key);
    if (sessionItem) {
        return JSON.parse(sessionItem);
    } else {
        const localItem = localStorage.getItem(key);
        if (localItem) {
            return JSON.parse(localItem);
        } else {
            return null;
        }
    }
}

// Clear object from both local and session storage
export const clearObjectFromStorage = (key: string) => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
}

// prompts for adding new activity records:
export const tasks = [
    "I conducted an analysis using a mathematical/analytical model.",
    "I retrieved knowledge by doing research, data collection, or testing",
    "I waited for new information (and in parallel worked on another activity not related to this project).",
    "I updated an existing analytical/mathematical model based on new information.",
    "I analyzed some new information that I received.",
    "I shared new information or data with colleagues."
  ];

export const activityTypes = [{ value: '', label: '' }].concat(tasks.map(task => {
    return { value: task, label: task }
  }))